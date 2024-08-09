import React, { useEffect } from 'react';
import { Button, View, Text, SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './app/SplashScreen';
import LoginScreen from './app/LoginScreen';
import Dashboard from './app/Dashboard';
import WebviewScreen from './app/WebviewScreen';
import { enableScreens } from 'react-native-screens';

import TestComp from './app/TestComp';

enableScreens(false);

// import NavigationStack from './app/NavigationStack';
// import { enableScreens } from 'react-native-screens';
import { Provider as PaperProvider } from 'react-native-paper';
// enableScreens(false);


// import LocationService from './LocationService';
// import { requestLocationPermission, checkLocationServicesEnabled } from './LocationPermissions';

// const App = () => {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };
  
  // useEffect(() => {
  //   const initializeLocationServices = async () => {
  //     await requestLocationPermission();
  //     await checkLocationServicesEnabled();
  //     LocationService.startLocationUpdates();
  //     LocationService.startBackgroundTimer();
  //   };

  //   initializeLocationServices();

  //   return () => {
  //     LocationService.stopLocationUpdates();
  //   };
  // }, []);

//   return (
//     <SafeAreaView>
//             {/* <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       /> */}
//       {/* <Button title='Stop Location' onPress={()=>LocationService.stopLocationUpdates()} /> */}
//       <PaperProvider>
//       <NavigationStack/>
//       </PaperProvider>
//     </SafeAreaView>
//   );
// };

// export default App;


function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerTitle: ""}}>

      {/* <Stack.Screen name="TestComp" component={TestComp} /> */}

        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="WebviewScreen" component={WebviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;