import React from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { profile } from '../../services/auth/profile';
import { getAcademicStats } from '../../services/gamifikasi/index';
import { ribuanCast } from '../../helper/ribuan';

const getRankTier = (totalPoint: number) => {
  if (totalPoint >= 10000) return { name: 'Legend', color: '#EF4444', icon: 'crown' };
  if (totalPoint >= 7500) return { name: 'Superior', color: '#F59E0B', icon: 'shield-crown' };
  if (totalPoint >= 5400) return { name: 'Specialist', color: '#8B5CF6', icon: 'star-circle' };
  if (totalPoint >= 3900) return { name: 'Professional', color: '#3B82F6', icon: 'shield-star' };
  if (totalPoint >= 2400) return { name: 'Proficient', color: '#10B981', icon: 'medal' };
  if (totalPoint >= 1100) return { name: 'Qualified', color: '#14B8A6', icon: 'certificate' };
  return { name: 'Novice', color: '#9CA3AF', icon: 'shield-outline' };
};

const StatistikScreen = (props: any) => {
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile-stats'],
    queryFn: () => profile(),
  });

  const { data: academicData, isLoading: isAcademicLoading } = useQuery({
    queryKey: ['academic-stats'],
    queryFn: () => getAcademicStats(),
  });

  const stats = profileData?.data || {};
  const totalPoint = stats.total_point || 0;
  const currentRank = getRankTier(totalPoint);

  const semesterIpsList = academicData?.data || [];
  const ipkValue = academicData?.ipk || stats.ipk || '-';

  const pointCategories = [
    { label: 'Pendidikan', value: stats.point_pendidikan, icon: 'school', color: '#4ADE80' },
    { label: 'Penelitian', value: stats.point_penelitian, icon: 'microscope', color: '#F472B6' },
    { label: 'Pengabdian', value: stats.point_pengabdian, icon: 'account-group', color: '#FBBF24' },
    { label: 'Kompetensi', value: stats.point_kompetensi, icon: 'medal', color: '#A78BFA' },
    { label: 'Penunjang', value: stats.point_penunjang, icon: 'plus-circle', color: '#FB923C' },
    { label: 'Rekomendasi', value: stats.point_rekomendasi, icon: 'hand-heart', color: '#38BDF8' },
  ];

  const isLoading = isProfileLoading || isAcademicLoading;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#15613F', '#2D9C6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statistik Poin & Akademik</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.totalPointsCard}>
          <Text style={styles.totalLabel}>Total UCL Score</Text>
          <Text style={styles.totalValue}>{ribuanCast(totalPoint)}</Text>
          <View style={[styles.rankBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <Icon name={currentRank.icon} size={18} color="#FBBF24" />
            <Text style={styles.rankText}>{currentRank.name}</Text>
          </View>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#15613F" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Indeks Prestasi Section */}
          <View style={styles.ipkCard}>
            <View style={styles.ipkHeaderRow}>
              <View style={styles.ipkIconContainer}>
                <Icon name="school-outline" size={26} color="#15613F" />
              </View>
              <View style={styles.ipkTextCol}>
                <Text style={styles.ipkTitle}>Indeks Prestasi Kumulatif</Text>
                <Text style={styles.ipkSubtitle}>Performa Akademik Mahasiswa</Text>
              </View>
              <Text style={styles.ipkValueText}>{ipkValue}</Text>
            </View>

            {/* Semester IPS Breakdown if available */}
            {semesterIpsList && semesterIpsList.length > 0 && (
              <View style={styles.ipsContainer}>
                <Text style={styles.ipsSectionTitle}>Riwayat IPS Semester</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ipsScroll}>
                  {semesterIpsList.map((item: any, idx: number) => (
                    <View key={`ips-${idx}`} style={styles.ipsCardItem}>
                      <Text style={styles.ipsSemesterLabel}>Smt {item.semester || (idx + 1)}</Text>
                      <Text style={styles.ipsValue}>{item.ip ? parseFloat(item.ip).toFixed(2) : '-'}</Text>
                      <View style={styles.ipsBarTrack}>
                        <View
                          style={[
                            styles.ipsBarFill,
                            {
                              height: `${Math.min(100, ((parseFloat(item.ip) || 0) / 4.0) * 100)}%`,
                              backgroundColor: (parseFloat(item.ip) || 0) >= 3.5 ? '#15613F' : (parseFloat(item.ip) || 0) >= 3.0 ? '#3B82F6' : '#F59E0B',
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Breakdown Tri Dharma */}
          <Text style={styles.sectionTitle}>Breakdown Poin Kategori</Text>
          <View style={styles.grid}>
            {pointCategories.map((item, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                  <Icon name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={[styles.statValue, { color: item.color }]}>{ribuanCast(item.value || 0)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Icon name="information-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>
              Poin dihitung otomatis berdasarkan aktivitas akademik, kompetensi, penelitian, dan pengabdian yang telah divalidasi oleh sistem TIAS.
            </Text>
          </View>
        </ScrollView>
      )}
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
    paddingBottom: responsiveHeight(4.5),
    paddingHorizontal: responsiveWidth(5),
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#FFF',
  },
  totalPointsCard: {
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: responsiveFontSize(1.5),
    color: '#E0F2FE',
    opacity: 0.9,
  },
  totalValue: {
    fontSize: responsiveFontSize(4.2),
    fontWeight: '900',
    color: '#FFF',
    marginVertical: 4,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  rankText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: responsiveFontSize(1.5),
  },
  scrollContent: {
    padding: responsiveWidth(5),
    paddingTop: 20,
    paddingBottom: 40,
  },
  ipkCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  ipkHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ipkIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ipkTextCol: {
    flex: 1,
  },
  ipkTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  ipkSubtitle: {
    fontSize: responsiveFontSize(1.3),
    color: '#6B7280',
    marginTop: 2,
  },
  ipkValueText: {
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
    color: '#15613F',
  },
  ipsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  ipsSectionTitle: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 10,
  },
  ipsScroll: {
    flexDirection: 'row',
  },
  ipsCardItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 50,
  },
  ipsSemesterLabel: {
    fontSize: responsiveFontSize(1.2),
    color: '#6B7280',
    marginBottom: 4,
  },
  ipsValue: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  ipsBarTrack: {
    width: 14,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  ipsBarFill: {
    width: '100%',
    borderRadius: 7,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: responsiveFontSize(1.4),
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 14,
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: responsiveFontSize(1.25),
    color: '#6B7280',
    lineHeight: 18,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StatistikScreen;
