import React, { useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Signature from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SignaturePage = (props: any) => {
  const ref: any = useRef();

  const handleSignature = (signature: any) => {
    console.log('Tanda tangan base64:', signature); // base64 string
    // TODO: Kirim data signature ke API atau state
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleEnd = () => {
    ref.current.readSignature(); // Membaca tanda tangan saat selesai
  };

  return (
    <View style={styles.container}>
      {/* Header Navigasi */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.backButton}>
          <Icon name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tanda Tangan Digital</Text>
      </View>

      {/* Area Instruksi */}
      <View style={styles.instructionContainer}>
        <Icon name="draw-pen" size={24} color="#6A5BE2" />
        <Text style={styles.instructionText}>
          Silakan gambar tanda tangan Anda di dalam kotak putih di bawah ini.
        </Text>
      </View>

      {/* Area Kanvas Tanda Tangan */}
      <View style={styles.canvasContainer}>
        <Signature
          ref={ref}
          onOK={handleSignature}
          onEmpty={() => console.log('Kosong')}
          onClear={handleClear}
          onEnd={handleEnd}
          descriptionText=""
          clearText="Hapus"
          confirmText="Simpan"
          webStyle={`
            .m-signature-pad {
              border: none;
              box-shadow: none;
              background-color: transparent;
            }
            .m-signature-pad--body {
              border: none;
            }
            .m-signature-pad--footer {
              display: none;
              margin: 0px;
            }
          `}
        />
      </View>

      {/* Area Tombol Aksi */}
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={handleClear} style={styles.btnCancel}>
          <Icon name="eraser" size={20} color="#EF4444" style={styles.btnIcon} />
          <Text style={styles.btnCancelText}>Hapus Ulang</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => ref.current.readSignature()} style={styles.btnSave}>
          <Icon name="check" size={20} color="#FFF" style={styles.btnIcon} />
          <Text style={styles.btnSaveText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Seragam dengan latar aplikasi
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveWidth(6),
    paddingBottom: responsiveWidth(4),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(6),
    marginTop: responsiveWidth(6),
    marginBottom: responsiveWidth(4),
  },
  instructionText: {
    marginLeft: 10,
    fontSize: responsiveFontSize(1.7),
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  canvasContainer: {
    width: responsiveWidth(90),
    height: responsiveHeight(45),
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveWidth(8),
  },
  btnIcon: {
    marginRight: 6,
  },
  btnCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(6.5),
    backgroundColor: '#FEE2E2', // Merah pudar
    borderRadius: 14,
    marginRight: responsiveWidth(2),
  },
  btnCancelText: {
    color: '#EF4444',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
  btnSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(6.5),
    backgroundColor: '#10B981', // Hijau modern
    borderRadius: 14,
    marginLeft: responsiveWidth(2),
    elevation: 3,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnSaveText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.8),
    fontWeight: 'bold',
  },
});

export default SignaturePage;