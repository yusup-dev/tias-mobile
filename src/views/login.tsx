import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Checkbox} from 'react-native-paper';
import {useMutation} from '@tanstack/react-query';
import {login} from '../services/auth/index';
import {useTokenStore} from '../store/auth';
import {DialogComponent} from '../component/dialog';
import {LogoUika} from '../../assets/svg';

const Login = () => {
  const [check, setCheck] = useState(false);
  const [formLogin, setFormLogin] = useState({
    email: '',
    password: {
      value: '',
      secure: true,
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
  const {setAuthentication, setToken, setUser, setRememberMe} = useTokenStore();

  const {mutate, isLoading} = useMutation({
    mutationFn: login,
    onError: () => {},
    onSuccess: (succ: any) => {
      if (succ.message === 'Login Success.') {
        setUser(succ?.data);
        setToken(succ?.data?.token);
        setRememberMe(check);
        setAuthentication(true);
      } else {
        setModalQuery({
          title: 'Alert',
          visible: true,
          desc: {
            buttonCancel: 'Ok',
            buttonDone: '',
            title: succ.message,
          },
        });
      }
    },
  });
  const submit = () => {
    mutate({
      email: formLogin.email.trim(),
      password: formLogin.password.value,
    });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        height: responsiveHeight(100),
        width: responsiveWidth(100),
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          width: responsiveWidth(100),
          zIndex: -1,
        }}>
        <View
          style={{
            flex: 0.4,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/login/ikhwan.png')}
            resizeMode="cover"
            style={{
              height: responsiveHeight(40),
              width: responsiveWidth(50),
            }}
          />
        </View>

        <DialogComponent
          visible={modalQuery.visible}
          onDismiss={() => {
            setModalQuery({
              ...modalQuery,
              visible: !modalQuery.visible,
            });
          }}
          title={modalQuery.title}
          desc={modalQuery.desc}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          width: responsiveWidth(100),
          height: responsiveHeight(80),
          borderTopEndRadius: responsiveWidth(5),
          borderTopStartRadius: responsiveWidth(5),
          paddingHorizontal: responsiveWidth(2),
          paddingVertical: responsiveWidth(3),
          zIndex: 2,
          bottom: -responsiveWidth(40),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              color: '#15613F',
              fontWeight: '600',
              fontSize: responsiveFontSize(3),
            }}>
            Sign In
          </Text>
          <Image
            source={LogoUika}
            resizeMode="cover"
            style={{
              width: responsiveWidth(8),
              height: responsiveWidth(8),
            }}
          />
        </View>
        <View
          style={{
            marginTop: responsiveWidth(2),
          }}>
          <Text>Email</Text>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F1F1FD',
              paddingHorizontal: responsiveWidth(2),
              borderRadius: responsiveWidth(2),
              marginVertical: responsiveWidth(2),
            }}>
            <View
              style={{
                justifyContent: 'center',
              }}>
              <Icon name="email" size={25} color="gray" />
            </View>

            <TextInput
              placeholder="Please put your email"
              value={formLogin.email}
              onChangeText={val => {
                setFormLogin({
                  ...formLogin,
                  email: val,
                });
              }}
              style={{
                flex: 1,
                marginLeft: responsiveWidth(2),
              }}
            />
          </View>
        </View>
        <View
          style={{
            marginTop: responsiveWidth(2),
          }}>
          <Text>Password</Text>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F1F1FD',
              paddingHorizontal: responsiveWidth(2),
              borderRadius: responsiveWidth(2),
              marginVertical: responsiveWidth(2),
            }}>
            <View
              style={{
                justifyContent: 'center',
              }}>
              <Icon name="lock" size={23} color="gray" />
            </View>

            <TextInput
              placeholder="Please put your password"
              secureTextEntry={formLogin.password.secure}
              style={{
                flex: 1,
                marginLeft: responsiveWidth(2),
              }}
              onChangeText={val => {
                setFormLogin({
                  ...formLogin,
                  password: {
                    secure: formLogin.password.secure,
                    value: val,
                  },
                });
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setFormLogin({
                  ...formLogin,
                  password: {
                    secure: !formLogin.password.secure,
                    value: formLogin.password.value,
                  },
                });
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}>
                {formLogin.password.secure ? (
                  <Icon name="eye" size={25} color="gray" />
                ) : (
                  <Icon name="eye-off" size={25} color="gray" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: responsiveWidth(1),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Checkbox
              status={check ? 'checked' : 'unchecked'}
              onPress={() => {
                setCheck(!check);
              }}
            />

            <Text
              style={{
                alignSelf: 'center',
              }}>
              Ingat Saya
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                color: 'gray',
              }}>
              Lupa Password?
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={submit}
          style={{
            backgroundColor: '#15613F',
            paddingVertical: responsiveWidth(3),
            borderRadius: responsiveWidth(3),
            marginVertical: responsiveWidth(3),
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
            }}>
            Login
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: responsiveWidth(2),
          }}>
          <Text>Belum punya akun?</Text>
          <Text
            style={{
              color: '#15613F',
              fontWeight: '700',
            }}>
            Daftar Sekarang
          </Text>
        </View>
      </View>
      {isLoading && (
        <View
          style={{
            flex: 1,
            height: responsiveHeight(100),
            width: responsiveWidth(100),
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: 'transparent',
            zIndex: 50,
          }}>
          <Text
            style={{
              alignSelf: 'center',
              marginRight: responsiveWidth(2),
            }}>
            Please Wait
          </Text>

          <ActivityIndicator />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Login;