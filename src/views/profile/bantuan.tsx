import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTokenStore} from '../../store/auth';

const BantuanScreen = (props: any) => {
  const {user} = useTokenStore();
  const [activeTab, setActiveTab] = useState<'bantuan' | 'laporan'>('bantuan');
  const [laporanForm, setLaporanForm] = useState({
    kategori: '',
    judul: '',
    deskripsi: '',
  });

  // FAQ data
  const faqList = [
    {
      q: 'Bagaimana cara melakukan absensi?',
      a: 'Buka menu Absensi di tab bar, lalu scan QR code yang ditampilkan oleh dosen atau masukkan kode token secara manual.',
      icon: 'qrcode-scan',
    },
    {
      q: 'Bagaimana jika lupa password?',
      a: 'Hubungi admin atau bagian IT fakultas untuk melakukan reset password akun Anda.',
      icon: 'lock-reset',
    },
    {
      q: 'Bagaimana cara mengerjakan ujian CBT?',
      a: 'Buka tab CBT, pilih ujian yang tersedia, masukkan token dari pengawas, lalu kerjakan soal sebelum waktu habis.',
      icon: 'clipboard-edit',
    },
    {
      q: 'Apakah data absensi bisa diubah?',
      a: 'Data absensi tidak bisa diubah oleh mahasiswa. Hubungi dosen pengampu jika terjadi kesalahan.',
      icon: 'calendar-edit',
    },
    {
      q: 'Bagaimana cara melihat jadwal perkuliahan?',
      a: 'Buka tab Kuliah untuk melihat jadwal dan informasi perkuliahan Anda.',
      icon: 'calendar-clock',
    },
    {
      q: 'Siapa yang bisa saya hubungi jika ada masalah?',
      a: 'Kirim laporan melalui tab "Laporan" di halaman ini, atau hubungi bagian IT Fakultas Teknik UIKA.',
      icon: 'headset',
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const kategoriList = [
    {label: 'Bug / Error', value: 'bug', icon: 'bug', color: '#EF4444'},
    {label: 'Saran Fitur', value: 'saran', icon: 'lightbulb-on', color: '#F59E0B'},
    {label: 'Akun & Akses', value: 'akun', icon: 'account-alert', color: '#3B82F6'},
    {label: 'Lainnya', value: 'lainnya', icon: 'dots-horizontal-circle', color: '#6B7280'},
  ];

  const handleSubmitLaporan = () => {
    if (!laporanForm.kategori || !laporanForm.judul || !laporanForm.deskripsi) {
      Alert.alert('Perhatian', 'Mohon lengkapi semua field sebelum mengirim laporan.');
      return;
    }
    Alert.alert(
      'Laporan Terkirim',
      'Terima kasih! Laporan Anda telah dikirim dan akan ditinjau oleh tim kami.',
      [{text: 'OK', onPress: () => setLaporanForm({kategori: '', judul: '', deskripsi: ''})}],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bantuan & Laporan</Text>
        <View style={{width: 28}} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bantuan' && styles.tabActive]}
          onPress={() => setActiveTab('bantuan')}>
          <Icon name="help-circle" size={18} color={activeTab === 'bantuan' ? '#15613F' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'bantuan' && styles.tabTextActive]}>
            Bantuan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'laporan' && styles.tabActive]}
          onPress={() => setActiveTab('laporan')}>
          <Icon name="file-document-edit" size={18} color={activeTab === 'laporan' ? '#15613F' : '#9CA3AF'} />
          <Text style={[styles.tabText, activeTab === 'laporan' && styles.tabTextActive]}>
            Laporan Saya
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'bantuan' ? (
          <>
            {/* FAQ Section */}
            <Text style={styles.sectionTitle}>Pertanyaan Umum (FAQ)</Text>
            <View style={styles.faqGroup}>
              {faqList.map((faq, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.faqItem, index !== faqList.length - 1 && styles.faqBorder]}
                  onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  activeOpacity={0.7}>
                  <View style={styles.faqHeader}>
                    <View style={styles.faqIconBox}>
                      <Icon name={faq.icon} size={18} color="#15613F" />
                    </View>
                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                    <Icon
                      name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                      size={22}
                      color="#9CA3AF"
                    />
                  </View>
                  {expandedFaq === index && (
                    <View style={styles.faqAnswerBox}>
                      <Text style={styles.faqAnswer}>{faq.a}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Contact Info */}
            <View style={styles.contactCard}>
              <Icon name="headset" size={30} color="#15613F" />
              <Text style={styles.contactTitle}>Butuh bantuan lebih?</Text>
              <Text style={styles.contactDesc}>
                Hubungi tim IT Fakultas Teknik UIKA Bogor melalui email atau datang langsung ke kantor.
              </Text>
              <View style={styles.contactRow}>
                <Icon name="email" size={16} color="#6B7280" />
                <Text style={styles.contactText}>it@ft.uika-bogor.ac.id</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Form Laporan */}
            <Text style={styles.sectionTitle}>Kirim Laporan</Text>

            {/* Kategori */}
            <Text style={styles.inputLabel}>Kategori</Text>
            <View style={styles.kategoriGrid}>
              {kategoriList.map(kat => (
                <TouchableOpacity
                  key={kat.value}
                  style={[
                    styles.kategoriChip,
                    laporanForm.kategori === kat.value && {
                      borderColor: kat.color,
                      backgroundColor: kat.color + '15',
                    },
                  ]}
                  onPress={() => setLaporanForm({...laporanForm, kategori: kat.value})}>
                  <Icon
                    name={kat.icon}
                    size={18}
                    color={laporanForm.kategori === kat.value ? kat.color : '#9CA3AF'}
                  />
                  <Text
                    style={[
                      styles.kategoriText,
                      laporanForm.kategori === kat.value && {color: kat.color, fontWeight: 'bold'},
                    ]}>
                    {kat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Judul */}
            <Text style={styles.inputLabel}>Judul Laporan</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: Tidak bisa scan QR Code"
              placeholderTextColor="#9CA3AF"
              value={laporanForm.judul}
              onChangeText={val => setLaporanForm({...laporanForm, judul: val})}
            />

            {/* Deskripsi */}
            <Text style={styles.inputLabel}>Deskripsi Detail</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Jelaskan masalah yang Anda alami secara detail..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={laporanForm.deskripsi}
              onChangeText={val => setLaporanForm({...laporanForm, deskripsi: val})}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitLaporan}>
              <Icon name="send" size={18} color="#FFF" />
              <Text style={styles.submitText}>Kirim Laporan</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F3F4F6'},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4), paddingTop: responsiveWidth(6), paddingBottom: responsiveWidth(4),
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backBtn: {padding: 4},
  headerTitle: {fontSize: responsiveFontSize(2.2), fontWeight: 'bold', color: '#1F2937'},
  // Tabs
  tabContainer: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: responsiveWidth(5),
    marginTop: responsiveWidth(4), borderRadius: 14, padding: 4,
    elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 10, gap: 6,
  },
  tabActive: {backgroundColor: '#ECFDF5'},
  tabText: {fontSize: responsiveFontSize(1.5), color: '#9CA3AF', fontWeight: '500'},
  tabTextActive: {color: '#15613F', fontWeight: 'bold'},
  scrollContent: {paddingHorizontal: responsiveWidth(5), paddingTop: responsiveWidth(4)},
  sectionTitle: {fontSize: responsiveFontSize(2), fontWeight: 'bold', color: '#1F2937', marginBottom: responsiveWidth(3)},
  // FAQ
  faqGroup: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4,
    marginBottom: responsiveWidth(5),
  },
  faqItem: {paddingVertical: responsiveWidth(3.5), paddingHorizontal: responsiveWidth(4)},
  faqBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  faqHeader: {flexDirection: 'row', alignItems: 'center'},
  faqIconBox: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#ECFDF5',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  faqQuestion: {flex: 1, fontSize: responsiveFontSize(1.6), color: '#1F2937', fontWeight: '600'},
  faqAnswerBox: {
    backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12, marginTop: 10, marginLeft: 44,
  },
  faqAnswer: {fontSize: responsiveFontSize(1.4), color: '#4B5563', lineHeight: 20},
  // Contact
  contactCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: responsiveWidth(5), alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4,
  },
  contactTitle: {fontSize: responsiveFontSize(1.8), fontWeight: 'bold', color: '#1F2937', marginTop: 10},
  contactDesc: {
    fontSize: responsiveFontSize(1.4), color: '#6B7280', textAlign: 'center',
    lineHeight: 20, marginVertical: 10,
  },
  contactRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  contactText: {fontSize: responsiveFontSize(1.4), color: '#6B7280'},
  // Laporan Form
  inputLabel: {
    fontSize: responsiveFontSize(1.5), color: '#4B5563', fontWeight: '600',
    marginBottom: 8, marginTop: 16,
  },
  kategoriGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  kategoriChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFF',
  },
  kategoriText: {fontSize: responsiveFontSize(1.4), color: '#6B7280'},
  textInput: {
    backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: responsiveFontSize(1.6), color: '#1F2937',
  },
  textArea: {height: 120, paddingTop: 14},
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#15613F', paddingVertical: 16, borderRadius: 14, marginTop: 24,
    elevation: 3, shadowColor: '#15613F', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.3, shadowRadius: 4,
  },
  submitText: {color: '#FFFFFF', fontSize: responsiveFontSize(1.6), fontWeight: 'bold'},
});

export default BantuanScreen;
