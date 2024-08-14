// import React, {useEffect, useState, useRef} from 'react';
// import {
//   View,
//   Text,
//   PermissionsAndroid,
//   Platform,
//   FlatList,
//   Alert,
//   AppState,
//   BackHandler,
//   Dimensions,
//   Image,
// } from 'react-native';
// import LocationService from '../LocationService';
// import { requestLocationPermission, checkLocationServicesEnabled } from '../LocationPermissions';

// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
// const Dashboard = ({navigation}) => {
//     console.log("test")

//     useEffect(() => {
//         const initializeLocationServices = async () => {
//           await requestLocationPermission();
//           await checkLocationServicesEnabled();
//         };

//         initializeLocationServices();

//         return () => {
//           LocationService.stopLocationUpdates();
//         };
//       }, []);

// return(
//     <View>
//         <Text>Test</Text>
//     </View>
// )
//  }

//  export default Dashboard;

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Platform,
  FlatList,
  Alert,
  AppState,
  BackHandler,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';
import {getUniqueId} from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';
import {Modal, FAB, Button, Snackbar} from 'react-native-paper';
import Loader from './Loader';
import Toast from 'react-native-simple-toast';
import LocationService from '../LocationService';
// import {requestLocationPermission} from '../LocationPermissions';
// import BackgroundJob from 'react-native-background-actions';
import BackgroundFetch from 'react-native-background-fetch';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// BackgroundJob.on('expiration', () => {
//   console.log('iOS: I am being closed!');
// });

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
};

const Dashboard = ({navigation}) => {
  const [access, setAccess] = useState(1244);
  const [locationAccess, setLocationAccess] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [forceEnable, setForceEnable] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [increment, setIncrement] = useState(3);
  const [oneTime, setOneTime] = useState(false);
  const [data, setData] = useState([]);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState({open: false});
  const [loading, setLoading] = useState(false);
  const [deviceid, setDeviceId] = useState('');
  const [snakebar, setSnakebar] = useState(false);
  const [attendance, setAttendance] = useState(0);
  const [markOnClick, setMarkOnClick] = useState(false);
  const [warning, setWarning] = useState(false);
  const [childMounted, setChildMounted] = useState(true);
  const [loginIdPrint, setLoginIdPrint] = useState(null);

  const onToggleSnackBar = () => setVisible(!snakebar);
  const onDismissSnackBar = () => setVisible(false);
  const onStateChange = ({open}) => setState({open});
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const onDismissWarningBar = () => setVisible(false);

  const [loginData, setLoginData] = useState(null);

  const [checkInModal, setCheckInModal] = useState(false);
  const [proceedData, setProceedData] = useState(null);
  const [attendanceMessage, setAttendanceMessage] =  useState('');

  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    height: windowHeight / 2,
    margin: 10,
    borderRadius: 10,
  };

  const containerCheckInStyle = {
    backgroundColor: 'white',
    padding: 20,
    height: windowHeight / 4,
    margin: 10,
    borderRadius: 10,
  };

  const {open} = state;

  // let playing = BackgroundJob.isRunning();

  const toggleBackground = async () => {
    playing = !playing;
    if (playing) {
      try {
        console.log('Trying to start background service');
        await BackgroundJob.start(() => {}, options);
        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundJob.stop();
    }
  };

  useEffect(() => {
    const initializeLocationServices = async () => {
      //   await requestLocationPermission();
      await checkLocationServicesEnabled();
      //    BackgroundTimer.runBackgroundTimer(() => {
      //     StartService();
      //   }, 10000);

      // initBackgroundFetch();

      LocationService.startLocationUpdates();
      //   LocationService.startBackgroundTimer();
    };

    initializeLocationServices();

    return () => {
      LocationService.stopLocationUpdates();
    };
    // return () => {
    //     BackgroundTimer.stopBackgroundTimer(timerId);
    //   };
  }, []);

  useEffect(() => {
    // Initialize device ID and permissions
    getUniqueId().then(uniqueId => {
      setDeviceId(uniqueId);
    });
    // LocationPermission();
    // getLoginId();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    // if (appState.current === 'background') {
    //   stopBackgroundService();
    // }
    getFlag();
    attendanceMarkCheck();
    getLoginData();
  }, []);

  const getLoginData = async () => {
    const data = await AsyncStorage.getItem('response_login');
    const dataParse = JSON.parse(data);
    if (dataParse) {
      setLoginData(dataParse);
    }
  };

  const initBackgroundFetch = async () => {
    // BackgroundFetch event handler.
    const onEvent = async taskId => {
      console.log('[BackgroundFetch] task:', taskId);
      // Do your background work...
      await StartService(taskId); // IMPORTANT: Signal to the OS that your task is complete.
    };

    // Configure BackgroundFetch
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 0.5, // 15 minutes in seconds
        stopOnTerminate: false, // Not applicable for iOS
        startOnBoot: true, // Not applicable for iOS
      },
      onEvent,
      error => console.error('[BackgroundFetch] Error:', error),
    );

    // Start the background fetch
    BackgroundFetch.start();
  };

  const checkLocationServicesEnabled = async () => {
    if (Platform.OS === 'ios') {
      const locationEnabled = await Geolocation.requestAuthorization('always');
      console.log('locationEnabled', locationEnabled);
      if (locationEnabled !== 'granted') {
        setForceEnable(true);
        getLoginId();
      } else {
        getLoginId();
      }
      if (locationEnabled !== 'granted') {
        Alert.alert(
          'Enable Location Services',
          'Location services are disabled. Please enable them in settings.',
        );
      }
    }
  };

  useEffect(() => {
    setTimeout(()=>{
      setLoading(false);
    },30000)
  }, [loading]);

  const getFlag = async () => {
    const attend = await AsyncStorage.getItem('response_login');
    const flag = JSON.parse(attend);
    if (flag?.attenflag !== 0) {
      setAttendance(flag?.attenflag);
    } else {
      AsyncStorage.removeItem('mark_attendance');
    }
  };

  const getLoginId = async () => {
    const loginId = JSON.parse(await AsyncStorage.getItem('user_loginid'));
    if (loginId === null) {
      autoDetect(true);
    } else {
      showModal();
      setForceEnable(true);
    }
  };

  const autoDetect = (detect = false) => {
    AsyncStorage.getItem('login_first_time').then(value => {
      if (value === null) {
        if (forceEnable === false || detect === true) {
          // BackgroundTimer.runBackgroundTimer(() => {
          //     StartService();
          //     initBackgroundFetch();
          //     console.log("session autodetect")
          //   }, 10000);
          StartService();
        }
      }else{
        setLoading(false);
      }
    });
  };

  // const stopBackgroundService = () => {
  //   BackgroundTimer.stopBackgroundTimer();
  // };

  const LocationPermission = async () => {
    // For iOS, you don't need to manually request location permission here
    // as it's handled by the geolocation library.
    getLoginId();
  };

  const startBackgroundService = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      StartService();
    }, 25000);
  };

  const createTwoButtonAlert = data => {
    const long = JSON.stringify(data.coords.longitude);
    const lat = JSON.stringify(data.coords.latitude);
    Alert.alert('Device Location', `long: ${long} lat: ${lat}`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  };

  // const startTask = () => {
  //   if (forceEnable) {
  //     startBackgroundService();
  //   } else {
  //     LocationPermission();
  //   }
  // };

  const getFirstSession = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user_data'));
    const email = user?.userid;

    Geolocation.getCurrentPosition(
      position => {
        const option = {
          userid: email,
          username: email,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        fetch('https://dev.telibrahma.in/salesvisit/insertLoginLog', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(option),
        })
          .then(response => response.json())
          .then(async response => {
            console.log('First session', response);

            setLoading(false);
            await AsyncStorage.setItem(
              'user_loginid',
              JSON.stringify(response.loginid),
            );
            await AsyncStorage.setItem('addData', 'success');
            setLoginIdPrint(response.loginid);
            Toast.show(
              'Login ID: ' + JSON.stringify(response.loginid),
              Toast.LONG,
            );
            const resp = [position];
            setData([{...resp, response: response.origin}]);
            setIncrement(increment + 3);
            setFirstTime(true);
          })
          .catch(error => {
            setLoading(false);
          });
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 25000,
        interval: 25000,
        distanceFilter: 5,
        maximumAge: 0,
        useSignificantChanges: false,
        showsBackgroundLocationIndicator: true,
      },
    );
  };

  const getPreviousSession = async id => {
    const user = JSON.parse(await AsyncStorage.getItem('user_data'));
    const email = user.userid;

    Geolocation.getCurrentPosition(
      position => {
        const option = {
          userid: email,
          username: email,
          deviceid: deviceid,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          checkin_id: id,
        };
        fetch('https://dev.telibrahma.in/salesvisit/saveLatLong', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(option),
        })
          .then(response => response.json())
          .then(async response => {
            setLoading(false);
            console.log('previous', response);
            await AsyncStorage.setItem('addData', 'success');
            const resp = [position];
            setData([{...resp, response: response.origin}]);
            setIncrement(increment + 3);
            setFirstTime(true);
          })
          .catch(error => {
            setLoading(false);
          });
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 25000,
        interval: 25000,
        distanceFilter: 5,
        maximumAge: 0,
        useSignificantChanges: false,
        showsBackgroundLocationIndicator: true,
      },
    );
  };

  const StartService = async () => {
    console.log('Use Effect, StartService');
    BackgroundTimer.runBackgroundTimer(() => {
      setOneTime(true);
      AsyncStorage.getItem('login_first_time').then(value => {
        if (value === null) {
          AsyncStorage.setItem('login_first_time', 'started');
        }
      });
      AsyncStorage.getItem('user_loginid').then(async user => {
        if (user === null) {
          // setLoading(true);
          getFirstSession();
        } else {
          // setLoading(true);
          await getPreviousSession(user);
        }
      });
    }, 15000);
  };

  const LogOut = async () => {
    setLoading(true);
    const user = JSON.parse(await AsyncStorage.getItem('user_data'));
    const email = user?.userid;
    const loginId = JSON.parse(await AsyncStorage.getItem('user_loginid'));

    const option = {
      userid: email,
      loginid: loginId,
    };

    Geolocation.getCurrentPosition(
      position => {
        const option = {
          username: email,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        fetch('https://dev.telibrahma.in/salesvisit/insertLogoutLog', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(option),
        })
          .then(response => response.json())
          .then(async response => {
            console.log("logout", response)
            setTimeout(() => {
              AsyncStorage.removeItem('user_loginid');
              AsyncStorage.removeItem('user_data');
              AsyncStorage.removeItem('login_first_time');
              setLoading(false);
              Toast.show(
                response?.respText,
                Toast.LONG,
              );
              navigation.dispatch(StackActions.replace('LoginScreen'));
            }, 1000);
    
            LocationService.stopLocationUpdates();
          })
          .catch(error => {
            setLoading(false);
          });
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 25000,
        interval: 25000,
        distanceFilter: 5,
        maximumAge: 0,
        useSignificantChanges: false,
        showsBackgroundLocationIndicator: true,
      },
    );
  };

  const markAttendance = async () => {
    setLoading(true);
    const attend = JSON.parse(await AsyncStorage.getItem('mark_attendance'));

    const user = JSON.parse(await AsyncStorage.getItem('user_data'));
    const email = user.userid;
    console.log("user", user)

    const loginId = JSON.parse(await AsyncStorage.getItem('user_loginid'));
    // if (attend === 1) {
    //   setWarning(true);
    //   setTimeout(() => {
    //     setWarning(false);
    //   }, 3000);
    // } else {
    Geolocation.getCurrentPosition(
      async position => {
        const option = {
          username: email,
          loginid: loginId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        fetch('https://dev.telibrahma.in/salesvisit/markAttendance', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(option),
        })
        .then((res)=> res.json())
          .then(async response => {
            console.log("res attendance", response)
            const attend = JSON.parse(
              await AsyncStorage.getItem('mark_attendance'),
            );
            const resp = [position];
            setAttendance(attend);
            setIncrement(increment + 3);
            setFirstTime(true);
            setMarkOnClick(true);
            setSnakebar(true);
            await AsyncStorage.setItem('mark_attendance', '1');
            setTimeout(() => {
              setSnakebar(false);
            }, 3000);
            setAttendanceMessage(response?.respText)
            setLoading(false);
          })
          .catch(error => {
            setLoading(false);
            console.error(error);
          });
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 25000,
        interval: 25000,
        distanceFilter: 5,
        maximumAge: 0,
        useSignificantChanges: false,
        showsBackgroundLocationIndicator: true,
      },
    );
    // }
  };

  const attendanceMarkCheck = async () => {
    const attend = JSON.parse(await AsyncStorage.getItem('mark_attendance'));
    if (attend === 1) {
      setAttendance(attend);
    }
  };

  const checkSession = async type => {
    if (type === 'new') {
       AsyncStorage.removeItem('user_loginid');
       autoDetect(true);
       hideModal();
       setLoading(true);
    } else {
      autoDetect(true);
      hideModal();
      setLoading(true);
      AsyncStorage.getItem('user_loginid').then(async user => {
        if (user !== null) {
          setLoginIdPrint(user);
        }
      });
    }
  };

  const stopTask = () => {
    AsyncStorage.getItem('user_loginid').then(async user => {
      // console.log('user', user)
      AsyncStorage.getItem('addData').then(async add => {
        if (user !== null && add !== null) {
          setLoading(false);
          // await ReactNativeForegroundService.stop();
          await LocationService.stopLocationUpdates();
          await navigation.dispatch(StackActions.replace('WebviewScreen'));
          setOneTime(false);
          setIncrement(3);
          setData([]);
          await AsyncStorage.removeItem('addData');
        } else {
          setWarning(true);
          setInterval(() => {
            setWarning(false);
          }, 2000);
        }
      });
    });
  };

  const checkInOut = () => {
    stopTask();
    setCheckInModal(false);
  };

  const handleProceed = async () => {
    setLoading(true);

    const user = JSON.parse(await AsyncStorage.getItem('user_data'));
    const email = user.userid;
    const loginId = JSON.parse(await AsyncStorage.getItem('user_loginid'));

    Geolocation.getCurrentPosition(
      async position => {
        const option = {
          userid: email,
          checkin_id: loginId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        fetch('https://dev.telibrahma.in/salesvisit/getTempDistance', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(option),
        })
          .then(response => response.json())
          .then(async response => {
            console.log('response123', response);
              setProceedData(response?.respText1);
              setCheckInModal(true);
              setLoading(false);
          })
          .catch(error => {
            setLoading(false);
            console.error(error);
          });
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 25000,
        interval: 25000,
        distanceFilter: 5,
        maximumAge: 0,
        useSignificantChanges: false,
        showsBackgroundLocationIndicator: true,
      },
    );
  };

  let ApiData = data.length === 0;

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <Loader loading={loading} />
      {loginData ? (
        <View style={{height: windowHeight / 5}}>
          <ScrollView style={{margin: 15, backgroundColor: '#fff'}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: loginData?.colorFlag === 0 ? 'red' : 'black',
              }}>
              {loginData?.respText1}
            </Text>
          </ScrollView>
        </View>
      ) : null}
      <View
        style={{
          marginTop: 15,
          margin: 15,
          //   borderRadius: 10,
          //   backgroundColor: '#fff',
        }}>
        <View
          style={{
            // height: windowHeight / 5,
            elevation: 1,
            margin: 5,
            borderColor: '#f0f0f0',
            backgroundColor: '#f0f0f0',
            borderWidth: 0.1,
            borderRadius: 10,
            padding: 10,
            alignItems: 'center',
            shadowColor: '#f0f0f0',
          }}>
          <Image
            source={require('./assets/location.png')}
            style={{
              width: '50%',
              height: windowHeight / 10,
              resizeMode: 'contain',
              margin: 30,
            }}
          />
          <Button
            onPress={() => (data?.length > 0 ? handleProceed() : null)}
            style={{backgroundColor: ApiData ? 'gray' : '#7d0705'}}
            disabled={ApiData}
            textColor={'#fff'}>
            PROCEED TO CHECK IN
          </Button>
        </View>
        <View style={{alignItems: 'center', margin: 15}}>
          <Button
            onPress={() => markAttendance()}
            style={{
              backgroundColor:
                attendance === 1 || markOnClick === true
                  ? '#0bfa02'
                  : ApiData
                  ? 'gray'
                  : '#7d0705',
            }}
            textColor={'#fff'}
            disabled={ApiData}>
            MARK ATTENDANCE FOR THE DAY
          </Button>
        </View>
      </View>

      {/* <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ height: windowHeight, width: windowWidth }}>
          {forceEnable ? (
            <View>
              {attendance === 0 ? (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Button mode="contained" onPress={markAttendance}>
                    Mark Attendance
                  </Button>
                </View>
              ) : null}
              <View style={{ height: '90%' }}>
                <FlatList
                  data={data}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={{ margin: 10 }}>
                      <Text>{JSON.stringify(item.coords)}</Text>
                      <Text>{item.response}</Text>
                    </View>
                  )}
                />
              </View>
            </View>
          ) : null}
        </View>
      </View> */}

      {loginIdPrint !== null ? (
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: 'black',
            textAlign: 'center',
          }}>
          Login ID: {loginIdPrint}
        </Text>
      ) : null}
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={item => {
            return (
              <View>
                <Text
                  style={{
                    marginTop: 15,
                    margin: 10,
                    textDecorationLine: 'underline',
                    fontSize: 16,
                    color: '#7d0705',
                    fontWeight: 'bold',
                  }}>
                  Deivice Response :
                </Text>
                <View style={{marginTop: 5, margin: 10}}>
                  <Text style={{color: 'black'}}>
                    long: {item.item[0].coords.longitude}
                  </Text>
                </View>
                <View style={{marginTop: 5, margin: 10}}>
                  <Text style={{color: 'black'}}>
                    lat: {item.item[0].coords.latitude}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      marginTop: 10,
                      margin: 10,
                      textDecorationLine: 'underline',
                      fontSize: 16,
                      color: '#7d0705',
                      fontWeight: 'bold',
                    }}>
                    API Response:
                  </Text>
                  <View style={{marginTop: 5, margin: 10}}>
                    <Text style={{color: 'black'}}>{item.item.response}</Text>
                  </View>
                </View>
              </View>
            );
          }}
          extraData={data || increment}
          keyExtractor={(item, i) => item.provider + i}
        />
      ) : null}
      <FAB.Group
        open={open}
        label={'sign out'}
        visible={!ApiData}
        icon={''}
        actions={[
          {
            icon: 'logout',
            label: 'sign out',
            onPress: () => LogOut(),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // console.log('setLoading(true)')
          }
        }}
      />
      <Snackbar
        visible={snakebar}
        onDismiss={onDismissSnackBar}
        style={{backgroundColor: '#7d0705'}}
        action={{
          label: '',
          onPress: () => setSnakebar(false),
        }}>
        {attendanceMessage !== '' ? attendanceMessage:'Attendance is marked for today'}
      </Snackbar>
      <Snackbar
        visible={warning}
        onDismiss={onDismissWarningBar}
        style={{backgroundColor: '#7d0705'}}
        action={{
          label: '',
          onPress: () => setWarning(false),
        }}>
        Please wait....
      </Snackbar>
      <Modal
        visible={visible}
        // onDismiss={hideModal}
        contentContainerStyle={containerStyle}>
        <ScrollView contentContainerStyle={{flex: 1}}>
          <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
            {loginData?.respText2}
          </Text>
          <View style={{margin: 20, marginTop: 40}}>
            <Button
              onPress={() => checkSession('new')}
              style={{backgroundColor: '#7d0705'}}
              textColor={'#fff'}>
              PROCEED WITH NEW SESSION
            </Button>
          </View>
          <View style={{margin: 20}}>
            <Button
              onPress={() => checkSession('prevoius')}
              style={{backgroundColor: '#7d0705'}}
              textColor={'#fff'}>
              PROCEED WITH PREVIOUS SESSION
            </Button>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={checkInModal}
        // onDismiss={hideModal}
        contentContainerStyle={containerCheckInStyle}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
            {proceedData
              ? proceedData
              : `Confirm if you have reached the destination and want to process to
            check In?`}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{margin: 20}}>
              <Button
                onPress={() => checkInOut()}
                style={{backgroundColor: '#7d0705'}}
                textColor={'#fff'}>
                Confirm
              </Button>
            </View>
            <View style={{margin: 20}}>
              <Button
                onPress={() => setCheckInModal(false)}
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: 1,
                  borderColor: '#7d0705',
                }}
                textColor={'black'}>
                Cancel
              </Button>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Dashboard;
