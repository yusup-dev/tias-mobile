import {useQuery} from '@tanstack/react-query';
import {
  Image,
  PermissionsAndroid,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTokenStore} from '../../../store/auth';
import {getEvent, getTantangan} from '../../../services/home/index';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {LoncengIcon} from '../../../../assets/svg';
// import LoncengIcon from '';
const DosenMenuComponent = (props: any) => {
  const {auth, user, setAuthentication, setToken, setUser} = useTokenStore();

  const userData = [
    {
      value: 'E-Voting',
      type: 'pendidikan',
      icon: () => (
        <Image
          source={require('../../../../assets/home/pendidikan.png')}
          style={{
            alignSelf: 'center',
          }}
        />
      ),
    },
    {
      value: 'Upload \nDokumen',
      type: 'penelitian',
      icon: () => (
        <Image
          source={require('../../../../assets/home/penelitian.png')}
          style={{
            alignSelf: 'center',
          }}
        />
      ),
    },
    {
      value: 'Jadwal \nkegiatan',
      type: 'pengabdian',
      icon: () => (
        <Image
          source={require('../../../../assets/home/pengabdian.png')}
          style={{
            alignSelf: 'center',
          }}
        />
      ),
    },
    {
      value: 'Bimbingan \nMahasiswa',
      type: 'kualifikasi',
      icon: () => (
        <Image
          source={require('../../../../assets/home/kualifikasi.png')}
          style={{
            alignSelf: 'center',
          }}
        />
      ),
    },
    {
      value: 'Penelitian',
      type: 'kompetensi',
      icon: () => (
        <Image
          source={require('../../../../assets/home/kompetensi.png')}
          style={{
            alignSelf: 'center',
          }}
        />
      ),
    },
    {
      value: 'Pengabdian',
      type: 'penunjang',
      icon: () => (
        <Image
          source={require('../../../../assets/home/penunjang.png')}
          style={{
            alignSelf: 'center',
          }}
        />
      ),
    },
    {
      value: 'Pendidikan',
      icon: () => (
        <Image
          source={require('../../../../assets/home/artikel.png')}
          style={{
            alignSelf: 'center',
          }}
        />
      ),
    },
    {
      value: 'Presensi',
      icon: () => (
        <Image
          source={require('../../../../assets/home/dokumen.png')}
          style={{
            alignSelf: 'center',
          }}
        />
      ),
    },
  ];

  // useEffect(() => {
  //   Geolocation.requestAuthorization('whenInUse');
  // }, []);
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <LinearGradient
        colors={['#BAEED7', '#fff']}
        style={{height: responsiveHeight(30)}}>
        <View
          style={{
            backgroundColor: '#fff',
            width: responsiveWidth(100),
            height: responsiveHeight(10),
            // flex: 1,
            borderBottomRightRadius: responsiveWidth(7),
            borderBottomLeftRadius: responsiveWidth(7),
            paddingHorizontal: responsiveWidth(3),
          }}>
          <View
            style={{
              flexDirection: 'row',

              marginVertical: 'auto',
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#d9d9d9',
                width: responsiveWidth(80),
                marginHorizontal: 'auto',
                alignItems: 'center',
                borderRadius: responsiveWidth(2),
                paddingHorizontal: responsiveWidth(3),
              }}>
              <Icon name="search" size={25} />
              <Text
                style={{
                  marginLeft: responsiveWidth(2),
                }}>
                Cari apapun disini
              </Text>
            </View>
            <View>
              <Image source={require('../../../../assets/Lonceng.png')} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View
        style={{
          marginTop: responsiveWidth(2),
          paddingHorizontal: responsiveWidth(3),
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            // marginTop: responsiveWidth(3),
          }}>
          {userData.map((list, index) => (
            <TouchableOpacity
              key={`${index}-${list.value}`}
              style={{
                justifyContent: 'center',
                marginTop: responsiveWidth(3),

                width: responsiveWidth(20),
              }}
              onPress={() => {
                // setUser({});
                // setToken('');
                // setAuthentication(false);
              }}>
              {list.icon()}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: responsiveFontSize(1.4),
                  marginTop: responsiveWidth(1.8),
                }}>
                {list.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DosenMenuComponent;
