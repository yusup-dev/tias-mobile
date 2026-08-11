# Agent Guide — TIAS Mobile
# Integrasi Fitur CBT (Computer Based Test)

## Konteks Sistem Ini

Kamu adalah agent yang bekerja pada sistem **TIAS Mobile** — aplikasi mobile mahasiswa kampus UIKA Bogor yang dibangun dengan:
- **React Native 0.75.3 + TypeScript**
- **Zustand + AsyncStorage** untuk state management
- **Axios + React Query (@tanstack/react-query)** untuk fetching data
- **React Navigation** untuk routing (stack + bottom tabs)
- Arsitektur Feature-Based: `src/features/`, `src/services/`, `src/views/`, `src/store/`

---

## Peranmu dalam Integrasi Ini

TIAS Mobile adalah **sisi client yang mahasiswa gunakan** untuk mengerjakan ujian. Tugasmu:
1. Melakukan SSO otomatis ke CBT API saat mahasiswa membuka menu CBT (via TIAS Backend)
2. Menampilkan daftar ujian yang sedang berlangsung
3. Menerima input token ujian dari mahasiswa, verifikasi ke CBT API
4. Menampilkan ruang ujian: soal 4 tipe, timer countdown, navigasi antar soal
5. Mengirim jawaban ke CBT API dan menampilkan hasil
6. Untuk dosen: tombol yang membuka browser ke Web CBT (bukan ujian di mobile)

**Mahasiswa mengerjakan ujian sepenuhnya di dalam aplikasi TIAS Mobile — tidak dipindahkan ke browser atau WebView.**

---

## Dua Server yang Diakses

| Aksi | Server yang Dituju |
|------|-------------------|
| Login, SSO `/api/cbt/auth` | **TIAS Backend** (via `axios-tias` yang sudah ada) |
| Daftar ujian, verifikasi token, soal, submit, hasil | **CBT API** langsung (via `axios-cbt` yang baru dibuat) |

---

## Alur Lengkap Mahasiswa

```
Login TIAS (email + password) → JWT TIAS tersimpan di store
  ↓
Tap menu CBT di bottom tab
  ↓
CBTEntryScreen: SSO otomatis
  → kirim JWT TIAS ke TIAS Backend POST /api/cbt/auth
  → terima CBT Token → simpan di store
  ↓
CBTListScreen: tampil daftar ujian berlangsung
  → GET /api/student/exams ke CBT API
  ↓
Tap salah satu ujian
  ↓
CBTTokenScreen: input token dari dosen
  → POST /api/student/verify-token ke CBT API
  ↓
Token valid → CBTExamScreen: ruang ujian
  → GET /api/exams/:id/questions ke CBT API
  → timer countdown aktif
  → kerjakan soal (PG / teks / esai / upload file)
  ↓
Submit (manual atau auto saat timer habis)
  → POST /api/student/submit-exam ke CBT API
  ↓
CBTResultScreen: tampil skor + status per soal
```

---

## Perubahan yang Harus Dilakukan

### PERUBAHAN 1 — Install Dependency Baru

```bash
cd tias-2026

npm install react-native-document-picker

# Untuk iOS (jika perlu):
cd ios && pod install && cd ..
```

---

### PERUBAHAN 2 — Buat Instance Axios untuk CBT API

Buat file baru: `src/config/axios-cbt.ts`

```typescript
import axios from 'axios';
import { useTokenStore } from '../store/auth';

const CBT_API_BASE_URL = 'https://url-cbt-api-kamu.com'; // ganti dengan URL CBT API

const axiosCbt = axios.create({
  baseURL: CBT_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Otomatis sisipkan CBT Token di setiap request ke CBT API
axiosCbt.interceptors.request.use(
  (config) => {
    const cbtToken = useTokenStore.getState().cbt_token;
    if (cbtToken) {
      config.headers.Authorization = `Bearer ${cbtToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Jika CBT Token expired (401), hapus dari store agar SSO diulang
axiosCbt.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useTokenStore.getState().clearCbtToken();
    }
    return Promise.reject(error);
  }
);

export default axiosCbt;
```

---

### PERUBAHAN 3 — Update Zustand Auth Store

Edit file: `src/store/auth.ts`

Tambahkan state dan action CBT Token ke store yang sudah ada. **Jangan hapus state yang sudah ada.**

```typescript
// Tambahkan ke interface TokenStore:
cbt_token: string | null;
cbt_user_id: number | null;
setCbtToken: (token: string, cbt_user_id: number) => void;
clearCbtToken: () => void;

// Tambahkan ke dalam create():
cbt_token: null,
cbt_user_id: null,

setCbtToken: (cbt_token, cbt_user_id) => set({ cbt_token, cbt_user_id }),

clearCbtToken: () => set({ cbt_token: null, cbt_user_id: null }),

// Di action logout yang sudah ada, tambahkan reset CBT Token:
logout: () => set({
  token: null,
  user: null,
  auth: false,
  cbt_token: null,     // ← tambahkan
  cbt_user_id: null,   // ← tambahkan
}),
```

---

### PERUBAHAN 4 — Buat Services (React Query Hooks)

Buat semua file di folder `src/services/cbt/`:

---

**`src/services/cbt/useCbtLogin.ts`**
```typescript
import { useMutation } from '@tanstack/react-query';
import { useTokenStore } from '../../store/auth';
import axiosTias from '../../config/axios-tias'; // pakai axios TIAS, bukan CBT

export const useCbtLogin = () => {
  const { token, setCbtToken } = useTokenStore();

  return useMutation({
    mutationFn: async () => {
      const res = await axiosTias.post(
        '/api/cbt/auth',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success && data?.data?.cbt_token) {
        setCbtToken(data.data.cbt_token, data.data.cbt_user_id);
      }
    },
  });
};
```

---

**`src/services/cbt/useExamList.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import axiosCbt from '../../config/axios-cbt';

export interface Exam {
  id: number;
  nama_ujian: string;
  mata_kuliah: string;
  durasi: number;
  start_time: string;
  end_time: string;
}

export const useExamList = () => {
  return useQuery<Exam[]>({
    queryKey: ['cbt-exam-list'],
    queryFn: async () => {
      const res = await axiosCbt.get('/api/student/exams');
      return res.data?.data ?? [];
    },
    staleTime: 30_000,
    retry: 2,
  });
};
```

---

**`src/services/cbt/useVerifyToken.ts`**
```typescript
import { useMutation } from '@tanstack/react-query';
import axiosCbt from '../../config/axios-cbt';

export interface Question {
  id: number;
  tipe: 'TIPE_1' | 'TIPE_2' | 'TIPE_3' | 'TIPE_4';
  pertanyaan: string;
  bobot: number;
  options?: string[];
}

export const useVerifyToken = () => {
  return useMutation({
    mutationFn: async (tokenUjian: string) => {
      const res = await axiosCbt.post('/api/student/verify-token', {
        token: tokenUjian,
      });
      return res.data;
    },
  });
};
```

---

**`src/services/cbt/useSubmitExam.ts`**
```typescript
import { useMutation } from '@tanstack/react-query';
import axiosCbt from '../../config/axios-cbt';

export const useSubmitExam = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axiosCbt.post('/api/student/submit-exam', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30_000,
      });
      return res.data;
    },
  });
};
```

---

**`src/services/cbt/useExamResult.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import axiosCbt from '../../config/axios-cbt';

export const useExamResult = (examId: number | null) => {
  return useQuery({
    queryKey: ['cbt-result', examId],
    queryFn: async () => {
      const res = await axiosCbt.get(`/api/student/result/${examId}`);
      return res.data?.data;
    },
    enabled: !!examId,
    retry: 1,
  });
};
```

---

### PERUBAHAN 5 — Buat Screen-Screen CBT

Buat semua file di folder `src/features/cbt/`:

---

**`src/features/cbt/CBTEntryScreen.tsx`** — SSO otomatis + routing berdasarkan role:

```tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTokenStore } from '../../store/auth';
import { useCbtLogin } from '../../services/cbt/useCbtLogin';

const CBT_WEB_URL = 'https://url-web-cbt-dosen.com'; // ganti dengan URL Web CBT dosen

const CBTEntryScreen = ({ navigation }: any) => {
  const { cbt_token, user } = useTokenStore();
  const { mutate: loginCbt, isPending, isError } = useCbtLogin();

  const isDosen = user?.role === 'Dosen' || user?.role === 'dosen';

  useEffect(() => {
    if (!isDosen && !cbt_token) {
      loginCbt();
    }
  }, []);

  useEffect(() => {
    if (cbt_token && !isDosen) {
      navigation.replace('CBTList');
    }
  }, [cbt_token]);

  if (isDosen) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Portal Dosen CBT</Text>
        <Text style={styles.subtitle}>
          Untuk membuat dan mengelola ujian, gunakan Portal Web CBT.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(CBT_WEB_URL)}>
          <Text style={styles.buttonText}>Buka Portal Web CBT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E75B6" />
        <Text style={styles.loadingText}>Menghubungkan ke sistem ujian...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Gagal terhubung ke sistem CBT.</Text>
        <TouchableOpacity style={styles.button} onPress={() => loginCbt()}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <View style={styles.container}><ActivityIndicator size="large" color="#2E75B6" /></View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  button: { backgroundColor: '#2E75B6', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  loadingText: { marginTop: 16, color: '#555', fontSize: 14 },
  errorText: { color: '#e53e3e', marginBottom: 16, fontSize: 15, textAlign: 'center' },
});

export default CBTEntryScreen;
```

---

**`src/features/cbt/CBTListScreen.tsx`** — daftar ujian berlangsung:

```tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useExamList, Exam } from '../../services/cbt/useExamList';

const CBTListScreen = ({ navigation }: any) => {
  const { data: exams, isLoading, isError, refetch, isFetching } = useExamList();

  const renderItem = ({ item }: { item: Exam }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CBTToken', { exam: item })}
    >
      <Text style={styles.cardTitle}>{item.nama_ujian}</Text>
      <Text style={styles.cardSub}>{item.mata_kuliah}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardInfo}>⏱ {item.durasi} menit</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>Berlangsung</Text></View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#2E75B6" />
      <Text style={{ marginTop: 12, color: '#555' }}>Memuat daftar ujian...</Text>
    </View>
  );

  if (isError) return (
    <View style={styles.center}>
      <Text style={{ color: '#e53e3e', marginBottom: 12 }}>Gagal memuat ujian.</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ujian Berlangsung</Text>
      <FlatList
        data={exams}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: '#888', textAlign: 'center' }}>
              Tidak ada ujian yang sedang berlangsung.
            </Text>
          </View>
        }
        contentContainerStyle={exams?.length === 0 ? { flex: 1 } : { paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { fontSize: 20, fontWeight: 'bold', padding: 20, paddingBottom: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  retryBtn: { backgroundColor: '#2E75B6', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  card: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 12, padding: 16, elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#666', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { fontSize: 12, color: '#888' },
  badge: { backgroundColor: '#DCFCE7', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20 },
  badgeText: { color: '#16A34A', fontSize: 11, fontWeight: 'bold' },
});

export default CBTListScreen;
```

---

**`src/features/cbt/CBTTokenScreen.tsx`** — input token ujian:

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useVerifyToken } from '../../services/cbt/useVerifyToken';

const CBTTokenScreen = ({ route, navigation }: any) => {
  const { exam } = route.params;
  const [tokenInput, setTokenInput] = useState('');
  const { mutate: verifyToken, isPending } = useVerifyToken();

  const handleVerifikasi = () => {
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      Alert.alert('Perhatian', 'Masukkan token ujian terlebih dahulu.');
      return;
    }

    verifyToken(trimmed, {
      onSuccess: (data) => {
        if (data?.success) {
          navigation.replace('CBTExam', {
            exam,
            questions: data.data?.questions ?? [],
            durasi: data.data?.durasi ?? exam.durasi,
          });
        } else {
          Alert.alert('Token Tidak Valid', data?.message || 'Periksa kembali token ujian Anda.');
        }
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || 'Token tidak valid atau ujian sudah ditutup.';
        Alert.alert('Gagal Masuk', msg);
      },
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={styles.title}>{exam.nama_ujian}</Text>
        <Text style={styles.subtitle}>{exam.mata_kuliah} · {exam.durasi} menit</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Token Ujian</Text>
          <Text style={styles.hint}>Masukkan token yang diberikan oleh dosen</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: ABC123"
            placeholderTextColor="#aaa"
            value={tokenInput}
            onChangeText={setTokenInput}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={20}
          />
          <TouchableOpacity
            style={[styles.button, isPending && { backgroundColor: '#93B8D8' }]}
            onPress={handleVerifikasi}
            disabled={isPending}
          >
            {isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Masuk ke Ruang Ujian</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, elevation: 3 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  hint: { fontSize: 12, color: '#888', marginBottom: 14 },
  input: {
    borderWidth: 1.5, borderColor: '#CBD5E0', borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 16,
    fontSize: 20, fontWeight: 'bold', letterSpacing: 4, textAlign: 'center', marginBottom: 20,
  },
  button: { backgroundColor: '#2E75B6', paddingVertical: 16, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CBTTokenScreen;
```

---

**`src/features/cbt/CBTExamScreen.tsx`** — ruang ujian (4 tipe soal + timer):

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, BackHandler, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useSubmitExam } from '../../services/cbt/useSubmitExam';

const CBTExamScreen = ({ route, navigation }: any) => {
  const { exam, questions, durasi } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState((durasi ?? 60) * 60);
  const [sudahSubmit, setSudahSubmit] = useState(false);
  const timerRef = useRef<any>(null);
  const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam();

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Blokir back button selama ujian
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert('Perhatian', 'Tidak dapat meninggalkan ruang ujian.');
      return true;
    });
    return () => sub.remove();
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const setAnswer = (id: number, val: any) => setAnswers((p) => ({ ...p, [id]: val }));

  const handlePickFile = async (id: number) => {
    try {
      const f = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.allFiles] });
      setAnswer(id, f);
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) Alert.alert('Error', 'Gagal memilih file.');
    }
  };

  const handleSubmit = useCallback((auto = false) => {
    if (sudahSubmit) return;
    const doSubmit = () => {
      setSudahSubmit(true);
      clearInterval(timerRef.current);
      const fd = new FormData();
      fd.append('exam_id', String(exam.id));
      questions.forEach((q: any) => {
        const jaw = answers[q.id];
        if (q.tipe === 'TIPE_4' && jaw) {
          fd.append(`answer_${q.id}`, { uri: jaw.uri, type: jaw.type, name: jaw.name } as any);
        } else {
          fd.append(`answer_${q.id}`, jaw ?? '');
        }
      });
      submitExam(fd, {
        onSuccess: (data) => navigation.replace('CBTResult', { exam, result: data?.data }),
        onError: () => { setSudahSubmit(false); Alert.alert('Gagal Submit', 'Terjadi kesalahan. Coba lagi.'); },
      });
    };
    if (auto) { doSubmit(); return; }
    Alert.alert('Kumpulkan Ujian?', 'Jawaban tidak dapat diubah setelah dikumpulkan.',
      [{ text: 'Batal', style: 'cancel' }, { text: 'Kumpulkan', onPress: doSubmit }]);
  }, [sudahSubmit, answers, exam, questions]);

  const q = questions[currentIndex];
  const timerWarn = timeLeft <= 300;

  const renderJawaban = (q: any) => {
    switch (q.tipe) {
      case 'TIPE_1':
        return (
          <View style={{ gap: 10 }}>
            {(q.options ?? []).map((opt: string, i: number) => {
              const label = ['A','B','C','D'][i];
              const sel = answers[q.id] === label;
              return (
                <TouchableOpacity key={i} style={[styles.option, sel && styles.optSel]} onPress={() => setAnswer(q.id, label)}>
                  <View style={[styles.optLabel, sel && { backgroundColor: '#2E75B6' }]}>
                    <Text style={[{ fontWeight: 'bold', fontSize: 13, color: '#555' }, sel && { color: '#fff' }]}>{label}</Text>
                  </View>
                  <Text style={[{ flex: 1, fontSize: 14 }, sel && { color: '#2E75B6', fontWeight: '600' }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      case 'TIPE_2':
        return <TextInput style={styles.inputSingkat} placeholder="Ketik jawaban singkat..." value={answers[q.id] ?? ''} onChangeText={(t) => setAnswer(q.id, t)} />;
      case 'TIPE_3':
        return <TextInput style={styles.inputEsai} placeholder="Tulis jawaban esai..." value={answers[q.id] ?? ''} onChangeText={(t) => setAnswer(q.id, t)} multiline textAlignVertical="top" />;
      case 'TIPE_4':
        const file = answers[q.id];
        return (
          <TouchableOpacity style={styles.uploadBtn} onPress={() => handlePickFile(q.id)}>
            <Text style={{ color: '#2E75B6', fontWeight: '600' }}>{file ? `📎 ${file.name}` : '📁 Pilih File Jawaban'}</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <View style={[styles.header, timerWarn && { backgroundColor: '#DC2626' }]}>
        <Text style={{ flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 13, marginRight: 12 }} numberOfLines={1}>{exam.nama_ujian}</Text>
        <Text style={{ color: timerWarn ? '#FEF08A' : '#fff', fontSize: 18, fontWeight: 'bold' }}>{formatTime(timeLeft)}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: '#fff', maxHeight: 56, flexGrow: 0 }} contentContainerStyle={{ padding: 8, gap: 6 }}>
        {questions.map((_: any, idx: number) => {
          const ans = answers[questions[idx].id] !== undefined;
          return (
            <TouchableOpacity key={idx} style={[styles.navNum, idx === currentIndex && { backgroundColor: '#2E75B6' }, ans && { backgroundColor: '#16A34A' }]} onPress={() => setCurrentIndex(idx)}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: (idx === currentIndex || ans) ? '#fff' : '#555' }}>{idx + 1}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 13, color: '#888', fontWeight: '600' }}>Soal {currentIndex + 1} / {questions.length}</Text>
            <View style={{ backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
              <Text style={{ color: '#1D4ED8', fontSize: 11, fontWeight: '600' }}>{q.tipe.replace('_', ' ')}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 15, lineHeight: 24, marginBottom: 20 }}>{q.pertanyaan}</Text>
          {renderJawaban(q)}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.navBtn, currentIndex === 0 && { opacity: 0.4 }]} onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}>
          <Text style={{ color: '#555', fontWeight: '600' }}>← Sebelumnya</Text>
        </TouchableOpacity>
        {currentIndex < questions.length - 1
          ? <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentIndex((i) => i + 1)}><Text style={{ color: '#555', fontWeight: '600' }}>Berikutnya →</Text></TouchableOpacity>
          : <TouchableOpacity style={[styles.submitBtn, (isSubmitting || sudahSubmit) && { backgroundColor: '#86EFAC' }]} onPress={() => handleSubmit(false)} disabled={isSubmitting || sudahSubmit}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isSubmitting ? 'Mengumpulkan...' : 'Kumpulkan Ujian'}</Text>
            </TouchableOpacity>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2E75B6', paddingHorizontal: 16, paddingVertical: 12, paddingTop: Platform.OS === 'ios' ? 50 : 12 },
  navNum: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 10, padding: 14 },
  optSel: { borderColor: '#2E75B6', backgroundColor: '#EFF6FF' },
  optLabel: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  inputSingkat: { borderWidth: 1.5, borderColor: '#CBD5E0', borderRadius: 10, padding: 14, fontSize: 15 },
  inputEsai: { borderWidth: 1.5, borderColor: '#CBD5E0', borderRadius: 10, padding: 14, fontSize: 15, minHeight: 180 },
  uploadBtn: { borderWidth: 1.5, borderColor: '#2E75B6', borderRadius: 10, borderStyle: 'dashed', padding: 20, alignItems: 'center', backgroundColor: '#EFF6FF' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  navBtn: { backgroundColor: '#E2E8F0', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  submitBtn: { backgroundColor: '#16A34A', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
});

export default CBTExamScreen;
```

---

**`src/features/cbt/CBTResultScreen.tsx`** — hasil ujian:

```tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const CBTResultScreen = ({ route, navigation }: any) => {
  const { exam, result } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.resultHeader}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 4 }}>Hasil Ujian</Text>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>{exam.nama_ujian}</Text>
          <View style={styles.scoreBox}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 4 }}>Total Skor Sementara</Text>
            <Text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>{result?.total_score ?? '-'}</Text>
          </View>
        </View>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 12 }}>Detail Penilaian</Text>
          {(result?.details ?? []).map((item: any, idx: number) => (
            <View key={item.question_id} style={styles.detailCard}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>Soal {idx + 1}</Text>
                <Text style={{ fontSize: 12, color: '#888' }}>{item.tipe?.replace('_', ' ')}</Text>
              </View>
              {item.status === 'menunggu'
                ? <View style={styles.badgeWait}><Text style={{ color: '#D97706', fontSize: 11, fontWeight: '600' }}>Menunggu Koreksi</Text></View>
                : <View style={styles.badgeDone}><Text style={{ color: '#16A34A', fontSize: 11, fontWeight: '600' }}>Skor: {item.score ?? 0}</Text></View>
              }
            </View>
          ))}
          {result?.has_pending && (
            <View style={{ backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14, marginTop: 8 }}>
              <Text style={{ color: '#1D4ED8', fontSize: 13, lineHeight: 20 }}>
                ℹ️ Beberapa soal masih menunggu koreksi dosen. Skor akhir akan diperbarui setelah semua soal dikoreksi.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={{ padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.navigate('CBTList')}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Kembali ke Daftar Ujian</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultHeader: { backgroundColor: '#2E75B6', padding: 24, paddingTop: 48, alignItems: 'center' },
  scoreBox: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, padding: 20, alignItems: 'center', width: '70%' },
  detailCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 1 },
  badgeWait: { backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeDone: { backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  btnBack: { backgroundColor: '#2E75B6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
});

export default CBTResultScreen;
```

---

### PERUBAHAN 6 — Update Stack Navigator CBT

Edit file: `src/navigation/cbtStack.tsx`

```tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CBTEntryScreen from '../features/cbt/CBTEntryScreen';
import CBTListScreen from '../features/cbt/CBTListScreen';
import CBTTokenScreen from '../features/cbt/CBTTokenScreen';
import CBTExamScreen from '../features/cbt/CBTExamScreen';
import CBTResultScreen from '../features/cbt/CBTResultScreen';

const Stack = createStackNavigator();

const CBTStack = () => (
  <Stack.Navigator
    initialRouteName="CBTEntry"
    screenOptions={{
      headerStyle: { backgroundColor: '#2E75B6' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen name="CBTEntry" component={CBTEntryScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CBTList" component={CBTListScreen} options={{ title: 'Daftar Ujian', headerLeft: () => null }} />
    <Stack.Screen name="CBTToken" component={CBTTokenScreen} options={{ title: 'Masuk Ujian' }} />
    <Stack.Screen
      name="CBTExam"
      component={CBTExamScreen}
      options={{
        headerShown: false,
        gestureEnabled: false,   // nonaktifkan swipe back iOS saat ujian
      }}
    />
    <Stack.Screen name="CBTResult" component={CBTResultScreen} options={{ title: 'Hasil Ujian', headerLeft: () => null }} />
  </Stack.Navigator>
);

export default CBTStack;
```

---

## Catatan Penting untuk Agent

1. **`axios-tias`** sudah ada di `src/config/axios-tias.ts`. Gunakan untuk request ke TIAS Backend. **Jangan ubah file ini.**

2. **`axios-cbt`** adalah file baru yang kamu buat. Gunakan khusus untuk request langsung ke CBT API.

3. **Nama field response** — nama field dari CBT API (`nama_ujian`, `mata_kuliah`, `is_active`, dll) mungkin berbeda dengan yang tertulis di sini. Sesuaikan dengan response aktual dari CBT API. Gunakan `console.log(response.data)` saat development untuk melihat struktur aktual.

4. **Role check dosen** — sesuaikan `user?.role === 'Dosen'` dengan nilai role aktual yang disimpan di store TIAS.

5. **URL CBT API** — ganti `'https://url-cbt-api-kamu.com'` di `axios-cbt.ts` dengan URL CBT API yang sebenarnya.

6. **URL Web CBT** — ganti `CBT_WEB_URL` di `CBTEntryScreen.tsx` dengan URL portal web CBT untuk dosen.

---

## Checklist Sebelum Selesai

- [ ] `react-native-document-picker` terinstall
- [ ] `src/config/axios-cbt.ts` dibuat dengan URL CBT API yang benar
- [ ] `src/store/auth.ts` diupdate: `cbt_token`, `cbt_user_id`, `setCbtToken`, `clearCbtToken`, reset di `logout`
- [ ] `src/services/cbt/useCbtLogin.ts` dibuat
- [ ] `src/services/cbt/useExamList.ts` dibuat
- [ ] `src/services/cbt/useVerifyToken.ts` dibuat
- [ ] `src/services/cbt/useSubmitExam.ts` dibuat
- [ ] `src/services/cbt/useExamResult.ts` dibuat
- [ ] `src/features/cbt/CBTEntryScreen.tsx` dibuat
- [ ] `src/features/cbt/CBTListScreen.tsx` dibuat
- [ ] `src/features/cbt/CBTTokenScreen.tsx` dibuat
- [ ] `src/features/cbt/CBTExamScreen.tsx` dibuat
- [ ] `src/features/cbt/CBTResultScreen.tsx` dibuat
- [ ] `src/navigation/cbtStack.tsx` diupdate dengan semua 5 screen
- [ ] Test: login → buka menu CBT → daftar ujian muncul → input token → masuk ruang ujian → submit → hasil tampil
- [ ] Back button tidak bisa ditekan selama di CBTExamScreen
