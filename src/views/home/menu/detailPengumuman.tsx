import moment from 'moment';
import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DetailPengumuman = (props: any) => {
  return (
    <ScrollView style={{ backgroundColor: '#fff', flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}
        style={{
          position: 'absolute',
          left: 15,
          top: 15,
          zIndex: 999,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 20,
          padding: 4,
        }}>
        <Icon name="chevron-left" size={28} color="#000" />
      </TouchableOpacity>
      
      {props.route.params?.pamflet_url ? (
        <Image
          source={{
            uri: props.route.params.pamflet_url,
          }}
          resizeMode="cover"
          style={{
            width: responsiveWidth(100),
            height: responsiveHeight(40),
          }}
        />
      ) : (
        <View style={{
          width: responsiveWidth(100),
          height: responsiveHeight(30),
          backgroundColor: '#F3F4F6',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon name="campaign" size={60} color="#D1D5DB" />
        </View>
      )}
      
      <View
        style={{
          marginVertical: responsiveWidth(5),
          marginHorizontal: responsiveWidth(5),
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: responsiveFontSize(2.2),
            color: '#1F2937',
            marginBottom: 8,
          }}>
          {props.route.params?.title || 'Pengumuman'}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Icon name="calendar-today" size={16} color="#6B7280" />
          <Text
            style={{
              fontSize: responsiveFontSize(1.4),
              color: '#6B7280',
              marginLeft: 6,
            }}>
            {props.route.params?.created_at ? moment(props.route.params.created_at).format('LLL') : '-'}
          </Text>
        </View>
        
        <Text
          style={{
            fontSize: responsiveFontSize(1.6),
            lineHeight: 24,
            color: '#4B5563',
          }}>
          {props.route.params?.deskripsi || 'Tidak ada deskripsi detail.'}
        </Text>
      </View>
    </ScrollView>
  );
};

export default DetailPengumuman;
