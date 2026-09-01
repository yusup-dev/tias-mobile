import {useQuery} from '@tanstack/react-query';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';

const DosenMenuComponent = (props: any) => {
  const {user} = useTokenStore();

  const userData = [
    {
      value: 'Surat \nDisposisi',
      route: 'home.surat',
      icon: () => (
        <Image
          source={require('../../../../assets/home/dokumen.png')}
          style={{ alignSelf: 'center' }}
        />
      ),
    },
    {
      value: 'Undangan \nRapat',
      route: 'home.meeting',
      icon: () => (
        <Image
          source={require('../../../../assets/home/pengabdian.png')}
          style={{ alignSelf: 'center' }}
        />
      ),
    },
    {
      value: 'E-Voting',
      route: 'home.evoting',
      icon: () => (
        <Image
          source={require('../../../../assets/home/pendidikan.png')}
          style={{ alignSelf: 'center' }}
        />
      ),
    },
    {
      value: 'Pendidikan',
      route: 'home.pendidikan',
      icon: () => (
        <Image
          source={require('../../../../assets/home/artikel.png')}
          style={{ alignSelf: 'center' }}
        />
      ),
    },
    {
      value: 'Penelitian',
      route: 'home.penelitian',
      icon: () => (
        <Image
          source={require('../../../../assets/home/kompetensi.png')}
          style={{ alignSelf: 'center' }}
        />
      ),
    },
    {
      value: 'Pengabdian',
      route: 'home.pengabdian',
      icon: () => (
        <Image
          source={require('../../../../assets/home/penunjang.png')}
          style={{ alignSelf: 'center' }}
        />
      ),
    },
    {
      value: 'Kompetensi',
      route: 'home.kompetensi',
      icon: () => (
        <Image
          source={require('../../../../assets/home/kualifikasi.png')}
          style={{ alignSelf: 'center' }}
        />
      ),
    },
    {
      value: 'Presensi',
      action: () => props.navigation.navigate('barcode'),
      icon: () => (
        <Image
          source={require('../../../../assets/home/penelitian.png')}
          style={{ alignSelf: 'center' }}
        />
      ),
    },
  ];

  const { data } = useQuery<any>({
    queryKey: ['list_event'],
    queryFn: () => getEvent(),
  });

  const { data: dataEvent } = useQuery<any>({
    queryKey: ['list_tantangan'],
    queryFn: () => getTantangan(),
  });

  const eventList: any[] = (data as any)?.data || [];
  const tantanganList: any[] = (dataEvent as any)?.data || [];

  const handleMenuPress = (item: any) => {
    if (item.action) {
      item.action();
    } else if (item.route) {
      props.navigation.push(item.route);
    }
  };

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
            <Text style={{ fontSize: responsiveFontSize(1.6), color: '#4B5563' }}>
              Halo, Dosen
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                fontWeight: 'bold',
                color: '#15613F',
              }}>
              {user?.nama_lengkap || user?.name || 'Bapak/Ibu Dosen'}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: responsiveWidth(10),
              height: responsiveWidth(10),
              borderRadius: responsiveWidth(5),
              backgroundColor: '#15613F',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => props.navigation.navigate('Profile')}
          >
            <Icon name="person" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Grid Menu */}
      <View
        style={{
          marginHorizontal: responsiveWidth(5),
          backgroundColor: '#fff',
          borderRadius: 20,
          paddingVertical: responsiveWidth(4),
          marginTop: -responsiveHeight(3),
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}>
          {userData.map((list, index) => (
            <TouchableOpacity
              key={`${index}-${list.value}`}
              activeOpacity={0.7}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: responsiveWidth(2),
                width: responsiveWidth(20),
              }}
              onPress={() => handleMenuPress(list)}>
              {list.icon()}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: responsiveFontSize(1.3),
                  fontWeight: '600',
                  color: '#374151',
                  marginTop: 6,
                }}>
                {list.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Banner Pengumuman & Berita */}
      <View
        style={{
          marginTop: responsiveWidth(6),
          marginHorizontal: responsiveWidth(5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: responsiveWidth(3),
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#ECFDF5',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: responsiveWidth(2.5),
              }}>
              <Icon name="campaign" size={22} color="#15613F" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: responsiveFontSize(2),
                  fontWeight: 'bold',
                  color: '#1F2937',
                }}>
                Pengumuman Dosen
              </Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.2),
                  color: '#9CA3AF',
                  marginTop: 1,
                }}>
                Informasi penting kampus
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: responsiveWidth(1) }}>
          {eventList.map((list: any) => (
            <TouchableOpacity
              onPress={() => {
                props.navigation.push('home.detail-pengumuman', {
                  ...list,
                });
              }}
              key={list.id}
              activeOpacity={0.85}
              style={{
                marginRight: responsiveWidth(3),
                width: responsiveWidth(72),
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                overflow: 'hidden',
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
              }}>
              {list?.pamflet_url ? (
                <Image
                  source={{ uri: list?.pamflet_url }}
                  resizeMode="cover"
                  style={{
                    width: '100%',
                    height: responsiveWidth(40),
                  }}
                />
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: responsiveWidth(40),
                    backgroundColor: '#F3F4F6',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="image" size={40} color="#D1D5DB" />
                </View>
              )}
              <View style={{ padding: responsiveWidth(3.5) }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    fontWeight: 'bold',
                    color: '#1F2937',
                    marginBottom: 4,
                  }}
                  numberOfLines={2}>
                  {list?.title || 'Pengumuman Terbaru'}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4,
                  }}>
                  <Icon name="calendar-today" size={13} color="#9CA3AF" />
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.2),
                      color: '#9CA3AF',
                      marginLeft: 4,
                    }}>
                    {moment(list?.created_at).format('DD MMM YYYY')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* UCL Challenge / Berita Section */}
      <View
        style={{
          marginTop: responsiveWidth(5),
          marginHorizontal: responsiveWidth(5),
          marginBottom: responsiveWidth(8),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: responsiveWidth(3),
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#FEF3C7',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: responsiveWidth(2.5),
              }}>
              <Icons name="medal" size={20} color="#F59E0B" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: responsiveFontSize(2),
                  fontWeight: 'bold',
                  color: '#1F2937',
                }}>
                UCL Challenge & Event
              </Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.2),
                  color: '#9CA3AF',
                  marginTop: 1,
                }}>
                Kegiatan & tantangan aktif
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            overflow: 'hidden',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}>
          {tantanganList.map((list: any, index: number) => (
            <TouchableOpacity
              onPress={() => {
                props.navigation.push('home.detail-challenge', {
                  ...list,
                });
              }}
              key={`tantangan-${list.id}`}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: responsiveWidth(3),
                paddingHorizontal: responsiveWidth(4),
                borderBottomWidth: index !== tantanganList.length - 1 ? 1 : 0,
                borderBottomColor: '#F3F4F6',
              }}>
              <View
                style={{
                  width: responsiveWidth(18),
                  height: responsiveWidth(18),
                  borderRadius: 12,
                  overflow: 'hidden',
                  backgroundColor: '#F3F4F6',
                }}>
                {list.pamflet_url ? (
                  <Image
                    source={{ uri: list.pamflet_url }}
                    resizeMode="cover"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icons name="trophy" size={24} color="#D1D5DB" />
                  </View>
                )}
              </View>

              <View
                style={{
                  flex: 1,
                  marginLeft: responsiveWidth(3),
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: 4,
                  }}
                  numberOfLines={2}>
                  {list.title}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      backgroundColor: '#ECFDF5',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 6,
                    }}>
                    <Icon name="schedule" size={12} color="#15613F" />
                  </View>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.2),
                      color: '#9CA3AF',
                    }}>
                    {moment(list.created_at).format('DD MMM YYYY')}
                  </Text>
                </View>
              </View>

              <Icon name="chevron-right" size={22} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DosenMenuComponent;
