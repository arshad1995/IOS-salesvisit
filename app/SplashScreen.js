// import React, {useState, useEffect} from 'react';
// import {View, Text, Image, AppState, Platform} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {StackActions} from '@react-navigation/native';
// import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

// const SplashScreen = ({navigation}) => {
//   const [animating, setAnimating] = useState(true);

//   useEffect(() => {
//     AsyncStorage.removeItem('login_first_time');
//     setTimeout(() => {
//       setAnimating(false);
//       // navigation.dispatch(
//       //   StackActions.replace(value === null ? 'LoginScreen' : 'Dashboard'),
//       //   StackActions.replace('LoginScreen'),
//       // );
//       AsyncStorage.getItem('user_id').then(value => {
//         navigation.dispatch(
//           StackActions.replace(value === null ? 'LoginScreen' : 'Dashboard'),
//           // StackActions.replace('LoginScreen'),
//         );
//       });
//     }, 3000);
//   }, []);

//   useEffect(() => {
//     const listener = AppState.addEventListener("change", (status) => {
//       console.log("status 123", status, Platform.OS)
//       if (Platform.OS === "ios" && status === "active") {
//         request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
//           .then((result) => console.log("result",result))
//           .catch((error) => console.log(error));
//       }
//     });
  
//     return listener.remove;
//   }, []);

//   return (
//     <View 
//     style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Image
//         source={require('./assets/logo.png')}
//         style={{
//           width: 100,
//           height: 100,
//           resizeMode: 'contain',
//           margin: 30,
//         }}
//       />
//     </View>
//   );
// };

// export default SplashScreen;

import React, { useState, useEffect } from 'react';
import { View, Image, Modal, Text, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { request, PERMISSIONS } from 'react-native-permissions';

const SplashScreen = ({ navigation }) => {
  const [animating, setAnimating] = useState(true);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  // Function to handle navigation based on login status
  const navigateToNextScreen = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    navigation.dispatch(
      StackActions.replace(userId === null ? 'LoginScreen' : 'Dashboard')
    );
  };

  // Function to request tracking permission
  const requestTrackingPermission = async () => {
    const hasRequestedTracking = await AsyncStorage.getItem('hasRequestedTracking');
    
    if (!hasRequestedTracking && Platform.OS === 'ios') {
      // Show modal first to mimic system behavior
      setShowTrackingModal(true);
    } else {
      navigateToNextScreen(); // Skip the pop-up if permission was already requested
    }
  };

  // Function to handle tracking permission after modal interaction
  const handleTrackingPermission = (allowTracking) => {
    setShowTrackingModal(false); // Hide the modal

    if (allowTracking) {
      request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
        .then((result) => {
          console.log("Tracking Transparency result:", result);
          AsyncStorage.setItem('hasRequestedTracking', 'true'); // Prevent further prompts
          navigateToNextScreen();
        })
        .catch((error) => {
          console.log("Permission request error:", error);
          navigateToNextScreen();
        });
    } else {
      AsyncStorage.setItem('hasRequestedTracking', 'true'); // Store even if denied
      navigateToNextScreen();
    }
  };

  // Simulate splash screen animation
  useEffect(() => {
    AsyncStorage.removeItem('login_first_time');
    setTimeout(() => {
      setAnimating(false);
      requestTrackingPermission();
    }, 3000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('./assets/logo.png')}
        style={{
          width: 100,
          height: 100,
          resizeMode: 'contain',
          margin: 30,
        }}
      />

      {/* Custom Modal for Tracking Permission */}
      <Modal
        transparent={true}
        visible={showTrackingModal}
        animationType="slide"
        onRequestClose={() => setShowTrackingModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Allow "Jeftechno" to Track Your Activity?</Text>
            <Text style={styles.modalDescription}>
              We need your permission to track your activities to ensure accurate
              location-based attendance tracking and background location updates. 
              This is essential for verifying work attendance and travel routes for
              Jeftechno personnel. Your data is used exclusively for these purposes
              and is handled with the utmost privacy and security.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleTrackingPermission(false)}
              >
                <Text style={styles.buttonText}>Ask App Not to Track</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.allowButton]}
                onPress={() => handleTrackingPermission(true)}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>Allow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SplashScreen;

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  allowButton: {
    backgroundColor: '#007AFF',
  },
};
