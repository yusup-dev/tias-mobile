import {useMutation} from '@tanstack/react-query';
import {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import DialogComponent from '../../component/dialog/DialogComponent';
import {get_pembelajaran} from '../../services/absen/index';
import SwitchToggle from 'react-native-switch-toggle';
import CameraScanBarcode from '../../component/camera/index';
import {useTokenStore} from '../../store/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AbsensiComponent = (props: any) => {
  const [value, setValue] = useState('');
  const [onSwitch, setOnSwitch] = useState(false);
  const [modalQuery, setModalQuery] = useState({
    visible: false,
    title: '',
    desc: {
      buttonCancel: 'Cancel',
      buttonDone: 'Done',
      title: 'Are you sure?',
    },
  });

  const {user} = useTokenStore();
  const {mutate, isLoading} = useMutation({
    mutationFn: get_pembelajaran,
    onSuccess: (succ: any, variables: any) => {
      if (Array.isArray(succ?.data) && succ.data.length) {
        const item = succ.data[0];
        const tokenVal = variables?.token ?? value;

        // Langsung ke face recognition tanpa halaman konfirmasi
        props?.navigation?.push('absensi.face', {
          subjectId: user?.npm || '',
          token: tokenVal,
          meetingId: item?.id?.toString() || '',
          subject: item?.matakuliah?.nama_matakuliah || item?.matkul?.name || '-',
          lecturer: item?.dosen?.nama || item?.nik_dosen || '-',
          className: item?.kelas?.toString() || '-',
          authToken: useTokenStore.getState().token,
        });
        setValue('');
      } else {
        setModalQuery({
          title: 'Token Tidak Valid',
          visible: true,
          desc: {
            buttonCancel: 'Ok',
            buttonDone: '',
            title:
              'Mata Kuliah Tidak Ditemukan. Silahkan masukkan kembali TOKEN dengan benar!',
          },
        });
      }
    },

    onError: (error: any) => {
      console.log('=== ERROR API ABSENSI ===');
      console.log('error', error);
      console.log('error response data', error?.response?.data);
      console.log('error message', error?.message);

      setModalQuery({
        title: 'Gagal Memuat',
        visible: true,
        desc: {
          buttonCancel: 'Tutup',
          buttonDone: '',
          title:
            error?.response?.data?.message ||
            error?.message ||
            'Terjadi kesalahan pada server. Silakan coba lagi.',
        },
      });

      setValue('');
    },
  });

  const submit = (token: string) => {
    if (!token) {
      return;
    }
    mutate({
      token: token,
    });
  };

  const handleScanToken = (token: string) => {
    console.log('=== HASIL SCAN QR ASLI ===');
    console.log('Teks dari QR Code:', token);

    let cleanToken = token.trim();
    console.log('Teks dari clean:', cleanToken);

    if (cleanToken.includes('http') || cleanToken.includes('/')) {
      const parts = cleanToken.split('/');
      cleanToken = parts[parts.length - 1];
      console.log('Token setelah diekstrak dari URL:', cleanToken);
    }

    setValue(cleanToken);
    submit(cleanToken);
  };

  return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F4C2A" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="qrcode-scan" size={22} color="#4ADE80" />
            <Text style={styles.headerTitle}>Presensi</Text>
          </View>

          <View style={styles.switchWrapper}>
            <Text style={[styles.switchLabel, !onSwitch && styles.switchLabelActive]}>
              Perkuliahan
            </Text>
            <SwitchToggle
              switchOn={onSwitch}
              onPress={() => setOnSwitch(prev => !prev)}
              circleColorOff="#FFFFFF"
              circleColorOn="#FFFFFF"
              backgroundColorOn="#6A5BE2"
              backgroundColorOff="#15613F"
              containerStyle={styles.switchContainer}
              circleStyle={styles.switchCircle}
            />
            <Text style={[styles.switchLabel, onSwitch && styles.switchLabelActive]}>
              Kegiatan
            </Text>
          </View>
        </View>

        {/* Camera Area - kamera mengisi semua area */}
        <View style={styles.cameraWrapper}>
          <CameraScanBarcode onScanSuccess={handleScanToken} />
        </View>

        {/* Bottom Action Panel */}
        <View style={styles.bottomPanel}>
          <Text style={styles.bottomHint}>Arahkan kamera ke QR Code di layar dosen</Text>

          {isLoading ? (
            <View style={styles.loadingBtn}>
              <Icon name="loading" size={20} color="#FFFFFF" />
              <Text style={styles.loadingBtnText}>Memproses token...</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                props.navigation.push('absensi.formcode');
              }}
              style={styles.manualBtn}
              activeOpacity={0.85}>
              <Icon name="keyboard" size={18} color="#FFFFFF" />
              <Text style={styles.manualBtnText}>Masukkan Kode Manual</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              props.navigation.push('absensi.face.dev', {
                token: 'DEV-TEST-TOKEN',
                matkul: 'Pemrograman Mobile (DEV)',
                dosen: 'Dr. Dev Mode',
                pertemuan: '9',
                kelas: 'IF-DEV',
              });
            }}
            style={styles.devBtn}
            activeOpacity={0.85}>
            <Icon name="cog-outline" size={18} color="#FFFFFF" />
            <Text style={styles.devBtnText}>[DEV] Bypass ke Face Recognition</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={styles.cancelBtn}
            activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>Batal</Text>
          </TouchableOpacity>
        </View>

        <DialogComponent
          visible={modalQuery.visible}
          onDismiss={() => {
            setModalQuery({
              ...modalQuery,
              visible: !modalQuery.visible,
            });
            setValue('');
          }}
          title={modalQuery.title}
          desc={modalQuery.desc}
        />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#0F4C2A',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(3.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.4),
    letterSpacing: 0.5,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: responsiveFontSize(1.4),
    fontWeight: '500',
  },
  switchLabelActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  switchContainer: {
    width: responsiveWidth(12),
    height: 22,
    borderRadius: 11,
    padding: 2,
  },
  switchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  cameraWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  bottomPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(5),
    paddingBottom: responsiveWidth(6),
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    gap: 12,
  },
  bottomHint: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: responsiveFontSize(1.5),
    marginBottom: 4,
  },
  loadingBtn: {
    backgroundColor: '#15613F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveWidth(4),
    borderRadius: 14,
    gap: 10,
    opacity: 0.8,
  },
  loadingBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
  },
  manualBtn: {
    backgroundColor: '#15613F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveWidth(4),
    borderRadius: 14,
    gap: 10,
    elevation: 3,
    shadowColor: '#15613F',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  manualBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  devBtn: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveWidth(4),
    borderRadius: 14,
    gap: 10,
    elevation: 3,
    shadowColor: '#D97706',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  devBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  cancelBtn: {
    backgroundColor: '#F5F5F5',
    paddingVertical: responsiveWidth(3.5),
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelBtnText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
});

export default AbsensiComponent;
