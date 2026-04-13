import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const KebijakanPrivasiScreen = (props: any) => {
  const sections = [
    {
      title: '1. Pengumpulan Data',
      icon: 'database',
      content:
        'TIAS mengumpulkan informasi yang diperlukan untuk keperluan akademik, termasuk: nama lengkap, NPM/NIP, email, data absensi, lokasi saat absensi, dan hasil ujian CBT. Data ini dikumpulkan saat Anda mendaftar dan menggunakan layanan kami.',
    },
    {
      title: '2. Penggunaan Data',
      icon: 'cog',
      content:
        'Data Anda digunakan untuk:\n• Memverifikasi identitas pengguna\n• Mencatat kehadiran perkuliahan\n• Melaksanakan ujian berbasis komputer (CBT)\n• Menampilkan informasi akademik\n• Meningkatkan layanan aplikasi',
    },
    {
      title: '3. Penyimpanan Data',
      icon: 'shield-lock',
      content:
        'Data Anda disimpan di server yang aman milik Universitas Ibn Khaldun Bogor. Kami menggunakan enkripsi dan protokol keamanan standar industri untuk melindungi data Anda dari akses yang tidak sah.',
    },
    {
      title: '4. Berbagi Data',
      icon: 'share-variant',
      content:
        'Kami tidak menjual atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan komersial. Data hanya dapat diakses oleh:\n• Dosen pengampu mata kuliah\n• Staff akademik yang berwenang\n• Admin sistem TIAS',
    },
    {
      title: '5. Akses Lokasi',
      icon: 'map-marker-check',
      content:
        'Aplikasi TIAS meminta akses lokasi hanya saat proses absensi berlangsung untuk memverifikasi kehadiran fisik di lokasi kampus. Data lokasi tidak disimpan atau digunakan untuk tujuan lain.',
    },
    {
      title: '6. Akses Kamera',
      icon: 'camera',
      content:
        'Kamera digunakan untuk memindai QR Code absensi dan fitur pengenalan wajah. Gambar wajah hanya diproses secara lokal dan tidak disimpan di server tanpa persetujuan Anda.',
    },
    {
      title: '7. Hak Pengguna',
      icon: 'account-check',
      content:
        'Anda berhak untuk:\n• Melihat data pribadi yang kami simpan\n• Meminta koreksi data yang tidak akurat\n• Meminta penghapusan akun\n• Menolak pengumpulan data opsional',
    },
    {
      title: '8. Perubahan Kebijakan',
      icon: 'file-document-edit',
      content:
        'Kebijakan privasi ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan dinotifikasikan melalui aplikasi. Penggunaan berkelanjutan setelah perubahan menandakan persetujuan Anda.',
    },
    {
      title: '9. Hubungi Kami',
      icon: 'email',
      content:
        'Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi:\n\nTim IT Fakultas Teknik\nUniversitas Ibn Khaldun Bogor\nEmail: it@ft.uika-bogor.ac.id',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kebijakan Privasi</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Card */}
        <View style={styles.topCard}>
          <View style={styles.topIconCircle}>
            <Icon name="shield-check" size={36} color="#15613F" />
          </View>
          <Text style={styles.topTitle}>Privasi Anda Penting</Text>
          <Text style={styles.topSubtitle}>
            Kami berkomitmen melindungi data pribadi Anda. Baca kebijakan berikut untuk memahami bagaimana kami mengelola informasi Anda.
          </Text>
          <View style={styles.lastUpdated}>
            <Icon name="clock-outline" size={14} color="#9CA3AF" />
            <Text style={styles.lastUpdatedText}>Terakhir diperbarui: 1 April 2026</Text>
          </View>
        </View>

        {/* Policy Sections */}
        {sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Icon name={section.icon} size={18} color="#15613F" />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

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
  scrollContent: {paddingHorizontal: responsiveWidth(5), paddingTop: responsiveWidth(4)},
  // Top Card
  topCard: {
    backgroundColor: '#ECFDF5', borderRadius: 20, padding: responsiveWidth(5),
    alignItems: 'center', marginBottom: responsiveWidth(4),
  },
  topIconCircle: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#D1FAE5',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  topTitle: {fontSize: responsiveFontSize(2), fontWeight: 'bold', color: '#1F2937'},
  topSubtitle: {
    fontSize: responsiveFontSize(1.4), color: '#4B5563', textAlign: 'center',
    lineHeight: 20, marginTop: 8, paddingHorizontal: 10,
  },
  lastUpdated: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14,
  },
  lastUpdatedText: {fontSize: responsiveFontSize(1.2), color: '#9CA3AF'},
  // Section Cards
  sectionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: responsiveWidth(4),
    marginBottom: responsiveWidth(3),
    elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4,
  },
  sectionHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  sectionIconBox: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#ECFDF5',
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  sectionTitle: {fontSize: responsiveFontSize(1.7), fontWeight: 'bold', color: '#1F2937', flex: 1},
  sectionContent: {fontSize: responsiveFontSize(1.4), color: '#4B5563', lineHeight: 22},
});

export default KebijakanPrivasiScreen;
