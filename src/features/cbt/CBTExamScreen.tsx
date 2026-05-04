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
