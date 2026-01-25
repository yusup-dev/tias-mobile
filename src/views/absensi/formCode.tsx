import {useMutation, useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import DialogComponent from '../../component/dialog/DialogComponent';
import {get_pembelajaran} from '../../services/absen/index';
import ValidateComponent from './validate';

const FormCodeComponent = (props: any) => {
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props_, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [dataMatkul, setDataMatkul] = useState<{
    matkul: string;
    pertemuan: string;
    dosen: string;
    kelas: string;
    token: string;
  }>({
    matkul: '',
    pertemuan: '',
    dosen: '',
    kelas: '',
    token: '',
  });
  const [validateData, setValidateData] = useState(false);
  const {mutate, isLoading} = useMutation({
    mutationFn: get_pembelajaran,
    onSuccess: (succ: any) => {
      if (succ.data.length) {
        const {pertemuan, dosen, matkul, kelas} = succ.data[0];
        setDataMatkul({
          dosen: dosen.nama,
          pertemuan: pertemuan,
          matkul: matkul.name,
          kelas: kelas,
          token: value,
        });
        setValidateData(true);
      } else {
        setModalQuery({
          title: 'Alert',
          visible: true,
          desc: {
            buttonCancel: 'Ok',
            buttonDone: '',
            title:
              'Mata Kuliah Tidak Ditemukan, Silahkan masukkan kembali TOKEN dengan benar!',
          },
        });
      }
    },
  });
  const [modalQuery, setModalQuery] = useState({
    visible: false,
    title: '',
    desc: {
      buttonCancel: 'Cancel',
      buttonDone: 'Done',
      title: 'Are you sure?',
    },
  });
  const submit = () => {
    mutate({
      token: value,
    });
  };
  if (validateData) {
    return (
      <ValidateComponent
        props={props}
        onPress={() => {
          setValidateData(false);
          setValue('');
        }}
        dataMatkul={dataMatkul}
      />
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <View>
          <Image source={require('../../../assets/login/banner-home.png')} />
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: responsiveFontSize(3),
              }}>
              ABSENSI
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
            flexDirection: 'column',
          }}>
          <CodeField
            ref={ref}
            value={value}
            cellCount={CELL_COUNT}
            onChangeText={setValue}
            rootStyle={styles.codeFieldRoot}
            keyboardType="numeric"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
            //...
          />
          <View>
            {value.length == CELL_COUNT ? (
              <TouchableOpacity
                onPress={submit}
                style={{
                  backgroundColor: '#6A5BE2',
                  paddingVertical: responsiveWidth(3),
                  marginHorizontal: responsiveWidth(5),
                  borderRadius: responsiveWidth(3),
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            ) : (
              <Pressable
                style={{
                  backgroundColor: '#E9e9e9',
                  paddingVertical: responsiveWidth(3),
                  marginHorizontal: responsiveWidth(5),
                  borderRadius: responsiveWidth(3),
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  Submit
                </Text>
              </Pressable>
            )}
          </View>
        </View>
        <DialogComponent
          visible={modalQuery.visible}
          onDismiss={() => {
            setModalQuery({
              ...modalQuery,
              visible: !modalQuery.visible,
            });
            setValue('');
          }}
          title={modalQuery.title}
          desc={modalQuery.desc}
        />
      </View>
    );
  }
};
const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    // marginTop: responsiveWidth(40),
    paddingHorizontal: responsiveWidth(6),
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    borderRadius: responsiveWidth(3),
  },
  focusCell: {
    borderColor: '#000',
  },
});
export default FormCodeComponent;
