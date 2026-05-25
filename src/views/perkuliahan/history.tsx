import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { get_history } from '../../services/absen/index';

const HistoryPerkuliahanComponent = (props: any) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['history_perkuliahan'],
    queryFn: async () => {
      const response: any = await get_history();
      const list = Array.isArray(response?.data) ? response.data : [];
      return list.filter((item: any) => item?.pembelajaran != null);
    },
  });

  const historyList = Array.isArray(data) ? data : [];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.backButton}>
          <Icons size={28} name="chevron-left" color={'white'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Absensi</Text>
      </View>

      {/* Bottom Sheet List Section */}
      <View style={styles.bottomSheet}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#15613F" style={styles.centerLoading} />
          ) : isError ? (
            <Text style={styles.emptyText}>Gagal memuat riwayat perkuliahan.</Text>
          ) : historyList.length ? (
            historyList.map((list: any, index: number) => (
              <View key={`${index}-history-${list.id}`} style={styles.card}>

                {/* Status Box */}
                <View style={styles.statusBox}>
                  <Icons name="check-circle-outline" size={24} color="#15613F" />
                  <Text style={styles.statusText}>Hadir</Text>
                </View>

                {/* Info Absensi */}
                <View style={styles.cardInfo}>
                  <Text style={styles.matkulName} numberOfLines={2}>
                    {list.pembelajaran.matkul.name} <Text style={styles.sksText}>({list.sks} SKS)</Text>
                  </Text>

                  <View style={styles.detailRow}>
                    <Icons name="calendar-clock" size={14} color="#666" />
                    <Text style={styles.detailText}>Pertemuan {list.pembelajaran.pertemuan}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Icons name="google-classroom" size={14} color="#666" />
                    <Text style={styles.detailText}>
                      Kelas {list.pembelajaran.kelas} • {list.pembelajaran.status_kelas ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                </View>

              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Riwayat perkuliahan belum tersedia.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15613F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(8),
    paddingBottom: responsiveWidth(8),
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#F4F4F9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: responsiveWidth(5),
    paddingBottom: responsiveWidth(10),
  },
  centerLoading: {
    marginTop: responsiveWidth(10),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    alignItems: 'center',
  },
  statusBox: {
    backgroundColor: '#E8F5E9',
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#15613F',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.4),
    marginTop: 2,
  },
  cardInfo: {
    flex: 1,
    marginLeft: responsiveWidth(4),
  },
  matkulName: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  sksText: {
    fontWeight: 'normal',
    color: '#888',
    fontSize: responsiveFontSize(1.5),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: responsiveFontSize(1.5),
    color: '#666',
    marginLeft: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: responsiveWidth(10),
    color: '#888',
    fontSize: responsiveFontSize(1.8),
  },
});

export default HistoryPerkuliahanComponent;