import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../../services/gamifikasi/index';
import { ribuanCast } from '../../helper/ribuan';

const CATEGORIES = [
  { key: 'all', label: 'Semua', field: 'total_point' },
  { key: 'pendidikan', label: 'Pendidikan', field: 'point_pendidikan' },
  { key: 'penelitian', label: 'Penelitian', field: 'point_penelitian' },
  { key: 'pengabdian', label: 'Pengabdian', field: 'point_pengabdian' },
  { key: 'kompetensi', label: 'Kompetensi', field: 'point_kompetensi' },
  { key: 'penunjang', label: 'Penunjang', field: 'point_penunjang' },
  { key: 'rekomendasi', label: 'Rekomendasi', field: 'point_rekomendasi' },
];

const LeaderboardScreen = (props: any) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => getLeaderboard({ limit: 50 }),
  });

  const rawData: any[] = data?.data || [];

  const currentCategory = useMemo(() => {
    return CATEGORIES.find(c => c.key === activeCategory) || CATEGORIES[0];
  }, [activeCategory]);

  const sortedData = useMemo(() => {
    const field = currentCategory.field;
    return [...rawData]
      .filter(item => item[field] !== undefined && item[field] !== null)
      .sort((a, b) => (Number(b[field]) || 0) - (Number(a[field]) || 0));
  }, [rawData, currentCategory]);

  const top3 = sortedData.slice(0, 3);
  const restList = sortedData.slice(3);

  const getPointsValue = (item: any) => {
    const val = item[currentCategory.field];
    return Number(val) || 0;
  };

  const renderLeaderboardItem = ({ item, index }: { item: any; index: number }) => {
    const rankColors = ['#FBBF24', '#9CA3AF', '#B45309'];

    return (
      <View style={styles.userRow}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{index + 4}</Text>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={item.image ? { uri: item.image } : require('../../../assets/login/logo_uika.png')}
            style={styles.avatar}
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>{item.nama_lengkap || item.name || 'Mahasiswa'}</Text>
          <Text style={styles.userNpm}>{item.npm || item.kode_mhs || '-'}</Text>
        </View>

        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{ribuanCast(getPointsValue(item))}</Text>
          <Text style={styles.pointsLabel}>pts</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#15613F', '#2D9C6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Papan Peringkat</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Category Tabs in Header */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              >
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Podium Top 3 */}
        {top3.length >= 3 && (
          <View style={styles.podiumContainer}>
            {/* Rank 2 */}
            <View style={[styles.podiumItem, { marginTop: 20 }]}>
              <View style={[styles.podiumAvatarContainer, { borderColor: '#9CA3AF' }]}>
                <Image source={top3[1].image ? { uri: top3[1].image } : require('../../../assets/login/logo_uika.png')} style={styles.podiumAvatar} />
                <View style={[styles.podiumBadge, { backgroundColor: '#9CA3AF' }]}>
                  <Text style={styles.podiumBadgeText}>2</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[1].nama_lengkap || 'Rank 2'}</Text>
              <Text style={styles.podiumPoints}>{ribuanCast(getPointsValue(top3[1]))}</Text>
            </View>

            {/* Rank 1 */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatarContainer, { borderColor: '#FBBF24', width: 80, height: 80, borderRadius: 40 }]}>
                <Image source={top3[0].image ? { uri: top3[0].image } : require('../../../assets/login/logo_uika.png')} style={[styles.podiumAvatar, { width: 72, height: 72, borderRadius: 36 }]} />
                <View style={[styles.podiumBadge, { backgroundColor: '#FBBF24', width: 24, height: 24, borderRadius: 12 }]}>
                  <Icon name="crown" size={14} color="#FFF" />
                </View>
              </View>
              <Text style={[styles.podiumName, { fontSize: responsiveFontSize(1.7) }]} numberOfLines={1}>{top3[0].nama_lengkap || 'Rank 1'}</Text>
              <Text style={[styles.podiumPoints, { color: '#FBBF24' }]}>{ribuanCast(getPointsValue(top3[0]))}</Text>
            </View>

            {/* Rank 3 */}
            <View style={[styles.podiumItem, { marginTop: 30 }]}>
              <View style={[styles.podiumAvatarContainer, { borderColor: '#B45309' }]}>
                <Image source={top3[2].image ? { uri: top3[2].image } : require('../../../assets/login/logo_uika.png')} style={styles.podiumAvatar} />
                <View style={[styles.podiumBadge, { backgroundColor: '#B45309' }]}>
                  <Text style={styles.podiumBadgeText}>3</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[2].nama_lengkap || 'Rank 3'}</Text>
              <Text style={styles.podiumPoints}>{ribuanCast(getPointsValue(top3[2]))}</Text>
            </View>
          </View>
        )}
      </LinearGradient>

      {/* List */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#15613F" />
          </View>
        ) : (
          <FlatList
            data={restList}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item, idx) => item.user_id || item.npm || idx.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={{ color: '#9CA3AF', marginTop: 20 }}>Tidak ada data pada kategori ini.</Text>
              </View>
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
  categoryScroll: {
    marginTop: 14,
    marginBottom: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#FFF',
  },
  categoryChipText: {
    color: '#E0F2FE',
    fontSize: responsiveFontSize(1.35),
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#15613F',
    fontWeight: 'bold',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 14,
    marginBottom: 10,
  },
  podiumItem: {
    alignItems: 'center',
    width: responsiveWidth(28),
  },
  podiumAvatarContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  podiumAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  podiumBadge: {
    position: 'absolute',
    bottom: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  podiumName: {
    color: '#FFF',
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    width: '90%',
  },
  podiumPoints: {
    color: '#E0F2FE',
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
    marginTop: -16,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 16,
  },
  listContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#6B7280',
  },
  avatarContainer: {
    marginLeft: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userNpm: {
    fontSize: responsiveFontSize(1.3),
    color: '#9CA3AF',
    marginTop: 2,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#15613F',
  },
  pointsLabel: {
    fontSize: responsiveFontSize(1.15),
    color: '#9CA3AF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LeaderboardScreen;
