import {useMutation} from '@tanstack/react-query';
import {useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
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
import {get_pembelajaran} from '../../services/absen/index';
import {useTokenStore} from '../../store/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FormCodeComponent = (props: any) => {
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const [, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const {user} = useTokenStore();
  const {mutate, isLoading} = useMutation({
    mutationFn: get_pembelajaran,
    onSuccess: (succ: any) => {
      if (Array.isArray(succ?.data) && succ.data.length) {
        const item = succ.data[0];

        // Langsung ke face recognition tanpa halaman konfirmasi
        props?.navigation?.push('absensi.face', {
          subjectId: user?.npm || '',
          token: value,
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
      console.log('=== ERROR API FORM CODE ===');
      console.log('error', error);
      console.log('error response data', error?.response?.data);

      setModalQuery({
        title: 'Gagal Memuat',
        visible: true,
        desc: {
          buttonCancel: 'Ok',
          buttonDone: '',
          title:
            error?.response?.data?.message ||
            error?.message ||
            'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
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

  return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#0F4C2A" />

        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={styles.backBtn}>
            <Icon name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerBarTitle}>Input Kode Token</Text>
          <View style={{width: 38}} />
        </View>

        {/* Banner */}
        <View style={styles.headerContainer}>
          <Image
            source={require('../../../assets/login/banner-home.png')}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay}>
            <Icon name="shield-key" size={40} color="rgba(255,255,255,0.9)" />
            <Text style={styles.headerTitle}>KODE TOKEN</Text>
            <Text style={styles.headerSubtitle}>
              Masukkan kode yang diberikan dosen
            </Text>
          </View>
        </View>

        {/* Card Form Input */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.cardTitleDot} />
            <Text style={styles.cardTitle}>Kode Absensi</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Masukkan 6 digit kode token kelas Anda
          </Text>

          <CodeField
            value={value}
            cellCount={CELL_COUNT}
            onChangeText={setValue}
            rootStyle={styles.codeFieldRoot}
            keyboardType="default"
            autoCapitalize="characters"
            renderCell={({index, symbol, isFocused}) => (
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
            <TouchableOpacity
              onPress={submit}
              style={[styles.buttonActive, isLoading && styles.buttonLoading]}
              disabled={isLoading}
              activeOpacity={0.85}>
              {isLoading ? (
                <Icon name="loading" size={20} color="#FFFFFF" />
              ) : (
                <Icon name="check-circle" size={20} color="#FFFFFF" />
              )}
              <Text style={styles.buttonText}>
                {isLoading ? 'Memverifikasi...' : 'Submit Token'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Pressable style={styles.buttonDisabled}>
              <Icon name="lock-outline" size={20} color="#A1A1AA" />
              <Text style={styles.buttonTextDisabled}>Submit Token</Text>
            </Pressable>
          )}

          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Kembali ke Scan QR</Text>
          </TouchableOpacity>
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
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerBar: {
    backgroundColor: '#0F4C2A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerBarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.2),
  },
  headerContainer: {
    height: responsiveWidth(45),
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
    backgroundColor: 'rgba(15, 76, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(3.2),
    letterSpacing: 3,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: responsiveFontSize(1.5),
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: responsiveWidth(5),
    marginTop: -responsiveWidth(8),
    borderRadius: 24,
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveWidth(7),
    elevation: 10,
    shadowColor: '#15613F',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitleDot: {
    width: 4,
    height: 20,
    backgroundColor: '#15613F',
    borderRadius: 2,
  },
  cardTitle: {
    fontSize: responsiveFontSize(2.4),
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  cardSubtitle: {
    fontSize: responsiveFontSize(1.6),
    color: '#6B7280',
    marginBottom: 28,
    marginLeft: 12,
  },
  codeFieldRoot: {
    marginBottom: 28,
    justifyContent: 'space-between',
  },
  cell: {
    width: responsiveWidth(11),
    height: responsiveWidth(13),
    lineHeight: responsiveWidth(12),
    fontSize: responsiveFontSize(2.8),
    fontWeight: '700',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    borderRadius: 12,
    color: '#1A1A1A',
    overflow: 'hidden',
  },
  focusCell: {
    borderColor: '#15613F',
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
  },
  buttonActive: {
    backgroundColor: '#15613F',
    paddingVertical: responsiveWidth(3.8),
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    elevation: 4,
    shadowColor: '#15613F',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  buttonLoading: {
    opacity: 0.8,
    backgroundColor: '#1E8449',
  },
  buttonDisabled: {
    backgroundColor: '#F3F4F6',
    paddingVertical: responsiveWidth(3.8),
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
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
    fontWeight: '600',
  },
  cancelBtn: {
    marginTop: 14,
    paddingVertical: responsiveWidth(3),
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#15613F',
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default FormCodeComponent;