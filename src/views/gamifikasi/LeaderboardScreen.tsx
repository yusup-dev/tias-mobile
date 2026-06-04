import React from 'react';
import {
  FlatList,
  Image,
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
import { getLeaderboard } from '../../services/gamifikasi/index';
import { ribuanCast } from '../../helper/ribuan';

const LeaderboardScreen = (props: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => getLeaderboard({ limit: 50 }),
  });

  const leaderboardData = data?.data || [];

  const renderLeaderboardItem = ({ item, index }: { item: any; index: number }) => {
    const isTop3 = index < 3;
    const rankColors = ['#FBBF24', '#9CA3AF', '#B45309']; // Gold, Silver, Bronze

    return (
      <View style={styles.userRow}>
        <View style={styles.rankContainer}>
          {isTop3 ? (
            <Icon name="medal" size={24} color={rankColors[index]} />
          ) : (
            <Text style={styles.rankText}>{index + 1}</Text>
          )}
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={item.image ? { uri: item.image } : require('../../../assets/login/logo_uika.png')}
            style={styles.avatar}
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>{item.nama_lengkap}</Text>
          <Text style={styles.userNpm}>{item.npm}</Text>
        </View>

        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{ribuanCast(item.total_point || 0)}</Text>
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
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Podium Top 3 */}
        {leaderboardData.length >= 3 && (
          <View style={styles.podiumContainer}>
            {/* Rank 2 */}
            <View style={[styles.podiumItem, { marginTop: 20 }]}>
              <View style={[styles.podiumAvatarContainer, { borderColor: '#9CA3AF' }]}>
                <Image source={leaderboardData[1].image ? { uri: leaderboardData[1].image } : require('../../../assets/login/logo_uika.png')} style={styles.podiumAvatar} />
                <View style={[styles.podiumBadge, { backgroundColor: '#9CA3AF' }]}>
                  <Text style={styles.podiumBadgeText}>2</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{leaderboardData[1].nama_lengkap}</Text>
              <Text style={styles.podiumPoints}>{ribuanCast(leaderboardData[1].total_point)}</Text>
            </View>

            {/* Rank 1 */}
            <View style={styles.podiumItem}>
              <View style={[styles.podiumAvatarContainer, { borderColor: '#FBBF24', width: 80, height: 80, borderRadius: 40 }]}>
                <Image source={leaderboardData[0].image ? { uri: leaderboardData[0].image } : require('../../../assets/login/logo_uika.png')} style={[styles.podiumAvatar, { width: 72, height: 72, borderRadius: 36 }]} />
                <View style={[styles.podiumBadge, { backgroundColor: '#FBBF24', width: 24, height: 24, borderRadius: 12 }]}>
                  <Icon name="crown" size={14} color="#FFF" />
                </View>
              </View>
              <Text style={[styles.podiumName, { fontSize: responsiveFontSize(1.8) }]} numberOfLines={1}>{leaderboardData[0].nama_lengkap}</Text>
              <Text style={[styles.podiumPoints, { color: '#FBBF24' }]}>{ribuanCast(leaderboardData[0].total_point)}</Text>
            </View>

            {/* Rank 3 */}
            <View style={[styles.podiumItem, { marginTop: 30 }]}>
              <View style={[styles.podiumAvatarContainer, { borderColor: '#B45309' }]}>
                <Image source={leaderboardData[2].image ? { uri: leaderboardData[2].image } : require('../../../assets/login/logo_uika.png')} style={styles.podiumAvatar} />
                <View style={[styles.podiumBadge, { backgroundColor: '#B45309' }]}>
                  <Text style={styles.podiumBadgeText}>3</Text>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{leaderboardData[2].nama_lengkap}</Text>
              <Text style={styles.podiumPoints}>{ribuanCast(leaderboardData[2].total_point)}</Text>
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
            data={leaderboardData.slice(3)}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.user_id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
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
    paddingBottom: responsiveHeight(4),
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
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: '#FFF',
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  podiumItem: {
    alignItems: 'center',
    width: responsiveWidth(28),
  },
  podiumAvatarContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  podiumAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
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
    fontSize: responsiveFontSize(1.5),
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    width: '90%',
  },
  podiumPoints: {
    color: '#E0F2FE',
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
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
    fontSize: responsiveFontSize(1.8),
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
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userNpm: {
    fontSize: responsiveFontSize(1.4),
    color: '#9CA3AF',
    marginTop: 2,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#15613F',
  },
  pointsLabel: {
    fontSize: responsiveFontSize(1.2),
    color: '#9CA3AF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LeaderboardScreen;
