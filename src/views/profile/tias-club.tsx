import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTokenStore} from '../../store/auth';
import { useQuery } from '@tanstack/react-query';
import { getMyAchievements } from '../../services/gamifikasi/index';
import { ribuanCast } from '../../helper/ribuan';

const TiasClubScreen = (props: any) => {
  const {user} = useTokenStore();

  const { data, isLoading } = useQuery({
    queryKey: ['my-achievements'],
    queryFn: () => getMyAchievements(),
  });

  const badges = data?.data?.achievements || [];
  const earnedCount = badges.filter((b: any) => b.status).length;
  const totalPoints = data?.data?.total_points || 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TIAS Club</Text>
        <View style={{width: 28}} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#15613F" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statsIconCircle}>
              <Icon name="star-outline" size={34} color="#FFF" />
            </View>
            <Text style={styles.statsTitle}>{user?.nama_lengkap || 'Pengguna'}</Text>
            <Text style={styles.statsSubtitle}>Member TIAS Club</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{earnedCount}</Text>
                <Text style={styles.statLabel}>Badge Diperoleh</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{badges.length - earnedCount}</Text>
                <Text style={styles.statLabel}>Belum Tercapai</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{ribuanCast(totalPoints)}</Text>
                <Text style={styles.statLabel}>Total Poin</Text>
              </View>
            </View>
          </View>

          {/* Badge List */}
          <Text style={styles.sectionTitle}>Badge & Pencapaian</Text>
          <View style={styles.badgeGrid}>
            {badges.map((badge: any) => (
              <View
                key={badge.id}
                style={[
                  styles.badgeCard,
                  !badge.status && styles.badgeCardLocked,
                ]}>
                <View
                  style={[
                    styles.badgeIconCircle,
                    {backgroundColor: badge.status ? '#FBBF24' : '#E5E7EB'},
                  ]}>
                  <Icon
                    name={badge.status ? 'medal' : 'lock'}
                    size={26}
                    color={badge.status ? '#FFF' : '#9CA3AF'}
                  />
                </View>
                <Text
                  style={[
                    styles.badgeName,
                    !badge.status && styles.badgeNameLocked,
                  ]}
                  numberOfLines={1}>
                  {badge.name}
                </Text>
                <Text style={styles.badgeDesc} numberOfLines={2}>
                  {badge.deskripsi || badge.sub_judul || 'Selesaikan misi untuk mendapatkan badge ini.'}
                </Text>
                {badge.status ? (
                  <View style={styles.earnedBadge}>
                    <Icon name="check-circle" size={12} color="#10B981" />
                    <Text style={styles.earnedText}>Diperoleh</Text>
                  </View>
                ) : (
                  <View style={styles.lockedBadge}>
                    <Icon name="lock" size={12} color="#9CA3AF" />
                    <Text style={styles.lockedText}>Terkunci</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={{height: 30}} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(4),
  },
  statsCard: {
    backgroundColor: '#15613F',
    borderRadius: 20,
    padding: responsiveWidth(6),
    alignItems: 'center',
    marginBottom: responsiveWidth(6),
  },
  statsIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsSubtitle: {
    fontSize: responsiveFontSize(1.4),
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: responsiveFontSize(2.6),
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: responsiveFontSize(1.2),
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: responsiveWidth(3),
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(3),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeName: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeNameLocked: {
    color: '#6B7280',
  },
  badgeDesc: {
    fontSize: responsiveFontSize(1.2),
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8,
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  earnedText: {
    fontSize: responsiveFontSize(1.2),
    color: '#10B981',
    fontWeight: '600',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockedText: {
    fontSize: responsiveFontSize(1.2),
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

export default TiasClubScreen;
