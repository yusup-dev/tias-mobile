import { useQuery } from '@tanstack/react-query';
import {
  Image,
  PermissionsAndroid,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { View } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTokenStore } from '../../../store/auth';
import { getEvent, getTantangan } from '../../../services/home/index';
import { getIpkParent } from '../../../services/nilai/index';
import moment from 'moment';
import Geolocation from 'react-native-geolocation-service';
import { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { LoncengIcon } from '../../../../assets/svg';
// import LoncengIcon from '';
const MenuComponent = (props: any) => {
  const { auth, user, setAuthentication, setToken, setUser } = useTokenStore();

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
  const { data, isLoading, isSuccess, isError, error }: { data: any; isLoading: boolean; isSuccess: boolean; isError: boolean; error: any } = useQuery({
    queryKey: ['list_event', {}],
    queryFn: () => {
      return getEvent();
    },
  });

  // Efek pengganti onSuccess
  useEffect(() => {
    if (isSuccess && data) {
      // Logika ketika fetch berhasil
      // console.log({ result: data });
    }
  }, [isSuccess, data]);

  // Efek pengganti onError
  useEffect(() => {
    if (isError) {
      // Logika ketika fetch gagal
      console.log({ result: error });
    }
  }, [isError, error]);
  const {
    data: dataEvent,
    isLoading: isLoadingEvent,
    isSuccess: isSuccessEvent,
    isError: isErrorEvent,
    error: errorEvent,
  }: { data: any; isLoading: boolean; isSuccess: boolean; isError: boolean; error: any } = useQuery({
    queryKey: ['list_tantangan', {}],
    queryFn: () => {
      return getTantangan();
    },
  });

  // Efek pengganti onSuccess (tantangan)
  useEffect(() => {
    if (isSuccessEvent && dataEvent) {
      // console.log({ result: dataEvent });
    }
  }, [isSuccessEvent, dataEvent]);

  // Efek pengganti onError (tantangan)
  useEffect(() => {
    if (isErrorEvent) {
      console.log({ result: errorEvent });
    }
  }, [isErrorEvent, errorEvent]);

  // Query IPK khusus Parent
  const { data: ipkParentRes, isLoading: isLoadingIpk } = useQuery({
    queryKey: ['ipk_parent', user?.npm],
    queryFn: () => getIpkParent(user?.npm as string),
    enabled: user?.role === 'Parent' && !!user?.npm,
  });
  const ipkData = ipkParentRes?.data;

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
        style={{ height: responsiveHeight(13) }}>
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
            fontWeight: '600',
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
          {userData.filter(item => !(user?.role === 'Parent' && item.type === 'kualifikasi')).map((list, index) => (
            <TouchableOpacity
              key={`${index}-${list.value}`}
              style={{
                justifyContent: 'center',
                marginTop: responsiveWidth(3),

                width: responsiveWidth(30),
              }}
              onPress={() => {
                if (list.type === 'pendidikan') {
                  if (user?.role === 'Parent') {
                    props.navigation.push('home.pendidikan');
                  }
                } else if (list.type === 'penelitian') {
                  if (user?.role === 'Parent') {
                    props.navigation.push('home.penelitian');
                  }
                } else if (list.type === 'pengabdian') {
                  if (user?.role === 'Parent') {
                    props.navigation.push('home.pengabdian');
                  }
                } else if (list.type === 'kompetensi') {
                  if (user?.role === 'Parent') {
                    props.navigation.push('home.kompetensi');
                  }
                } else if (list.type === 'penunjang') {
                  if (user?.role === 'Parent') {
                    props.navigation.push('home.penunjang');
                  }
                }
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
      {user?.role === 'Parent' ? (
        <>
          <View
            style={{
              marginHorizontal: responsiveWidth(5),
              marginTop: responsiveWidth(5),
              backgroundColor: '#15613F',
              borderRadius: 16,
              padding: responsiveWidth(4),
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: '#fff', fontSize: responsiveFontSize(1.6), fontWeight: '600' }}>
                  Indeks Prestasi Kumulatif
                </Text>
                <Text style={{ color: '#fff', fontSize: responsiveFontSize(3.5), fontWeight: 'bold', marginTop: 4 }}>
                  {isLoadingIpk ? '...' : ipkData?.ipk || '0.00'}
                </Text>
              </View>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 12,
                borderRadius: 50
              }}>
                <Icon name="school" size={32} color="#fff" />
              </View>
            </View>

            {/* Mini riwayat semester terakhir jika ada */}
            {ipkData?.riwayat && ipkData.riwayat.length > 0 && (
              <View style={{ marginTop: responsiveWidth(4), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.3)', paddingTop: responsiveWidth(3) }}>
                <Text style={{ color: '#E0E0E0', fontSize: responsiveFontSize(1.4), marginBottom: 8 }}>
                  Semester Terakhir ({ipkData.riwayat[ipkData.riwayat.length - 1]?.periodeAkademik?.nama}):
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ color: '#fff', fontSize: responsiveFontSize(1.3) }}>IPS</Text>
                    <Text style={{ color: '#fff', fontSize: responsiveFontSize(1.8), fontWeight: 'bold' }}>
                      {ipkData.riwayat[ipkData.riwayat.length - 1]?.ips || '-'}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: '#fff', fontSize: responsiveFontSize(1.3) }}>SKS Diambil</Text>
                    <Text style={{ color: '#fff', fontSize: responsiveFontSize(1.8), fontWeight: 'bold' }}>
                      {ipkData.riwayat[ipkData.riwayat.length - 1]?.sksDiambil || 0}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: '#fff', fontSize: responsiveFontSize(1.3) }}>SKS Lulus</Text>
                    <Text style={{ color: '#fff', fontSize: responsiveFontSize(1.8), fontWeight: 'bold' }}>
                      {ipkData.riwayat[ipkData.riwayat.length - 1]?.sksLulus || 0}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              marginHorizontal: responsiveWidth(5),
              marginTop: responsiveWidth(4),
              backgroundColor: '#FFF3E0',
              borderRadius: 16,
              padding: responsiveWidth(4),
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              borderWidth: 1,
              borderColor: '#FFE0B2',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: '#E65100', fontSize: responsiveFontSize(1.6), fontWeight: '600' }}>
                  Informasi Tagihan
                </Text>
                <Text style={{ color: '#E65100', fontSize: responsiveFontSize(3), fontWeight: 'bold', marginTop: 4 }}>
                  Rp 0
                </Text>
              </View>
              <View style={{
                backgroundColor: '#FFE0B2',
                padding: 12,
                borderRadius: 50
              }}>
                <Icon name="account-balance-wallet" size={32} color="#E65100" />
              </View>
            </View>
            <View style={{ marginTop: responsiveWidth(3), flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(230, 81, 0, 0.2)', paddingTop: responsiveWidth(3) }}>
              <Icon name="check-circle" size={18} color="#2E7D32" />
              <Text style={{ color: '#2E7D32', fontSize: responsiveFontSize(1.4), marginLeft: 6, fontWeight: '500' }}>
                Seluruh tagihan administrasi telah lunas.
              </Text>
            </View>
          </View>
        </>
      ) : (
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
      )}
      {user?.role !== 'Parent' && (
        <>
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
              shadowOffset: { width: 0, height: 3 },
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
              }}>
              <Icons name="vote" size={responsiveWidth(6)} color={'#2196F3'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('CBT', { screen: 'cbt.exam-list' });
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              height: responsiveHeight(8),
              borderRadius: responsiveWidth(3),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
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
                CBT EXAM
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
              }}>
              <Icons name="vote" size={responsiveWidth(6)} color={'#2196F3'} />
            </View>
          </TouchableOpacity>
        </>
      )}
      {/* ── Pengumuman Section ── */}
      <View style={{
        marginTop: responsiveWidth(2),
        marginHorizontal: responsiveWidth(5),
      }}>
        {/* Section Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: responsiveWidth(2),
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: '#FFF3E0',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: responsiveWidth(2.5),
            }}>
              <Icon name="campaign" size={20} color="#F59E0B" />
            </View>
            <View>
              <Text style={{
                fontSize: responsiveFontSize(2),
                fontWeight: 'bold',
                color: '#1F2937',
              }}>
                Pengumuman
              </Text>
              <Text style={{
                fontSize: responsiveFontSize(1.2),
                color: '#9CA3AF',
                marginTop: 1,
              }}>
                Event & info terkini
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ECFDF5',
            paddingHorizontal: responsiveWidth(3),
            paddingVertical: responsiveWidth(1.5),
            borderRadius: 20,
          }}>
            <Text style={{
              fontSize: responsiveFontSize(1.3),
              color: '#15613F',
              fontWeight: '600',
              marginRight: 4,
            }}>
              Lihat Semua
            </Text>
            <Icon name="chevron-right" size={16} color="#15613F" />
          </TouchableOpacity>
        </View>

        {/* Pengumuman Cards Carousel */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: responsiveWidth(5) }}
        >
          {data?.data.map((list: any, index: number) => (
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
                <View style={{
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
                <Text style={{
                  fontSize: responsiveFontSize(1.6),
                  fontWeight: 'bold',
                  color: '#1F2937',
                  marginBottom: 4,
                }} numberOfLines={2}>
                  {list?.title || 'Pengumuman Terbaru'}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                }}>
                  <Icon name="calendar-today" size={13} color="#9CA3AF" />
                  <Text style={{
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

      {/* ── UCL Challenge / Berita Section ── */}
      <View style={{
        marginTop: responsiveWidth(5),
        marginHorizontal: responsiveWidth(5),
        marginBottom: responsiveWidth(5),
      }}>
        {/* Section Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: responsiveWidth(3),
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
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
              <Text style={{
                fontSize: responsiveFontSize(2),
                fontWeight: 'bold',
                color: '#1F2937',
              }}>
                UCL Challenge
              </Text>
              <Text style={{
                fontSize: responsiveFontSize(1.2),
                color: '#9CA3AF',
                marginTop: 1,
              }}>
                Raih hadiah menarik
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ECFDF5',
            paddingHorizontal: responsiveWidth(3),
            paddingVertical: responsiveWidth(1.5),
            borderRadius: 20,
          }}>
            <Text style={{
              fontSize: responsiveFontSize(1.3),
              color: '#15613F',
              fontWeight: '600',
              marginRight: 4,
            }}>
              Lihat Semua
            </Text>
            <Icon name="chevron-right" size={16} color="#15613F" />
          </TouchableOpacity>
        </View>

        {/* Challenge Cards */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          overflow: 'hidden',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }}>
          {dataEvent?.data.map((list: any, index: number) => (
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
                borderBottomWidth: index !== (dataEvent?.data?.length ?? 0) - 1 ? 1 : 0,
                borderBottomColor: '#F3F4F6',
              }}>
              {/* Thumbnail */}
              <View style={{
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
                  <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Icons name="trophy" size={24} color="#D1D5DB" />
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={{
                flex: 1,
                marginLeft: responsiveWidth(3),
                justifyContent: 'center',
              }}>
                <Text style={{
                  fontSize: responsiveFontSize(1.6),
                  fontWeight: '600',
                  color: '#1F2937',
                  marginBottom: 4,
                }} numberOfLines={2}>
                  {list.title}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <View style={{
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
                  <Text style={{
                    fontSize: responsiveFontSize(1.2),
                    color: '#9CA3AF',
                  }}>
                    {moment(list.created_at).format('DD MMM YYYY')}
                  </Text>
                </View>
              </View>

              {/* Chevron */}
              <Icon name="chevron-right" size={22} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MenuComponent;
