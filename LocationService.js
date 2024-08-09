import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';

class LocationService {
  watchId = null;

  startLocationUpdates() {
    this.watchId = Geolocation.watchPosition(
      (position) => {
        console.log("location",position);
        // Send position to your server or update state
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, distanceFilter: 0, interval: 10000, fastestInterval: 5000 }
    );
  }

  startBackgroundTimer() {
    BackgroundTimer.runBackgroundTimer(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log("position1234", position);
          // Send position to your server or update state
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }, 10000);
  }

  stopLocationUpdates() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    BackgroundTimer.stopBackgroundTimer();
  }
}

export default new LocationService();
