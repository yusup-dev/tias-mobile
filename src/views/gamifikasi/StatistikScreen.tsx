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
import { ribuanCast } from '../../helper/ribuan';

const StatistikScreen = (props: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ['profile-stats'],
    queryFn: () => profile(),
  });

  const stats = data?.data || {};

  const pointCategories = [
    { label: 'Pendidikan', value: stats.point_pendidikan, icon: 'school', color: '#4ADE80' },
    { label: 'Publikasi', value: stats.point_publikasi, icon: 'book-open-variant', color: '#60A5FA' },
    { label: 'Penelitian', value: stats.point_penelitian, icon: 'microscope', color: '#F472B6' },
    { label: 'Pengabdian', value: stats.point_pengabdian, icon: 'account-group', color: '#FBBF24' },
    { label: 'Kompetensi', value: stats.point_kompetensi, icon: 'medal', color: '#A78BFA' },
    { label: 'Penunjang', value: stats.point_penunjang, icon: 'plus-circle', color: '#FB923C' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#15613F', '#2D9C6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statistik Poin</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.totalPointsCard}>
          <Text style={styles.totalLabel}>Total TIAS Score</Text>
          <Text style={styles.totalValue}>{ribuanCast(stats.total_point || 0)}</Text>
          <View style={styles.rankBadge}>
            <Icon name="crown" size={16} color="#FBBF24" />
            <Text style={styles.rankText}>{stats.rank || 'Novice'}</Text>
          </View>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#15613F" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Breakdown Kategori</Text>
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
              Poin dihitung berdasarkan aktivitas akademik, penelitian, dan pengabdian yang telah divalidasi oleh sistem.
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
    paddingBottom: responsiveHeight(5),
    paddingHorizontal: responsiveWidth(5),
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: '#FFF',
  },
  totalPointsCard: {
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: responsiveFontSize(1.6),
    color: '#E0F2FE',
    opacity: 0.9,
  },
  totalValue: {
    fontSize: responsiveFontSize(4.5),
    fontWeight: '900',
    color: '#FFF',
    marginVertical: 5,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rankText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: responsiveFontSize(1.4),
  },
  scrollContent: {
    padding: responsiveWidth(5),
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: responsiveFontSize(1.3),
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
