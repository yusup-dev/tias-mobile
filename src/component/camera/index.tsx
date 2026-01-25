import React, {memo, useCallback, useMemo, useState, useEffect} from 'react';

import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {BarcodeMaskWithOuterLayout} from '@nartc/react-native-barcode-mask';

import Permission from '../../helper/permissionHelper';

const CameraScanBarcode = ({barcode, back, list}: any) => {
  const [hasPermission, setHasPermission] = React.useState(false);

  useEffect(() => {
    Permission.requestAll();
  }, []);

  return (
    <View>
      <QRCodeScanner
        onRead={(data: any) => {
          console.log({
            data,
            size: data.bounds.size,
            origin: data.bounds.origin,
          });
        }}
        cameraStyle={{
          height: responsiveHeight(79),
        }}
        showMarker={true}
        customMarker={
          <>
            <BarcodeMaskWithOuterLayout
              maskOpacity={0.5}
              edgeColor="#FFFFFF"
              edgeBorderWidth={0}
              // edgeRadius={20}
              width={responsiveWidth(48)}
              height={responsiveWidth(48)}
              showAnimatedLine={false}
            />
            <Image source={require('../../../assets/general/scan.png')} />
          </>
        }
        bottomContent={
          <TouchableOpacity>
            <Text>OK. Got it!</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default CameraScanBarcode;
