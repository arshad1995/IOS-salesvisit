import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import {TextInput, Checkbox} from 'react-native-paper';
// import CheckBox from '@react-native-community/checkbox';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUniqueId, getVersion} from 'react-native-device-info';
import {StackActions} from '@react-navigation/native';
import Loader from './Loader';
import Toast from 'react-native-simple-toast';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { requestLocationPermission, checkLocationServicesEnabled } from '../LocationPermissions';
// import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [deviceid, setDeviceId] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true); // Added state for password visibility

  const passwordInputRef = createRef();


  useEffect(() => {
    const initializeLocationServices = async () => {
      // await requestLocationPermission();
      // await checkLocationServicesEnabled();
      
    };

    initializeLocationServices();

    // return () => {
    //   LocationService.stopLocationUpdates();
    // };
  }, []);


  useEffect(() => {
    getUniqueId().then(uniqueId => {
      setDeviceId(uniqueId);
    });
    //   LocationPermission();
    AsyncStorage.getItem('user_save').then(value => {
      setLoading(true);
      if (value !== null) {
        let user = JSON.parse(value);
        setUserPassword(user.pass);
        setUserEmail(user.userid);
        setSelection(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const LocationPermission = async () => {
    // console.log('Platform.Version', Platform.Version)
    if (Platform.Version > 28) {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ],
        {
          title: 'Background Location Permission',
          message:
            'We need access to your location ' +
            'so you can get live quality updates.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      // console.log('granted', granted)
      if (
        granted['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'denied'
      ) {
        const grandFineLocation = PermissionsAndroid.requestMultiple(
          [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION],
          {
            title: 'Background Location Permission',
            message:
              'We need access to your location ' +
              'so you can get live quality updates.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        // console.log('grandFineLocation', grandFineLocation)
        if (grandFineLocation['android.permission.ACCESS_FINE_LOCATION']) {
          backgroundgranted();
        }
      } else {
        if (
          granted['android.permission.ACCESS_BACKGROUND_LOCATION'] &&
          granted['android.permission.ACCESS_FINE_LOCATION']
        ) {
          backgroundgranted();
        }
      }
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Background Location Permission',
          message:
            'We need access to your location ' +
            'so you can get live quality updates.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted) {
        backgroundgranted();
      }
    }
  };

  const backgroundgranted = async () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    setLoading(true);
    let versionId = getVersion();
    let dataToSend = {userid: userEmail, pass: userPassword, imeino: deviceid, appversion: versionId };

    fetch('https://dev.telibrahma.in/salesvisit/userLogin', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("responseJson", responseJson)
        setLoading(false);
        if (responseJson.respText === 'success') {
          // console.log('responseJson', responseJson);
          if (isSelected === true) {
            AsyncStorage.setItem('user_save', JSON.stringify(dataToSend));
          }
          // console.log('responseJson.loginid', responseJson.loginid)
          if (responseJson.loginid !== null) {
            AsyncStorage.setItem(
              'user_loginid',
              JSON.stringify(responseJson.loginid),
            );
          } else {
            AsyncStorage.setItem('user_loginid', '');
          }
          let data = JSON.stringify(responseJson)
          AsyncStorage.setItem('login_response', data);
          AsyncStorage.setItem('response_login', JSON.stringify(responseJson));
          AsyncStorage.setItem('user_data', JSON.stringify(dataToSend));
          AsyncStorage.setItem('weburl', responseJson.weburl);
          AsyncStorage.getItem('user_save').then(value => {
            if (isSelected === false && value !== null) {
              AsyncStorage.removeItem('user_save');
            }
          });
          if(responseJson?.attenflag === 1){
            AsyncStorage.setItem('mark_attendance', '1');
          }else{
            AsyncStorage.removeItem('mark_attendance');
          }
          navigation.dispatch(StackActions.replace('Dashboard'));
        } else {
          setErrortext('Please enter valid Email or password');
        }
      })
      .catch(error => {
        console.log("error", error)
        setLoading(false);
      });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('./assets/logo.png')}
                style={{
                  width: '50%',
                  height: 100,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                label={'Email'}
                style={styles.inputStyle}
                value={userEmail}
                outlineStyle={styles.outlineStyle}
                underlineStyle={styles.underlineStyle}
                onChangeText={UserEmail => setUserEmail(UserEmail)}
                // placeholder="Enter Email" //dummy@abc.com
                // placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                mode={'outlined'}
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                outlineStyle={styles.outlineStyle}
                underlineStyle={styles.underlineStyle}
                label={'Password'}
                value={userPassword}
                onChangeText={UserPassword => setUserPassword(UserPassword)}
                // placeholder="Enter Password" //12345
                // placeholderTextColor="#8b9cb5"
                keyboardType="default"
                mode={'outlined'}
                ref={passwordInputRef}
                // onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={secureTextEntry}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
                              <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Icon name={secureTextEntry ? 'visibility-off' : 'visibility'} size={24} color="gray" />
                </TouchableOpacity>
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox.Android
                status={!isSelected ? 'unchecked' : 'checked'}
                onPress={() => setSelection(!isSelected)}
                uncheckedColor="gray"
                //   style={{borderWidth: 1, borderColor: "gray", width: 30, height: 30, backgroundColor: "transparent"}}
              />
              <Text style={styles.label}>Remember Me</Text>
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
        {deviceid !== undefined || deviceid !== nulll ? (
          <Text numberOfLines={2} style={styles.deviceId}>Device Id: {deviceid}</Text>
        ) : null}
        <Text style={styles.appVersion}>Version {getVersion()}</Text>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignContent: 'center',
    position: 'relative',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 60,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7d0705',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7d0705',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 35,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    height: 55,
    borderColor: '#grey',
    backgroundColor: '#fff',
  },
  outlineStyle: {
    borderColor: '#1976d2',
  },
  underlineStyle: {
    borderColor: 'grey',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  label: {
    alignSelf: 'center',
  },
  deviceId: {
    position: 'absolute',
    top: 0,
    // left: 20,
    marginTop: 10,
    color: 'black',
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  appVersion: {
    position: 'relative',
    bottom: -windowHeight / 10,
    left: windowWidth / 2.8,
    color: 'gray',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  label: {
    fontSize: 18,
    color: '#333', // Ensure the label color is visible
    marginLeft: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 20,
  },
});
