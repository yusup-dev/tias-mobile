import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useTokenStore } from '../../store/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = (props: any) => {
  const { auth, user, setAuthentication, setToken, setUser, setRememberMe } = useTokenStore();
  
  const [listProfile] = useState([
    { id: 1, name: 'Kependudukan', icon: 'account-group', action: () => props.navigation.push('profile.kependudukan') },
    { id: 2, name: 'Alamat', icon: 'card-account-details-outline', action: () => props.navigation.push('profile.alamat') },
    { id: 3, name: 'Tias Club', icon: 'star-outline', action: () => props.navigation.push('profile.tias-club') },
    { id: 4, name: 'Tias Signature', icon: 'draw-pen', action: () => props.navigation.push('profile.signature') },
    { id: 5, name: 'Bantuan & Laporan Saya', icon: 'help-circle-outline', action: () => props.navigation.push('profile.bantuan') },
    { id: 6, name: 'Notifikasi', icon: 'bell-outline', action: () => props.navigation.push('profile.notifikasi') },
    { id: 7, name: 'Pengaturan Akun', icon: 'cog-outline', action: () => props.navigation.push('profile.pengaturan-akun') },
  ]);

  const [listProfile2] = useState([
    { id: 8, name: 'Kebijakan Privasi', icon: 'shield-alert-outline', action: () => props.navigation.push('profile.kebijakan-privasi') },
    { id: 9, name: 'Beri Kami Nilai', icon: 'party-popper', action: () => props.navigation.push('profile.beri-nilai') },
    { id: 10, name: 'Logout', icon: 'logout', action: () => {
        setUser({});
        setToken('');
        setRememberMe(false);
        setAuthentication(false);
        console.log('test logout');
      }
    },
  ]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Panel */}
      <View style={styles.headerPanel}>
        <Text style={styles.headerTitle}>Profil Saya</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userInfoRow}>
          {/* Avatar Lingkaran */}
          <View style={styles.avatar}>
            <Icon name="account" size={32} color="#FFF" />
          </View>
          <View style={styles.userData}>
            <Text style={styles.userName}>{user?.nama_lengkap || 'Pengguna'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => props.navigation.push('profile.signature')}>
            <Icon name="pencil-outline" size={20} color="#6A5BE2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Group 1: Akun */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Akun</Text>
        <View style={styles.menuGroup}>
          {listProfile.map((list: any, index: number) => (
            <TouchableOpacity
              onPress={() => list.action()}
              key={`${list.id}-list`}
              style={[styles.menuItem, index !== listProfile.length - 1 && styles.borderBottom]}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconWrapper}>
                  <Icon name={list.icon} size={22} color="#4B5563" />
                </View>
                <Text style={styles.menuText}>{list.name}</Text>
              </View>
              <Icon name={'chevron-right'} size={24} color="#C1C1C4" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Menu Group 2: Info Lainnya */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Info Lainnya</Text>
        <View style={styles.menuGroup}>
          {listProfile2.map((list: any, index: number) => (
            <TouchableOpacity
              onPress={() => list.action()}
              key={`${list.id}-list`}
              style={[styles.menuItem, index !== listProfile2.length - 1 && styles.borderBottom]}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconWrapper, list.name === 'Logout' && styles.iconWrapperLogout]}>
                  <Icon name={list.icon} size={22} color={list.name === 'Logout' ? '#EF4444' : '#4B5563'} />
                </View>
                <Text style={[styles.menuText, list.name === 'Logout' && styles.menuTextLogout]}>
                  {list.name}
                </Text>
              </View>
              {list.name !== 'Logout' && <Icon name={'chevron-right'} size={24} color="#C1C1C4" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Padding Bawah agar tidak mentok saat di-scroll */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Latar abu-abu sangat muda khas iOS
  },
  headerPanel: {
    backgroundColor: '#15613F', // Warna ungu utama
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(12), // Sesuaikan jika ada notch
    paddingBottom: responsiveWidth(16), // Space lebih untuk efek tumpukan card
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: 'bold',
    color: 'white',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: responsiveWidth(5),
    marginTop: -responsiveWidth(8), // Efek card menimpa header
    borderRadius: 16,
    padding: responsiveWidth(4),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    backgroundColor: '#15613F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userData: {
    flex: 1,
    marginLeft: responsiveWidth(4),
  },
  userName: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: responsiveFontSize(1.6),
    color: '#6B7280',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  sectionContainer: {
    marginTop: responsiveWidth(6),
    paddingHorizontal: responsiveWidth(5),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: responsiveWidth(3),
    marginLeft: responsiveWidth(1),
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveWidth(3.5),
    paddingHorizontal: responsiveWidth(4),
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperLogout: {
    backgroundColor: '#FEE2E2', // Merah muda untuk logout
  },
  menuText: {
    fontSize: responsiveFontSize(1.9),
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: responsiveWidth(3),
  },
  menuTextLogout: {
    color: '#EF4444', // Merah untuk teks logout
    fontWeight: 'bold',
  },
});

export default ProfileScreen;