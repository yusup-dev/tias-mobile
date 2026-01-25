import {useQuery} from '@tanstack/react-query';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {perkuliahan} from '../../services/perkuliahan/index';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useEffect} from 'react';
import {get_history} from '../../services/absen/index';
const HistoryPerkuliahanComponent = (props: any) => {
  const {data, isLoading}: {data: any; isLoading: Boolean} = useQuery({
    queryKey: ['history_perkuliahan'],
    queryFn: async () => {
      const data: any = await get_history();

      console.log({list: data.data});
      return data.data.filter((list: any) => list.pembelajaran != null);
    },
    onSuccess: succ => {},
    onError: err => {},
  });
  useEffect(() => {
    console.log({props});
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#15613F',
      }}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}
        style={{
          paddingHorizontal: responsiveWidth(2),
          paddingVertical: responsiveWidth(2),
          flexDirection: 'row',
        }}>
        <View style={{alignSelf: 'center'}}>
          <Icons size={24} name="chevron-left" color={'white'} />
        </View>
        <Text
          style={{
            color: 'white',
            fontSize: responsiveFontSize(3),
          }}>
          History
        </Text>
      </TouchableOpacity>
      <View
        style={{
          position: 'absolute',
          width: responsiveWidth(100),
          height: responsiveHeight(70),

          bottom: 0,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            bottom: 0,
            borderTopEndRadius: responsiveWidth(6),
            borderTopStartRadius: responsiveWidth(6),
          }}>
          <ScrollView>
            {!isLoading &&
              data?.length &&
              data?.map((list: any, index: number) => (
                <View
                  key={`${index}-perkuliahan-${list.id}`}
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
                      <Text style={{color: 'white'}}>Present</Text>
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
                        {list.pembelajaran.matkul.name}
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
                      Pertemuan {list.pembelajaran.pertemuan}
                    </Text>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.5),
                      }}>
                      {list.pembelajaran.kelas}{' '}
                      {list.pembelajaran.status_kelas ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default HistoryPerkuliahanComponent;
