import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getExamHistory} from '../../../services/cbt';

// Tipe data untuk satu item riwayat ujian
type ExamHistoryItem = {
  id: string | number;
  exam_title: string;
  course_name: string;
  score: number | null;
  total_questions: number;
  correct_answers: number;
  status: string; // 'graded', 'pending', 'submitted'
  submitted_at: string;
  graded_at: string | null;
  duration_minutes: number | null;
};

const CbtHistoryScreen = (props: any) => {
  const [historyData, setHistoryData] = useState<ExamHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistory = useCallback(async (showFullLoader = true) => {
    try {
      if (showFullLoader) {
        setIsLoading(true);
      }
      setErrorMsg(null);

      const result = await getExamHistory();
      console.log('[CBT History] Response:', JSON.stringify(result).substring(0, 300));

      // Sesuaikan dengan format response API
      if (result?.data && Array.isArray(result.data)) {
        setHistoryData(result.data);
      } else if (Array.isArray(result)) {
        setHistoryData(result);
      } else {
        setHistoryData([]);
      }
    } catch (error: any) {
      console.log('[CBT History] Error:', error?.message);
      setErrorMsg(error?.message || 'Gagal memuat riwayat ujian');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchHistory(false);
  }, [fetchHistory]);

  // ── Helpers ──────────────────────────────────────────
  const getScoreColor = (score: number | null): string => {
    if (score === null) return '#9CA3AF';
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'graded':
        return {color: '#10B981', bg: '#ECFDF5', text: 'Dinilai', icon: 'check-circle'};
      case 'pending':
        return {color: '#F59E0B', bg: '#FFFBEB', text: 'Menunggu Nilai', icon: 'clock-outline'};
      case 'submitted':
        return {color: '#3B82F6', bg: '#EFF6FF', text: 'Terkirim', icon: 'send-check'};
      default:
        return {color: '#6B7280', bg: '#F3F4F6', text: status || 'Selesai', icon: 'check'};
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return date.toLocaleDateString('id-ID', options);
    } catch {
      return dateStr;
    }
  };

  // ── Render Functions ─────────────────────────────────
  const renderHistoryCard = ({item}: {item: ExamHistoryItem}) => {
    const statusCfg = getStatusConfig(item.status);
    const scoreColor = getScoreColor(item.score);

    return (
      <View style={styles.card}>
        {/* Header Card */}
        <View style={styles.cardHeader}>
          <View style={[styles.badge, {backgroundColor: statusCfg.bg}]}>
            <Icon name={statusCfg.icon} size={14} color={statusCfg.color} />
            <Text style={[styles.badgeText, {color: statusCfg.color}]}>
              {statusCfg.text}
            </Text>
          </View>
          {item.duration_minutes && (
            <View style={styles.durationBadge}>
              <Icon name="timer-outline" size={13} color="#6B7280" />
              <Text style={styles.durationText}>{item.duration_minutes} menit</Text>
            </View>
          )}
        </View>

        {/* Judul & Mata Kuliah */}
        <Text style={styles.titleText} numberOfLines={2}>
          {item.exam_title}
        </Text>
        <Text style={styles.matkulText} numberOfLines={1}>
          {item.course_name}
        </Text>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>Nilai</Text>
            <Text style={[styles.scoreValue, {color: scoreColor}]}>
              {item.score !== null ? item.score : '-'}
            </Text>
          </View>
          {item.total_questions > 0 && (
            <View style={styles.scoreMeta}>
              <View style={styles.metaRow}>
                <Icon name="check-circle-outline" size={14} color="#10B981" />
                <Text style={styles.metaText}>
                  {item.correct_answers}/{item.total_questions} Benar
                </Text>
              </View>
              {/* Progress Bar Sederhana */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${
                        item.total_questions > 0
                          ? (item.correct_answers / item.total_questions) * 100
                          : 0
                      }%`,
                      backgroundColor: scoreColor,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Footer: Tanggal dikerjakan */}
        <View style={styles.cardFooter}>
          <Icon name="calendar-check" size={14} color="#9CA3AF" />
          <Text style={styles.footerText}>
            Dikerjakan: {formatDate(item.submitted_at)}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="clipboard-text-clock-outline" size={70} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
      <Text style={styles.emptySubtitle}>
        Riwayat ujian yang sudah kamu kerjakan akan muncul di sini.
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.emptyContainer}>
      <Icon name="alert-circle-outline" size={70} color="#EF4444" />
      <Text style={styles.emptyTitle}>Gagal Memuat</Text>
      <Text style={styles.emptySubtitle}>{errorMsg}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={() => fetchHistory()}>
        <Icon name="refresh" size={18} color="#FFFFFF" />
        <Text style={styles.retryText}>Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color="#15613F" />
      <Text style={[styles.emptySubtitle, {marginTop: 16}]}>
        Memuat riwayat ujian...
      </Text>
    </View>
  );

  // ── Main Render ──────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Ujian</Text>
        <TouchableOpacity onPress={() => fetchHistory()} style={styles.backBtn}>
          <Icon name="refresh" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Banner */}
      {!isLoading && !errorMsg && historyData.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{historyData.length}</Text>
            <Text style={styles.summaryLabel}>Total Ujian</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {historyData.filter(e => e.status?.toLowerCase() === 'graded').length}
            </Text>
            <Text style={styles.summaryLabel}>Sudah Dinilai</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {historyData.filter(e => e.score !== null && e.score !== undefined).length > 0
                ? Math.round(
                    historyData
                      .filter(e => e.score !== null && e.score !== undefined)
                      .reduce((sum, e) => sum + (e.score ?? 0), 0) /
                      historyData.filter(e => e.score !== null && e.score !== undefined).length,
                  )
                : '-'}
            </Text>
            <Text style={styles.summaryLabel}>Rata-rata</Text>
          </View>
        </View>
      )}

      {/* Content Area */}
      <View style={styles.bottomSheet}>
        {isLoading ? (
          renderLoading()
        ) : errorMsg ? (
          renderError()
        ) : (
          <FlatList
            data={historyData}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderHistoryCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#15613F']}
                tintColor="#15613F"
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15613F',
  },
  // ── Header ───────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(8),
    paddingBottom: responsiveWidth(4),
    backgroundColor: '#15613F',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // ── Summary Banner ───────────────
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: responsiveWidth(4),
    borderRadius: 16,
    padding: 16,
    marginBottom: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: '900',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: responsiveFontSize(1.3),
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  // ── Bottom Sheet ─────────────────
  bottomSheet: {
    flex: 1,
    backgroundColor: '#F4F4F9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  listContainer: {
    padding: responsiveWidth(5),
    paddingBottom: responsiveWidth(10),
    paddingTop: responsiveWidth(6),
  },
  // ── Card ─────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  badgeText: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: 'bold',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: responsiveFontSize(1.3),
    color: '#6B7280',
    fontWeight: '500',
  },
  titleText: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  matkulText: {
    fontSize: responsiveFontSize(1.5),
    color: '#4B5563',
    marginBottom: 16,
  },
  // ── Score ────────────────────────
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  scoreLeft: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    minWidth: 70,
  },
  scoreLabel: {
    fontSize: responsiveFontSize(1.2),
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: '900',
  },
  scoreMeta: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  metaText: {
    fontSize: responsiveFontSize(1.4),
    color: '#4B5563',
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  // ── Footer ──────────────────────
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 6,
  },
  footerText: {
    fontSize: responsiveFontSize(1.3),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  // ── Empty & Error ───────────────
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveWidth(25),
    paddingHorizontal: responsiveWidth(10),
  },
  emptyTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: responsiveFontSize(1.5),
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#15613F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
  },
});

export default CbtHistoryScreen;
