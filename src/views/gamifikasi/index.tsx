import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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

const getBadgeInfo = (totalPoint: number) => {
  if (totalPoint >= 10000) {
    return {
      rank: 'Legend',
      badge: require('../../../assets/lencana/lencana_legend.png'),
    };
  } else if (totalPoint >= 7500) {
    return {
      rank: 'Superior',
      badge: require('../../../assets/lencana/lencana_superior.png'),
    };
  } else if (totalPoint >= 5400) {
    return {
      rank: 'Specialist',
      badge: require('../../../assets/lencana/lencana_spesialist.png'),
    };
  } else if (totalPoint >= 3900) {
    return {
      rank: 'Professional',
      badge: require('../../../assets/lencana/lencana_professional.png'),
    };
  } else if (totalPoint >= 2400) {
    return {
      rank: 'Proficient',
      badge: require('../../../assets/lencana/lencana_proficient.png'),
    };
  } else if (totalPoint >= 1100) {
    return {
      rank: 'Qualified',
      badge: require('../../../assets/lencana/lencana_qualified.png'),
    };
  }
  return {
    rank: 'Novice',
    badge: require('../../../assets/lencana/lencana_novice.png'),
  };
};

// --- KOMPONEN LIST STATISTIK ---
const ListStatistik = ({ data, navigation }: { data: any; navigation: any }) => {
  const stats = [
    { id: 1, label: 'Pendidikan', value: data?.data?.point_pendidikan, color: '#4ADE80', route: 'home.pendidikan' },
    { id: 2, label: 'Penelitian', value: data?.data?.point_penelitian, color: '#F472B6', route: 'home.penelitian' },
    { id: 3, label: 'Pengabdian', value: data?.data?.point_pengabdian, color: '#FBBF24', route: 'home.pengabdian' },
    { id: 4, label: 'Kompetensi', value: data?.data?.point_kompetensi, color: '#A78BFA', route: 'home.kompetensi' },
    { id: 5, label: 'Penunjang', value: data?.data?.point_penunjang, color: '#FB923C', route: 'home.penunjang' },
    { id: 6, label: 'Rekomendasi', value: data?.data?.point_rekomendasi, color: '#38BDF8', route: 'gamifikasi.leaderboard' },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.statistikContainer}
      showsHorizontalScrollIndicator={false}
      horizontal={true}>
      {stats.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.8}
          onPress={() => {
            if (navigation && item.route) {
              navigation.navigate(item.route);
            }
          }}
          style={styles.statistikCard}>
          <Text style={styles.statistikValue}>
            {item.value ? ribuanCast(item.value) : 0}
          </Text>
          <Text style={styles.statistikLabel}>{item.label}</Text>
          <View style={[styles.statistikProgress, { backgroundColor: item.color }]} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// --- KOMPONEN UTAMA GAMIFIKASI ---
const Gamifikasi = (props: any) => {
  const { data, isError, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profile(),
  });

  useEffect(() => {
    if (isError) {
      console.log({ result: error });
    }
  }, [isError, error]);

  const totalPoint = data?.data?.total_point || 0;
  const badgeInfo = useMemo(() => getBadgeInfo(totalPoint), [totalPoint]);

  const listKategori = [
    {
      id: 1,
      title: 'Pencapaian',
      deskripsi: 'Lihat progres & hadiah',
      width: responsiveWidth(43),
      height: responsiveHeight(26),
      backgroundColor: '#FEF3C7',
      image: require('../../../assets/lencana/icon-pencapaian.png'),
      route: 'gamifikasi.pencapaian',
    },
    {
      id: 2,
      title: 'Misi',
      deskripsi: 'Tugas & tantangan',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#E0F2FE',
      image: require('../../../assets/lencana/icon-misi.png'),
      route: 'gamifikasi.misi',
    },
    {
      id: 3,
      title: 'Leaderboard',
      deskripsi: 'Papan peringkat',
      width: responsiveWidth(43),
      height: responsiveHeight(22),
      backgroundColor: '#E0F2FE',
      image: require('../../../assets/lencana/icon-papan-peringkat.png'),
      route: 'gamifikasi.leaderboard',
    },
    {
      id: 4,
      title: 'Statistik',
      deskripsi: 'Grafik IPK & Poin',
      width: responsiveWidth(43),
      height: responsiveHeight(24),
      backgroundColor: '#F3E8FF',
      image: require('../../../assets/lencana/icon-statistik.png'),
      route: 'gamifikasi.statistik',
    },
    {
      id: 5,
      title: 'Aktivitas',
      deskripsi: 'Log kehadiran',
      width: responsiveWidth(43),
      height: responsiveHeight(22),
      backgroundColor: '#FEF3C7',
      image: require('../../../assets/lencana/icon-aktivitas.png'),
      route: 'gamifikasi.aktivitas',
    },
    {
      id: 6,
      title: 'Ulasan',
      deskripsi: 'Beri penilaian',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#FEE2E2',
      image: require('../../../assets/lencana/icon-ulasan.png'),
      route: 'profile.beri-nilai',
    },
  ];

  const handlePressKategori = (item: any) => {
    if (item.route) {
      props.navigation.navigate(item.route);
    }
  };

  return (
    <ScrollView style={styles.rootContainer} showsVerticalScrollIndicator={false}>
      {/* Header Gradient */}
      <LinearGradient colors={['#15613F', '#BAEED7']} style={styles.headerGradient} />

      {/* Profil Banner Card (Overlapping Header) */}
      <View style={styles.profileBanner}>
        <View style={styles.profileInfo}>
          <Image
            style={styles.profileAvatar}
            source={
              data?.data?.image
                ? { uri: data?.data?.image }
                : require('../../../assets/login/logo_uika.png')
            }
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileRank}>{badgeInfo.rank}</Text>
            <Text style={styles.profileScore}>
              {totalPoint ? ribuanCast(totalPoint) : 0} UCL Score
            </Text>
          </View>
        </View>
        <Image
          style={styles.profileBadge}
          source={badgeInfo.badge}
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
            <Text style={styles.clubSubtitle}>Program loyalitas eksklusif UCL</Text>
          </View>

          <TouchableOpacity
            style={styles.clubButton}
            onPress={() => props.navigation.navigate('profile.tias-club')}
          >
            <Text style={styles.clubButtonText}>Buka Club</Text>
          </TouchableOpacity>
        </View>

        {/* Statistik Horizontal */}
        <ListStatistik data={data} navigation={props.navigation} />

        {/* Kategori Staggered Grid */}
        <View style={styles.kategoriSection}>
          <Text style={styles.sectionTitle}>UCL Kategori Gamifikasi</Text>

          <StaggeredList
            data={listKategori}
            animationType={'FADE_IN_FAST'}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePressKategori(item)}
                style={[styles.kategoriCard, { width: item.width, height: item.height, backgroundColor: item.backgroundColor }]}>
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
    backgroundColor: '#1E293B',
    marginHorizontal: responsiveWidth(5),
    marginTop: -responsiveHeight(7),
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
    flex: 1,
  },
  profileAvatar: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    backgroundColor: 'white',
  },
  profileTextContainer: {
    marginLeft: responsiveWidth(3),
    flex: 1,
  },
  profileRank: {
    color: '#FBBF24',
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
    fontSize: responsiveFontSize(1.4),
    color: '#6B7280',
    marginTop: 4,
  },
  clubButton: {
    backgroundColor: '#15613F',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2.5),
    borderRadius: 10,
  },
  clubButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.4),
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
    fontSize: responsiveFontSize(2.2),
    color: '#1F2937',
  },
  statistikLabel: {
    marginTop: 4,
    fontSize: responsiveFontSize(1.4),
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
    fontSize: responsiveFontSize(2),
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
    fontSize: responsiveFontSize(1.8),
    color: '#1F2937',
  },
  kategoriDesc: {
    fontSize: responsiveFontSize(1.3),
    color: '#4B5563',
    marginTop: 2,
  },
});

export default Gamifikasi;
