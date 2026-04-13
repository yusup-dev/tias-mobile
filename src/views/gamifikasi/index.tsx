import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import { ribuanCast } from '../../helper/ribuan';
import { profile } from '../../services/auth/profile';
import StaggeredList from '@mindinventory/react-native-stagger-view';
import LinearGradient from 'react-native-linear-gradient';

// --- KOMPONEN LIST STATISTIK ---
const ListStatistik = ({ data }: { data: any }) => {
  // Menggunakan array untuk mempersingkat kode agar tidak berulang
  const stats = [
    { id: 1, label: 'Pendidikan', value: data?.data?.point_pendidikan, color: '#4ADE80' }, // Hijau
    { id: 2, label: 'Publikasi', value: data?.data?.point_publikasi, color: '#60A5FA' }, // Biru
    { id: 3, label: 'Penelitian', value: data?.data?.point_penelitian, color: '#F472B6' }, // Merah Muda
    { id: 4, label: 'Pengabdian', value: data?.data?.point_pengabdian, color: '#FBBF24' }, // Kuning
    { id: 5, label: 'Kompetensi', value: data?.data?.point_kompetensi, color: '#A78BFA' }, // Ungu
    { id: 6, label: 'Penunjang', value: data?.data?.point_penunjang, color: '#FB923C' }, // Oranye
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.statistikContainer}
      showsHorizontalScrollIndicator={false}
      horizontal={true}>
      {stats.map((item) => (
        <View key={item.id} style={styles.statistikCard}>
          <Text style={styles.statistikValue}>
            {item.value ? ribuanCast(item.value) : 0}
          </Text>
          <Text style={styles.statistikLabel}>{item.label}</Text>
          <View style={[styles.statistikProgress, { backgroundColor: item.color }]} />
        </View>
      ))}
    </ScrollView>
  );
};

// --- KOMPONEN UTAMA GAMIFIKASI ---
const Gamifikasi = () => {
  const { data, isSuccess, isError, error }: { data: any; isSuccess: boolean; isError: boolean; error: any } = useQuery({
    queryKey: ['profile', {}],
    queryFn: () => profile(),
  });

  useEffect(() => {
    if (isError) {
      console.log({ result: error });
    }
  }, [isError, error]);

  const [listKategori] = useState([
    {
      id: 1,
      title: 'Lencana',
      deskripsi: 'Koleksi semua lencana',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#FEE2E2', // Merah muda pastel
      image: require('../../../assets/lencana/icon-lencana.png'),
    },
    {
      id: 2,
      title: 'Pencapaian',
      deskripsi: 'Lihat progresmu',
      width: responsiveWidth(43),
      height: responsiveHeight(28),
      backgroundColor: '#FEF3C7', // Kuning pastel
      image: require('../../../assets/lencana/icon-acara.png'),
    },
    {
      id: 3,
      title: 'Misi',
      deskripsi: 'Selesaikan tugas harian',
      width: responsiveWidth(43),
      height: responsiveHeight(22),
      backgroundColor: '#E0F2FE', // Biru pastel
      image: require('../../../assets/lencana/icon-misi.png'),
    },
    {
      id: 4,
      title: 'Acara',
      deskripsi: 'Ikuti event spesial',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#F3E8FF', // Ungu pastel
      image: require('../../../assets/lencana/icon-acara.png'),
    },
    {
      id: 5,
      title: 'Aktivitas',
      deskripsi: 'Log aktivitas terbaru',
      width: responsiveWidth(43),
      height: responsiveHeight(24),
      backgroundColor: '#FEF3C7',
      image: require('../../../assets/lencana/icon-aktivitas.png'),
    },
    {
      id: 6,
      title: 'Ulasan',
      deskripsi: 'Beri penilaian',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#FEE2E2',
      image: require('../../../assets/lencana/icon-ulasan.png'),
    },
    {
      id: 7,
      title: 'Statistik',
      deskripsi: 'Analisis performamu',
      width: responsiveWidth(43),
      height: responsiveHeight(22),
      backgroundColor: '#F3E8FF',
      image: require('../../../assets/lencana/icon-statistik.png'),
    },
    {
      id: 8,
      title: 'Leaderboard',
      deskripsi: 'Papan peringkat global',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#E0F2FE',
      image: require('../../../assets/lencana/icon-papan-peringkat.png'),
    },
  ]);

  return (
    <ScrollView style={styles.rootContainer} showsVerticalScrollIndicator={false}>
      
      {/* Header Gradient */}
      <LinearGradient colors={['#15613F', '#BAEED7']} style={styles.headerGradient} />

      {/* Profil Banner Card (Overlapping Header) */}
      <View style={styles.profileBanner}>
        <View style={styles.profileInfo}>
          <Image
            style={styles.profileAvatar}
            source={require('../../../assets/login/logo_uika.png')}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileRank}>{data?.data?.rank || 'Level 1'}</Text>
            <Text style={styles.profileScore}>
              {data?.data?.total_point ? ribuanCast(data?.data?.total_point) : 0} TIAS Score avg
            </Text>
          </View>
        </View>
        <Image
          style={styles.profileBadge}
          source={require('../../../assets/lencana/lencana_novice.png')}
        />
      </View>

      <View style={styles.contentContainer}>
        
        {/* UCL Club Banner */}
        <View style={styles.clubCard}>
          <View style={styles.clubInfo}>
            <View style={styles.clubHeaderRow}>
              <Image source={require('../../../assets/login/mdi_shield-star.png')} style={styles.clubIcon} />
              <Text style={styles.clubTitle}>UCL Club</Text>
            </View>
            <Text style={styles.clubSubtitle}>Program loyalitas eksklusif TIAS</Text>
          </View>
          
          <TouchableOpacity style={styles.clubButton}>
            <Text style={styles.clubButtonText}>Ikuti Gratis</Text>
          </TouchableOpacity>
        </View>

        {/* Statistik Horizontal */}
        <ListStatistik data={data} />

        {/* Kategori Staggered Grid */}
        <View style={styles.kategoriSection}>
          <Text style={styles.sectionTitle}>Tias Kategori</Text>
          
          <StaggeredList
            data={listKategori}
            animationType={'FADE_IN_FAST'}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // Dimatikan karena sudah di dalam ScrollView utama
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity activeOpacity={0.8} style={[styles.kategoriCard, { width: item.width, height: item.height, backgroundColor: item.backgroundColor }]}>
                <Image source={item.image} style={styles.kategoriImage} resizeMode="contain" />
                <View>
                  <Text style={styles.kategoriTitle}>{item.title}</Text>
                  <Text style={styles.kategoriDesc}>{item.deskripsi}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerGradient: {
    height: responsiveHeight(15),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Warna gelap agar kontras dengan avatar dan lencana
    marginHorizontal: responsiveWidth(5),
    marginTop: -responsiveHeight(7), // Overlapping gradient
    borderRadius: 20,
    padding: responsiveWidth(5),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    backgroundColor: 'white', // Jika logo transparan
  },
  profileTextContainer: {
    marginLeft: responsiveWidth(3),
  },
  profileRank: {
    color: '#FBBF24', // Warna emas/kuning untuk rank
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.2),
  },
  profileScore: {
    color: '#E2E8F0',
    fontSize: responsiveFontSize(1.5),
    marginTop: 2,
  },
  profileBadge: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    resizeMode: 'contain',
  },
  contentContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(6),
  },
  clubCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: responsiveWidth(4),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  clubInfo: {
    flex: 1,
  },
  clubHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  clubTitle: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
    color: '#1F2937',
    marginLeft: 6,
  },
  clubSubtitle: {
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    marginTop: 4,
  },
  clubButton: {
    backgroundColor: '#15613F', // Hijau UIKA
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2.5),
    borderRadius: 10,
  },
  clubButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.5),
  },
  statistikContainer: {
    flexDirection: 'row',
    marginTop: responsiveWidth(6),
    paddingBottom: responsiveWidth(2),
  },
  statistikCard: {
    width: responsiveWidth(32),
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: responsiveWidth(3),
    marginRight: responsiveWidth(3),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statistikValue: {
    fontWeight: '900',
    fontSize: responsiveFontSize(2.4),
    color: '#1F2937',
  },
  statistikLabel: {
    marginTop: 4,
    fontSize: responsiveFontSize(1.6),
    color: '#6B7280',
    fontWeight: '500',
  },
  statistikProgress: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  kategoriSection: {
    marginTop: responsiveWidth(6),
    paddingBottom: responsiveWidth(10),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: responsiveWidth(3),
  },
  kategoriCard: {
    borderRadius: 20,
    padding: responsiveWidth(4),
    justifyContent: 'space-between',
    marginBottom: responsiveWidth(4),
    elevation: 1,
  },
  kategoriImage: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    alignSelf: 'flex-end',
  },
  kategoriTitle: {
    fontWeight: '800',
    fontSize: responsiveFontSize(2),
    color: '#1F2937',
  },
  kategoriDesc: {
    fontSize: responsiveFontSize(1.4),
    color: '#4B5563',
    marginTop: 2,
  },
});

export default Gamifikasi;