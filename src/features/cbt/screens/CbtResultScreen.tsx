import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CbtResultScreen = (props: any) => {
  // Menangkap parameter dari layar Ujian (hasil dari submit API)
  const message = props.route?.params?.message || 'Ujian berhasil diselesaikan!';
  const infoNilai = props.route?.params?.infoNilai || 'Menunggu Penilaian';

  // Mencoba mengekstrak angka dari string "Skor Otomatis: 75"
  const scoreMatch = infoNilai.match(/\d+/);
  const finalScore = scoreMatch ? scoreMatch[0] : '-';
  
  // Tentukan status lulus/gagal sederhana (misal KKM 60)
  const isPassed = finalScore !== '-' && parseInt(finalScore) >= 60;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Ikon Sukses */}
        <View style={styles.iconCircle}>
          <Icon name="check-decagram" size={60} color="#15613F" />
        </View>

        <Text style={styles.title}>Ujian Selesai!</Text>
        <Text style={styles.subtitle}>
          {message}
        </Text>

        {/* Skor Utama */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>NILAI AKHIR</Text>
          <Text style={styles.scoreValue}>{finalScore}</Text>
          
          {finalScore !== '-' && (
            <View style={[styles.statusBadge, isPassed ? styles.badgeSuccess : styles.badgeFail]}>
              <Text style={styles.statusText}>{isPassed ? 'LULUS' : 'TIDAK LULUS'}</Text>
            </View>
          )}
        </View>

        {/* Detail Skor Breakdown */}
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Keterangan Sistem:</Text>
            <Text style={styles.detailValue}>{infoNilai}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailRow}>
            <Icon name="information-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              Nilai esai dihitung otomatis menggunakan algoritma Text Similarity. Soal upload file (jika ada) akan dinilai manual oleh dosen.
            </Text>
          </View>
        </View>

        {/* Tombol Kembali */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => {
            // Kembali ke halaman daftar ujian (ganti 'cbt.list' jika namamu berbeda)
            props.navigation.popToTop(); 
          }}>
          <Text style={styles.homeBtnText}>Kembali ke Daftar Ujian</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15613F', // Hijau UIKA
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveWidth(5),
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 24,
    padding: responsiveWidth(6),
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -responsiveWidth(14), 
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: responsiveFontSize(1.6),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreLabel: {
    fontSize: responsiveFontSize(1.6),
    color: '#9CA3AF',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: responsiveFontSize(8),
    fontWeight: '900',
    color: '#15613F',
    lineHeight: responsiveHeight(10), 
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: -10,
  },
  badgeSuccess: { backgroundColor: '#10B981' },
  badgeFail: { backgroundColor: '#EF4444' },
  statusText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: responsiveFontSize(1.4), letterSpacing: 1 },
  detailContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: responsiveFontSize(1.6),
    color: '#4B5563',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: responsiveFontSize(1.8),
    color: '#1F2937',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  infoText: {
    fontSize: responsiveFontSize(1.4),
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  homeBtn: {
    backgroundColor: '#15613F', // Hijau UIKA
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
});

export default CbtResultScreen;