import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
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
import { getListSurat, SuratItem } from '../../services/surat/index';
import moment from 'moment';

const TABS: Array<{ key: 'masuk' | 'keluar' | 'revisi' | 'terkirim'; label: string; icon: string }> = [
  { key: 'masuk', label: 'Surat Masuk', icon: 'email-receive-outline' },
  { key: 'keluar', label: 'Surat Keluar', icon: 'email-send-outline' },
  { key: 'revisi', label: 'Revisi', icon: 'file-document-edit-outline' },
  { key: 'terkirim', label: 'Terkirim', icon: 'checkbox-marked-circle-outline' },
];

const SuratScreen = (props: any) => {
  const [activeTab, setActiveTab] = useState<'masuk' | 'keluar' | 'revisi' | 'terkirim'>('masuk');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['list-surat', activeTab],
    queryFn: () => getListSurat(activeTab),
  });

  const rawList: SuratItem[] = data?.data || [];

  const filteredList = rawList.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.perihal?.toLowerCase().includes(q) ||
      item.no_surat?.toLowerCase().includes(q) ||
      item.pengirim?.toLowerCase().includes(q)
    );
  });

  const renderSuratCard = ({ item }: { item: SuratItem }) => {
    const isInternal = item.kategori === 'Internal';
    const hasDisposisi = item.disposisi && item.disposisi.length > 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => props.navigation.push('home.surat-detail', { surat: item })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.badgeKategori, { backgroundColor: isInternal ? '#ECFDF5' : '#EFF6FF' }]}>
            <Text style={[styles.badgeKategoriText, { color: isInternal ? '#15613F' : '#2563EB' }]}>
              {item.kategori}
            </Text>
          </View>
          <Text style={styles.tanggalText}>{item.tanggal ? moment(item.tanggal).format('DD MMM YYYY') : '-'}</Text>
        </View>

        <Text style={styles.noSuratText}>{item.no_surat}</Text>
        <Text style={styles.perihalText} numberOfLines={2}>{item.perihal}</Text>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.pengirimRow}>
            <Icon name="account-arrow-right-outline" size={18} color="#6B7280" />
            <Text style={styles.pengirimText} numberOfLines={1}>Dari: {item.pengirim}</Text>
          </View>

          {hasDisposisi && (
            <View style={styles.disposisiBadge}>
              <Icon name="share-circle" size={14} color="#D97706" />
              <Text style={styles.disposisiBadgeText}>Ada Disposisi</Text>
            </View>
          )}
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
          <Text style={styles.headerTitle}>Persuratan & Disposisi</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={22} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nomor surat atau perihal..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* 4 Tabs Bar */}
        <View style={styles.tabsContainer}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
                <Icon
                  name={tab.icon}
                  size={18}
                  color={isActive ? '#15613F' : 'rgba(255, 255, 255, 0.8)'}
                />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      {/* Surat List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#15613F" />
        </View>
      ) : (
        <FlatList
          data={filteredList}
          renderItem={renderSuratCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="email-off-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>Tidak ada surat pada kategori {activeTab}.</Text>
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
    paddingBottom: 16,
    paddingHorizontal: responsiveWidth(5),
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(1.45),
    color: '#1F2937',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#FFF',
  },
  tabLabel: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 4,
  },
  tabLabelActive: {
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
  badgeKategori: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeKategoriText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: 'bold',
  },
  tanggalText: {
    fontSize: responsiveFontSize(1.25),
    color: '#9CA3AF',
  },
  noSuratText: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  perihalText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pengirimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  pengirimText: {
    fontSize: responsiveFontSize(1.3),
    color: '#6B7280',
    marginLeft: 6,
  },
  disposisiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  disposisiBadgeText: {
    fontSize: responsiveFontSize(1.15),
    fontWeight: 'bold',
    color: '#D97706',
    marginLeft: 4,
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

export default SuratScreen;
