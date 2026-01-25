import {useRef} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Signature from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SignaturePage = (props: any) => {
  const ref: any = useRef();

  const handleSignature = (signature: any) => {
    console.log('Tanda tangan base64:', signature); // base64 string
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleEnd = () => {
    ref.current.readSignature(); // Membaca tanda tangan saat selesai
  };

  return (
    <View style={{height: responsiveHeight(90), backgroundColor: '#fff'}}>
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}
        style={{
          marginVertical: responsiveWidth(3),
          marginHorizontal: responsiveWidth(5),
          flexDirection: 'row',
          //   backgroundColor: 'red',
        }}>
        <Icon name="chevron-left" size={24} />
        <Text
          style={{
            marginTop: 2,
          }}>
          Draw your signature below
        </Text>
      </TouchableOpacity>
      <Signature
        style={{
          width: responsiveWidth(90),
          height: responsiveHeight(50),
          margin: 'auto',
          borderRadius: responsiveWidth(7),
        }}
        ref={ref}
        onOK={handleSignature}
        onEmpty={() => console.log('Kosong')}
        onClear={handleClear}
        onEnd={handleEnd}
        descriptionText="Silakan tanda tangan di bawah ini"
        clearText="Hapus"
        confirmText="Simpan"
        webStyle={`
    .m-signature-pad {
      border: 2px solid #gray;
      border-radius: 16px;
      box-shadow: 0 2px 6px #fff; 
    }
    .m-signature-pad--footer {
      display: none;
      margin: 0px;
    }
  `}
      />
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          onPress={handleClear}
          style={{
            borderWidth: 1,
            borderColor: 'red',
            height: responsiveHeight(5),
            width: responsiveWidth(20),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: responsiveWidth(7),
          }}>
          <Text
            style={{
              color: 'red',
            }}>
            Batal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            ref.current.readSignature();
          }}
          style={{
            borderWidth: 1,
            borderColor: 'green',
            height: responsiveHeight(5),
            width: responsiveWidth(20),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: responsiveWidth(7),
          }}>
          <Text
            style={{
              color: 'green',
            }}>
            Simpan
          </Text>
        </TouchableOpacity>
      </View>
      {/* <Button
        title="Simpan Tanda Tangan"
        onPress={() => ref.current.readSignature()}
      /> */}
    </View>
  );
};

export default SignaturePage;
