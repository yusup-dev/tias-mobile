# Dokumentasi Arsitektur dan Struktur Source Code TIAS (Frontend App)

Dokumen ini berisi penjelasan komprehensif mengenai arsitektur, struktur folder, alur aplikasi, serta efek dan fungsi dari setiap komponen di dalam project **TIAS 2026**. Proyek ini merupakan aplikasi **React Native** (v0.75.3) yang tampaknya berfungsi sebagai Sistem Akademik/Portal Mahasiswa untuk Teknik Informatika, Fakultas Teknik, UIKA Bogor (berdasarkan URL API `https://api-tias.ti.ft.uika-bogor.ac.id/`).

---

## 1. Teknologi dan Library Utama (Tech Stack)

Aplikasi ini menggunakan teknologi modern pengembangan _mobile_ dengan React Native:
- **Framework Utama**: React Native (0.75.3) & React (18.3.1)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (`^5.0.0`) untuk mengelola status global (seperti token otentikasi) yang dipadukan dengan `@react-native-async-storage/async-storage` untuk menyimpan data secara lokal (_persist state_).
- **Network / API**: [Axios](https://axios-http.com/) (`^1.7.0`) untuk HTTP Request, dikombinasikan dengan `@tanstack/react-query` (`^4.33.0`) untuk proses pengambilan, _caching_, dan sinkronisasi data dari server.
- **Routing & Navigation**: `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs` untuk mengatur alur perpindahan antar halaman (screen).
- **UI Components & Styling**:
  - `react-native-paper` untuk komponen UI berbasis Material Design.
  - `react-native-vector-icons` untuk menggunakan icon.
  - `react-native-linear-gradient`, `react-native-svg`.
- **Fitur Hardware (Kamera & Lokasi)**:
  - `react-native-vision-camera` dan `react-native-vision-camera-face-detector` untuk deteksi wajah (sangat mungkin digunakan untuk absensi berbasis *face recognition*).
  - `react-native-geolocation-service` untuk menangkap data lokasi (GPS) pengguna saat melakukan absensi.

---

## 2. Struktur Direktori dan Arsitektur Proyek

Berikut adalah detail penjelasan fungsional setiap folder utama beserta efek penggunaannya di dalam `d:\tias-2026`.

### Direktori Tingkat Atas (Root Level)

- **`android/`** & **`ios/`**: Folder *native* dari sistem operasi untuk kompilasi kode aplikasi menjadi `.apk` / `.aab` (Android) atau `.ipa` (iOS). Berisi pengaturan Gradle, Pods, AndroidManifest, dan Info.plist.
- **`node_modules/`**: Folder yang berisi semua modul dan dependensi eksternal dari `package.json`.
- **`__tests__/`** & **`__mocks__/`**: Folder yang berisi *unit testing* menggunakan Jest.
- **`App.tsx`**: Entry point utama komponen React. File ini membungkus aplikasi dengan *Context Providers* seperti `<SafeAreaProvider>`, `<PaperProvider>`, dan `<QueryClientProvider>`. Efeknya: semua komponen di bawahnya bisa mengakses tema UI Paper, fitur area aman perangkat genggam, dan *cache* koneksi API React Query.
- **`index.js`**: Titik mulai (_entry point_) asli yang me-register `App.tsx` ke dalam engine React Native (Metro Bundler).
- **`package.json`**: Menyimpan daftar dependensi, skrip _build_ (seperti `android-build-release-windows`), dan metadata proyek.

### Bedah Direktori Core (`src/`)

Direktori `src/` adalah tempat di mana seluruh logika bisnis dan *interface* aplikasi dibangun. Aplikasi ini menerapkan pola struktur folder *Feature-Based* / *Domain-Driven* yang dikombinasikan dengan pemisahan teknis.

#### 1. `src/config/`
Folder ini berisi file konfigurasi global aplikasi.
- **Fungsi**: Tempat membuat *instance* _third-party libraries_ dengan pengaturan dasar yang dipakai berulang-ulang.
- **File Penting**: `axios-tias.ts` dan `axios-ti.ts`.
  - Di dalam `axios-tias.ts`, `axios.create` digunakan untuk mendefinisikan `baseURL` API utama.
  - Disertakan juga **Interceptors** untuk `request` dan `response`. Interceptor ini memiliki **efek** melakukan pencatatan log otomatis (`console.log`) untuk setiap request API yang dilakukan dan menangani *error handling* global jika API merespons dengan kegagalan.

#### 2. `src/store/`
Folder ini menangani status (_state_) global aplikasi yang bisa diakses oleh *screen* mana pun tanpa perlu menggunakan _props drilling_.
- **Fungsi**: Mendefinisikan Store Zustand.
- **File Penting**: `auth.ts`.
  - Mengelola data krusial seperti: `token` (JWT Session), `user` (data mahasiswa: NPM, Email, Role), `auth` (status apakah pengguna sudah login), dan `rememberMe`.
  - Menggunakan fungsi *middleware* `persist` dan disinkronkan ke `AsyncStorage`. **Efeknya**: Data otentikasi akan tersimpan di memori perangkat HP, sehingga jika aplikasi ditutup atau HP di-restart, status login tetap tersimpan tanpa harus login ulang.

#### 3. `src/navigation/`
Folder ini menangani alur logika pindah layar dan tumpukan (*stack*) layar.
- **Fungsi**: Mendefinisikan Router dan Navigator di React Native.
- **File Penting**: 
  - `navigate.tsx`: Bertindak sebagai *Gatekeeper* (penjaga pintu utama). Mengambil `auth`, `token`, dan data `user` dari `useTokenStore`. Jika data lengkap (`isLoggedIn`), sistem merender `<BottomTabsComponent />` (halaman dalam). Jika belum login, dilempar ke layar `<Login />`. **Efeknya**: Mencegah pengguna yang tidak memiliki otorisasi mengakses halaman utama aplikasi.
  - `bottom-tabs.tsx`: Mendefinisikan menu navigasi bagian bawah yang biasanya menempel permanen ketika aplikasi dibuka.
  - `absensiStack.tsx`, `cbtStack.tsx`, `perkiliahanStack.tsx`: Tumpukan navigasi spesifik untuk modul tertentu (Nested Navigation).

#### 4. `src/features/`
Folder ini mengelompokkan modul-modul kompleks yang memerlukan *scope* tersendiri dan tidak sekadar sebuah halaman UI biasa.
- **Sub-folder yang ada**: `attendance-face/` (absensi dengan validasi deteksi muka) dan `cbt/` (Computer Based Test).
- **Efek**: Memisahkan kerumitan logika *hardware* atau fitur berat agar tidak bercampur dengan komponen dasar maupun file tampilan UI sederhana.

#### 5. `src/services/`
Folder ini mengelola *Data Fetching* atau logika pengambilan API.
- **Fungsi**: Berisi hooks kustom (biasanya integrasi dari `react-query`) yang membungkus pemanggilan Axios dari `config`.
- **Sub-folder**: `absen/`, `auth/`, `cbt/`, `home/`, `perkuliahan/`.
- **Efek**: Memisahkan logika koneksi server dari UI (*View*). Sehingga halaman UI (di `src/views/`) hanya memanggil hook seperti `useGetJadwal()` dan fokus untuk menampilkan status `isLoading`, `isError`, dan `data` ke *user interface*.

#### 6. `src/views/`
Folder ini mewakili *Screens* atau Halaman-halaman antarmuka aplikasi.
- **Sub-folder/File**: `login.tsx` (Halaman Autentikasi awal), `home/` (Dashboard Utama), `absensi/` (Halaman Absen manual/lihat rekap), `perkuliahan/` (Lihat jadwal, nilai, dll), `gamifikasi/` (Sistem poin/reward perkuliahan), dan `profile/` (Pengaturan akun, alamat, dll).
- **Fungsi**: Tempat meletakkan kode JSX/TSX (*Markup* Visual) dan komponen UI (CSS / StyleSheet RN). Menghubungkan fungsi dari `store` dan `services` ke desain visual.

#### 7. `src/component/`
Folder ini berisi *reusable components* atau komponen antarmuka yang bisa dipakai berkali-kali.
- **Sub-folder**: `camera/`, `dialog/`.
- **Efek**: Mengurangi duplikasi kode (*DRY - Don't Repeat Yourself*). Jika ada desain *Button*, *Modal Dialog*, atau antar-muka *Kamera* yang sama di 5 halaman berbeda, semua me-referensi ke folder ini.

#### 8. `src/helper/`
Folder utilitas untuk menyimpan logika bantuan (*helper function*).
- **Fungsi**: Fungsi murni (pure function) TypeScript seperti *formatter* tanggal (`moment`), *formatter* mata uang/angka, fungsi validasi *regex*, atau algoritma pengolah data sederhana yang digunakan lintas aplikasi.

---

## 3. Alur Sistem Secara Keseluruhan (App Lifecycle Flow)

Untuk memahami bagaimana aplikasi ini berjalan dari saat di-klik oleh *user* sampai menampilkan data, berikut alurnya:

1. **Inisiasi App (Boot Sequence)**:
   Aplikasi mulai dari `index.js`, yang memanggil `App.tsx`. `App.tsx` membungkus aplikasi dengan *context* warna/tema, alat pengolah data (`QueryClientProvider`), dan area aman ponsel (`SafeAreaProvider`).
2. **Pengecekan Otentikasi (Auth Check)**:
   Kemudian masuk ke `src/navigation/navigate.tsx`. Komponen ini diam-diam membaca memori lokal menggunakan `Zustand`.
   - **Kasus A (Belum Login):** Token kosong. Sistem memuat komponen `src/views/login.tsx`. Pengguna mengisi form. Saat klik Submit, UI Login memanggil API lewat `src/services/auth/`. Jika sukses dari server (`axios-tias.ts`), *response* berisi JWT Token. Token dimasukkan ke *store* global lewat fungsi `setToken` di `src/store/auth.ts`.
   - **Kasus B (Sudah Login):** `navigate.tsx` mendeteksi kehadiran token dan identitas mahasiswa/NPM. Tampilan langsung dialihkan ke `<BottomTabsComponent />`.
3. **Navigasi Tab dan Menu**:
   `bottom-tabs.tsx` akan menampilkan *dashboard* utama (biasanya terhubung ke file `src/views/home/index.tsx`).
4. **Alur Pemanggilan Data (Data Fetching Flow)**:
   Saat layar *Home* atau layar *Perkuliahan* dimuat:
   - UI (misal: `src/views/perkuliahan/index.tsx`) memanggil fungsi Hook API di folder `src/services/perkuliahan/`.
   - Hook React Query meminta Axios (`src/config/axios-tias.ts`) untuk HTTP GET ke URL `api-tias.ti.ft.uika-bogor.ac.id/endpoint`.
   - Di latar belakang, *interceptor* menambahkan JWT Header (authorization barer).
   - Data kembali, disimpan di *cache* lokal oleh React Query, dan tampilan loading *spinner* berganti menjadi tabel jadwal kuliah/nilai.
5. **Fitur Khusus (Geofence & Camera)**:
   Jika mahasiswa membuka menu **Absensi**, layar akan membuka modul di `src/features/attendance-face/`. Modul ini mengaktifkan GPS (`react-native-geolocation-service`) untuk mencocokkan koordinat, dan menyalakan UI Kamera (`react-native-vision-camera`). Begitu wajah terdeteksi dan diklik, gambar dan kordinat dikirim melalui `Axios` sebagai absensi hadir.

## Kesimpulan
Arsitektur source code **TIAS 2026** sangat modern, modular, dan mengikuti _Best Practices_ React Native (dengan pemisahan `store`, `services`, `views`, dan `features`). Penggunaan Zustand dipadu AsyncStorage membuat manajemen sesi efisien, sementara penggunaan Axios bersama React-Query di _services_ layer menjamin performa *fetching* data tetap optimal dengan *caching* yang baik. Struktur ini dirancang untuk mudah diskalakan, sehingga jika ada penambahan fitur (seperti CBT / Gamifikasi di masa mendatang), pengembang cukup meletakkan logikanya di `features/` atau halaman di `views/` tanpa mengganggu core *root* aplikasi.
