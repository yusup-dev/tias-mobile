import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const MisiScreen = (props: any) => {
  const [activeTab, setActiveTab] = useState('Harian');

  const tabs = ['Harian', 'Mingguan', 'Spesial'];

  const missions = [
    {
      id: 1,
      title: 'Absensi Tepat Waktu',
      description: 'Lakukan absensi sebelum jam 08:00 selama 3 hari berturut-turut.',
      points: 50,
      progress: 2,
      total: 3,
      type: 'Harian',
      icon: 'clock-check-outline',
      color: '#4ADE80',
    },
    {
      id: 2,
      title: 'Pembaca Aktif',
      description: 'Baca 5 artikel terbaru di dashboard hari ini.',
      points: 30,
      progress: 5,
      total: 5,
      completed: true,
      type: 'Harian',
      icon: 'book-open-page-variant-outline',
      color: '#60A5FA',
    },
    {
      id: 3,
      title: 'Komentar Membangun',
      description: 'Berikan komentar pada 2 pengumuman dosen.',
      points: 20,
      progress: 1,
      total: 2,
      type: 'Harian',
      icon: 'comment-text-outline',
      color: '#FBBF24',
    },
    {
      id: 4,
      title: 'Pejuang Kuliah',
      description: 'Hadir di semua jadwal kuliah minggu ini.',
      points: 200,
      progress: 8,
      total: 12,
      type: 'Mingguan',
      icon: 'school-outline',
      color: '#A78BFA',
    },
    {
      id: 5,
      title: 'Update Profil',
      description: 'Lengkapi data kependudukan dan alamat domisili.',
      points: 100,
      progress: 1,
      total: 2,
      type: 'Spesial',
      icon: 'account-edit-outline',
      color: '#FB923C',
    },
  ];

  const filteredMissions = missions.filter(m => m.type === activeTab);

  const renderMissionItem = ({item}: {item: any}) => (
    <View style={styles.missionCard}>
      <View style={styles.missionHeader}>
        <View style={[styles.iconContainer, {backgroundColor: item.color + '20'}]}>
          <Icon name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.missionInfo}>
          <Text style={styles.missionTitle}>{item.title}</Text>
          <Text style={styles.missionPoints}>+{item.points} Points</Text>
        </View>
        {item.completed && (
          <View style={styles.completedBadge}>
            <Icon name="check-circle" size={20} color="#4ADE80" />
          </View>
        )}
      </View>
      <Text style={styles.missionDesc}>{item.description}</Text>
      
      <View style={styles.progressSection}>
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              {
                width: `${(item.progress / item.total) * 100}%`,
                backgroundColor: item.completed ? '#4ADE80' : item.color
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{item.progress}/{item.total}</Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.actionButton, 
          {backgroundColor: item.completed ? '#F3F4F6' : '#15613F'}
        ]}
        disabled={item.completed}
      >
        <Text style={[styles.actionButtonText, {color: item.completed ? '#9CA3AF' : '#FFFFFF'}]}>
          {item.completed ? 'Selesai' : 'Ambil Misi'}
        </Text>
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Misi Harian</Text>
          <View style={{width: 28}} />
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>Total Poin</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Berjalan</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredMissions}
        renderItem={renderMissionItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="clipboard-text-off-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>Belum ada misi tersedia untuk kategori ini.</Text>
          </View>
        }
      />
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(3),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingVertical: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: responsiveFontSize(1.4),
    color: '#E0F2FE',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: responsiveWidth(5),
    marginTop: -20,
    borderRadius: 15,
    padding: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTabItem: {
    backgroundColor: '#15613F',
  },
  tabText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: 30,
    paddingBottom: 40,
  },
  missionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  missionTitle: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  missionPoints: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    color: '#15613F',
    marginTop: 2,
  },
  completedBadge: {
    marginLeft: 8,
  },
  missionDesc: {
    fontSize: responsiveFontSize(1.5),
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 20,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
    color: '#4B5563',
    marginLeft: 10,
    minWidth: 35,
    textAlign: 'right',
  },
  actionButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
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
    paddingHorizontal: 40,
  },
});

export default MisiScreen;
