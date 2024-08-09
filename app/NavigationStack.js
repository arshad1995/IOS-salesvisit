import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Dashboard from './Dashboard'
import SplashScreen from './SplashScreen'
// import WebviewScreen from './WebviewScreen'
// import LoginScreen from './LoginScreen'

const Stack = createNativeStackNavigator();
function NavigationStack() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"SplashScreen"} screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        {/* <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="WebviewScreen" component={WebviewScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationStack;