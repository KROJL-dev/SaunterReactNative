import React, { useState, useEffect } from 'react';

import { Text, View, Dimensions } from 'react-native';

import MapView, { Marker, LatLng, MapEvent } from 'react-native-maps';

import MapViewDirections, {
  MapViewDirectionsWaypoints,
} from 'react-native-maps-directions';
import { Button } from 'native-base';

import { observer } from 'mobx-react';

import { useStore } from '../store/store';
import generateId from '../utils/generateId';

const Map: React.FC<{}> = () => {
  const { pathStore } = useStore();

  const [coordinateDirection, setCoordinateDirection] = useState<
    MapViewDirectionsWaypoints[]
  >([]);
  const [distance, setDistance] = useState<number>();

  let coordinate = {
    latitude: 47.78825,
    longitude: 35.05754025013747,
    latitudeDelta: 47.78844,
    longitudeDelta: 35.05754025013747,
  };

  useEffect(() => {
    console.log('useeffect', distance);
    if (distance !== undefined) {
      pathStore.setCurrentCoordinatesInfo({
        coordinate: coordinateDirection,
        directionSize: distance,
      });
    }
  }, [distance, coordinateDirection]);

  const onClickMap = (e: MapEvent) => {
    setCoordinateDirection([...coordinateDirection, e.nativeEvent.coordinate]);
  };
  return (
    <View>
      <MapView
        style={{
          height: Dimensions.get('screen').height / 2.4,
          width: Dimensions.get('screen').width,
        }}
        initialRegion={coordinate}
        onPress={onClickMap}
      >
        {coordinateDirection.length
          ? coordinateDirection.map((coordinate) => (
              <Marker
                key={generateId()}
                coordinate={coordinate as unknown as LatLng}
              />
            ))
          : null}
        {coordinateDirection.length > 1 && (
          <MapViewDirections
            waypoints={coordinateDirection}
            origin={coordinateDirection[0]}
            destination={coordinateDirection[coordinateDirection.length - 1]}
            apikey="AIzaSyC_uhizMxcvd4H0ku2IOf3-o0w4OvsKBZo"
            strokeWidth={6}
            strokeColor="red"
            optimizeWaypoints={false}
            onReady={(result) => {
              setDistance(result.distance);
            }}
          />
        )}
      </MapView>
      {distance !== undefined && (
        <Text style={{ width: 300, height: 100 }}>
          Distance: {distance} km{' '}
        </Text>
      )}
      <Button
        onPress={() => {
          setCoordinateDirection([]), setDistance(0);
        }}
      >
        Clear
      </Button>
    </View>
  );
};
export default observer(Map);
