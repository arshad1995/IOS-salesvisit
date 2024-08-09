import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

    if (status === RESULTS.DENIED) {
      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      if (result !== RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Location permission is required to access your location.');
      }
    }
  } else if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permission Denied', 'Location permission is required to access your location.');
    }
  }
};

const checkLocationServicesEnabled = async () => {
  if (Platform.OS === 'ios') {
    const locationEnabled = await Geolocation.requestAuthorization('always');
    console.log("locationEnabled", locationEnabled)
    if (locationEnabled !== 'granted') {
      Alert.alert('Enable Location Services', 'Location services are disabled. Please enable them in settings.');
    }
  }
};

export { requestLocationPermission, checkLocationServicesEnabled };
