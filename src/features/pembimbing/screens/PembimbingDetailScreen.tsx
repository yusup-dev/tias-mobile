import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  approvePengajuanPembimbing,
  getDetailPengajuanPembimbingUntukDosen,
  PembimbingApproveField,
  PengajuanPembimbingDetail,
} from '../../../services/tugasAkhir';

interface ApprovalRow {
  field: PembimbingApproveField;
  label: string;
  approved: boolean;
}

const buildApprovalRows = (data?: PengajuanPembimbingDetail): ApprovalRow[] => {
  if (!data) return [];
  const rows: ApprovalRow[] = [];

  if (data.statusDosen === 1) {
    rows.push({ field: 'sk_status_pem_1', label: 'Pembimbing 1', approved: !!data.sk_status_pem_1 });
  } else if (data.statusDosen === 2) {
    rows.push({ field: 'sk_status_pem_2', label: 'Pembimbing 2', approved: !!data.sk_status_pem_2 });
  } else if (data.statusDosen === 3) {
    rows.push({ field: 'sk_status_pem_3', label: 'Pembimbing 3', approved: !!data.sk_status_pem_3 });
  }

  if (data.isKepalaLab) {
    rows.push({ field: 'status_kepala_lab', label: 'Kepala Lab', approved: !!data.status_kepala_lab });
  }

  return rows;
};

const PembimbingDetailScreen = (props: any) => {
  const id = props.route?.params?.id;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['pengajuan-pembimbing-detail', id],
    queryFn: () => getDetailPengajuanPembimbingUntukDosen(id),
    enabled: !!id,
  });

  const detail: PengajuanPembimbingDetail | undefined = data?.data;

  const [rows, setRows] = useState<ApprovalRow[]>([]);

  useEffect(() => {
    setRows(buildApprovalRows(detail));
  }, [detail]);

  const { mutate: approve, isPending } = useMutation({
    mutationFn: (field: PembimbingApproveField) => approvePengajuanPembimbing(id, field),
    onSuccess: (_res, field) => {
      setRows(prev => prev.map(r => (r.field === field ? { ...r, approved: true } : r)));
      queryClient.invalidateQueries({ queryKey: ['pengajuan-pembimbing-dosen'] });
      Alert.alert('Berhasil', 'Ajuan pembimbing berhasil disetujui.');
    },
    onError: () => {
      Alert.alert('Gagal', 'Gagal menyetujui ajuan. Silakan coba lagi.');
    },
  });

  const handleApprove = (row: ApprovalRow) => {
    if (row.approved || isPending) return;
    Alert.alert(
      'Setujui Ajuan',
      `Anda akan menyetujui diri sebagai ${row.label} untuk mahasiswa ini. Lanjutkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Setujui', onPress: () => approve(row.field) },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (isError || !detail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Icons name="alert-circle-outline" size={48} color="#FEE2E2" />
        <Text style={{ color: '#fff', marginTop: 12, marginBottom: 16 }}>Gagal memuat detail ajuan.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#15613F', '#2D9C6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icons name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Ajuan Pembimbing</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <View style={styles.bodyWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <InfoRow label="Nama Mahasiswa" value={detail.nama_lengkap} />
            <InfoRow label="NPM" value={detail.npm} />
            <InfoRow label="Judul Skripsi" value={detail.judul_skripsi} />
            <InfoRow label="Semester" value={detail.semester} />
            <InfoRow label="Lokasi Kegiatan" value={detail.lokasi_kegiatan} />
          </View>

          <View style={styles.approvalCard}>
            <View style={styles.approvalNotice}>
              <Icons name="information-outline" size={18} color="#D97706" style={{ marginRight: 8 }} />
              <Text style={styles.approvalNoticeText}>
                Setujui di bawah ini jika Anda bersedia menjadi Pembimbing / Kepala Lab mahasiswa ini
                dalam Surat Keputusan (SK).
              </Text>
            </View>

            {rows.length === 0 ? (
              <Text style={styles.emptyRoleText}>Tidak ada peran approval untuk Anda pada ajuan ini.</Text>
            ) : (
              rows.map(row => (
                <View key={row.field} style={styles.approvalRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.approvalRoleLabel}>{row.label}</Text>
                    <Text style={styles.approvalRoleSub}>
                      {row.approved ? 'Anda sudah menyetujui' : 'Menunggu persetujuan Anda'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.approveBtn, row.approved && styles.approveBtnDone]}
                    onPress={() => handleApprove(row)}
                    disabled={row.approved || isPending}
                  >
                    {isPending ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Icons
                          name={row.approved ? 'check-circle' : 'check-circle-outline'}
                          size={18}
                          color="#FFF"
                        />
                        <Text style={styles.approveBtnText}>
                          {row.approved ? 'Disetujui' : 'Setujui'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15613F' },
  header: {
    paddingTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(5),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: responsiveFontSize(2), fontWeight: 'bold', color: '#FFF' },
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scrollContent: { padding: responsiveWidth(4), paddingBottom: responsiveWidth(10) },
  retryBtn: { marginTop: 8, backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10 },
  retryBtnText: { color: '#15613F', fontWeight: 'bold' },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  infoRow: { marginBottom: 12 },
  infoLabel: { fontSize: responsiveFontSize(1.3), color: '#6B7280', marginBottom: 2 },
  infoValue: { fontSize: responsiveFontSize(1.7), color: '#1F2937', fontWeight: '600' },
  approvalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: responsiveWidth(4),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  approvalNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  approvalNoticeText: { flex: 1, fontSize: responsiveFontSize(1.4), color: '#92400E', lineHeight: 20 },
  emptyRoleText: { color: '#6B7280', fontSize: responsiveFontSize(1.5), textAlign: 'center', paddingVertical: 12 },
  approvalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  approvalRoleLabel: { fontSize: responsiveFontSize(1.7), fontWeight: 'bold', color: '#1F2937' },
  approvalRoleSub: { fontSize: responsiveFontSize(1.3), color: '#9CA3AF', marginTop: 2 },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#15613F',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  approveBtnDone: { backgroundColor: '#9CA3AF' },
  approveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: responsiveFontSize(1.4) },
});

export default PembimbingDetailScreen;
