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
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { getTantangan } from '../../../services/home/index';
import moment from 'moment';

const ChallengeList = (props: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ['list_tantangan_all'],
    queryFn: () => getTantangan(),
  });

  const challenges = (data && Array.isArray(data.data)) ? data.data : [];

  const renderChallengeItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => props.navigation.push('home.detail-challenge', { ...item })}
      activeOpacity={0.7}
      style={styles.challengeCard}>
      <View style={styles.thumbnailContainer}>
        {item.pamflet_url ? (
          <Image source={{ uri: item.pamflet_url }} style={styles.thumbnail} />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Icons name="trophy" size={32} color="#D1D5DB" />
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.dateContainer}>
          <Icon name="schedule" size={14} color="#9CA3AF" />
          <Text style={styles.dateText}>{moment(item.created_at).format('DD MMM YYYY')}</Text>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.deskripsi}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UCL Challenges</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#15613F" />
        </View>
      ) : (
        <FlatList
          data={challenges}
          renderItem={renderChallengeItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icons name="medal-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>Belum ada tantangan aktif saat ini.</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(6),
    paddingBottom: 15,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  listContent: {
    padding: responsiveWidth(5),
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    width: responsiveWidth(22),
    height: responsiveWidth(22),
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    fontSize: responsiveFontSize(1.3),
    color: '#9CA3AF',
    marginLeft: 4,
  },
  cardDesc: {
    fontSize: responsiveFontSize(1.4),
    color: '#6B7280',
    lineHeight: 18,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: responsiveFontSize(1.6),
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ChallengeList;
