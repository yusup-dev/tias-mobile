import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DetailChallange = (props: any) => {
  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}
        style={{
          position: 'absolute',
          left: 5,
          top: 5,
          zIndex: 999,
          backgroundColor: '#fff',
          borderRadius: responsiveWidth(7),
        }}>
        <Icon name="chevron-left" size={30} />
      </TouchableOpacity>
      {/* <Text>{JSON.stringify(props.route.params)}</Text> */}
      <Image
        source={{
          uri: props.route.params.pamflet_url,
        }}
        resizeMode="stretch"
        style={{
          width: responsiveWidth(100),
          height: responsiveHeight(70),
        }}
      />
      <View
        style={{
          marginVertical: responsiveWidth(3),
          marginHorizontal: responsiveWidth(4),
        }}>
        <Text
          style={{
            fontWeight: 'bold',
          }}>
          {props.route.params.title}
        </Text>
        <Text
          style={{
            fontSize: responsiveFontSize(1.4),
          }}>
          {moment(props.route.params.created_at).format('LLL')}
        </Text>
        <Text
          style={{
            marginTop: responsiveHeight(2),
          }}>
          {props.route.params.deskripsi}
        </Text>
      </View>
    </ScrollView>
  );
};

export default DetailChallange;
