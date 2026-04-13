import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import DialogComponent from '../../component/dialog/DialogComponent';
import { get_pembelajaran } from '../../services/absen/index';
import ValidateComponent from './validate';

const FormCodeComponent = (props: any) => {
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const [, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  
  const [dataMatkul, setDataMatkul] = useState<{
    matkul: string;
    pertemuan: string;
    dosen: string;
    kelas: string;
    token: string;
  }>({
    matkul: '',
    pertemuan: '',
    dosen: '',
    kelas: '',
    token: '',
  });
  
  const [validateData, setValidateData] = useState(false);
  
  const { mutate } = useMutation({
    mutationFn: get_pembelajaran,
    onSuccess: (succ: any) => {
      if (Array.isArray(succ?.data) && succ.data.length) {
        const { pertemuan, dosen, matkul, kelas } = succ.data[0];
        setDataMatkul({
          dosen: dosen.nama,
          pertemuan: pertemuan,
          matkul: matkul.name,
          kelas: kelas,
          token: value,
        });
        setValidateData(true);
      } else {
        setModalQuery({
          title: 'Alert',
          visible: true,
          desc: {
            buttonCancel: 'Ok',
            buttonDone: '',
            title: 'Mata Kuliah Tidak Ditemukan, Silahkan masukkan kembali TOKEN dengan benar!',
          },
        });
      }
    },
    onError: (error: any) => {
      console.log("=== ERROR API FORM CODE ===");
      console.log("error", error);
      console.log("error response data", error?.response?.data);

      setModalQuery({
        title: 'Gagal Memuat',
        visible: true,
        desc: {
          buttonCancel: 'Ok',
          buttonDone: '',
          title: error?.response?.data?.message || error?.message || 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
        },
      });
      setValue('');
    },
  });

  const [modalQuery, setModalQuery] = useState({
    visible: false,
    title: '',
    desc: {
      buttonCancel: 'Cancel',
      buttonDone: 'Done',
      title: 'Are you sure?',
    },
  });

  const submit = () => {
    mutate({
      token: value,
    });
  };

  if (validateData) {
    return (
      <ValidateComponent
        props={props}
        onPress={() => {
          setValidateData(false);
          setValue('');
        }}
        dataMatkul={dataMatkul}
      />
    );
  } else {
    return (
      <View style={styles.root}>
        {/* Header Banner */}
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../../assets/login/banner-home.png')} 
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>ABSENSI</Text>
          </View>
        </View>

        {/* Card Form Input */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kode Token</Text>
          <Text style={styles.cardSubtitle}>
            Masukkan 6 digit kode token kelas Anda
          </Text>

          <CodeField
            value={value}
            cellCount={CELL_COUNT}
            onChangeText={setValue}
            rootStyle={styles.codeFieldRoot}
            keyboardType="default" // Ubah ke default jika token bisa berisi huruf, biarkan numeric jika murni angka
            autoCapitalize="characters"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? '|' : null)}
              </Text>
            )}
          />

          {/* Tombol Submit */}
          {value.length === CELL_COUNT ? (
            <TouchableOpacity onPress={submit} style={styles.buttonActive}>
              <Text style={styles.buttonText}>Submit Token</Text>
            </TouchableOpacity>
          ) : (
            <Pressable style={styles.buttonDisabled}>
              <Text style={styles.buttonTextDisabled}>Submit Token</Text>
            </Pressable>
          )}
        </View>

        {/* Modal Alert */}
        <DialogComponent
          visible={modalQuery.visible}
          onDismiss={() => {
            setModalQuery({
              ...modalQuery,
              visible: false,
            });
            setValue('');
          }}
          title={modalQuery.title}
          desc={modalQuery.desc}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Abu-abu muda khas iOS background
  },
  headerContainer: {
    height: responsiveWidth(55),
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Sedikit menggelapkan gambar agar teks terbaca
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(3.5),
    letterSpacing: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: responsiveWidth(5),
    marginTop: -responsiveWidth(10), // Efek overlapping ke atas gambar banner
    borderRadius: 20,
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveWidth(8),
    elevation: 8, // Shadow Android
    shadowColor: '#000', // Shadow iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: responsiveFontSize(2.6),
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: responsiveFontSize(1.6),
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  codeFieldRoot: {
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  cell: {
    width: responsiveWidth(11),
    height: responsiveWidth(13),
    lineHeight: responsiveWidth(12), // Harus mendekati height agar teks di tengah vertikal
    fontSize: responsiveFontSize(3),
    fontWeight: '600',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    borderRadius: 10,
    color: '#333333',
    overflow: 'hidden',
  },
  focusCell: {
    borderColor: '#15613F', // Ungu modern saat sel aktif
    backgroundColor: '#FFFFFF',
  },
  buttonActive: {
    backgroundColor: '#15613F',
    paddingVertical: responsiveWidth(3.5),
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#E5E5EA',
    paddingVertical: responsiveWidth(3.5),
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    color: '#A1A1AA',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default FormCodeComponent;