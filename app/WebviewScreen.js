import React, {useState, useEffect} from 'react';
import {View, PermissionsAndroid, Dimensions, BackHandler, Alert} from 'react-native';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WebView} from 'react-native-webview';
import Loader from './Loader';
import {getUserAgent} from 'react-native-device-info';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WebviewScreen = ({navigation}) => {
  const [weburl, setWeburl] = useState('');
  const [loading, setLoading] = useState(true);
  const [customUserAgent, setCustomUserAgent] = useState('');

  useEffect(() => {
    // ReactNativeForegroundService.stop();
    getUserAgent().then((agent) =>{
      // console.log(agent)
      setCustomUserAgent(agent)
    })
    AsyncStorage.getItem('weburl').then(async value => {
      let user = JSON.parse(await AsyncStorage.getItem('user_loginid'));
      if (value !== null) {
        let url = value + `&checkin_id=${user}`;
        // console.log(url)
        setWeburl(url);
      }
    });

    // const backAction = () => {
    //   Alert.alert('Hold on!', 'Are you sure you want to go back?', [
    //     {
    //       text: 'Cancel',
    //       onPress: () => null,
    //       style: 'cancel',
    //     },
    //     {text: 'YES', onPress: () => BackHandler.exitApp()},
    //   ]);
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   backAction,
    // );

    // const requestPermission = async () => {
    //   try {
    //     const granted = await PermissionsAndroid.requestMultiple([
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    //     ]);
    //   } catch (err) {
    //     console.warn(err);
    //   }
    // };

    // requestPermission();

    // return () => {
    //   backHandler.remove();
    // };
  }, []);

  const navigateFunc = state => {
    // console.log('onNavigationStateChange', state)
    if (
      state.url === 'https://www.jeftechno.com/salesvisit/checkout/?info=close'
    ) {
      AsyncStorage.removeItem('login_first_time');
      AsyncStorage.removeItem('user_loginid');
      navigation.dispatch(StackActions.replace('Dashboard'));
    }
  };

  const hideSpinner = () => {
    setLoading(false);
  };
  return (
    <View style={{flex: 1}}>
      <Loader loading={loading} />
      <WebView
        source={{uri: weburl}}
        userAgent={customUserAgent}
        onLoadEnd={() => hideSpinner()}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        geolocationEnabled={true}
        style={{height: windowHeight, width: windowWidth}}
        onLoadProgress={({nativeEvent}) => {
          //your code goes here
        }}
        onNavigationStateChange={state => navigateFunc(state)}
      />
    </View>
  );
};

export default WebviewScreen;
