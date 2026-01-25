import {useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {ribuanCast} from '../../helper/ribuan';
import {profile} from '../../services/auth/profile';
import StaggeredList from '@mindinventory/react-native-stagger-view';
import LinearGradient from 'react-native-linear-gradient';
const ListStatistik = ({data}: {data: any}) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: responsiveWidth(5),
      }}
      showsHorizontalScrollIndicator={false}
      horizontal={true}>
      <View style={style.card}>
        <Text
          style={{
            fontWeight: '800',
          }}>
          {data?.data?.point_pendidikan
            ? ribuanCast(data?.data?.point_pendidikan)
            : 0}
        </Text>
        <Text
          style={{
            marginTop: responsiveWidth(1),
          }}>
          Pendidikan
        </Text>
        <View
          style={{
            width: responsiveWidth(25),
            marginTop: responsiveWidth(2),
            backgroundColor: 'red',
            height: responsiveWidth(0.8),
          }}></View>
      </View>
      <View style={style.card}>
        <Text
          style={{
            fontWeight: '800',
          }}>
          {data?.data?.point_publikasi
            ? ribuanCast(data?.data?.point_publikasi || 0)
            : 0}
        </Text>
        <Text
          style={{
            marginTop: responsiveWidth(1),
          }}>
          Publikasi
        </Text>
        <View
          style={{
            width: responsiveWidth(25),
            marginTop: responsiveWidth(2),
            backgroundColor: 'red',
            height: responsiveWidth(0.8),
          }}></View>
      </View>
      <View style={style.card}>
        <Text
          style={{
            fontWeight: '800',
          }}>
          {data?.data?.point_penelitian
            ? ribuanCast(data?.data?.point_penelitian || 0)
            : 0}
        </Text>
        <Text
          style={{
            marginTop: responsiveWidth(1),
          }}>
          Penelitian
        </Text>
        <View
          style={{
            width: responsiveWidth(25),
            marginTop: responsiveWidth(2),
            backgroundColor: 'red',
            height: responsiveWidth(0.8),
          }}></View>
      </View>
      <View style={style.card}>
        <Text
          style={{
            fontWeight: '800',
          }}>
          {data?.data?.point_pengabdian
            ? ribuanCast(data?.data?.point_pengabdian || 0)
            : 0}
        </Text>
        <Text
          style={{
            marginTop: responsiveWidth(1),
          }}>
          Pengabdian
        </Text>
        <View
          style={{
            width: responsiveWidth(25),
            marginTop: responsiveWidth(2),
            backgroundColor: 'red',
            height: responsiveWidth(0.8),
          }}></View>
      </View>
      <View style={style.card}>
        <Text
          style={{
            fontWeight: '800',
          }}>
          {data?.data?.point_kompetensi
            ? ribuanCast(data?.data?.point_kompetensi || 0)
            : 0}
        </Text>
        <Text
          style={{
            marginTop: responsiveWidth(1),
          }}>
          Kompetensi
        </Text>
        <View
          style={{
            width: responsiveWidth(25),
            marginTop: responsiveWidth(2),
            backgroundColor: 'red',
            height: responsiveWidth(0.8),
          }}></View>
      </View>
      <View style={style.card}>
        <Text
          style={{
            fontWeight: '800',
          }}>
          {data?.data?.point_penunjang
            ? ribuanCast(data?.data?.point_penunjang || 0)
            : 0}
        </Text>
        <Text
          style={{
            marginTop: responsiveWidth(1),
          }}>
          Penunjang
        </Text>
        <View
          style={{
            width: responsiveWidth(25),
            marginTop: responsiveWidth(2),
            backgroundColor: 'red',
            height: responsiveWidth(0.8),
          }}></View>
      </View>
    </ScrollView>
  );
};

const Gamifikasi = () => {
  const {data, isLoading}: {data: any; isLoading: Boolean} = useQuery({
    queryKey: ['profile', {}],
    queryFn: () => {
      return profile();
    },
    onSuccess: result => {
      //   console.log({result});
    },
    onError: result => {
      console.log({result});
    },
  });
  const [listKategori, setListKategori] = useState([
    {
      id: 1,
      title: 'LENCANA',
      deskripsi: 'Koleksi semua lencana',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#FDD6DA',
      image: require('../../../assets/lencana/icon-lencana.png'),
    },
    {
      id: 2,
      title: 'Pencapaian',
      deskripsi: 'Koleksi semua lencana',
      width: responsiveWidth(43),
      height: responsiveHeight(30),
      backgroundColor: '#FCF1D5',
      image: require('../../../assets/lencana/icon-acara.png'),
    },
    {
      id: 3,
      title: 'Misi',
      deskripsi: 'Koleksi semua lencana',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#D6EFFD',
      image: require('../../../assets/lencana/icon-misi.png'),
    },
    {
      id: 4,
      title: 'Acara',
      deskripsi: 'Koleksi semua lencana',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#F3D6FD',
      image: require('../../../assets/lencana/icon-acara.png'),
    },
    {
      id: 5,
      title: 'Aktivitas',
      deskripsi: 'Koleksi semua lencana',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#FCF1D5',
      image: require('../../../assets/lencana/icon-aktivitas.png'),
    },
    {
      id: 6,
      title: 'Ulasan',
      deskripsi: 'Koleksi semua lencana',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#FDD6DA',
      image: require('../../../assets/lencana/icon-ulasan.png'),
    },
    {
      id: 7,
      title: 'Statistik',
      deskripsi: 'Koleksi semua lencana',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#F3D6FD',
      image: require('../../../assets/lencana/icon-statistik.png'),
    },
    {
      id: 7,
      title: 'Papan peringkat',
      deskripsi: 'Koleksi semua lencana',
      width: responsiveWidth(43),
      height: responsiveHeight(20),
      backgroundColor: '#D6EFFD',
      image: require('../../../assets/lencana/icon-papan-peringkat.png'),
    },
  ]);
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
            {/* <Image source={require('../../../../assets/Lonceng.png')} /> */}
            {/* <LoncengIcon width={25} height={30} /> */}
            {/* <Icon name="eye" size={25} color="gray" /> */}
            {/* <Text>Icon</Text> */}
          </View>
        </View>
      </LinearGradient>
      {/* <Image source={require('../../../assets/login/banner-home.png')} /> */}
      <View
        style={{
          //   marginBottom: responsiveWidth(15),
          marginTop: responsiveWidth(10),
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'absolute',
          left: 0,
          right: 0,
          paddingHorizontal: responsiveWidth(6),
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              alignSelf: 'center',
            }}>
            <Image
              style={{
                width: responsiveWidth(15),
                height: responsiveWidth(15),
                borderRadius: responsiveWidth(20),
              }}
              source={require('../../../assets/login/logo_uika.png')}
            />
          </View>
          <View
            style={{
              alignSelf: 'center',
              marginLeft: responsiveWidth(2),
            }}>
            <Text
              style={{
                color: 'white',
              }}>
              {data?.data?.rank}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(1.4),
              }}>
              {data?.data?.total_point
                ? ribuanCast(data?.data?.total_point || 0)
                : 0}{' '}
              TIAS Score avg
            </Text>
          </View>
        </View>

        <Image
          style={{
            width: responsiveWidth(15),
            height: responsiveWidth(15),
            alignSelf: 'center',
          }}
          source={require('../../../assets/lencana/lencana_novice.png')}
        />
      </View>
      <View
        style={{
          paddingHorizontal: responsiveWidth(4),
          paddingTop: responsiveWidth(3),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderRadius: responsiveWidth(3),
            borderColor: '#CCC4C4',
            padding: responsiveWidth(2),
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={require('../../../assets/login/mdi_shield-star.png')}
              />
              <Text
                style={{
                  alignSelf: 'center',
                }}>
                UCL Club
              </Text>
            </View>
            <View
              style={{
                marginTop: responsiveWidth(2),
              }}>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.5),
                }}>
                Program loyalitas TIAS
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              backgroundColor: '#15613F',
              paddingHorizontal: responsiveWidth(3),
              paddingVertical: responsiveWidth(2),
              borderRadius: responsiveWidth(3),
            }}>
            <Text
              style={{
                color: 'white',
              }}>
              Ikuti dengan Gratis
            </Text>
          </TouchableOpacity>
        </View>
        <ListStatistik data={data} />
        <View
          style={{
            marginTop: responsiveWidth(3),
          }}>
          <Text>Tias Kategori</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            <StaggeredList
              data={listKategori}
              animationType={'FADE_IN_FAST'}
              // contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <View
                  key={`kategori-${item.id}`}
                  style={{
                    width: item.width,
                    height: item.height,
                    backgroundColor: item.backgroundColor,
                    marginTop: responsiveWidth(2),
                    borderRadius: responsiveWidth(3),
                    paddingHorizontal: responsiveWidth(3),
                    justifyContent: 'space-evenly',
                  }}>
                  <Image source={item.image} />
                  <Text
                    style={{
                      fontWeight: '600',
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.2),
                    }}>
                    {item.deskripsi}
                  </Text>
                </View>
              )}
              // isLoading={isLoading}
              // LoadingView={
              //   <View style={styles.activityIndicatorWrapper}>
              //     <ActivityIndicator color={'black'} size={'large'} />
              //   </View>
              // }
            />
            {/* {listKategori.map((list, index: number) => (
              <View
                key={`kategori-${list.id}`}
                style={{
                  width: list.width,
                  height: list.height,
                  backgroundColor: list.backgroundColor,
                }}>
                <Text>{list.title}</Text>
              </View>
            ))} */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const style = StyleSheet.create({
  card: {
    width: responsiveWidth(30),
    borderWidth: 1,
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveWidth(1),
    marginHorizontal: responsiveWidth(1),
  },
});
export default Gamifikasi;
