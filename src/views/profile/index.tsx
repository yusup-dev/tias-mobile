import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useTokenStore} from '../../store/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = (props: any) => {
  // const {user} = useTokenStore();
  const {auth, user, setAuthentication, setToken, setUser} = useTokenStore();
  const [listProfile] = useState([
    {
      id: 1,
      name: 'Kependudukan',
      icon: 'account-group',
      page: '',
      action: () => {
        console.log('test');
      },
    },
    {
      id: 2,
      name: 'Alamat',
      icon: 'account-box',
      page: '',
      action: () => {
        console.log('test');
      },
    },
    {
      id: 3,
      name: 'Tias Club',
      icon: 'star',
      page: '',
      action: () => {
        console.log('test');
      },
    },
    {
      id: 4,
      name: 'Tias Signature',
      icon: 'draw-pen',
      page: '',
      action: () => {
        props.navigation.push('profile.signature');
      },
    },
    {
      id: 5,
      name: 'Bantuan & Laporan Saya',
      icon: 'help-circle',
      page: '',
      action: () => {
        console.log('test');
      },
    },
    {
      id: 6,
      name: 'Notifikasi',
      icon: 'bell',
      page: '',
      action: () => {
        console.log('test');
      },
    },
    {
      id: 7,
      name: 'Pengaturan Akun',
      icon: 'cog',
      page: '',
      action: () => {
        console.log('test');
      },
    },
  ]);
  const [listProfile2] = useState([
    {
      id: 8,
      name: 'Kebijakan Privasi',
      icon: 'shield-alert',
      page: '',
      action: () => {
        console.log('test');
      },
    },
    {
      id: 9,
      name: 'Beri Kami Nilai',
      icon: 'party-popper',
      page: '',
      action: () => {
        console.log('test');
      },
    },
    {
      id: 10,
      name: 'Logout',
      icon: 'logout',
      page: '',
      action: () => {
        setUser({});
        setToken('');
        setAuthentication(false);
        console.log('test logout');
      },
    },
  ]);
  return (
    <ScrollView
      style={{
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#6A5BE2',
          paddingLeft: responsiveWidth(2),
          paddingVertical: responsiveWidth(4),
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 10,
          marginBottom: responsiveWidth(2),
        }}>
        <View
          style={{
            justifyContent: 'center',
            marginLeft: responsiveWidth(3),
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(3),
              fontWeight: 'bold',
              color: 'white',
            }}>
            Profile Saya
          </Text>
        </View>
      </View>
      {/* profile */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: responsiveWidth(5),
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
          }}>
          <View
            style={{
              alignSelf: 'center',
              width: responsiveWidth(10),
              height: responsiveWidth(10),
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: responsiveWidth(2),
            }}>
            {/* <Text>ini</Text> */}
          </View>
          <View>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                fontWeight: 'bold',
              }}>
              {user.nama_lengkap}
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
              }}>
              {user.email}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            props.navigation.push('profile.signature');
          }}
          style={{
            alignSelf: 'center',
          }}>
          <Icon name="pencil" size={24} />
        </TouchableOpacity>
      </View>
      {/* list akun */}
      <View
        style={{
          paddingHorizontal: responsiveWidth(5),
          marginTop: responsiveWidth(4),
        }}>
        <View
          style={{
            marginBottom: responsiveWidth(2),
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.3),
              fontWeight: 'bold',
            }}>
            Akun
          </Text>
        </View>
        {listProfile.map((list: any) => (
          <TouchableOpacity
            onPress={() => list.action()}
            key={`${list.id}-list`}
            style={{
              flexDirection: 'row',
              marginVertical: responsiveWidth(1.5),
              paddingBottom: responsiveWidth(1),
              borderBottomWidth: 1,
              borderBottomColor: '#E6E6E6',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon name={list.icon} size={24} />
              <Text
                style={{
                  fontSize: responsiveFontSize(2.2),
                  alignSelf: 'center',
                  marginLeft: responsiveWidth(2.5),
                }}>
                {list.name}
              </Text>
            </View>
            <Icon name={'chevron-right'} size={24} />
          </TouchableOpacity>
        ))}
        <View
          style={{
            marginVertical: responsiveWidth(3),
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.3),
              fontWeight: 'bold',
            }}>
            Info Lainnya
          </Text>
        </View>
        {listProfile2.map((list: any) => (
          <TouchableOpacity
            onPress={() => list.action()}
            key={`${list.id}-list`}
            style={{
              flexDirection: 'row',
              marginVertical: responsiveWidth(1.5),
              paddingBottom: responsiveWidth(1),
              borderBottomWidth: 1,
              borderBottomColor: '#E6E6E6',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon name={list.icon} size={24} />
              <Text
                style={{
                  fontSize: responsiveFontSize(2.2),
                  alignSelf: 'center',
                  marginLeft: responsiveWidth(2.5),
                }}>
                {list.name}
              </Text>
            </View>
            <Icon name={'chevron-right'} size={24} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
