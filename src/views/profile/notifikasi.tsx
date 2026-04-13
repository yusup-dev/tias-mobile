import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Switch,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotifikasiScreen = (props: any) => {
  const [settings, setSettings] = useState({
    absensi: true,
    ujian: true,
    pengumuman: true,
    jadwal: false,
    promo: false,
    suara: true,
    getar: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({...prev, [key]: !prev[key]}));
  };

  const notifCategories = [
    {
      title: 'Akademik',
      items: [
        {key: 'absensi' as const, label: 'Absensi', desc: 'Notifikasi saat absensi dibuka', icon: 'qrcode-scan', color: '#10B981'},
        {key: 'ujian' as const, label: 'Ujian CBT', desc: 'Pengingat ujian dan hasil nilai', icon: 'clipboard-text', color: '#3B82F6'},
        {key: 'pengumuman' as const, label: 'Pengumuman', desc: 'Info penting dari kampus', icon: 'bullhorn', color: '#F59E0B'},
        {key: 'jadwal' as const, label: 'Perubahan Jadwal', desc: 'Notif saat jadwal kuliah berubah', icon: 'calendar-alert', color: '#8B5CF6'},
      ],
    },
    {
      title: 'Lainnya',
      items: [
        {key: 'promo' as const, label: 'Info & Event', desc: 'Event kampus dan kegiatan', icon: 'party-popper', color: '#EF4444'},
      ],
    },
  ];

  const soundVibrate = [
    {key: 'suara' as const, label: 'Suara Notifikasi', icon: 'volume-high', color: '#15613F'},
    {key: 'getar' as const, label: 'Getaran', icon: 'vibrate', color: '#15613F'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Categories */}
        {notifCategories.map(category => (
          <View key={category.title}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            <View style={styles.cardGroup}>
              {category.items.map((item, index) => (
                <View
                  key={item.key}
                  style={[
                    styles.settingRow,
                    index !== category.items.length - 1 && styles.rowBorder,
                  ]}>
                  <View style={[styles.iconBox, {backgroundColor: item.color + '15'}]}>
                    <Icon name={item.icon} size={20} color={item.color} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingDesc}>{item.desc}</Text>
                  </View>
                  <Switch
                    value={settings[item.key]}
                    onValueChange={() => toggleSetting(item.key)}
                    trackColor={{false: '#E5E7EB', true: '#86EFAC'}}
                    thumbColor={settings[item.key] ? '#15613F' : '#FFF'}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Sound & Vibration */}
        <Text style={styles.sectionTitle}>Suara & Getaran</Text>
        <View style={styles.cardGroup}>
          {soundVibrate.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.settingRow,
                index !== soundVibrate.length - 1 && styles.rowBorder,
              ]}>
              <View style={[styles.iconBox, {backgroundColor: '#ECFDF5'}]}>
                <Icon name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <Switch
                value={settings[item.key]}
                onValueChange={() => toggleSetting(item.key)}
                trackColor={{false: '#E5E7EB', true: '#86EFAC'}}
                thumbColor={settings[item.key] ? '#15613F' : '#FFF'}
              />
            </View>
          ))}
        </View>

        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F3F4F6'},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4), paddingTop: responsiveWidth(6), paddingBottom: responsiveWidth(4),
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  backBtn: {padding: 4},
  headerTitle: {fontSize: responsiveFontSize(2.2), fontWeight: 'bold', color: '#1F2937'},
  scrollContent: {paddingHorizontal: responsiveWidth(5), paddingTop: responsiveWidth(2)},
  sectionTitle: {
    fontSize: responsiveFontSize(1.7), fontWeight: 'bold', color: '#4B5563',
    marginBottom: responsiveWidth(2), marginTop: responsiveWidth(5), marginLeft: responsiveWidth(1),
  },
  cardGroup: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 4,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: responsiveWidth(3), paddingHorizontal: responsiveWidth(4),
  },
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: responsiveWidth(3),
  },
  settingContent: {flex: 1},
  settingLabel: {fontSize: responsiveFontSize(1.7), color: '#1F2937', fontWeight: '600'},
  settingDesc: {fontSize: responsiveFontSize(1.3), color: '#9CA3AF', marginTop: 2},
});

export default NotifikasiScreen;
