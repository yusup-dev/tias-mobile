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
const MenuComponent = (props: any) => {
  const {auth, user, setAuthentication, setToken, setUser} = useTokenStore();

  const userData = [
    {
      value: 'Pendidikan',
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
      value: 'Penelitian',
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
      value: 'Pengabdian',
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
      value: 'Kualifikasi',
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
      value: 'Kompetensi',
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
      value: 'Penunjang',
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
    // {
    //   value: 'Artikel',
    //   icon: () => (
    //     <Image
    //       source={require('../../../../assets/home/artikel.png')}
    //       style={{
    //         alignSelf: 'center',
    //       }}
    //     />
    //   ),
    // },
    // {
    //   value: 'Dokumen',
    //   icon: () => (
    //     <Image
    //       source={require('../../../../assets/home/dokumen.png')}
    //       style={{
    //         alignSelf: 'center',
    //       }}
    //     />
    //   ),
    // },
  ];
  const {data, isLoading}: {data: any; isLoading: Boolean} = useQuery({
    queryKey: ['list_event', {}],
    queryFn: () => {
      return getEvent();
    },
    onSuccess: result => {
      // console.log({result});
    },
    onError: result => {
      console.log({result});
    },
  });
  const {
    data: dataEvent,
    isLoading: isLoadingEvent,
  }: {data: any; isLoading: Boolean} = useQuery({
    queryKey: ['list_tantangan', {}],
    queryFn: () => {
      return getTantangan();
    },
    onSuccess: result => {
      // console.log({result});
    },
    onError: result => {
      console.log({result});
    },
  });

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
        style={{height: responsiveHeight(13)}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: responsiveHeight(4),
            paddingHorizontal: responsiveWidth(5),
          }}>
          <View>
            <Text>
              Halo,{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#000',
                }}>
                {user?.nama_lengkap}
              </Text>
            </Text>
          </View>
          <View>
            <Image source={require('../../../../assets/Lonceng.png')} />
            {/* <LoncengIcon width={25} height={30} /> */}
            {/* <Icon name="eye" size={25} color="gray" /> */}
            {/* <Text>Icon</Text> */}
          </View>
        </View>
      </LinearGradient>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: responsiveWidth(80),
          borderColor: 'black',
          borderWidth: responsiveWidth(0.1),
          margin: 'auto',
          paddingHorizontal: responsiveWidth(5),
          borderRadius: 10,
          paddingVertical: responsiveWidth(2),
        }}>
        <View>
          <Text
            style={{
              fontSize: responsiveFontSize(1.5),
              fontWeight: 'bold',
              color: '#000',
            }}>
            Cek Dokumen Riawayat Hidup
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: responsiveWidth(3),
            }}>
            <View
              style={{
                flexDirection: 'row',
                borderRightWidth: 0.5,
                paddingRight: responsiveWidth(2),
              }}>
              <Icon
                size={15}
                name="settings"
                style={{
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: responsiveFontSize(1.5),
                  marginLeft: responsiveWidth(2),
                  // fontWeight: 'bold',
                  color: '#000',
                }}>
                Atur Format CV
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                // borderLeftWidth: 1,
                marginLeft: responsiveWidth(2),
                paddingHorizontal: responsiveWidth(2),
                backgroundColor: '#15613F',
                paddingVertical: responsiveWidth(2),
                borderRadius: responsiveWidth(5),
              }}>
              <Icons size={15} name="file" color={'white'} />
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: responsiveFontSize(1),
                  marginLeft: responsiveWidth(1),
                  color: 'white',
                }}>
                Print CV
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Image source={require('../../../../assets/login/pdf.png')} />
        </View>
      </View>
      <View
        style={{
          marginTop: responsiveWidth(4),
          paddingHorizontal: responsiveWidth(3),
        }}>
        <Text
          style={{
            fontWeight: 'semibold',
            marginHorizontal: responsiveWidth(4),
            color: '#000',
          }}>
          Kategori Pelaksanaan
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            marginTop: responsiveWidth(3),
          }}>
          {userData.map((list, index) => (
            <TouchableOpacity
              key={`${index}-${list.value}`}
              style={{
                justifyContent: 'center',
                marginTop: responsiveWidth(3),

                width: responsiveWidth(30),
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
      <TouchableOpacity
        onPress={() => {
          console.log('test');
        }}>
        <Image
          source={require('../../../../assets/home/statistik2.png')}
          style={{
            alignSelf: 'center',
            marginTop: responsiveWidth(5),
            width: responsiveWidth(100),
            height: responsiveHeight(20),
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.navigation.push('home.evoting');
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          height: responsiveHeight(8),
          borderRadius: responsiveWidth(3),
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 3},
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 10,
          marginVertical: responsiveWidth(4),
          marginHorizontal: responsiveWidth(5),
        }}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#2196F3',
              fontWeight: 'bold',
              marginLeft: responsiveWidth(3),
            }}>
            E-VOTING TIAS
          </Text>
        </View>
        <View
          style={{
            // alignSelf: 'center',
            height: responsiveHeight(7.5),
            backgroundColor: '#D6EFFD',
            width: responsiveHeight(7.5),
            borderRadius: responsiveWidth(3),
            marginRight: responsiveWidth(0.6),
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 'auto',
          }}>
          <Icons name="vote" size={responsiveWidth(6)} color={'#2196F3'} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          props.navigation.push('home.evoting');
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          height: responsiveHeight(8),
          borderRadius: responsiveWidth(3),
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 3},
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 10,
          marginVertical: responsiveWidth(4),
          marginHorizontal: responsiveWidth(5),
        }}>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#2196F3',
              fontWeight: 'bold',
              marginLeft: responsiveWidth(3),
            }}>
            BUAT LAPORAN
          </Text>
        </View>
        <View
          style={{
            // alignSelf: 'center',
            height: responsiveHeight(7.5),
            backgroundColor: '#D6EFFD',
            width: responsiveHeight(7.5),
            borderRadius: responsiveWidth(3),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: responsiveWidth(0.6),
            marginVertical: 'auto',
          }}>
          <Icons name="vote" size={responsiveWidth(6)} color={'#2196F3'} />
        </View>
      </TouchableOpacity>
      <View
        style={{
          marginHorizontal: responsiveWidth(5),
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
            }}>
            Pengumuman
          </Text>
          <Icon
            size={30}
            name="bar-chart"
            color={'#E57F00'}
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
        <Text
          style={{
            fontSize: responsiveFontSize(1.5),
          }}>
          Pengumuman terkini, TIAS Event menciptakan suasana yang menyenangkan
          dan inspiratif
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            flexDirection: 'row',
          }}>
          {data?.data.map((list: any) => (
            <View
              key={list.id}
              style={{
                marginRight: responsiveWidth(2),
                marginVertical: responsiveWidth(1),
                width: responsiveWidth(90),
              }}>
              {list?.pamflet_url ? (
                <View
                  style={{
                    borderRadius: responsiveWidth(10),
                    flex: 1,
                    marginTop: responsiveWidth(2),
                  }}>
                  <Image
                    source={{
                      uri: list?.pamflet_url,
                    }}
                    resizeMode="cover"
                    style={{
                      width: responsiveWidth(90),
                      height: responsiveWidth(50),
                      borderRadius: responsiveWidth(5),
                    }}
                  />
                </View>
              ) : (
                <></>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          marginVertical: responsiveWidth(4),
          marginHorizontal: responsiveWidth(4),
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              color: '#000',
            }}>
            UCL Challage
          </Text>
          <Icons
            size={24}
            name="medal"
            style={{
              alignSelf: 'center',
            }}
          />
        </View>
        <Text
          style={{
            fontSize: responsiveFontSize(1.4),
            marginTop: responsiveWidth(2),
          }}>
          Ayo berkontribusi dari tantangan TIAS dan daparkan hadiah menarik
          lainnya
        </Text>
        <View
          style={{
            marginTop: responsiveWidth(2),
          }}>
          {dataEvent?.data.map((list: any) => (
            <TouchableOpacity
              onPress={() => {
                props.navigation.push('home.detail-challenge', {
                  ...list,
                });
                console.log(list);
              }}
              key={`tantangan-${list.id}`}
              style={{
                marginVertical: responsiveWidth(2),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: responsiveWidth(100),
                }}>
                <Image
                  source={{
                    uri: list.pamflet_url,
                  }}
                  resizeMode="cover"
                  style={{
                    width: responsiveWidth(30),
                    height: responsiveWidth(30),
                  }}
                />
                <View
                  style={{
                    marginLeft: responsiveWidth(5),
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      width: responsiveWidth(50),
                      fontSize: responsiveFontSize(1.5),
                    }}>
                    {list.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.2),
                    }}>
                    {moment(list.created_at).format('LL')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MenuComponent;
