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
import { getActivity } from '../../services/gamifikasi/index';
import moment from 'moment';

const AktivitasScreen = (props: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-activity'],
    queryFn: () => getActivity(),
  });

  const activities = data?.data || [];

  const renderActivityItem = ({ item }: { item: any }) => (
    <View style={styles.activityCard}>
      <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
        <Icon name="calendar-check" size={24} color="#15613F" />
      </View>
      <div style={styles.contentContainer}>
        <Text style={styles.activityTitle}>Absensi: {item.pembelajaran?.matkul?.name || 'Mata Kuliah'}</Text>
        <Text style={styles.activityTime}>{moment(item.created_at).format('DD MMMM YYYY, HH:mm')}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Berhasil</Text>
        </View>
      </div>
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
          <Text style={styles.headerTitle}>Log Aktivitas</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#15613F" />
        </View>
      ) : (
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="history" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>Belum ada aktivitas terbaru.</Text>
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
  listContent: {
    padding: responsiveWidth(5),
    paddingTop: 20,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  activityTime: {
    fontSize: responsiveFontSize(1.4),
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  statusText: {
    fontSize: responsiveFontSize(1.2),
    color: '#15613F',
    fontWeight: 'bold',
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
    fontSize: responsiveFontSize(1.8),
    color: '#9CA3AF',
    marginTop: 16,
  },
});

export default AktivitasScreen;
