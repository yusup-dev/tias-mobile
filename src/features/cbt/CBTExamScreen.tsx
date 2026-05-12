import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, BackHandler, Platform, SafeAreaView } from 'react-native';
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
      Alert.alert('Perhatian', 'Anda tidak dapat meninggalkan ruang ujian yang sedang berlangsung.');
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
        if (q.tipe_soal === 'TIPE_4' && jaw) {
          fd.append(`file_${q.id}`, { uri: jaw.uri, type: jaw.type, name: jaw.name } as any);
        } else {
          // Sesuaikan dengan format JSON yang diterima backend
          fd.append(`answers[${q.id}]`, jaw ?? ''); 
        }
      });
submitExam(fd, {
        onSuccess: (data) => {
          // JARING PENGAMAN: Ambil data utuh, jangan terpaku pada data.data
          const payload = data?.data || data; 
          navigation.replace('CBTResult', { exam, result: payload });
        },
        onError: () => { setSudahSubmit(false); Alert.alert('Gagal Submit', 'Terjadi kesalahan jaringan. Coba lagi.'); },
      });
    };
    if (auto) { doSubmit(); return; }
    
    // Hitung soal yang sudah dijawab
    const dijawab = Object.keys(answers).filter(k => answers[Number(k)] !== undefined && answers[Number(k)] !== '').length;
    
    Alert.alert(
      'Kumpulkan Ujian?', 
      `Anda telah menjawab ${dijawab} dari ${questions.length} soal.\nJawaban tidak dapat diubah setelah dikumpulkan.`,
      [{ text: 'Periksa Kembali', style: 'cancel' }, { text: 'Ya, Kumpulkan', onPress: doSubmit }]
    );
  }, [sudahSubmit, answers, exam, questions]);

  const q = questions[currentIndex];
  const timerWarn = timeLeft <= 300;

  const renderJawaban = (q: any) => {
    switch (q.tipe_soal) { // FIX: Menggunakan tipe_soal
      case 'TIPE_1':
        return (
          <View style={{ gap: 12 }}>
            {(q.question_options ?? []).map((opt: any, i: number) => { // FIX: Menggunakan question_options
              const label = opt.label_pilihan || ['A','B','C','D'][i];
              const sel = answers[q.id] === label;
              return (
                <TouchableOpacity activeOpacity={0.7} key={i} style={[styles.optionCard, sel && styles.optionCardActive]} onPress={() => setAnswer(q.id, label)}>
                  <View style={[styles.optionBadge, sel && styles.optionBadgeActive]}>
                    <Text style={[styles.optionBadgeText, sel && styles.optionBadgeTextActive]}>{label}</Text>
                  </View>
                  <Text style={[styles.optionText, sel && styles.optionTextActive]}>{opt.teks_pilihan}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      case 'TIPE_2':
        return (
          <TextInput 
            style={styles.inputSingkat} 
            placeholder="Ketik jawaban singkat di sini..." 
            placeholderTextColor="#94A3B8"
            value={answers[q.id] ?? ''} 
            onChangeText={(t) => setAnswer(q.id, t)} 
          />
        );
      case 'TIPE_3':
        return (
          <TextInput 
            style={styles.inputEsai} 
            placeholder="Uraikan jawaban Anda secara lengkap..." 
            placeholderTextColor="#94A3B8"
            value={answers[q.id] ?? ''} 
            onChangeText={(t) => setAnswer(q.id, t)} 
            multiline 
            textAlignVertical="top" 
          />
        );
      case 'TIPE_4':
        const file = answers[q.id];
        return (
          <TouchableOpacity activeOpacity={0.8} style={[styles.uploadArea, file && styles.uploadAreaActive]} onPress={() => handlePickFile(q.id)}>
            <Text style={[styles.uploadText, file && styles.uploadTextActive]}>
              {file ? `✅ ${file.name}` : '📁 Ketuk untuk melampirkan Dokumen/File'}
            </Text>
            {!file && <Text style={styles.uploadSubtext}>Maks. 5MB (PDF/JPG/PNG/ZIP)</Text>}
          </TouchableOpacity>
        );
      default:
        return <Text style={{ color: '#94A3B8', fontStyle: 'italic' }}>Tipe soal tidak didukung.</Text>;
    }
  };

  if (!q) return <View style={styles.container}><Text>Memuat soal...</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      {/* 🌟 HEADER - TEMA HIJAU UIKA */}
      <View style={[styles.header, timerWarn && styles.headerWarning]}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{exam.nama_ujian}</Text>
          <Text style={styles.headerSubtitle}>{exam.mata_kuliah?.nama_mk || exam.kode_mk}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>SISA WAKTU</Text>
          <Text style={[styles.timerValue, timerWarn && styles.timerValueWarning]}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* 🌟 NAVIGASI NOMOR SOAL SCROLL */}
      <View style={styles.navScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navScrollContent}>
          {questions.map((_: any, idx: number) => {
            const isAnswered = answers[questions[idx].id] !== undefined && answers[questions[idx].id] !== '';
            const isActive = idx === currentIndex;
            
            return (
              <TouchableOpacity 
                key={idx} 
                style={[
                  styles.navBubble, 
                  isAnswered && styles.navBubbleAnswered,
                  isActive && styles.navBubbleActive
                ]} 
                onPress={() => setCurrentIndex(idx)}
              >
                <Text style={[
                  styles.navBubbleText, 
                  (isActive || isAnswered) && styles.navBubbleTextActive
                ]}>
                  {idx + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 🌟 AREA NASKAH SOAL */}
      <ScrollView style={styles.contentArea} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.questionCard}>
          <View style={styles.questionMeta}>
            <Text style={styles.questionNumber}>Pertanyaan {currentIndex + 1} dari {questions.length}</Text>
            <View style={styles.badgeTipe}>
              <Text style={styles.badgeTipeText}>
                {q.tipe_soal ? q.tipe_soal.replace('_', ' ') : 'SOAL'}
              </Text>
            </View>
          </View>
          {/* FIX: Menggunakan isi_soal */}
          <Text style={styles.questionText}>{q.isi_soal}</Text> 
          
          <View style={styles.divider} />
          
          {renderJawaban(q)}
        </View>
      </ScrollView>

      {/* 🌟 FOOTER AKSI */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btnAction, styles.btnPrev, currentIndex === 0 && styles.btnDisabled]} 
          onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))} 
          disabled={currentIndex === 0}
        >
          <Text style={styles.btnPrevText}>Kembali</Text>
        </TouchableOpacity>
        
        {currentIndex < questions.length - 1 ? (
          <TouchableOpacity 
            style={[styles.btnAction, styles.btnNext]} 
            onPress={() => setCurrentIndex((i) => i + 1)}
          >
            <Text style={styles.btnNextText}>Selanjutnya</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.btnAction, styles.btnSubmit, (isSubmitting || sudahSubmit) && styles.btnDisabled]} 
            onPress={() => handleSubmit(false)} 
            disabled={isSubmitting || sudahSubmit}
          >
            <Text style={styles.btnSubmitText}>{isSubmitting ? 'Memproses...' : 'Kumpulkan'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' }, // Hijau UIKA sangat muda

  // Header UIKA Green
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#14532D', // Hijau UIKA Gelap
    paddingHorizontal: 20, paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    borderBottomWidth: 1, borderBottomColor: '#0F3D1F',
  },
  headerWarning: { backgroundColor: '#DC2626' }, // Merah jika waktu mau habis
  headerTitleContainer: { flex: 1, paddingRight: 16 },
  headerTitle: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
  headerSubtitle: { color: '#BBF7D0', fontSize: 12, marginTop: 4, fontWeight: '500' },
  timerContainer: { alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.18)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  timerLabel: { color: '#BBF7D0', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  timerValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', fontVariant: ['tabular-nums'] },
  timerValueWarning: { color: '#FACC15' }, // Kuning UIKA saat warning

  // Navigasi Soal
  navScrollContainer: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#DCFCE7', shadowColor: '#14532D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  navScrollContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  navBubble: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DCFCE7' },
  navBubbleAnswered: { backgroundColor: '#16A34A', borderColor: '#16A34A' }, // Hijau UIKA
  navBubbleActive: { backgroundColor: '#FFFFFF', borderColor: '#14532D', borderWidth: 2, transform: [{ scale: 1.1 }] },
  navBubbleText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  navBubbleTextActive: { color: '#FFFFFF' },

  // Area Konten
  contentArea: { flex: 1, padding: 16 },
  questionCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#14532D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: '#DCFCE7' },
  questionMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  questionNumber: { fontSize: 13, color: '#166534', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  badgeTipe: { backgroundColor: '#FEF9C3', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#FACC15' },
  badgeTipeText: { color: '#CA8A04', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  questionText: { fontSize: 16, lineHeight: 28, color: '#14532D', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#DCFCE7', marginVertical: 24 },

  // Pilihan Ganda (TIPE 1)
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#DCFCE7', borderRadius: 16, padding: 16 },
  optionCardActive: { borderColor: '#16A34A', backgroundColor: '#F0FDF4' },
  optionBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#DCFCE7' },
  optionBadgeActive: { backgroundColor: '#16A34A', borderColor: '#16A34A' },
  optionBadgeText: { fontWeight: '800', fontSize: 14, color: '#166534' },
  optionBadgeTextActive: { color: '#FFFFFF' },
  optionText: { flex: 1, fontSize: 15, color: '#166534', lineHeight: 22 },
  optionTextActive: { color: '#14532D', fontWeight: '600' },

  // Input Teks (TIPE 2 & 3)
  inputSingkat: { backgroundColor: '#F0FDF4', borderWidth: 1.5, borderColor: '#DCFCE7', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, fontSize: 16, color: '#14532D', fontWeight: '500' },
  inputEsai: { backgroundColor: '#F0FDF4', borderWidth: 1.5, borderColor: '#DCFCE7', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, fontSize: 16, color: '#14532D', minHeight: 200, lineHeight: 24 },

  // Upload Area (TIPE 4)
  uploadArea: { backgroundColor: '#F0FDF4', borderWidth: 2, borderColor: '#BBF7D0', borderRadius: 16, borderStyle: 'dashed', padding: 24, alignItems: 'center', justifyContent: 'center' },
  uploadAreaActive: { backgroundColor: '#DCFCE7', borderColor: '#16A34A', borderStyle: 'solid' },
  uploadText: { color: '#166534', fontWeight: '700', fontSize: 15, textAlign: 'center' },
  uploadTextActive: { color: '#14532D' },
  uploadSubtext: { color: '#6B7280', fontSize: 12, marginTop: 8 },

  // Footer Actions
  footer: { flexDirection: 'row', padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#DCFCE7', paddingBottom: Platform.OS === 'ios' ? 30 : 16, gap: 12 },
  btnAction: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.5 },

  btnPrev: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#DCFCE7' },
  btnPrevText: { color: '#166534', fontWeight: '700', fontSize: 15 },

  btnNext: { backgroundColor: '#14532D' }, // Hijau UIKA Gelap
  btnNextText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  btnSubmit: { backgroundColor: '#16A34A', shadowColor: '#16A34A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnSubmitText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
});

export default CBTExamScreen;