# 🛠️ Task Brief — Perbaikan Bug Token CBT Expired (TIAS Mobile + Backend)

> **Untuk dieksekusi di Claude Code.**
> **Repo terkait:** `tias-mobile` (React Native 0.75.3 + TS + Zustand + Axios + react-query v4) dan `tias-backend` (Node.js/Express + Sequelize + MySQL).
> **Sifat dokumen:** spesifikasi tugas. Kode di bawah adalah REFERENSI — sesuaikan dengan struktur file aktual di repo.

---

## 🎯 Tujuan

Menghilangkan bug: setelah token CBT kedaluwarsa (>8 jam), saat user buka menu CBT muncul **"koneksi gagal, tidak dapat mengambil data"**, dan satu-satunya cara pulih adalah **menghapus cache/penyimpanan aplikasi secara manual**. Setelah perbaikan, token kedaluwarsa harus ditangani otomatis (re-SSO transparan) tanpa intervensi user.

---

## 🔍 Akar Masalah (ringkas)

1. **`CBTEntryScreen` hanya cek keberadaan token, bukan validitasnya.** Token expired tetap tersimpan di AsyncStorage → pengecekan lolos → SSO di-skip → request ke CBT API pakai token mati.
2. **Interceptor `axios-cbt` kemungkinan hanya menangkap `status === 401`.** Server CBT (kemungkinan Laravel/PHP) saat sesi mati sering balas **419 / 302 → halaman HTML login / 500**, bukan 401 murni. Akibatnya token mati tidak pernah dibersihkan → nyangkut permanen.
3. **Flow login ulang tidak mereset `cbt_token` lama.** Login baru hanya mengganti JWT TIAS, token CBT basi tetap tinggal → bug #1 & #2 berulang. Hapus storage "berhasil" karena menyapu token basi itu.

---

## ⚙️ ATURAN EKSEKUSI (wajib dibaca Claude Code sebelum mulai)

1. **Baca file aktual dulu** sebelum mengedit (`src/config/axios-cbt.ts`, `src/store/auth.ts`, `src/features/cbt/CBTEntryScreen.tsx`, `controllers/CBT/CbtAuthController.js`, dan flow login `useLogin`/store). Kode referensi di bawah mengasumsikan struktur dari dokumen brainstorm — **verifikasi nama field, nama fungsi, dan path-nya** sebelum menempel.
2. **Adaptasi, jangan timpa buta.** Jika store sudah memakai pola/penamaan tertentu (mis. `useAuthStore`, `setCbtToken`), ikuti pola itu. Jangan ganti gaya kode yang sudah ada.
3. **Jangan ubah hal di luar scope** (UI, screen lain, dependency baru) kecuali disebut eksplisit.
4. **Jangan menambah library baru** untuk Task 1–5. (Task 6 opsional dan tetap tanpa library baru.)
5. **Konfirmasi sebelum migration.** Jika Task 5 butuh kolom DB baru/ubahan, periksa apakah `cbt_token_expires_at` sudah ada di tabel `CbtUserMappings`. Jika belum, siapkan migration TAPI tanyakan dulu sebelum menjalankannya di environment apa pun.
6. Setelah tiap task, jalankan **type-check** (`tsc --noEmit` untuk mobile) / lint yang tersedia, lalu lapor ringkas perubahan per file.

---

## ✅ TASK 1 — Store auth: lacak expiry + bersihkan token saat login/logout

**File:** `src/store/auth.ts`

**Yang harus dilakukan:**
- Tambah state `cbt_token_expires_at: number | null` (epoch ms).
- Pada action set JWT TIAS (login), **reset** `cbt_token`, `cbt_user_id`, `cbt_token_expires_at` ke `null`.
- `setCbtToken` menerima `expiresAt` opsional (default +8 jam).
- `clearCbtToken` & `logout` ikut membersihkan `cbt_token_expires_at`.
- Ekspor helper `isCbtTokenValid()`.

**Kode referensi (sesuaikan dengan tipe & action yang sudah ada):**

```typescript
interface AuthState {
  token: string | null;                 // JWT TIAS
  cbt_token: string | null;
  cbt_user_id: string | null;
  cbt_token_expires_at: number | null;  // epoch ms

  setToken: (jwt: string) => void;
  setCbtToken: (token: string, userId: string, expiresAt?: number) => void;
  clearCbtToken: () => void;
  logout: () => void;
}

// di dalam create():
setToken: (jwt) =>
  // ⬇️ KUNCI: setiap login baru, BUANG token CBT lama agar tidak nyangkut
  set({ token: jwt, cbt_token: null, cbt_user_id: null, cbt_token_expires_at: null }),

setCbtToken: (token, userId, expiresAt) =>
  set({
    cbt_token: token,
    cbt_user_id: userId,
    cbt_token_expires_at: expiresAt ?? Date.now() + 8 * 60 * 60 * 1000,
  }),

clearCbtToken: () =>
  set({ cbt_token: null, cbt_user_id: null, cbt_token_expires_at: null }),

logout: () =>
  set({ token: null, cbt_token: null, cbt_user_id: null, cbt_token_expires_at: null }),
```

Tambahkan helper (di file yang sama, di luar `create`):

```typescript
export const isCbtTokenValid = (): boolean => {
  const { cbt_token, cbt_token_expires_at } = useAuthStore.getState();
  if (!cbt_token || !cbt_token_expires_at) return false;
  // buffer 5 menit: jangan pakai token yang sebentar lagi mati
  return Date.now() < cbt_token_expires_at - 5 * 60 * 1000;
};
```

> ⚠️ **Migrasi storage persist:** karena menambah field baru ke state yang dipersist, user lama yang sudah punya storage akan rehydrate tanpa `cbt_token_expires_at` (jadi `undefined`). `isCbtTokenValid()` sudah menangani ini (return `false` → memicu SSO). Jika store memakai `version`/`migrate` di config `persist`, naikkan `version`-nya.

**Verifikasi Task 1:**
- [ ] State baru muncul & ter-persist.
- [ ] Action login memanggil `setToken` versi baru (bukan `set({ token })` mentah). Cek juga flow `useLogin`/`onSuccess`.
- [ ] `isCbtTokenValid()` bisa diimpor dari `src/store/auth`.

---

## ✅ TASK 2 — Fungsi re-SSO yang dedupe (file baru)

**File baru:** `src/services/cbt/refreshCbtToken.ts`

**Tujuan:** satu fungsi untuk SSO ulang ke TIAS Backend, anti-balapan (kalau banyak request gagal bersamaan, SSO hanya jalan sekali).

```typescript
// src/services/cbt/refreshCbtToken.ts
import axiosTias from '../../config/axios-tias';
import { useAuthStore } from '../../store/auth';

let refreshPromise: Promise<string | null> | null = null;

export async function refreshCbtToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise; // dedupe

  refreshPromise = (async () => {
    const jwtTias = useAuthStore.getState().token;
    if (!jwtTias) return null; // belum login → tidak bisa SSO

    try {
      const { data } = await axiosTias.post(
        '/api/cbt/auth',
        {},
        { headers: { token: jwtTias } } // ingat: header 'token', BUKAN Authorization
      );
      if (!data?.cbt_token) return null;

      const expiresAt = data.expires_at
        ? new Date(data.expires_at).getTime()
        : Date.now() + 8 * 60 * 60 * 1000;

      useAuthStore.getState().setCbtToken(data.cbt_token, data.cbt_user_id, expiresAt);
      return data.cbt_token;
    } catch (e) {
      // SSO gagal (mis. JWT TIAS ikut mati) → bersihkan agar UI dapat jalur bersih
      useAuthStore.getState().clearCbtToken();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
```

> Sesuaikan **path import** `axios-tias` dan **nama field response** (`cbt_token`, `cbt_user_id`, `expires_at`) dengan respons aktual `/api/cbt/auth`. Cek juga apakah endpoint butuh body tertentu.

**Verifikasi Task 2:**
- [ ] File ter-compile, import resolve.
- [ ] Nama field response cocok dengan output `CbtAuthController` (lihat Task 5).

---

## ✅ TASK 3 — Interceptor `axios-cbt`: deteksi expiry luas + auto re-SSO + retry (INTI)

**File:** `src/config/axios-cbt.ts`

**Tujuan:** ini perbaikan utama. Interceptor harus mendeteksi token mati secara luas (401 **dan** 419/440 **dan** halaman HTML login), lalu SSO ulang dan **mengulang request asli** dengan token baru — transparan ke user.

```typescript
// src/config/axios-cbt.ts
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { refreshCbtToken } from '../services/cbt/refreshCbtToken';

const axiosCbt = axios.create({
  baseURL: 'https://u-talent.uika-bogor.ac.id/cbt-api',
  timeout: 20000,
});

// --- Request: inject token + paksa JSON ---
axiosCbt.interceptors.request.use((config) => {
  const token = useAuthStore.getState().cbt_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // PENTING: paksa JSON supaya server tidak balas halaman HTML login saat sesi mati
  config.headers.Accept = 'application/json';
  return config;
});

// --- Deteksi expiry secara LUAS, bukan cuma 401 ---
function isAuthExpired(error: any): boolean {
  const status = error?.response?.status;
  if (status === 401 || status === 419 || status === 440) return true;

  // Kasus diam-diam: server balas berisi halaman HTML login
  const ct = error?.response?.headers?.['content-type'] ?? '';
  const body = error?.response?.data;
  if (ct.includes('text/html')) return true;
  if (typeof body === 'string' && /<html|<!doctype|login|silakan masuk/i.test(body)) return true;

  return false;
}

axiosCbt.interceptors.response.use(
  (response) => {
    // Tangkap "sukses palsu": status 200 tapi isinya HTML login
    const ct = response.headers?.['content-type'] ?? '';
    if (ct.includes('text/html') && typeof response.data === 'string') {
      return Promise.reject({ config: response.config, __authExpired: true });
    }
    return response;
  },
  async (error) => {
    const original = error.config;
    const expired = error?.__authExpired || isAuthExpired(error);

    if (expired && original && !original.__isRetry) {
      original.__isRetry = true; // hanya retry SEKALI → cegah loop tak hingga

      const newToken = await refreshCbtToken();
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosCbt(original); // ulangi request asli
      }
      // SSO gagal → token sudah dibersihkan di refreshCbtToken
    }

    return Promise.reject(error);
  }
);

export default axiosCbt;
```

> **Catatan saat membaca file aktual:** kemungkinan besar saat ini interceptor cuma `if (status === 401) clearCbtToken()`. Ganti dengan blok di atas. Pertahankan konfigurasi lain yang sudah ada (mis. `baseURL` dari env, `timeout`, header tambahan).

**Verifikasi Task 3:**
- [ ] Header `Accept: application/json` terkirim di setiap request CBT.
- [ ] 401/419/HTML login memicu satu kali re-SSO + retry, bukan langsung error ke user.
- [ ] Tidak ada loop: request yang sudah `__isRetry` tidak di-refresh lagi.

---

## ✅ TASK 4 — `CBTEntryScreen`: validasi token, bukan sekadar keberadaan

**File:** `src/features/cbt/CBTEntryScreen.tsx`

**Yang harus dilakukan:**
- Ganti pengecekan "punya `cbt_token`?" menjadi `isCbtTokenValid()`.
- Saat SSO sukses, simpan `expires_at` dari backend ke store.

```typescript
import { isCbtTokenValid } from '../../store/auth';

useEffect(() => {
  if (user?.role === 'Dosen') return; // dosen tetap lihat portal

  if (isCbtTokenValid()) {
    navigation.replace('CBTList');
  } else {
    loginCbt(); // mutation useCbtLogin → SSO
  }
  // deps: pastikan tidak memicu ulang tak perlu
}, []);
```

Di `onSuccess` mutation SSO (kemungkinan di `useCbtLogin.ts` atau di screen):

```typescript
onSuccess: (data) => {
  const expiresAt = data?.expires_at
    ? new Date(data.expires_at).getTime()
    : Date.now() + 8 * 60 * 60 * 1000;
  setCbtToken(data.cbt_token, data.cbt_user_id, expiresAt);
  navigation.replace('CBTList');
},
```

> Cek nilai aktual `user?.role` di store TIAS (apakah persis `'Dosen'`). Sesuaikan kondisi role bila perlu.

**Verifikasi Task 4:**
- [ ] Token expired di store → screen memicu SSO ulang, bukan langsung ke CBTList.
- [ ] `onSuccess` SSO menyimpan `expires_at`.

---

## ✅ TASK 5 — Backend `CbtAuthController`: kembalikan `expires_at` + perbaiki perbandingan expiry

**File:** `controllers/CBT/CbtAuthController.js`

**Yang harus dilakukan:**
- Bandingkan expiry pakai epoch yang konsisten + buffer 5 menit.
- **Kembalikan `expires_at`** di response agar mobile bisa melacak.
- Pastikan timezone DB & app seragam (lihat catatan).

```javascript
// controllers/CBT/CbtAuthController.js
exports.getCbtToken = async (req, res) => {
  try {
    const tiasUser = req.user; // dari middleware authenticateToken
    const now = Date.now();

    let mapping = await CbtUserMapping.findOne({
      where: { tias_user_id: tiasUser.id },
    });

    const valid =
      mapping?.cbt_token &&
      mapping?.cbt_token_expires_at &&
      new Date(mapping.cbt_token_expires_at).getTime() > now + 5 * 60 * 1000; // buffer 5 mnt

    if (valid) {
      return res.json({
        cbt_token: mapping.cbt_token,
        cbt_user_id: mapping.cbt_user_id,
        expires_at: mapping.cbt_token_expires_at,
      });
    }

    // Expired / belum ada → tukar token baru ke CBT API
    const exchanged = await exchangeToCbtToken({
      email: tiasUser.email,
      nama: tiasUser.nama,
      nim: tiasUser.nim,
    });
    const expiresAt = new Date(now + 8 * 60 * 60 * 1000);

    if (mapping) {
      await mapping.update({
        cbt_token: exchanged.token,
        cbt_user_id: exchanged.cbt_user_id,
        cbt_token_expires_at: expiresAt,
      });
    } else {
      mapping = await CbtUserMapping.create({
        tias_user_id: tiasUser.id,
        email: tiasUser.email,
        nim: tiasUser.nim,
        cbt_user_id: exchanged.cbt_user_id,
        cbt_token: exchanged.token,
        cbt_token_expires_at: expiresAt,
      });
    }

    return res.json({
      cbt_token: exchanged.token,
      cbt_user_id: exchanged.cbt_user_id,
      expires_at: expiresAt,
    });
  } catch (err) {
    console.error('[CBT AUTH]', err?.response?.data || err.message);
    return res.status(502).json({ message: 'Gagal menukar token CBT' });
  }
};
```

> **Sesuaikan:** nama fungsi aktual (`getCbtToken`), nama field user dari middleware (`tiasUser.id/email/nama/nim`), dan signature `exchangeToCbtToken()` di `utils/cbtApiClient.js`. Jika field di model bernama beda, samakan.

**⚠️ Catatan timezone (penyebab klasik "token kelihatan valid padahal mati"):**
Kolom `DATETIME` MySQL bersifat *naive*. Pastikan config Sequelize & MySQL pakai timezone yang sama. Di config DB tambahkan/cek:
```javascript
// config Sequelize
{ dialectOptions: { timezone: '+07:00' }, timezone: '+07:00' }
```
atau seragamkan semuanya ke UTC. Jika app & DB beda 7 jam, `getTime()` akan meleset 7 jam — persis bisa membuat token "valid 7 jam lebih lama" dari seharusnya.

**Migration (HANYA jika `cbt_token_expires_at` belum ada):** siapkan migration menambah kolom `DATETIME` `cbt_token_expires_at` di tabel `CbtUserMappings`, lalu **tanya dulu** sebelum dijalankan.

**Verifikasi Task 5:**
- [ ] Response `/api/cbt/auth` memuat `expires_at`.
- [ ] Perbandingan expiry pakai epoch + buffer.
- [ ] Timezone DB & app konsisten.

---

## ⏳ TASK 6 (OPSIONAL, direkomendasikan untuk ujian) — Auto-save jawaban anti-hilang

**File:** `src/features/cbt/CBTExamScreen.tsx`

**Tujuan:** jika token mati / app crash di tengah ujian, jawaban mahasiswa tidak hilang. Ini safety net penting untuk skenario ujian.

**Langkah:**
- Simpan `answers` ke AsyncStorage setiap kali berubah, dengan key per ujian, mis. `cbt_draft_${exam_id}`.
- Saat `CBTExamScreen` mount, cek apakah ada draft untuk `exam_id` tsb → restore.
- Setelah submit sukses, hapus draft (`AsyncStorage.removeItem`).

```typescript
// contoh ringkas
const draftKey = `cbt_draft_${exam.id}`;

// saat answers berubah:
useEffect(() => {
  AsyncStorage.setItem(draftKey, JSON.stringify(answers)).catch(() => {});
}, [answers]);

// saat mount:
useEffect(() => {
  AsyncStorage.getItem(draftKey).then((raw) => {
    if (raw) setAnswers(JSON.parse(raw));
  });
}, []);

// setelah submit sukses:
await AsyncStorage.removeItem(draftKey);
```

> Interceptor di Task 3 juga sudah membuat **submit yang gagal karena token mati otomatis di-retry** setelah re-SSO. Task 6 melengkapi: kalaupun retry gagal total, jawaban tetap aman.

---

## 🧪 CARA TEST MANUAL (reproduksi & validasi)

**Reproduksi bug (sebelum fix):**
1. Login, buka CBT, pastikan list muncul.
2. Paksa token CBT mati lebih cepat: sementara set expiry CBT ke ~2 menit (di backend) ATAU ubah `cbt_token` di store jadi string acak.
3. Buka menu CBT lagi → seharusnya muncul error "koneksi gagal".

**Validasi setelah fix:**
- [ ] **Skenario expired:** token CBT mati → buka menu CBT → otomatis re-SSO → list muncul **tanpa** hapus storage.
- [ ] **Skenario login ulang:** logout → login → buka CBT → tidak ada token basi, SSO fresh berjalan.
- [ ] **Skenario non-401:** simulasikan server balas 419 atau HTML login (mock interceptor) → tetap memicu re-SSO + retry.
- [ ] **Skenario JWT TIAS mati:** kalau JWT TIAS juga mati → token CBT dibersihkan, user diarahkan ke jalur login/SSO yang jelas (bukan stuck).
- [ ] **Skenario di tengah ujian (jika Task 6):** matikan koneksi sebentar saat submit → jawaban tidak hilang, submit retry setelah koneksi pulih.

**Debug yang berguna saat reproduksi:**
Log `error.response?.status` dan `error.response?.headers?.['content-type']` saat error muncul. Jika yang keluar **419/302/`text/html`** dan bukan 401, itu konfirmasi penyebabnya adalah halaman login HTML — dan Task 3 menyelesaikannya tepat sasaran.

---

## 📋 CHECKLIST AKHIR

- [ ] Task 1 — store: expiry + reset saat login/logout + `isCbtTokenValid()`
- [ ] Task 2 — `refreshCbtToken.ts` (dedupe)
- [ ] Task 3 — interceptor `axios-cbt`: deteksi luas + re-SSO + retry **(INTI)**
- [ ] Task 4 — `CBTEntryScreen` validasi + simpan `expires_at`
- [ ] Task 5 — backend kembalikan `expires_at` + fix timezone
- [ ] Task 6 — (opsional) auto-save jawaban
- [ ] Type-check / lint hijau
- [ ] Semua skenario test manual lolos
- [ ] Ringkasan perubahan per file dilaporkan

> **Prioritas jika waktu terbatas:** Task 1 + Task 3 + (pastikan `setToken` mereset CBT) sudah menghilangkan mayoritas masalah. Task 2 wajib karena dipakai Task 3. Task 4 & 5 menyempurnakan. Task 6 untuk keandalan ujian.
