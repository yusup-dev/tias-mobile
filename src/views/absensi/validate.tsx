import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useTokenStore} from '../../store/auth';
import Geolocation from 'react-native-geolocation-service';
import {useMutation} from '@tanstack/react-query';
import {absensi} from '../../services/absen/index';
import DialogComponent from '../../component/dialog/DialogComponent';
const ValidateComponent = ({
  props,
  onPress,
  dataMatkul,
}: {
  props?: any;
  onPress: () => any;
  dataMatkul: {
    matkul: string;
    pertemuan: string;
    dosen: string;
    kelas: string;
    token: string;
  };
}) => {
  const getLatLon = () => {
    return new Promise((resolve: any, reject: any) => {
      Geolocation.requestAuthorization('whenInUse')
        .then(result => {
          if (result == 'granted') {
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
  const {user} = useTokenStore();
  const [modalQuery, setModalQuery] = useState({
    visible: false,
    title: '',
    desc: {
      buttonCancel: 'Cancel',
      buttonDone: 'Done',
      title: 'Are you sure?',
    },
  });
  const {mutate, isLoading} = useMutation({
    mutationFn: absensi,
    onSuccess: (succ: any) => {
      console.log({succ: succ});
      if (succ.message === 'success') {
        setModalQuery({
          title: 'Alert',
          visible: true,
          desc: {
            buttonCancel: 'Ok',
            buttonDone: '',
            title: `Anda Berhasil Melakukan Absensi di mata kuliah ${dataMatkul.matkul}`,
          },
        });
        setTimeout(() => {
          props.navigation.jumpTo('Home');
        }, 2000);
      } else {
        setModalQuery({
          title: 'Alert',
          visible: true,
          desc: {
            buttonCancel: 'Ok',
            buttonDone: '',
            title: succ.message,
          },
        });
      }
    },
  });
  return (
    <View
      style={{
        backgroundColor: '#7366E3',
        flex: 1,
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginTop: responsiveWidth(3),
          fontWeight: 'bold',
          color: 'white',
          fontSize: responsiveFontSize(2.5),
        }}>
        Pertemuan {dataMatkul.pertemuan}
      </Text>

      <View
        style={{
          backgroundColor: 'white',
          width: responsiveWidth(100),
          height: responsiveHeight(70),
          position: 'absolute',
          bottom: 0,
          borderTopEndRadius: responsiveWidth(5),
          borderTopStartRadius: responsiveWidth(5),
        }}>
        <View
          style={{
            top: -responsiveWidth(10),
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: responsiveWidth(20),
              height: responsiveWidth(20),
              borderRadius: responsiveWidth(50),
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../assets/absensi/user-default.png')}
              style={{
                width: responsiveWidth(22),
                height: responsiveWidth(22),
              }}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 0.5,
              width: responsiveWidth(80),
              paddingBottom: responsiveWidth(5),
              borderBottomColor: '#e9e9e9',
              marginTop: responsiveWidth(2),
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              {user?.nama_lengkap}
            </Text>
            <Text
              style={{
                textAlign: 'center',
              }}>
              {user?.npm}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: responsiveWidth(10),
            top: -responsiveWidth(5),
          }}>
          <View style={{}}>
            <View>
              <Text>Mata Kuliah</Text>
              <View style={[style.box_container, style.shadow]}>
                <Text>{dataMatkul.matkul}</Text>
              </View>
            </View>
            <View
              style={{
                marginVertical: responsiveWidth(2),
              }}>
              <Text>Dosen Pengampu</Text>
              <View style={[style.box_container, style.shadow]}>
                <Text>{dataMatkul.dosen}</Text>
              </View>
            </View>
            <View>
              <Text>Kelas</Text>
              <View style={[style.box_container, style.shadow]}>
                <Text>{dataMatkul.kelas}</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              top: responsiveWidth(10),
            }}>
            <TouchableOpacity
              onPress={async () => {
                let check: any = await getLatLon();

                mutate({
                  coordinate: `${check.lat}, ${check.long}`,
                  npm: user?.npm,
                  status_absen: 1,
                  token: dataMatkul.token,
                });
              }}
              style={[
                {
                  backgroundColor: '#7366E3',
                  paddingHorizontal: responsiveWidth(2),
                  paddingVertical: responsiveWidth(3),
                  borderRadius: responsiveWidth(3),
                },
                style.shadow,
              ]}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                }}>
                Presensi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPress}
              style={[
                {
                  backgroundColor: '#fff',
                  paddingHorizontal: responsiveWidth(2),
                  paddingVertical: responsiveWidth(3),
                  borderRadius: responsiveWidth(3),
                  marginTop: responsiveWidth(3),
                },
                style.shadow,
              ]}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'red',
                  fontWeight: 'bold',
                }}>
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <DialogComponent
        visible={modalQuery.visible}
        onDismiss={() => {
          setModalQuery({
            ...modalQuery,
            visible: !modalQuery.visible,
          });
        }}
        title={modalQuery.title}
        desc={modalQuery.desc}
      />
    </View>
  );
};

const style = StyleSheet.create({
  box_container: {
    borderWidth: 1,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    marginVertical: responsiveWidth(2),
    borderColor: '#E9E9F9',
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default ValidateComponent;
