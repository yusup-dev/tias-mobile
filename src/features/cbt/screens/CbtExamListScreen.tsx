import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CbtExamListScreen = (props: any) => {
  const [examList] = useState([
    {
      id: '1',
      title: 'Ujian Tengah Semester',
      matkul: 'Algoritma & Struktur Data',
      date: '06 Apr 2026',
      time: '08:00 - 10:00 WIB',
      duration: '120 Menit',
      type: 'Pilihan Ganda & Essay',
      status: 'AVAILABLE',
    },
    {
      id: '2',
      title: 'Kuis Pertemuan 4',
      matkul: 'Rekayasa Perangkat Lunak',
      date: '07 Apr 2026',
      time: '13:00 - 14:30 WIB',
      duration: '90 Menit',
      type: 'Pilihan Ganda',
      status: 'UPCOMING',
    },
    {
      id: '3',
      title: 'Ujian Akhir Semester',
      matkul: 'Basis Data',
      date: '10 Mar 2026',
      time: '08:00 - 10:00 WIB',
      duration: '120 Menit',
      type: 'Pilihan Ganda & Essay',
      status: 'DONE',
    },
  ]);

  // State untuk Modal Input Token
  const [isTokenModalVisible, setTokenModalVisible] = useState(false);
  const [inputToken, setInputToken] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const handleOpenTokenModal = (examId: string) => {
    setSelectedExamId(examId);
    setInputToken(''); // Reset input
    setTokenModalVisible(true);
  };

  const handleMasukUjian = () => {
    if (inputToken.trim() === '') {
      // Validasi sederhana jika token kosong
      return;
    }
    setTokenModalVisible(false);
    // Pindah ke layar ujian sambil membawa token yang diketik mahasiswa
    props.navigation.push('cbt.session', { 
      examId: selectedExamId, 
      examToken: inputToken.trim() 
    });
  };

  const renderExamCard = ({ item }: { item: any }) => {
    const isAvailable = item.status === 'AVAILABLE';
    const isDone = item.status === 'DONE';
    
    let statusColor = '#3B82F6';
    let statusBg = '#EFF6FF';
    let statusText = 'Belum Mulai';

    if (isAvailable) {
      statusColor = '#15613F'; 
      statusBg = '#E8F5E9';
      statusText = 'Tersedia';
    } else if (isDone) {
      statusColor = '#6B7280';
      statusBg = '#F3F4F6';
      statusText = 'Selesai';
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: statusBg }]}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.badgeText, { color: statusColor }]}>{statusText}</Text>
          </View>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>

        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.matkulText}>{item.matkul}</Text>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar-clock" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{`${item.date} - ${item.time}`}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="timer-sand" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
        </View>

        {isAvailable && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleOpenTokenModal(item.id)}>
            <Text style={styles.actionButtonText}>Mulai Kerjakan</Text>
            <Icon name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        )}
        
        {isDone && (
          <TouchableOpacity
            style={styles.resultButton}
            onPress={() => props.navigation.push('cbt.result', { examId: item.id })}>
            <Text style={styles.resultButtonText}>Lihat Nilai</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Ujian CBT</Text>
        <TouchableOpacity onPress={() => props.navigation.push('cbt.history')} style={styles.backBtn}>
          <Icon name="clipboard-text-clock" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSheet}>
        <FlatList
          data={examList}
          keyExtractor={(item) => item.id}
          renderItem={renderExamCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="clipboard-text-off-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>Tidak ada jadwal ujian saat ini.</Text>
            </View>
          }
        />
      </View>

      {/* Modal Input Token Ujian */}
      <Modal
        visible={isTokenModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTokenModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <Icon name="lock-outline" size={32} color="#15613F" />
            </View>
            <Text style={styles.modalTitle}>Masukkan Token Ujian</Text>
            <Text style={styles.modalSubtitle}>
              Mintalah token akses kepada Dosen/Pengawas ujian Anda untuk mulai mengerjakan soal.
            </Text>

            <TextInput
              style={styles.tokenInput}
              placeholder="Contoh: UTS-WEB-123"
              placeholderTextColor="#9CA3AF"
              value={inputToken}
              onChangeText={setInputToken}
              autoCapitalize="characters"
              maxLength={10}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={styles.modalCancelBtn} 
                onPress={() => setTokenModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalSubmitBtn, inputToken.length < 3 && { opacity: 0.5 }]} 
                onPress={handleMasukUjian}
                disabled={inputToken.length < 3} // Disable jika token kurang dari 3 huruf
              >
                <Text style={styles.modalSubmitText}>Lanjut Ujian</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15613F' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: responsiveWidth(4), paddingTop: responsiveWidth(8), paddingBottom: responsiveWidth(6), backgroundColor: '#15613F' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: responsiveFontSize(2.4), fontWeight: 'bold', color: '#FFFFFF' },
  bottomSheet: { flex: 1, backgroundColor: '#F4F4F9', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  listContainer: { padding: responsiveWidth(5), paddingBottom: responsiveWidth(10), paddingTop: responsiveWidth(6) },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: responsiveWidth(4), marginBottom: responsiveWidth(4), elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  badgeText: { fontSize: responsiveFontSize(1.4), fontWeight: 'bold' },
  typeText: { fontSize: responsiveFontSize(1.4), color: '#6B7280', fontWeight: '500' },
  titleText: { fontSize: responsiveFontSize(2), fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  matkulText: { fontSize: responsiveFontSize(1.6), color: '#4B5563', marginBottom: 16 },
  detailRow: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { marginLeft: 8, fontSize: responsiveFontSize(1.4), color: '#6B7280', fontWeight: '500' },
  actionButton: { flexDirection: 'row', backgroundColor: '#15613F', paddingVertical: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  actionButtonText: { color: '#FFFFFF', fontSize: responsiveFontSize(1.6), fontWeight: 'bold', marginRight: 8 },
  resultButton: { backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  resultButtonText: { color: '#4B5563', fontSize: responsiveFontSize(1.6), fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: responsiveWidth(20) },
  emptyText: { marginTop: 16, color: '#9CA3AF', fontSize: responsiveFontSize(1.8) },
  
  // Styles untuk Modal Token
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(5),
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: responsiveWidth(6),
    alignItems: 'center',
    elevation: 10,
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  tokenInput: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 24,
  },
  modalActionRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  modalCancelText: {
    color: '#4B5563',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.6),
  },
  modalSubmitBtn: {
    flex: 1,
    backgroundColor: '#15613F', // Hijau UIKA
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.6),
  },
});

export default CbtExamListScreen;