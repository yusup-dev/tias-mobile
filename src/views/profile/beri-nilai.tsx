import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BeriNilaiScreen = (props: any) => {
  const handleRate = (type: 'playstore' | 'feedback') => {
    if (type === 'playstore') {
      // Ganti dengan package name aplikasi yang benar
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.tias';
      Linking.canOpenURL(playStoreUrl).then(supported => {
        if (supported) {
          Linking.openURL(playStoreUrl);
        } else {
          Alert.alert('Info', 'Tidak dapat membuka Play Store. Silakan buka secara manual.');
        }
      });
    } else {
      Alert.alert(
        'Terima Kasih! 🎉',
        'Feedback Anda sangat berarti bagi kami untuk terus meningkatkan aplikasi TIAS.',
      );
    }
  };

  const features = [
    {icon: 'star', label: 'Rating di Play Store', color: '#F59E0B'},
    {icon: 'comment-text', label: 'Tulis Ulasan', color: '#3B82F6'},
    {icon: 'share-variant', label: 'Bagikan ke Teman', color: '#10B981'},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beri Kami Nilai</Text>
        <View style={{width: 28}} />
      </View>

      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustration}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>⭐</Text>
          </View>
        </View>

        <Text style={styles.title}>Suka dengan TIAS?</Text>
        <Text style={styles.subtitle}>
          Bantu kami berkembang dengan memberikan rating dan ulasan di Play Store. Setiap bintang sangat berarti! 🙏
        </Text>

        {/* Star Display */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <Icon key={star} name="star" size={40} color="#F59E0B" />
          ))}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => handleRate('playstore')}>
          <Icon name="google-play" size={22} color="#FFF" />
          <Text style={styles.primaryBtnText}>Beri Rating di Play Store</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => {
            const shareUrl = 'https://play.google.com/store/apps/details?id=com.tias';
            Linking.openURL(`https://wa.me/?text=Yuk coba aplikasi TIAS buat kegiatan kampus! ${shareUrl}`);
          }}>
          <Icon name="share-variant" size={20} color="#15613F" />
          <Text style={styles.secondaryBtnText}>Bagikan ke Teman</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>TIAS v2.0.0</Text>
          <Text style={styles.versionSub}>Dibuat dengan ❤️ oleh Tim IT FT UIKA</Text>
        </View>
      </View>
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
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: responsiveWidth(8),
  },
  illustration: {marginBottom: 20},
  emojiCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFFBEB',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#FEF3C7',
  },
  emoji: {fontSize: 46},
  title: {
    fontSize: responsiveFontSize(2.8), fontWeight: 'bold', color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: responsiveFontSize(1.5), color: '#6B7280', textAlign: 'center',
    lineHeight: 22, marginBottom: 24,
  },
  starsRow: {
    flexDirection: 'row', gap: 8, marginBottom: 32,
  },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#15613F', width: '100%', paddingVertical: 16, borderRadius: 14,
    elevation: 3, shadowColor: '#15613F', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.3, shadowRadius: 4,
    marginBottom: 12,
  },
  primaryBtnText: {color: '#FFFFFF', fontSize: responsiveFontSize(1.7), fontWeight: 'bold'},
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#FFFFFF', width: '100%', paddingVertical: 16, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  secondaryBtnText: {color: '#15613F', fontSize: responsiveFontSize(1.7), fontWeight: 'bold'},
  versionContainer: {alignItems: 'center', marginTop: 40},
  versionText: {fontSize: responsiveFontSize(1.4), color: '#9CA3AF', fontWeight: '600'},
  versionSub: {fontSize: responsiveFontSize(1.2), color: '#D1D5DB', marginTop: 2},
});

export default BeriNilaiScreen;
