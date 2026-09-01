import React, { useState, useMemo } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { getChallenges } from '../../services/gamifikasi/index';
import { profile } from '../../services/auth/profile';
import { ribuanCast } from '../../helper/ribuan';
import moment from 'moment';

const MisiScreen = (props: any) => {
  const [activeTab, setActiveTab] = useState('Tantangan');
  const tabs = ['Tantangan', 'Harian', 'Spesial'];

  const { data: challengesRes, isLoading: isChallengesLoading } = useQuery({
    queryKey: ['challenges-list'],
    queryFn: () => getChallenges(),
  });

  const { data: profileRes } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profile(),
  });

  const rawChallenges: any[] = challengesRes?.data || [];
  const totalPoint = profileRes?.data?.total_point || 0;

  const defaultMissions = [
    {
      id: 'm-1',
      title: 'Presensi Tepat Waktu',
      description: 'Lakukan absensi perkuliahan sebelum jam perkuliahan dimulai.',
      points: 50,
      progress: 1,
      total: 1,
      type: 'Harian',
      icon: 'clock-check-outline',
      color: '#10B981',
      completed: true,
    },
    {
      id: 'm-2',
      title: 'Lengkapi Biodata Mahasiswa',
      description: 'Perbarui data alamat dan data kependudukan di profil.',
      points: 100,
      progress: 1,
      total: 2,
      type: 'Spesial',
      icon: 'account-check-outline',
      color: '#3B82F6',
      completed: false,
    },
    {
      id: 'm-3',
      title: 'Tanda Tangan Digital',
      description: 'Simpan tanda tangan digital untuk keperluan surat menyurat.',
      points: 75,
      progress: profileRes?.data?.ttd ? 1 : 0,
      total: 1,
      type: 'Spesial',
      icon: 'draw',
      color: '#8B5CF6',
      completed: !!profileRes?.data?.ttd,
    },
  ];

  const displayedList = useMemo(() => {
    if (activeTab === 'Tantangan') {
      if (rawChallenges.length > 0) {
        return rawChallenges.map(ch => ({
          id: `ch-${ch.id}`,
          title: ch.title,
          description: ch.deskripsi || 'Selesaikan tantangan ini untuk meraih poin hadiah UCL.',
          points: ch.points || ch.point || 100,
          pamflet: ch.pamflet_url || (ch.pamflet ? `https://api-tias.ti.ft.uika-bogor.ac.id/berita/pamflet/${ch.pamflet}` : null),
          created_at: ch.created_at,
          type: 'Tantangan',
          icon: 'trophy-award',
          color: '#F59E0B',
          raw: ch,
        }));
      }
      return [
        {
          id: 'ch-default',
          title: 'UCL Challenge Semester Ini',
          description: 'Ikuti tantangan akademik dan capai poin minimal 1.100 untuk membuka badge Qualified.',
          points: 150,
          type: 'Tantangan',
          icon: 'trophy',
          color: '#F59E0B',
          progress: Math.min(totalPoint, 1100),
          total: 1100,
        },
      ];
    }
    return defaultMissions.filter(m => m.type === activeTab);
  }, [activeTab, rawChallenges, totalPoint, profileRes]);

  const renderMissionItem = ({ item }: { item: any }) => (
    <View style={styles.missionCard}>
      <View style={styles.missionHeader}>
        {item.pamflet ? (
          <Image source={{ uri: item.pamflet }} style={styles.thumbnailImage} />
        ) : (
          <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
            <Icon name={item.icon || 'star'} size={24} color={item.color} />
          </View>
        )}
        <View style={styles.missionInfo}>
          <Text style={styles.missionTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.missionPoints}>+{item.points} UCL Points</Text>
        </View>
        {item.completed && (
          <View style={styles.completedBadge}>
            <Icon name="check-circle" size={20} color="#10B981" />
          </View>
        )}
      </View>
      <Text style={styles.missionDesc} numberOfLines={3}>{item.description}</Text>

      {item.total ? (
        <View style={styles.progressSection}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(100, ((item.progress || 0) / item.total) * 100)}%`,
                  backgroundColor: item.completed ? '#10B981' : item.color,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{item.progress || 0}/{item.total}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: item.completed ? '#F3F4F6' : '#15613F' },
        ]}
        onPress={() => {
          if (item.raw) {
            props.navigation.push('home.detail-challenge', item.raw);
          }
        }}
        disabled={item.completed}
      >
        <Text style={[styles.actionButtonText, { color: item.completed ? '#9CA3AF' : '#FFFFFF' }]}>
          {item.completed ? 'Selesai' : 'Lihat Detail'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#15613F', '#2D9C6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Misi & Tantangan</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{rawChallenges.length}</Text>
            <Text style={styles.statLabel}>Tantangan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{ribuanCast(totalPoint)}</Text>
            <Text style={styles.statLabel}>Total Poin</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profileRes?.data?.rank || 'Novice'}</Text>
            <Text style={styles.statLabel}>Tier Rank</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isChallengesLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#15613F" />
        </View>
      ) : (
        <FlatList
          data={displayedList}
          renderItem={renderMissionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="clipboard-text-off-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>Belum ada misi atau tantangan aktif saat ini.</Text>
            </View>
          }
        />
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
    paddingBottom: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(5),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(2),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 14,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: responsiveFontSize(1.3),
    color: '#E0F2FE',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: responsiveWidth(5),
    marginTop: -20,
    borderRadius: 15,
    padding: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTabItem: {
    backgroundColor: '#15613F',
  },
  tabText: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: 24,
    paddingBottom: 40,
  },
  missionCard: {
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
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  missionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  missionTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  missionPoints: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '600',
    color: '#15613F',
    marginTop: 2,
  },
  completedBadge: {
    marginLeft: 8,
  },
  missionDesc: {
    fontSize: responsiveFontSize(1.35),
    color: '#6B7280',
    marginTop: 10,
    lineHeight: 18,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: 'bold',
    color: '#4B5563',
    marginLeft: 10,
    minWidth: 35,
    textAlign: 'right',
  },
  actionButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: responsiveFontSize(1.45),
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: responsiveFontSize(1.5),
    color: '#9CA3AF',
    marginTop: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default MisiScreen;
