import React, { useEffect, useState } from 'react';
import { Dimensions, View, ActivityIndicator } from 'react-native';

import { observer } from 'mobx-react';

import Map from '../components/Map';

import { LatLng } from 'react-native-maps';

import { useStore } from '../store/store';

import { startWatcher, stopWatcher } from '../utils/geolocationControl';

import MapViewDirections from 'react-native-maps-directions';

import _ from 'lodash';
import { Button, Center } from 'native-base';

const DisplayDirectionModal: React.FC<{}> = () => {
  const { pathStore, userStore } = useStore();

  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  
  const [isStart, setIsStart] = useState<boolean>(true);
   
  const [loading, setLoading] = useState<boolean>(false);
  const [watchId,setWatchId] = useState<number>()

  const onPressStart = () => {
    console.log("loading", loading)
     
    if (!isStart && watchId !== undefined) {
      setLoading(true);
      console.log('if');
      stopWatcher(watchId);
      userStore.unsetUserPosition();
      setLoading(false);
    } else {
      setLoading(true);
      console.log('else');
      let watchID = startWatcher((latitude: number, longitude: number) => {
        userStore.setUserPosition(latitude, longitude);

        setLoading(false);
      });
      setWatchId(watchID);
    }
     
    setIsStart(!isStart);
  };

 

  useEffect(() => {
    let newCoordinates = _.cloneDeep(pathStore.currentCordinatesForDisplay);
    if (newCoordinates !== undefined) {
      let newKek = newCoordinates.coordinate.map(
        (newCoord) => newCoord as unknown as LatLng
      );
      setCoordinates(newKek);
 
    }
  }, [pathStore.currentCordinatesForDisplay]);

  return (
    <View>
      {coordinates.length ? (
        <View>
          <Map
            coordinatesForMarker={coordinates}
            center={coordinates[0]}
            height={Dimensions.get('screen').height - 250}
          >
            <MapViewDirections
              waypoints={coordinates}
              origin={userStore.userPosition!==undefined?userStore.userPosition:coordinates[0]}
              destination={coordinates[coordinates.length - 1]}
              apikey="AIzaSyC_uhizMxcvd4H0ku2IOf3-o0w4OvsKBZo"
              mode={'DRIVING'}
              strokeWidth={2}
              strokeColor="red"
              optimizeWaypoints={false}
              splitWaypoints={true}
              strokeColors={[
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 1)',
              ]}
            />
          </Map>
          <Button w="100%" h={100} onPress={onPressStart} disabled={loading}>
            {loading ? (
              <Center>
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={{
                    height: 150,
                    width: 150,
                  }}
                />
              </Center>
            ) : isStart ? (
              'Start'
            ) : (
              'Stop'
            )}
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export default observer(DisplayDirectionModal);
