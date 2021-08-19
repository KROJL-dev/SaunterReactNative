import Geolocation from '@react-native-community/geolocation';

export const getCurrentPos = (succesCalbackFunction: Function) => {
  Geolocation.getCurrentPosition(
    (position) => {
      succesCalbackFunction(
        position.coords.latitude,
        position.coords.longitude
      );
    },
    (error) => console.log('Error', JSON.stringify(error)),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
};
export const startWatcher = (succesCalbackFunction: Function) => {
  console.log('startWatcher');
  return Geolocation.watchPosition(
    (position) => {
      console.log('kek');
      succesCalbackFunction(
        position.coords.latitude,
        position.coords.longitude
      );
    },
    (error) => console.log('Error', JSON.stringify(error)),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
      distanceFilter: 3,
    }
  );
};
export const stopWatcher = (watchId: number) => {
  Geolocation.clearWatch(watchId);
};
