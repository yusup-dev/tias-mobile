import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SuratItem } from '../../services/surat/index';
import moment from 'moment';

const DetailSuratScreen = (props: any) => {
  const surat: SuratItem = props.route?.params?.surat || {};

  const isInternal = surat.kategori === 'Internal';
  const disposisiList = surat.disposisi || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#15613F', '#2D9C6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Surat</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.badgeKategori, { backgroundColor: isInternal ? '#ECFDF5' : '#EFF6FF' }]}>
              <Text style={[styles.badgeKategoriText, { color: isInternal ? '#15613F' : '#2563EB' }]}>
                {surat.kategori || 'Surat Dinas'}
              </Text>
            </View>
            <Text style={styles.tanggalText}>
              {surat.tanggal ? moment(surat.tanggal).format('DD MMMM YYYY') : '-'}
            </Text>
          </View>

          <Text style={styles.noSuratLabel}>Nomor Surat:</Text>
          <Text style={styles.noSuratText}>{surat.no_surat}</Text>

          <Text style={styles.perihalLabel}>Perihal:</Text>
          <Text style={styles.perihalText}>{surat.perihal}</Text>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Icon name="account-arrow-right" size={20} color="#15613F" />
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Pengirim</Text>
              <Text style={styles.metaValue}>{surat.pengirim}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Icon name="account-arrow-left" size={20} color="#3B82F6" />
            <View style={styles.metaTextCol}>
              <Text style={styles.metaLabel}>Tujuan / Penerima</Text>
              <Text style={styles.metaValue}>{surat.tujuan}</Text>
            </View>
          </View>
        </View>

        {/* Isi Surat Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Ringkasan Isi Surat</Text>
          <Text style={styles.isiSuratText}>
            {surat.isi || 'Surat resmi mengenai kegiatan akademik dan koordinasi fakultas di lingkungan UIKA Bogor.'}
          </Text>

          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={() => Alert.alert('Lampiran', 'Membuka dokumen lampiran PDF...')}
          >
            <Icon name="file-pdf-box" size={24} color="#EF4444" />
            <View style={styles.attachmentTextCol}>
              <Text style={styles.attachmentTitle}>Dokumen_Surat_Resmi.pdf</Text>
              <Text style={styles.attachmentSubtitle}>Klik untuk melihat dokumen lengkap</Text>
            </View>
            <Icon name="download" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Riwayat Disposisi */}
        <View style={styles.card}>
          <View style={styles.disposisiHeaderRow}>
            <Text style={styles.cardSectionTitle}>Riwayat Disposisi</Text>
            <View style={styles.disposisiCountBadge}>
              <Text style={styles.disposisiCountText}>{disposisiList.length}</Text>
            </View>
          </View>

          {disposisiList.length > 0 ? (
            disposisiList.map((disp, idx) => (
              <View key={`disp-${idx}`} style={styles.disposisiItem}>
                <View style={styles.dispTimelineDot} />
                <View style={styles.dispContent}>
                  <View style={styles.dispTopRow}>
                    <Text style={styles.dispTujuan}>{disp.tujuan_disposisi}</Text>
                    <Text style={styles.dispDate}>{disp.tanggal_disposisi}</Text>
                  </View>
                  {disp.status_tindak_lanjut && (
                    <View style={styles.dispStatusBadge}>
                      <Text style={styles.dispStatusText}>{disp.status_tindak_lanjut}</Text>
                    </View>
                  )}
                  <Text style={styles.dispCatatan}>{disp.catatan}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDisposisiText}>Belum ada disposisi pada surat ini.</Text>
          )}

          {/* Action Button: Beri Disposisi */}
          <TouchableOpacity
            style={styles.btnDisposisi}
            onPress={() => props.navigation.push('home.surat-disposisi', { surat })}
          >
            <Icon name="share-variant" size={20} color="#FFF" />
            <Text style={styles.btnDisposisiText}>Beri / Teruskan Disposisi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: responsiveHeight(4),
    paddingBottom: 20,
    paddingHorizontal: responsiveWidth(5),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    padding: responsiveWidth(5),
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeKategori: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeKategoriText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: 'bold',
  },
  tanggalText: {
    fontSize: responsiveFontSize(1.3),
    color: '#9CA3AF',
  },
  noSuratLabel: {
    fontSize: responsiveFontSize(1.25),
    color: '#6B7280',
    marginTop: 4,
  },
  noSuratText: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    color: '#15613F',
    marginBottom: 8,
  },
  perihalLabel: {
    fontSize: responsiveFontSize(1.25),
    color: '#6B7280',
  },
  perihalText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 24,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  metaLabel: {
    fontSize: responsiveFontSize(1.2),
    color: '#9CA3AF',
  },
  metaValue: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
    color: '#374151',
    marginTop: 1,
  },
  cardSectionTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  isiSuratText: {
    fontSize: responsiveFontSize(1.4),
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 14,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
  },
  attachmentTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  attachmentTitle: {
    fontSize: responsiveFontSize(1.35),
    fontWeight: 'bold',
    color: '#991B1B',
  },
  attachmentSubtitle: {
    fontSize: responsiveFontSize(1.15),
    color: '#B91C1C',
    marginTop: 2,
  },
  disposisiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  disposisiCountBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  disposisiCountText: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: 'bold',
    color: '#15613F',
  },
  disposisiItem: {
    flexDirection: 'row',
    marginBottom: 14,
    borderLeftWidth: 2,
    borderLeftColor: '#10B981',
    paddingLeft: 12,
  },
  dispTimelineDot: {
    position: 'absolute',
    left: -5,
    top: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  dispContent: {
    flex: 1,
  },
  dispTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dispTujuan: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dispDate: {
    fontSize: responsiveFontSize(1.15),
    color: '#9CA3AF',
  },
  dispStatusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginVertical: 4,
  },
  dispStatusText: {
    fontSize: responsiveFontSize(1.15),
    fontWeight: 'bold',
    color: '#D97706',
  },
  dispCatatan: {
    fontSize: responsiveFontSize(1.3),
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 2,
  },
  noDisposisiText: {
    fontSize: responsiveFontSize(1.35),
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 14,
  },
  btnDisposisi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15613F',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
  },
  btnDisposisiText: {
    color: '#FFF',
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DetailSuratScreen;
