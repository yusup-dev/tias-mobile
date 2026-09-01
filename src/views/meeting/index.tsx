import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
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
import { getMeetingInvites, MeetingItem } from '../../services/meeting/index';
import moment from 'moment';

const MeetingScreen = (props: any) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mendatang' | 'selesai'>('all');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['meeting-invites'],
    queryFn: () => getMeetingInvites(),
  });

  const rawList: MeetingItem[] = data?.data || [];

  const filteredList = rawList.filter(item => {
    if (activeFilter === 'mendatang') return !item.status_hadir;
    if (activeFilter === 'selesai') return item.status_hadir;
    return true;
  });

  const renderMeetingCard = ({ item }: { item: MeetingItem }) => {
    const isCompleted = item.status_hadir;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => props.navigation.push('home.meeting-detail', { meeting: item })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.badgeTipe, { backgroundColor: isCompleted ? '#F3F4F6' : '#ECFDF5' }]}>
            <Text style={[styles.badgeTipeText, { color: isCompleted ? '#6B7280' : '#15613F' }]}>
              {item.tipe_kegiatan || 'Rapat'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            {isCompleted ? (
              <View style={styles.statusHadirBadge}>
                <Icon name="check-circle" size={14} color="#10B981" />
                <Text style={styles.statusHadirText}>Sudah Presensi</Text>
              </View>
            ) : (
              <View style={styles.statusBelumBadge}>
                <Icon name="clock-outline" size={14} color="#F59E0B" />
                <Text style={styles.statusBelumText}>Mendatang</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.judulText} numberOfLines={2}>{item.nm_kegiatan}</Text>

        <View style={styles.metaRow}>
          <Icon name="account-tie" size={18} color="#6B7280" />
          <Text style={styles.metaText} numberOfLines={1}>Pengundang: {item.nm_pengundang}</Text>
        </View>

        <View style={styles.metaRow}>
          <Icon name="map-marker-radius-outline" size={18} color="#6B7280" />
          <Text style={styles.metaText} numberOfLines={1}>{item.ruangan || 'Online / Ruang Rapat'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.dateRow}>
            <Icon name="calendar-clock" size={16} color="#15613F" />
            <Text style={styles.dateText}>
              {item.tanggal ? moment(item.tanggal).format('DD MMM YYYY') : '-'} • {item.waktu || 'TBA'}
            </Text>
          </View>

          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Undangan Rapat & Kegiatan</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          {[
            { key: 'all', label: 'Semua Rapat' },
            { key: 'mendatang', label: 'Mendatang' },
            { key: 'selesai', label: 'Selesai' },
          ].map(f => {
            const isActive = activeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key as any)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      {/* Meeting List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#15613F" />
        </View>
      ) : (
        <FlatList
          data={filteredList}
          renderItem={renderMeetingCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-blank-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>Tidak ada jadwal rapat pada filter ini.</Text>
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
    paddingBottom: 20,
    paddingHorizontal: responsiveWidth(5),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
    fontSize: responsiveFontSize(2.1),
    fontWeight: 'bold',
    color: '#FFF',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#FFF',
  },
  filterChipText: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: '600',
    color: '#E0F2FE',
  },
  filterChipTextActive: {
    color: '#15613F',
    fontWeight: 'bold',
  },
  listContent: {
    padding: responsiveWidth(5),
    paddingBottom: 40,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeTipe: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeTipeText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusHadirBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusHadirText: {
    fontSize: responsiveFontSize(1.15),
    fontWeight: 'bold',
    color: '#10B981',
    marginLeft: 4,
  },
  statusBelumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBelumText: {
    fontSize: responsiveFontSize(1.15),
    fontWeight: 'bold',
    color: '#D97706',
    marginLeft: 4,
  },
  judulText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: responsiveFontSize(1.3),
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: responsiveFontSize(1.25),
    fontWeight: '600',
    color: '#15613F',
    marginLeft: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: responsiveFontSize(1.5),
    color: '#9CA3AF',
    marginTop: 14,
  },
});

export default MeetingScreen;
