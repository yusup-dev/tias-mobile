import {useQuery} from '@tanstack/react-query';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {perkuliahan} from '../../services/perkuliahan/index';
import Icons from 'react-native-vector-icons/FontAwesome';
import {useEffect} from 'react';
const PerkuliahanComponent = (props: any) => {
  const {data, isLoading}: {data: any; isLoading: Boolean} = useQuery({
    queryKey: ['perkuliahan'],
    queryFn: () => {
      return perkuliahan();
    },
    onSuccess: succ => {
      //   console.log(succ.data[0]);
      //   console.log({succ});
    },
    onError: err => {
      //   console.log({err});
    },
  });
  //   useEffect(() => {
  //     console.log({props: props.navigation});
  //   }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#15613F',
      }}>
      <View
        style={{
          paddingHorizontal: responsiveWidth(2),
          paddingVertical: responsiveWidth(2),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: responsiveFontSize(3),
          }}>
          Perkuliahan
        </Text>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            props.navigation.push('perkuliahan.history');
          }}>
          <Icons size={24} name="history" color={'white'} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          width: responsiveWidth(100),
          height: responsiveHeight(70),

          bottom: 0,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: responsiveWidth(2),
          }}>
          <Text
            style={{
              color: 'white',
            }}>
            {data?.sks} Total SKS
          </Text>
          <Text
            style={{
              color: 'white',
            }}>
            {data?.totalData} Jumlah Mata Kuliah
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            bottom: 0,
            borderTopEndRadius: responsiveWidth(6),
            borderTopStartRadius: responsiveWidth(6),
          }}>
          <ScrollView>
            {!isLoading ? (
              data.data.map((list: any, index: number) => (
                <View
                  key={`${index}-perkuliahan-${list.curr_code}`}
                  style={{
                    flexDirection: 'row',
                    marginVertical: responsiveWidth(2),
                    paddingHorizontal: responsiveWidth(3),
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#15613F',
                        paddingHorizontal: responsiveWidth(2),
                        paddingVertical: responsiveWidth(2),
                        borderRadius: responsiveWidth(3),
                      }}>
                      <Text style={{color: 'white'}}>{list.curr_code}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: responsiveWidth(3),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {list.name}
                      </Text>
                      <Text
                        style={{
                          fontWeight: 'bold',
                        }}>
                        ({list.sks} SKS)
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.5),
                      }}>
                      {list.dosen}
                    </Text>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.5),
                      }}>
                      {list.day}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: responsiveHeight(3),
                }}>
                Sedang Mengambil Data
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default PerkuliahanComponent;
