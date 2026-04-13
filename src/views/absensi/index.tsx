import {useMutation} from '@tanstack/react-query';
import {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import DialogComponent from '../../component/dialog/DialogComponent';
import {get_pembelajaran} from '../../services/absen/index';
import ValidateComponent from './validate';
import SwitchToggle from 'react-native-switch-toggle';
import CameraScanBarcode from '../../component/camera/index';
import Geolocation from 'react-native-geolocation-service';

const AbsensiComponent = (props: any) => {
  const [value, setValue] = useState('');
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

  const {mutate} = useMutation({
    mutationFn: get_pembelajaran,
    onSuccess: (succ: any, variables: any) => {
      if (Array.isArray(succ?.data) && succ.data.length) {
        const {pertemuan, dosen, matkul, kelas} = succ.data[0];
        setDataMatkul({
          dosen: dosen.nama,
          pertemuan: pertemuan,
          matkul: matkul.name,
          kelas: kelas,
          token: variables?.token ?? value,
        });
        setValidateData(true);
      } else {
        setModalQuery({
          title: 'Alert',
          visible: true,
          desc: {
            buttonCancel: 'Ok',
            buttonDone: '',
            title:
              'Mata Kuliah Tidak Ditemukan, Silahkan masukkan kembali TOKEN dengan benar!',
          },
        });
      }
    },

    onError: (error: any) => {
      console.log()
      console.log("=== ERROR API ABSENSI ===");
      console.log("error", error);
      console.log("error response data", error?.response?.data); // Menampilkan detail pesan error dari backend
      console.log("error message", error?.message);

      setModalQuery({
        title: 'Gagal Memuat',
        visible: true,
        desc: {
          buttonCancel: 'Tutup',
          buttonDone: '',
          title: error?.response?.data?.message || error?.message || 'Terjadi kesalahan pada server (Error 500). Silakan coba lagi.',
        },
      });
      
      // Reset input agar bisa scan ulang
      setValue(''); 
    },
  });

  const getLatLon = () => {
    return new Promise<{status: boolean; lat?: number; long?: number; message?: string}>(
      (resolve, _reject) => {
        Geolocation.requestAuthorization('whenInUse')
          .then(result => {
            if (result === 'granted') {
              Geolocation.getCurrentPosition(
                position => {
                  resolve({
                    status: true,
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                  });
                },
                error => {
                  resolve({status: false, message: error.message});
                },
                {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
              );
            } else {
              resolve({status: false, message: 'Izin lokasi tidak diberikan.'});
            }
          })
          .catch(error => {
            resolve({status: false, message: error?.message ?? 'Gagal akses lokasi.'});
          });
      },
    );
  };

  const submit = (token: string) => {
    if (!token) {
      return;
    }
    mutate({
      token: token,
    });
  };

const handleScanToken = (token: string) => {
    // 1. Tangkap hasil asli dari kamera
    console.log("=== HASIL SCAN QR ASLI ===");
    console.log("Teks dari QR Code:", token);
    

    // 2. Bersihkan dari spasi atau enter yang tidak sengaja terbawa
    let cleanToken = token.trim();
    console.log("Teks dari clean:", cleanToken);

    // 3. (Opsional) Cek apakah isinya URL. Jika ya, ambil token di bagian paling belakang
    if (cleanToken.includes('http') || cleanToken.includes('/')) {
      const parts = cleanToken.split('/');
      cleanToken = parts[parts.length - 1]; // Mengambil teks setelah garis miring terakhir
      console.log("Token setelah diekstrak dari URL:", cleanToken);
    }

    // 4. Lanjut proses ke state dan API
    setValue(cleanToken);
    submit(cleanToken);
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
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            backgroundColor: '#15613F',
            paddingHorizontal: responsiveWidth(3),
            paddingVertical: responsiveWidth(5),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: responsiveFontSize(3),
              }}>
              Presensi
            </Text>
          </View>
          <SwitchToggle
            backTextLeft="Perkuliahan"
            backTextRight="Kegiatan"
            switchOn={onSwitch}
            onPress={async () => {
              setOnSwitch(prev => !prev);
            }}
            circleColorOff="#6A5BE2"
            circleColorOn="#6A5BE2"
            backgroundColorOn="#6D6D6D"
            backgroundColorOff="#6D6D6D"
            textRightStyle={{
              color: 'white',
              fontSize: 12,
            }}
            textLeftStyle={{
              color: 'white',
              fontSize: 12,
            }}
            containerStyle={{
              width: responsiveWidth(40),
              height: 25,
              borderRadius: 25,
            }}
            circleStyle={{
              width: responsiveWidth(20),
              height: 25,
              borderRadius: 20,
              borderColor: 'white',
              borderWidth: 1,
            }}
            rightContainerStyle={{
              width: responsiveWidth(20),
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
            }}
            leftContainerStyle={{
              width: responsiveWidth(20),
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 0,
              zIndex: 999,
            }}
          />
        </View>
        <View style={{}}>
          <CameraScanBarcode onScanSuccess={handleScanToken} />
        </View>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: responsiveWidth(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Jika kamu tidak bisa scan, tekan tombol dibawah</Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.push('absensi.formcode');
            }}
            style={{
              backgroundColor: '#6A5BE2',
              paddingVertical: responsiveWidth(4),
              borderRadius: responsiveWidth(2),
              width: responsiveWidth(70),
              marginVertical: responsiveWidth(3),
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
              }}>
              Masukkan kode absensi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.push('absensi.face', {token: value});
            }}
            style={{
              backgroundColor: '#15613F',
              paddingVertical: responsiveWidth(4),
              borderRadius: responsiveWidth(2),
              width: responsiveWidth(70),
              marginBottom: responsiveWidth(3),
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
              }}>
              Absensi wajah
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              width: responsiveWidth(70),
              paddingVertical: responsiveWidth(4),
              borderRadius: responsiveWidth(2),
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'red',
                fontWeight: 'bold',
              }}>
              Batal
            </Text>
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
  }
};
export default AbsensiComponent;
