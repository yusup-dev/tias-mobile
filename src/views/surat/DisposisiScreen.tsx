import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { submitDisposisi, SuratItem } from '../../services/surat/index';

const INSTRUKSI_OPTIONS = [
  'Tindak Lanjuti & Selesaikan',
  'Hadir Mewakili',
  'Pelajari & Beri Tanggapan',
  'Koordinasikan dengan Tim Terkait',
  'Arsipkan / Untuk Diketahui',
];

const TARGET_DOSEN_LIST = [
  'Sekretaris Program Studi',
  'Koordinator Kurikulum & Akademik',
  'Koordinator Kerja Praktik & MBKM',
  'Koordinator Skripsi / Tugas Akhir',
  'Kepala Laboratorium Komputer & Jaringan',
  'Seluruh Dosen Pengampu Mata Kuliah',
];

const DisposisiScreen = (props: any) => {
  const surat: SuratItem = props.route?.params?.surat || {};

  const [selectedTarget, setSelectedTarget] = useState(TARGET_DOSEN_LIST[0]);
  const [selectedInstruksi, setSelectedInstruksi] = useState(INSTRUKSI_OPTIONS[0]);
  const [catatan, setCatatan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!catatan.trim()) {
      Alert.alert('Perhatian', 'Harap isi catatan / instruksi disposisi terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitDisposisi({
        surat_id: surat.id,
        tujuan_disposisi: selectedTarget,
        instruksi: selectedInstruksi,
        catatan: catatan.trim(),
      });

      Alert.alert(
        'Berhasil',
        'Disposisi surat berhasil diteruskan kepada ' + selectedTarget,
        [
          {
            text: 'OK',
            onPress: () => {
              props.navigation.goBack();
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'Gagal mengirim disposisi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#15613F', '#2D9C6B']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Form Disposisi</Text>
          <View style={{ width: 28 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Surat Singkat */}
        <View style={styles.suratInfoBox}>
          <Text style={styles.suratNoText}>{surat.no_surat}</Text>
          <Text style={styles.suratPerihalText} numberOfLines={2}>{surat.perihal}</Text>
        </View>

        {/* Target Disposisi */}
        <Text style={styles.fieldLabel}>Diteruskan Kepada</Text>
        <View style={styles.optionsContainer}>
          {TARGET_DOSEN_LIST.map((target, idx) => {
            const isSelected = selectedTarget === target;
            return (
              <TouchableOpacity
                key={`target-${idx}`}
                style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                onPress={() => setSelectedTarget(target)}
              >
                <Icon
                  name={isSelected ? 'account-check' : 'account-outline'}
                  size={18}
                  color={isSelected ? '#FFF' : '#4B5563'}
                />
                <Text style={[styles.optionChipText, isSelected && styles.optionChipTextSelected]}>
                  {target}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Pilihan Instruksi / Tindak Lanjut */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Instruksi / Tindak Lanjut</Text>
        <View style={styles.optionsContainer}>
          {INSTRUKSI_OPTIONS.map((inst, idx) => {
            const isSelected = selectedInstruksi === inst;
            return (
              <TouchableOpacity
                key={`inst-${idx}`}
                style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                onPress={() => setSelectedInstruksi(inst)}
              >
                <Icon
                  name={isSelected ? 'check-circle' : 'circle-outline'}
                  size={16}
                  color={isSelected ? '#FFF' : '#4B5563'}
                />
                <Text style={[styles.optionChipText, isSelected && styles.optionChipTextSelected]}>
                  {inst}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Catatan Disposisi */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Catatan Tambahan</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Tulis catatan instruksi atau arahan khusus untuk penerima disposisi..."
          placeholderTextColor="#9CA3AF"
          value={catatan}
          onChangeText={setCatatan}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.btnSubmit, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Icon name="send" size={20} color="#FFF" />
              <Text style={styles.btnSubmitText}>Kirim Disposisi</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    padding: responsiveWidth(5),
    paddingTop: 20,
    paddingBottom: 40,
  },
  suratInfoBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  suratNoText: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: 'bold',
    color: '#15613F',
    marginBottom: 4,
  },
  suratPerihalText: {
    fontSize: responsiveFontSize(1.5),
    color: '#1F2937',
    fontWeight: '600',
    lineHeight: 20,
  },
  fieldLabel: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  optionChipSelected: {
    backgroundColor: '#15613F',
    borderColor: '#15613F',
  },
  optionChipText: {
    fontSize: responsiveFontSize(1.3),
    color: '#4B5563',
    marginLeft: 6,
    fontWeight: '500',
  },
  optionChipTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  textArea: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 14,
    fontSize: responsiveFontSize(1.4),
    color: '#1F2937',
    minHeight: 110,
    textAlignVertical: 'top',
  },
  btnSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15613F',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnSubmitText: {
    color: '#FFF',
    fontSize: responsiveFontSize(1.6),
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DisposisiScreen;
