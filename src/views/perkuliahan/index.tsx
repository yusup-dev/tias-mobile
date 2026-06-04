import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/FontAwesome';
import { perkuliahan } from '../../services/perkuliahan/index';
import { useTokenStore } from '../../store/auth';

const PerkuliahanComponent = (props: any) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['perkuliahan'],
    queryFn: () => perkuliahan(),
  });

  const user = useTokenStore(state => state.user);
  const isParent = user?.role === 'Parent';

  let matkulList: any[] = [];
  let totalSks = 0;
  let totalMatkul = 0;

  if (isParent) {
    if (data?.data?.schedule) {
      Object.keys(data.data.schedule).forEach(day => {
        data.data.schedule[day].forEach((item: any) => {
          matkulList.push({
            npm: user?.npm,
            curr_code: item.kode,
            name: item.mataKuliah,
            sks: item.sks,
            dosen: item.dosen,
            day: `${day}, ${item.jamMulai?.substring(0, 5) ?? ''} - ${item.jamSelesai?.substring(0, 5) ?? ''} (${item.ruangan ?? ''})`
          });
        });
      });
      totalSks = data.data.totalSks || 0;
      totalMatkul = matkulList.length;
    }
  } else {
    matkulList = Array.isArray(data?.data) ? data.data : [];
    totalSks = data?.sks ?? 0;
    totalMatkul = data?.totalData ?? 0;
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perkuliahan</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => props.navigation.push('perkuliahan.history')}>
          <Icons size={20} name="history" color={'#15613F'} />
        </TouchableOpacity>
      </View>

      {/* Summary Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalSks}</Text>
          <Text style={styles.statLabel}>Total SKS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalMatkul}</Text>
          <Text style={styles.statLabel}>Mata Kuliah</Text>
        </View>
      </View>

      {/* Bottom Sheet List Section */}
      <View style={styles.bottomSheet}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#15613F" style={styles.centerLoading} />
          ) : isError ? (
            <Text style={styles.emptyText}>Gagal memuat data perkuliahan. Coba lagi nanti.</Text>
          ) : matkulList.length ? (
            matkulList.map((list: any, index: number) => (
              <TouchableOpacity
                key={`${index}-perkuliahan-${list.curr_code}`}
                style={styles.card}
                disabled={!isParent}
                onPress={() => {
                  if (isParent) {
                    props.navigation.navigate('perkuliahan.detail-absensi', {
                      npm: list.npm,
                      kodeMatkul: list.curr_code,
                      namaMatkul: list.name,
                    });
                  }
                }}>

                {/* Kode Matkul / Avatar Box */}
                <View style={styles.avatarBox}>
                  <Text style={styles.avatarText}>{list.curr_code}</Text>
                </View>

                {/* Detail Matkul */}
                <View style={styles.cardInfo}>
                  <Text style={styles.matkulName} numberOfLines={2}>
                    {list.name} <Text style={styles.sksText}>({list.sks} SKS)</Text>
                  </Text>

                  <View style={styles.detailRow}>
                    <Icons name="user" size={12} color="#666" />
                    <Text style={styles.detailText} numberOfLines={1}>{list.dosen}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Icons name="calendar" size={12} color="#666" />
                    <Text style={styles.detailText}>{list.day}</Text>
                  </View>
                </View>

                {isParent && (
                  <View style={styles.chevronBox}>
                    <Icons name="chevron-right" size={16} color="#15613F" />
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>Data perkuliahan belum tersedia.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15613F', // Hijau Utama
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveWidth(8),
    paddingBottom: responsiveWidth(4),
  },
  headerTitle: {
    color: 'white',
    fontSize: responsiveFontSize(3.2),
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveWidth(6),
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: responsiveWidth(6),
    borderRadius: 16,
    paddingVertical: 15,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statNumber: {
    color: 'white',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#E2E8F0',
    fontSize: responsiveFontSize(1.4),
    marginTop: 4,
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
    elevation: 3, // Shadow Android
    shadowColor: '#000', // Shadow iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatarBox: {
    backgroundColor: '#E8F5E9', // Hijau pudar
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#15613F',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.6),
    textAlign: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: responsiveWidth(4),
    justifyContent: 'center',
  },
  matkulName: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  sksText: {
    fontWeight: 'normal',
    color: '#888',
    fontSize: responsiveFontSize(1.6),
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
  chevronBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default PerkuliahanComponent;