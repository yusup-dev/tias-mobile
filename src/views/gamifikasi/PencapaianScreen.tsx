import React from 'react';
import {
  FlatList,
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
import { getMyAchievements } from '../../services/gamifikasi/index';

const PencapaianScreen = (props: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-achievements'],
    queryFn: () => getMyAchievements(),
  });

  const achievements = data?.data?.achievements || [];

  const renderAchievementItem = ({ item }: { item: any }) => (
    <View style={[styles.achievementCard, !item.status && styles.lockedCard]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: item.status ? '#FEF3C7' : '#F3F4F6' }]}>
          <Icon name={item.status ? 'trophy' : 'lock'} size={28} color={item.status ? '#F59E0B' : '#9CA3AF'} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPoints}>+{item.points} Points</Text>
        </View>
        {item.status && (
          <View style={styles.earnedBadge}>
            <Icon name="check-circle" size={20} color="#10B981" />
          </View>
        )}
      </View>
      <Text style={styles.cardDesc}>{item.deskripsi || item.sub_judul || 'Selesaikan misi untuk mendapatkan pencapaian ini.'}</Text>
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
          <Text style={styles.headerTitle}>Pencapaian</Text>
          <View style={{ width: 28 }} />
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{achievements.filter((a: any) => a.status).length}</Text>
            <Text style={styles.summaryLabel}>Diperoleh</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{achievements.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#15613F" />
        </View>
      ) : (
        <FlatList
          data={achievements}
          renderItem={renderAchievementItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="medal-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>Belum ada pencapaian yang tercatat.</Text>
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
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: '#FFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(2),
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: '#FFF',
  },
  summaryLabel: {
    fontSize: responsiveFontSize(1.4),
    color: '#E0F2FE',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: 20,
    paddingBottom: 40,
  },
  achievementCard: {
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
  lockedCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardPoints: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    color: '#F59E0B',
    marginTop: 2,
  },
  earnedBadge: {
    marginLeft: 8,
  },
  cardDesc: {
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: responsiveFontSize(1.6),
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default PencapaianScreen;
