import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';

const SplashScreen = ({navigation}) => {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    AsyncStorage.removeItem('login_first_time');
    setTimeout(() => {
      setAnimating(false);
      // navigation.dispatch(
      //   StackActions.replace(value === null ? 'LoginScreen' : 'Dashboard'),
      //   StackActions.replace('LoginScreen'),
      // );
      AsyncStorage.getItem('user_id').then(value => {
        navigation.dispatch(
          StackActions.replace(value === null ? 'LoginScreen' : 'Dashboard'),
          // StackActions.replace('LoginScreen'),
        );
      });
    }, 3000);
  }, []);

  return (
    <View 
    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={require('./assets/logo.png')}
        style={{
          width: 100,
          height: 100,
          resizeMode: 'contain',
          margin: 30,
        }}
      />
    </View>
  );
};

export default SplashScreen;
