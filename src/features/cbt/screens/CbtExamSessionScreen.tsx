import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { verifyExamToken, submitExamAnswers } from '../../../services/cbt/index'; // Sesuaikan path ini jika berbeda

const CbtExamSessionScreen = (props: any) => {
  // Menangkap examToken atau examId dari navigasi layar sebelumnya
  const examToken = props.route?.params?.examToken || 'TOKEN_DUMMY';

  // State Lokal
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);

  // 1. Fetching Data Soal dari API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['examData', examToken],
    queryFn: () => verifyExamToken(examToken),
    onSuccess: (res) => {
      // Setup durasi waktu berdasarkan kembalian API (res.data.exam.durasi dalam menit)
      if (res?.data?.exam?.durasi) {
        setTimeLeft(res.data.exam.durasi * 60);
      }
    },
    onError: (err: any) => {
      Alert.alert('Gagal Masuk Ujian', err.message || 'Token tidak valid', [
        { text: 'Kembali', onPress: () => props.navigation.goBack() }
      ]);
    }
  });

  // 2. Setup Mutasi untuk Submit Jawaban
  const submitMutation = useMutation({
    mutationFn: submitExamAnswers,
    onSuccess: (res) => {
      // Pindah ke halaman hasil dengan membawa info_nilai dari API
      props.navigation.replace('cbt.result', { 
        message: res.message,
        infoNilai: res.info_nilai 
      });
    },
    onError: (err: any) => {
      Alert.alert('Gagal Mengumpulkan', err.message || 'Terjadi kesalahan jaringan.');
    }
  });

  // Timer Countdown Logic
  useEffect(() => {
    if (timeLeft > 0 && !isLoading && !isError) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinalSubmit(true); // Waktu habis, paksa submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isLoading, isError]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAnswer = (questionId: number | string, val: string) => {
    setAnswers({ ...answers, [questionId.toString()]: val });
  };

  const handleFinalSubmit = (isAuto = false) => {
    if (!data?.data?.exam?.id) return;
    
    const payload = {
      examId: data.data.exam.id,
      answers: answers // Akan di-stringify di dalam service
    };

    if (isAuto) {
      Alert.alert('Waktu Habis!', 'Ujian otomatis dikumpulkan.', [
        { text: 'Tutup', onPress: () => submitMutation.mutate(payload) }
      ]);
    } else {
      Alert.alert('Konfirmasi Selesai', 'Pastikan semua soal sudah terjawab. Kumpulkan sekarang?', [
        { text: 'Periksa Lagi', style: 'cancel' },
        { text: 'Ya, Kumpulkan', onPress: () => submitMutation.mutate(payload) },
      ]);
    }
  };

  // Layar Loading API
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={{ color: 'white', marginTop: 10 }}>Mempersiapkan Ujian...</Text>
      </View>
    );
  }

  // Jika error fetch soal, tampilkan layer kosong agar tidak crash
  if (isError || !data?.data) {
    return <View style={styles.container} />;
  }

  const examInfo = data.data.exam;
  const questionsList = data.data.questions || [];
  const currentQ = questionsList[currentIndex];

  // Mencegah error jika array kosong
  if (!currentQ) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15613F" />
      
      {/* Header Info & Timer */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => Alert.alert('Peringatan', 'Keluar sekarang akan membatalkan ujian. Yakin?', [
              { text: 'Batal', style: 'cancel'},
              { text: 'Keluar', onPress: () => props.navigation.goBack()}
            ])} 
            style={styles.backBtn}
          >
            <Icon name="close" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{examInfo.nama_ujian}</Text>
            <Text style={styles.headerSubtitle}>{examInfo.mata_kuliah?.nama_mk}</Text>
          </View>
        </View>

        <View style={styles.timerBox}>
          <Icon name="clock-outline" size={18} color="#FFFFFF" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Grid Navigasi Nomor Soal */}
      <View style={styles.gridWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gridContent}>
          {questionsList.map((q: any, index: number) => {
            const qIdStr = q.id.toString();
            const isAnswered = !!answers[qIdStr] && answers[qIdStr].trim() !== '';
            const isActive = index === currentIndex;
            
            let bgColor = '#FFFFFF';
            let borderColor = '#D1D5DB';
            let textColor = '#4B5563';

            if (isActive) {
              bgColor = '#15613F';
              borderColor = '#15613F';
              textColor = '#FFFFFF';
            } else if (isAnswered) {
              bgColor = '#E8F5E9';
              borderColor = '#10B981';
              textColor = '#10B981';
            }

            return (
              <TouchableOpacity
                key={q.id}
                onPress={() => setCurrentIndex(index)}
                style={[
                  styles.gridItem,
                  { backgroundColor: bgColor, borderColor: borderColor },
                ]}>
                <Text style={[styles.gridText, { color: textColor }]}>
                  {index + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Area Render Soal */}
      <View style={styles.contentWrapper}>
        <ScrollView style={styles.questionArea} showsVerticalScrollIndicator={false} contentContainerStyle={styles.questionContent}>
          
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>Pertanyaan {currentIndex + 1}</Text>
              <View style={[
                styles.typeBadge, 
                currentQ.tipe_soal === 'TIPE_3' && styles.typeBadgeEssay,
                currentQ.tipe_soal === 'TIPE_2' && styles.typeBadgeMulti
              ]}>
                <Text style={[
                  styles.typeText, 
                  currentQ.tipe_soal === 'TIPE_3' && styles.typeTextEssay,
                  currentQ.tipe_soal === 'TIPE_2' && styles.typeTextMulti
                ]}>
                  {currentQ.tipe_soal === 'TIPE_1' ? 'Pilihan Ganda' : currentQ.tipe_soal === 'TIPE_2' ? 'Pilihan Ganda Multi' : currentQ.tipe_soal === 'TIPE_3' ? 'Essay' : 'Isian'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.questionText}>{currentQ.isi_soal}</Text>
          </View>

          {/* Render Opsi Pilihan Ganda (TIPE_1) */}
          {currentQ.tipe_soal === 'TIPE_1' && (
            <View style={styles.optionsContainer}>
              {currentQ.question_options?.map((opt: any) => {
                // Di dokumentasi, API minta kirim 'label_pilihan' (A, B, C, D) sebagai jawaban
                const isSelected = answers[currentQ.id.toString()] === opt.label_pilihan;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                    onPress={() => handleAnswer(currentQ.id, opt.label_pilihan)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {opt.label_pilihan}. {opt.teks_pilihan}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Render Opsi Pilihan Ganda Multiple Choice (TIPE_2) */}
          {currentQ.tipe_soal === 'TIPE_2' && (
            <View style={styles.optionsContainer}>
              <View style={styles.multipleChoiceHelper}>
                <Icon name="information-outline" size={16} color="#15613F" style={{ marginRight: 6 }} />
                <Text style={styles.multipleChoiceHelperText}>
                  Pilih satu atau lebih jawaban yang benar.
                </Text>
              </View>
              {currentQ.question_options?.map((opt: any) => {
                const currentSelections = (answers[currentQ.id.toString()] || '')
                  .split(',')
                  .filter((s: string) => s.trim());
                const isSelected = currentSelections.includes(opt.label_pilihan);

                const toggleSelection = () => {
                  let newSelections;
                  if (isSelected) {
                    newSelections = currentSelections.filter((s: string) => s !== opt.label_pilihan);
                  } else {
                    newSelections = [...currentSelections, opt.label_pilihan].sort();
                  }
                  handleAnswer(currentQ.id, newSelections.join(','));
                };

                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                    onPress={toggleSelection}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkboxSquare, isSelected && styles.checkboxSquareSelected]}>
                      {isSelected && <Icon name="check" size={14} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {opt.label_pilihan}. {opt.teks_pilihan}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Render Form Essay (TIPE_3) */}
          {currentQ.tipe_soal === 'TIPE_3' && (
            <View style={styles.essayContainer}>
              <Text style={styles.essayHelper}>
                Tuliskan penjelasan Anda secara rinci:
              </Text>
              <TextInput
                style={styles.essayInput}
                multiline={true}
                numberOfLines={10}
                placeholder="Mulai mengetik jawaban..."
                placeholderTextColor="#9CA3AF"
                textAlignVertical="top"
                value={answers[currentQ.id.toString()] || ''}
                onChangeText={(text) => handleAnswer(currentQ.id, text)}
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Footer Navigasi Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          disabled={currentIndex === 0 || submitMutation.isLoading}
          onPress={() => setCurrentIndex((prev) => prev - 1)}>
          <Icon name="chevron-left" size={24} color={currentIndex === 0 ? '#9CA3AF' : '#1F2937'} />
          <Text style={[styles.navText, currentIndex === 0 && styles.navTextDisabled]}>Sebelumnya</Text>
        </TouchableOpacity>

        {currentIndex === questionsList.length - 1 ? (
          <TouchableOpacity 
            style={[styles.submitBtn, submitMutation.isLoading && { opacity: 0.7 }]} 
            onPress={() => handleFinalSubmit()}
            disabled={submitMutation.isLoading}
          >
            {submitMutation.isLoading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitText}>Kumpulkan</Text>
                <Icon name="check-circle" size={18} color="#FFFFFF" style={{marginLeft: 6}} />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.navBtn}
            disabled={submitMutation.isLoading}
            onPress={() => setCurrentIndex((prev) => prev + 1)}>
            <Text style={styles.navText}>Selanjutnya</Text>
            <Icon name="chevron-right" size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15613F' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: responsiveWidth(5), paddingTop: responsiveWidth(10), paddingBottom: responsiveWidth(6) },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backBtn: { marginRight: 12, padding: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  headerTitle: { fontSize: responsiveFontSize(1.8), fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: responsiveFontSize(1.4), color: '#D1FAE5', marginTop: 2 },
  timerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, elevation: 4 },
  timerText: { marginLeft: 6, fontSize: responsiveFontSize(1.8), fontWeight: 'bold', color: '#FFFFFF' },
  gridWrapper: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  gridContent: { paddingHorizontal: responsiveWidth(5) },
  gridItem: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  gridText: { fontSize: responsiveFontSize(1.8), fontWeight: 'bold' },
  contentWrapper: { flex: 1, backgroundColor: '#F9FAFB' },
  questionArea: { flex: 1 },
  questionContent: { padding: responsiveWidth(5), paddingBottom: responsiveHeight(5) },
  questionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  questionNumber: { fontSize: responsiveFontSize(2), fontWeight: 'bold', color: '#111827' },
  typeBadge: { backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: responsiveFontSize(1.4), color: '#0284C7', fontWeight: 'bold' },
  typeBadgeEssay: { backgroundColor: '#FEF3C7' },
  typeTextEssay: { color: '#D97706' },
  typeBadgeMulti: { backgroundColor: '#F3E8FF' },
  typeTextMulti: { color: '#7C3AED' },
  questionText: { fontSize: responsiveFontSize(2), color: '#374151', lineHeight: 28 },
  optionsContainer: { marginTop: 5 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, marginBottom: 12 },
  optionBtnSelected: { borderColor: '#15613F', backgroundColor: '#F0FDF4' },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  radioCircleSelected: { borderColor: '#15613F' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#15613F' },
  checkboxSquare: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  checkboxSquareSelected: { borderColor: '#15613F', backgroundColor: '#15613F' },
  multipleChoiceHelper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 10, borderRadius: 10, marginBottom: 12 },
  multipleChoiceHelperText: { fontSize: responsiveFontSize(1.5), color: '#15613F', fontWeight: 'bold' },
  optionText: { flex: 1, fontSize: responsiveFontSize(1.8), color: '#4B5563', lineHeight: 24 },
  optionTextSelected: { color: '#15613F', fontWeight: '600' },
  essayContainer: { marginTop: 5 },
  essayHelper: { fontSize: responsiveFontSize(1.6), color: '#6B7280', marginBottom: 8, fontWeight: '500' },
  essayInput: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, fontSize: responsiveFontSize(1.8), color: '#1F2937', minHeight: responsiveHeight(25), textAlignVertical: 'top' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: responsiveWidth(4), backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', elevation: 10 },
  navBtn: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  navBtnDisabled: { opacity: 0.4 },
  navText: { fontSize: responsiveFontSize(1.8), fontWeight: 'bold', color: '#1F2937', marginHorizontal: 8 },
  navTextDisabled: { color: '#9CA3AF' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#15613F', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, elevation: 3 },
  submitText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: responsiveFontSize(1.8) },
});

export default CbtExamSessionScreen;