import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getSuratPengunduranDiri, approveSuratPengunduranDiri } from '../../../services/orang-tua/suratPengunduranDiri';
import { useTokenStore } from '../../../store/auth';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import { DialogComponent } from '../../../component/dialog';

const statusColor: Record<string, string> = {
  Selesai: '#15613F',
  Sent: '#3B82F6',
  Read: '#8B5CF6',
  Menunggu: '#EAB308',
};

const getStatusColor = (status: string) =>
  statusColor[status] || '#EAB308';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const SuratPengunduranDiriScreen = (props: any) => {
  const { user } = useTokenStore();
  const queryClient = useQueryClient();

  const npm = user?.npm;

  // Dialog konfirmasi persetujuan
  const [confirmModal, setConfirmModal] = useState({ visible: false, suratId: '' });

  // Dialog info hasil (Berhasil / Gagal)
  const [infoModal, setInfoModal] = useState({ visible: false, title: '', message: '' });

  const showInfo = (title: string, message: string) => {
    setInfoModal({ visible: true, title, message });
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['surat-pengunduran-diri', npm],
    queryFn: () => getSuratPengunduranDiri(npm as string),
    enabled: !!npm,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => approveSuratPengunduranDiri(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surat-pengunduran-diri', npm] });
      showInfo('Berhasil', 'Surat pengunduran diri berhasil disetujui.');
    },
    onError: (err: any) => {
      showInfo('Gagal', err?.response?.data?.message || 'Terjadi kesalahan saat menyetujui surat.');
    },
  });

  const handleApprove = (id: string) => {
    setConfirmModal({ visible: true, suratId: id });
  };

  // Extract & filter: hanya tampilkan surat utama (parent_id === null)
  let suratList: any[] = [];
  if (data) {
    const raw = data.data || data.result || data;
    const arr = Array.isArray(raw) ? raw : raw?.data ? (Array.isArray(raw.data) ? raw.data : [raw.data]) : [raw];
    suratList = arr.filter((item: any) => item?.parent_id === null && item?.form_data?.nama_lengkap);
  }


  const renderSurat = (item: any, index: number) => {
    const fd = item.form_data || {};
    const needsApproval = !item.is_approved_by_parent;
    const isThisMutating = mutation.isLoading;

    return (
      <View key={item.id} style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.cardIcon, { backgroundColor: needsApproval ? '#FEF3C7' : '#D1FAE5' }]}>
              <Icon
                name={needsApproval ? 'file-clock-outline' : 'file-check-outline'}
                size={22}
                color={needsApproval ? '#D97706' : '#15613F'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Surat Pengunduran Diri</Text>
              <Text style={styles.cardSubtitle}>{formatDate(item.created_at)}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>

        {/* Info Utama */}
        <View style={styles.infoGrid}>
          <InfoRow label="Nama Mahasiswa" value={fd.nama_lengkap} />
          <InfoRow label="Nama Orang Tua/Wali" value={fd.nama_ortu_wali} />
          <InfoRow label="Semester" value={fd.semester} />
          <InfoRow label="Perihal" value={fd.perihal} />
          {fd.tanggal_pengarahan && (
            <InfoRow label="Tgl. Pengarahan" value={fd.tanggal_pengarahan} />
          )}
          {fd.catatan_surat ? (
            <InfoRow label="Catatan" value={fd.catatan_surat} />
          ) : null}
        </View>

        {/* Status Persetujuan Ortu */}
        <View style={[
          styles.approvalBanner,
          { backgroundColor: item.is_approved_by_parent ? '#D1FAE5' : '#FEF3C7' }
        ]}>
          <Icon
            name={item.is_approved_by_parent ? 'check-circle' : 'clock-outline'}
            size={16}
            color={item.is_approved_by_parent ? '#15613F' : '#D97706'}
          />
          <Text style={[
            styles.approvalText,
            { color: item.is_approved_by_parent ? '#15613F' : '#D97706' }
          ]}>
            {item.is_approved_by_parent
              ? 'Sudah disetujui oleh Orang Tua'
              : 'Menunggu persetujuan Orang Tua'}
          </Text>
        </View>



        {/* Tombol Approve */}
        {needsApproval && (
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApprove(item.id)}
            disabled={isThisMutating}
            activeOpacity={0.8}
          >
            {isThisMutating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="check-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.approveButtonText}>Setujui Surat</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Dialog Konfirmasi Persetujuan */}
      <DialogComponent
        visible={confirmModal.visible}
        title="Konfirmasi Persetujuan"
        desc={{
          title: 'Apakah Anda yakin ingin menyetujui surat pengunduran diri anak Anda?',
          buttonCancel: 'Batal',
          buttonDone: 'Ya, Setujui',
        }}
        onDismiss={() => setConfirmModal({ visible: false, suratId: '' })}
        onDone={() => {
          mutation.mutate(confirmModal.suratId);
          setConfirmModal({ visible: false, suratId: '' });
        }}
      />
      {/* Dialog Hasil (Berhasil / Gagal) */}
      <DialogComponent
        visible={infoModal.visible}
        title={infoModal.title}
        desc={{
          title: infoModal.message,
          buttonCancel: 'Ok',
          buttonDone: '',
        }}
        onDismiss={() => setInfoModal({ visible: false, title: '', message: '' })}
      />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Surat Pengunduran Diri</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#15613F" style={{ marginTop: 60 }} />
        ) : isError ? (
          <View style={styles.emptyContainer}>
            <Icon name="alert-circle-outline" size={56} color="#EF4444" />
            <Text style={styles.errorText}>Gagal memuat data.</Text>
            <Text style={styles.errorTextSmall}>{String(error)}</Text>
          </View>
        ) : suratList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="file-hidden" size={56} color="#9CA3AF" />
            <Text style={styles.emptyText}>Data belum ada.</Text>
          </View>
        ) : (
          suratList.map((item, index) => renderSurat(item, index))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// Reusable row component
const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(6),
    paddingBottom: responsiveWidth(4),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: responsiveWidth(4),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: responsiveWidth(4),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardSubtitle: {
    fontSize: responsiveFontSize(1.4),
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
  },
  infoGrid: {
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(3),
    paddingBottom: responsiveWidth(1),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  infoLabel: {
    fontSize: responsiveFontSize(1.7),
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: responsiveFontSize(1.7),
    color: '#1F2937',
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'right',
  },
  approvalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveWidth(3),
    padding: responsiveWidth(3),
    borderRadius: 10,
    gap: 6,
  },
  approvalText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    marginLeft: 6,
  },
  catatanPejabat: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveWidth(3),
    gap: 4,
  },
  catatanPejabatText: {
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    flex: 1,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  toggleDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveWidth(3),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 4,
  },
  toggleDetailText: {
    fontSize: responsiveFontSize(1.7),
    color: '#15613F',
    fontWeight: '600',
  },
  expandedSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(3),
  },
  section: {
    marginBottom: responsiveWidth(4),
  },
  sectionLabel: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: responsiveWidth(2),
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineDot: {
    alignItems: 'center',
    marginRight: 10,
    width: 16,
  },
  timelineDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 2,
    minHeight: 20,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 12,
  },
  timelineStatus: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
  },
  timelineCatatan: {
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    marginTop: 2,
  },
  timelineDate: {
    fontSize: responsiveFontSize(1.4),
    color: '#9CA3AF',
    marginTop: 2,
  },
  lampiranItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: responsiveWidth(3),
    marginBottom: 6,
    gap: 8,
  },
  lampiranName: {
    fontSize: responsiveFontSize(1.6),
    color: '#1F2937',
    flex: 1,
    marginLeft: 6,
  },
  approveButton: {
    backgroundColor: '#15613F',
    flexDirection: 'row',
    paddingVertical: responsiveWidth(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#0d4a2e',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(10),
  },
  emptyText: {
    marginTop: 12,
    fontSize: responsiveFontSize(1.9),
    color: '#6B7280',
  },
  errorText: {
    marginTop: 12,
    fontSize: responsiveFontSize(1.9),
    color: '#EF4444',
    fontWeight: 'bold',
  },
  errorTextSmall: {
    marginTop: 4,
    fontSize: responsiveFontSize(1.6),
    color: '#EF4444',
  },
});

export default SuratPengunduranDiriScreen;
