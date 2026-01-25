import {useMutation, useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
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
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
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
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props_, getCellOnLayoutHandler] = useClearByFocusCell({
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
  const {mutate, isLoading} = useMutation({
    mutationFn: get_pembelajaran,
    onSuccess: (succ: any) => {
      console.log({succ});
      if (succ.data.length) {
        const {pertemuan, dosen, matkul, kelas} = succ.data[0];
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
            title:
              'Mata Kuliah Tidak Ditemukan, Silahkan masukkan kembali TOKEN dengan benar!',
          },
        });
      }
    },
  });
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
  const [hasPermission, setHasPermission] = useState(false);
  const getLatLon = () => {
    return new Promise((resolve: any, reject: any) => {
      Geolocation.requestAuthorization('whenInUse')
        .then(result => {
          console.log({result});
          if (result == 'granted') {
            setHasPermission(true);
            return Geolocation.getCurrentPosition(
              position => {
                let d_lat = position.coords.latitude;
                let d_lng = position.coords.longitude;
                console.log({position});
                return resolve({
                  status: true,
                  lat: d_lat,
                  long: d_lng,
                });
              },
              error => {
                return resolve({
                  status: false,
                  code: error.code,
                  message: error.message,
                });
              },
              {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
            );
          }
        })
        .catch(error => {
          return resolve({
            status: false,
            code: error.code,
            message: error.message,
          });
        });
    });
  };
  useEffect(() => {
    getLatLon();
  }, []);
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
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            backgroundColor: '#6A5BE2',
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

              // position: 'absolute',
              // paddingLeft: 5,
            }}
            rightContainerStyle={{
              // backgroundColor: 'red',
              width: responsiveWidth(20),
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
            }}
            leftContainerStyle={{
              // backgroundColor: 'red',
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
          <CameraScanBarcode />
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
              // console.log({props: props.navigation});
              props.navigation.push('absensi.formcode');
            }}
            style={{
              backgroundColor: '#6A5BE2',
              // paddingHorizontal: responsiveWidth(10),
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
            style={{
              backgroundColor: 'white',
              width: responsiveWidth(70),
              // paddingHorizontal: responsiveWidth(10),
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
        {/* <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
            flexDirection: 'column',
          }}>
          <CodeField
            ref={ref}
            value={value}
            cellCount={CELL_COUNT}
            onChangeText={setValue}
            rootStyle={styles.codeFieldRoot}
            keyboardType="numeric"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <View>
            {value.length == CELL_COUNT ? (
              <TouchableOpacity
                onPress={submit}
                style={{
                  backgroundColor: '#6A5BE2',
                  paddingVertical: responsiveWidth(3),
                  marginHorizontal: responsiveWidth(5),
                  borderRadius: responsiveWidth(3),
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            ) : (
              <Pressable
                style={{
                  backgroundColor: '#E9e9e9',
                  paddingVertical: responsiveWidth(3),
                  marginHorizontal: responsiveWidth(5),
                  borderRadius: responsiveWidth(3),
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  Submit
                </Text>
              </Pressable>
            )}
          </View>
        </View> */}

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
const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    // marginTop: responsiveWidth(40),
    paddingHorizontal: responsiveWidth(6),
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    borderRadius: responsiveWidth(3),
  },
  focusCell: {
    borderColor: '#000',
  },
});
export default AbsensiComponent;
