import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useQuery } from '@tanstack/react-query';
import { getPeriodeAkademik, getHasilStudiSiakad } from '../../../services/nilai/index';

// ── Dummy Data ────────────────────────────────────────────────────────────────

// ── Helpers ────────────────────────────────────────────────────────────────

const getNilaiColor = (nilai: string) => {
  switch (nilai?.toUpperCase()) {
    case 'A':
      return '#15613F';
    case 'AB':
      return '#2E7D32';
    case 'B':
      return '#1565C0';
    case 'BC':
      return '#0277BD';
    case 'C':
      return '#F57F17';
    case 'D':
      return '#E65100';
    case 'E':
      return '#C62828';
    default:
      return '#546E7A';
  }
};

// ── Component ──────────────────────────────────────────────────────────────

const NilaiScreen = (props: any) => {
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Fetch Periode List
  const { data: periodeRes, isLoading: isLoadingPeriode } = useQuery({
    queryKey: ['periode-akademik'],
    queryFn: getPeriodeAkademik,
  });

  const periodeList = useMemo(() => {
    return periodeRes?.data || [];
  }, [periodeRes]);

  // Set default periode
  useEffect(() => {
    if (periodeList.length > 0 && !selectedPeriodeId) {
      // Find the first active period or just the first one
      const active = periodeList.find((p: any) => p.status === 'Aktif') || periodeList[0];
      setSelectedPeriodeId(active.id);
    }
  }, [periodeList, selectedPeriodeId]);

  const activePeriodeObj = useMemo(() => {
    return periodeList.find((p: any) => p.id === selectedPeriodeId);
  }, [periodeList, selectedPeriodeId]);

  const activePeriodeName = activePeriodeObj?.nama || '';

  // Fetch Hasil Studi (Grades)
  const { data: hasilStudiRes, isLoading: isLoadingHasilStudi } = useQuery({
    queryKey: ['hasil-studi', selectedPeriodeId],
    queryFn: () => getHasilStudiSiakad(selectedPeriodeId as string),
    enabled: !!selectedPeriodeId,
  });

  const isLoading = isLoadingPeriode || isLoadingHasilStudi;

  const matkulList = useMemo(() => {
    console.log('--- HASIL STUDI RES ---', JSON.stringify(hasilStudiRes, null, 2));
    const list = hasilStudiRes?.data?.rincianKrs || hasilStudiRes?.data?.mataKuliah || [];
    console.log('--- MATKUL LIST ---', list);
    return list;
  }, [hasilStudiRes]);

  const totalSks = hasilStudiRes?.data?.hasilStudi?.sksDiambil ?? hasilStudiRes?.data?.totalSks ?? 0;
  const ips = hasilStudiRes?.data?.hasilStudi?.ips ?? hasilStudiRes?.data?.ips ?? 0;
  
  const totalBobot = useMemo(() => {
    if (hasilStudiRes?.data?.rincianKrs) {
      return hasilStudiRes.data.rincianKrs.reduce((acc: number, curr: any) => {
        return acc + (parseFloat(curr.nilaiAkhir) || 0);
      }, 0).toFixed(2);
    }
    return hasilStudiRes?.data?.totalBobot || 0;
  }, [hasilStudiRes]);


  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => props.navigation.goBack()}>
          <Icon name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nilai Akademik</Text>
      </View>

      {/* ── Body Wrapper (rounded top) ── */}
      <View style={styles.bodyWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {/* ── Period Selector ── */}
          <View style={styles.sectionCard}>
            <View style={styles.periodeRow}>
              <Text style={styles.periodeLabel}>Periode</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setDropdownVisible(true)}
                disabled={isLoading || periodeList.length === 0}>
                <Text style={styles.dropdownText} numberOfLines={1}>
                  {activePeriodeName || 'Pilih Periode'}
                </Text>
                <Icon name="keyboard-arrow-down" size={20} color="#15613F" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Info Banner ── */}
          <View style={styles.infoBanner}>
            <Icon name="info-outline" size={16} color="#1565C0" style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>
              {activePeriodeName
                ? `Menampilkan nilai periode ${activePeriodeName}`
                : 'Silakan pilih periode untuk melihat nilai'}
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#15613F" />
              <Text style={styles.centerText}>Memuat data...</Text>
            </View>
          ) : !selectedPeriodeId ? (
            <View style={styles.centerBox}>
              <Icon name="school" size={48} color="#CBD5E0" />
              <Text style={styles.centerText}>Belum ada data nilai</Text>
            </View>
          ) : (
            <>
              {/* ── Table ── */}
              <View style={styles.tableCard}>
                <View style={styles.tableTitle}>
                  <Text style={styles.tableTitleText}>Periode {activePeriodeName}</Text>
                </View>

                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.thText, styles.colNo]}>No</Text>
                  <Text style={[styles.thText, styles.colKode]}>Kode</Text>
                  <Text style={[styles.thText, styles.colNama]}>Nama Mata Kuliah</Text>
                  <Text style={[styles.thText, styles.colSks]}>SKS</Text>
                  <Text style={[styles.thText, styles.colMutu]}>Nilai Mutu</Text>
                  <Text style={[styles.thText, styles.colBobot]}>Bobot</Text>
                  <Text style={[styles.thText, styles.colNilai]}>Nilai</Text>
                </View>

                {matkulList.length === 0 ? (
                  <View style={styles.emptyRow}>
                    <Text style={styles.emptyRowText}>Tidak ada data mata kuliah.</Text>
                  </View>
                ) : (
                  matkulList.map((mk: any, idx: number) => (
                    <View
                      key={`mk-${idx}`}
                      style={[
                        styles.tableRow,
                        idx % 2 === 1 && styles.tableRowAlt,
                      ]}>
                      <Text style={[styles.tdText, styles.colNo]}>{idx + 1}</Text>
                      <Text style={[styles.tdText, styles.colKode, styles.tdKode]}>
                        {mk.kelasKuliah?.mataKuliah?.kode ?? mk.kode ?? mk.curr_code ?? mk.code ?? '-'}
                      </Text>
                      <Text style={[styles.tdText, styles.colNama]} numberOfLines={2}>
                        {mk.kelasKuliah?.mataKuliah?.nama ?? mk.namaMataKuliah ?? mk.name ?? mk.nama ?? '-'}
                      </Text>
                      <Text style={[styles.tdText, styles.colSks, { textAlign: 'center' }]}>
                        {mk.kelasKuliah?.mataKuliah?.totalSks ?? mk.sks ?? '-'}
                      </Text>
                      <Text style={[styles.tdText, styles.colMutu, { textAlign: 'center' }]}>
                        {mk.angkaMutu ?? (typeof mk.nilaiMutu === 'number'
                          ? mk.nilaiMutu.toFixed(2)
                          : mk.nilaiMutu ?? '-')}
                      </Text>
                      <Text style={[styles.tdText, styles.colBobot, { textAlign: 'center' }]}>
                        {mk.nilaiAkhir ?? mk.bobot ?? '-'}
                      </Text>
                      <View style={[styles.colNilai, { alignItems: 'center' }]}>
                        <View
                          style={[
                            styles.nilaiBadge,
                            { backgroundColor: getNilaiColor(mk.hurufMutu ?? mk.nilai ?? mk.grade) },
                          ]}>
                          <Text style={styles.nilaiBadgeText}>
                            {mk.hurufMutu ?? mk.nilai ?? mk.grade ?? '-'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}

                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { flex: 1 }]}>Total SKS</Text>
                  <Text style={[styles.summaryValue, styles.colSks, { textAlign: 'center' }]}>
                    {totalSks}
                  </Text>
                  <View style={styles.colMutu} />
                  <Text style={[styles.summaryValue, styles.colBobot, { textAlign: 'center' }]}>
                    {totalBobot}
                  </Text>
                  <View style={styles.colNilai} />
                </View>

                <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                  <Text style={[styles.summaryLabel, { flex: 1 }]}>
                    Indeks Prestasi Semester
                  </Text>
                  <Text style={[styles.summaryValue, styles.colSks, { textAlign: 'center' }]}>
                    {typeof ips === 'number' ? ips.toFixed(2) : ips}
                  </Text>
                  <View style={styles.colMutu} />
                  <View style={styles.colBobot} />
                  <View style={styles.colNilai} />
                </View>
              </View>

              {/* ── Summary Stats Cards ── */}
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { borderLeftColor: '#15613F' }]}>
                  <Text style={styles.statNum}>{totalSks}</Text>
                  <Text style={styles.statLbl}>Total SKS</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#1565C0' }]}>
                  <Text style={styles.statNum}>
                    {typeof ips === 'number' ? ips.toFixed(2) : ips}
                  </Text>
                  <Text style={styles.statLbl}>IPS</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#F57F17' }]}>
                  <Text style={styles.statNum}>{matkulList.length}</Text>
                  <Text style={styles.statLbl}>Mata Kuliah</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>

      {/* ── Dropdown Modal ── */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Pilih Periode</Text>
            <FlatList
              data={periodeList}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item.id === selectedPeriodeId && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    setSelectedPeriodeId(item.id);
                    setDropdownVisible(false);
                  }}>
                  <Text
                    style={[
                      styles.modalItemText,
                      item.id === selectedPeriodeId && styles.modalItemTextActive,
                    ]}>
                    {item.nama}
                  </Text>
                  {item.id === selectedPeriodeId && (
                    <Icon name="check" size={18} color="#15613F" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalSep} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────

const COL_NO = responsiveWidth(8);
const COL_KODE = responsiveWidth(14);
const COL_SKS = responsiveWidth(9);
const COL_MUTU = responsiveWidth(16);
const COL_BOBOT = responsiveWidth(13);
const COL_NILAI = responsiveWidth(13);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15613F' },

  // Header
  header: {
    backgroundColor: '#15613F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(4),
    gap: responsiveWidth(3),
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
  },

  // Body wrapper
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },

  // ScrollView
  scrollView: { flex: 1 },
  scrollContent: {
    padding: responsiveWidth(4),
    paddingBottom: responsiveWidth(10),
  },

  // Section card
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(3),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },

  // Periode row
  periodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodeLabel: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '700',
    color: '#1A3C2E',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#15613F',
    borderRadius: 10,
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(1.5),
    minWidth: responsiveWidth(48),
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: responsiveFontSize(1.6),
    color: '#15613F',
    fontWeight: '600',
    flex: 1,
    marginRight: 4,
  },

  // Info Banner
  infoBanner: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveWidth(2.5),
    marginBottom: responsiveWidth(3),
  },
  infoBannerText: {
    fontSize: responsiveFontSize(1.5),
    color: '#1565C0',
    flex: 1,
  },

  // Center states
  centerBox: {
    alignItems: 'center',
    paddingTop: responsiveWidth(15),
    paddingBottom: responsiveWidth(10),
  },
  centerText: {
    marginTop: responsiveWidth(4),
    fontSize: responsiveFontSize(1.9),
    color: '#718096',
    fontWeight: '600',
  },
  centerSubText: {
    fontSize: responsiveFontSize(1.5),
    color: '#A0AEC0',
    marginTop: 4,
  },

  // Table card
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    marginBottom: responsiveWidth(4),
  },
  tableTitle: {
    backgroundColor: '#1A3C2E',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2.5),
  },
  tableTitleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#15613F',
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
  },
  thText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.3),
    fontWeight: '700',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveWidth(2.5),
    paddingHorizontal: responsiveWidth(2),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAF9',
  },
  tdText: {
    fontSize: responsiveFontSize(1.4),
    color: '#2D3748',
  },
  tdKode: {
    color: '#15613F',
    fontWeight: '600',
  },
  emptyRow: {
    alignItems: 'center',
    padding: responsiveWidth(6),
  },
  emptyRowText: {
    color: '#A0AEC0',
    fontSize: responsiveFontSize(1.6),
  },

  // Column widths
  colNo: { width: COL_NO, textAlign: 'center' },
  colKode: { width: COL_KODE },
  colNama: { flex: 1 },
  colSks: { width: COL_SKS },
  colMutu: { width: COL_MUTU },
  colBobot: { width: COL_BOBOT },
  colNilai: { width: COL_NILAI },

  // Summary rows
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveWidth(2.5),
    paddingHorizontal: responsiveWidth(2),
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F7FAFC',
  },
  summaryLabel: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '700',
    color: '#1A3C2E',
  },
  summaryValue: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '800',
    color: '#15613F',
  },

  // Nilai badge
  nilaiBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 32,
    alignItems: 'center',
  },
  nilaiBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.4),
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: responsiveWidth(2),
    marginBottom: responsiveWidth(2),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: responsiveWidth(3.5),
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statNum: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#1A202C',
  },
  statLbl: {
    fontSize: responsiveFontSize(1.3),
    color: '#718096',
    marginTop: 2,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(4),
    paddingBottom: responsiveWidth(8),
    maxHeight: responsiveHeight(60),
  },
  modalTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1A3C2E',
    marginBottom: responsiveWidth(3),
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: 10,
  },
  modalItemActive: {
    backgroundColor: '#ECFDF5',
  },
  modalItemText: {
    fontSize: responsiveFontSize(1.7),
    color: '#374151',
  },
  modalItemTextActive: {
    color: '#15613F',
    fontWeight: '700',
  },
  modalSep: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});

export default NilaiScreen;