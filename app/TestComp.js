// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * Generated with the TypeScript template
//  * https://github.com/react-native-community/react-native-template-typescript
//  *
//  * @format
//  */

// import React from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
//   Switch,
//   Button,
//   Alert
// } from 'react-native';

// import BackgroundFetch from "react-native-background-fetch";

// import BackgroundTimer from 'react-native-background-timer';
// import Geolocation from 'react-native-geolocation-service';


// const Colors = {
//   gold: '#fedd1e',
//   black: '#000',
//   white: '#fff',
//   lightGrey: '#ccc',
//   blue: '#337AB7',
// }

// /// Util class for handling fetch-event peristence in AsyncStorage.
// // import Event from "./src/Event";

// const TestComp = () => {

//   const [enabled, setEnabled] = React.useState(false);
//   const [status, setStatus] = React.useState(-1);
//   const [events, setEvents] = React.useState([]);

//   React.useEffect(() => {
//     initBackgroundFetch()


//     // BackgroundTimer.runBackgroundTimer(() => {
//     //   Geolocation.getCurrentPosition(
//     //     (position) => {
//     //       console.log("position1234", position);
//     //       // Send position to your server or update state
//     //     },
//     //     (error) => {
//     //       console.error(error);
//     //     },
//     //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     //   );
//     // }, 10000);
//     // loadEvents();
//   }, []);

//   /// Configure BackgroundFetch.
//   ///
//   const initBackgroundFetch = async () => {
//     const status = await BackgroundFetch.configure({
//       minimumFetchInterval: 1,      // <-- minutes (15 is minimum allowed)
//       stopOnTerminate: false,
//       enableHeadless: true,
//       startOnBoot: true,
//       // Android options
//       forceAlarmManager: false,      // <-- Set true to bypass JobScheduler.
//       requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
//       requiresCharging: false,       // Default
//       requiresDeviceIdle: false,     // Default
//       requiresBatteryNotLow: false,  // Default
//       requiresStorageNotLow: false,  // Default
//     }, async (taskId) => {
//       console.log('[BackgroundFetch] taskId', taskId);
//       // Create an Event record.
//     //   const event = await Event.create(taskId, false);
//       // Update state.
//       setEvents((prev) => [...prev, event]);
//       // Finish.
//     //   BackgroundFetch.finish(taskId);
//     }, (taskId) => {
//       // Oh No!  Our task took too long to complete and the OS has signalled
//       // that this task must be finished immediately.
//       console.log('[Fetch] TIMEOUT taskId:', taskId);
//     //   BackgroundFetch.finish(taskId);
//     });
//     setStatus(status);
//     setEnabled(true);
//   }

//   /// Load persisted events from AsyncStorage.
//   ///
//   const loadEvents = () => {
//     Event.all().then((data) => {
//       setEvents(data);
//     }).catch((error) => {
//       Alert.alert('Error', 'Failed to load data from AsyncStorage: ' + error);
//     });
//   }

//   /// Toggle BackgroundFetch ON/OFF
//   ///
//   const onClickToggleEnabled = (value) => {
//     setEnabled(value);

//     if (value) {
//       BackgroundFetch.start();
//     } else {
//       BackgroundFetch.stop();
//     }
//   }

//   /// [Status] button handler.
//   ///
//   const onClickStatus = () => {
//     BackgroundFetch.status().then((status) => {
//       let statusConst = '';
//       switch (status) {
//         case BackgroundFetch.STATUS_AVAILABLE:
//           statusConst = 'STATUS_AVAILABLE';
//           break;
//         case BackgroundFetch.STATUS_DENIED:
//           statusConst = 'STATUS_DENIED';
//           break;
//         case BackgroundFetch.STATUS_RESTRICTED:
//           statusConst = 'STATUS_RESTRICTED';
//           break;
//       }
//       Alert.alert('BackgroundFetch.status()', `${statusConst} (${status})`);
//     });
//   }

//   /// [scheduleTask] button handler.
//   /// Schedules a custom-task to fire in 5000ms
//   ///
//   const onClickScheduleTask = () => {
//     BackgroundFetch.scheduleTask({
//       taskId: 'com.transistorsoft.customtask',
//       delay: 5000,
//       forceAlarmManager: true
//     }).then(() => {
//       Alert.alert('scheduleTask', 'Scheduled task with delay: 5000ms');
//     }).catch((error) => {
//       Alert.alert('scheduleTask ERROR', error);
//     });
//   }

//   /// Clear the Events list.
//   ///
//   const onClickClear = () => {
//     // Event.destroyAll();
//     setEvents([]);
//   }

//   /// Fetch events renderer.
//   ///
//   const renderEvents = () => {
//     if (!events.length) {
//       return (
//         <Text style={{padding: 10, fontSize: 16}}>Waiting for BackgroundFetch events...</Text>
//       );
//     }
//     return events.slice().reverse().map(event => (
//       <View key={event.key} style={styles.event}>
//         <View style={{flexDirection: 'row'}}>
//           <Text style={styles.taskId}>{event.taskId}&nbsp;{event.isHeadless ? '[Headless]' : ''}</Text>
//         </View>
//         <Text style={styles.timestamp}>{event.timestamp}</Text>
//       </View>
//     ))
//   }

//   return (
//     <SafeAreaView style={{flex:1, backgroundColor:Colors.gold}}>
//       {/* <StatusBar barStyle={'light-content'}>
//       </StatusBar> */}
//       <View style={styles.container}>
//         <View style={styles.toolbar}>
//           <Text style={styles.title}>BGFetch Demo</Text>
//           <Switch value={enabled} onValueChange={onClickToggleEnabled} />
//         </View>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.eventList}>
//           {renderEvents()}
//         </ScrollView>
//         <View style={styles.toolbar}>
//           <Button title={"status: " + status} onPress={onClickStatus} />
//           <Text>&nbsp;</Text>
//           <Button title="scheduleTask" onPress={onClickScheduleTask} />
//           <View style={{flex:1}} />
//           <Button title="clear" onPress={onClickClear} />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'column',
//     flex: 1
//   },
//   title: {
//     fontSize: 24,
//     flex: 1,
//     fontWeight: 'bold',
//     color: Colors.black
//   },
//   eventList: {
//     flex: 1,
//     backgroundColor: Colors.white
//   },
//   event: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: Colors.lightGrey
//   },
//   taskId: {
//     color: Colors.blue,
//     fontSize: 16,
//     fontWeight: 'bold'
//   },
//   headless: {
//     fontWeight: 'bold'
//   },
//   timestamp: {
//     color: Colors.black
//   },
//   toolbar: {
//     height: 57,
//     flexDirection: 'row',
//     paddingLeft: 10,
//     paddingRight: 10,
//     alignItems: 'center',
//     backgroundColor: Colors.gold
//   },

// });

// export default TestComp;



import React, { useEffect } from 'react';
import { Alert, Touchable, TouchableOpacity, View, Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import BackgroundFetch from 'react-native-background-fetch';
// import { Text } from 'react-native-paper';
import LocationService from '../LocationService';
import { requestLocationPermission, checkLocationServicesEnabled } from '../LocationPermissions';

const TestComp = () => {
//   useEffect(() => {
//     const configureBackgroundFetch = async () => {
//       BackgroundFetch.configure(
//         {
//           minimumFetchInterval: 5000, // Minimum fetch interval in minutes
//         },
//         async (taskId) => {
//           console.log('[BackgroundFetch] taskId: ', taskId);

//           // Perform your background fetch task here.
//           getCurrentLocation();

//           // Call finish when your background fetch task is complete
//           BackgroundFetch.finish(taskId);
//         },
//         (error) => {
//           console.error('[BackgroundFetch] configure error: ', error);
//         }
//       );

//       // Optional: Query current Background Fetch status
//       const status = await BackgroundFetch.status();
//       switch (status) {
//         case BackgroundFetch.STATUS_RESTRICTED:
//           Alert.alert('Background Fetch restricted');
//           break;
//         case BackgroundFetch.STATUS_DENIED:
//           Alert.alert('Background Fetch denied');
//           break;
//         case BackgroundFetch.STATUS_AVAILABLE:
//           Alert.alert('Background Fetch enabled');
//           break;
//       }
//     };

//     const getCurrentLocation = () => {
//       Geolocation.getCurrentPosition(
//         (position) => {
//           console.log('Position:', position);
//           // Handle location update
//         },
//         (error) => {
//           console.error('Geolocation error:', error);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 10000,
//         }
//       );
//     };

//     configureBackgroundFetch();

//     // return () => {
//     //   BackgroundFetch.stop();
//     // };
//   }, []);

useEffect(() => {
    const initializeLocationServices = async () => {
      await requestLocationPermission();
      await checkLocationServicesEnabled();
      LocationService.startLocationUpdates();
      LocationService.startBackgroundTimer();
    };

    initializeLocationServices();

    return () => {
      LocationService.stopLocationUpdates();
    };
  }, []);

  return <View>
    <TouchableOpacity onPress={()=>  BackgroundFetch.start()}>
            <Text>Press here</Text>
    </TouchableOpacity>
  </View>;
};

export default TestComp;
