import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';

import { observer } from 'mobx-react';

import Map from '../components/Map';

import { LatLng, Polyline } from 'react-native-maps';

import { useStore } from '../store/store';

import MapViewDirections from 'react-native-maps-directions';

import _ from 'lodash';

const DisplayDirectionModal: React.FC<{}> = () => {
  const { pathStore } = useStore();

  const [coordinates, setCoordinates] = useState<LatLng[]>();

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
      {coordinates !== undefined && (
        <Map
          coordinatesForMarker={coordinates}
          center={coordinates[0]}
          height={Dimensions.get('screen').height}
        >
          <MapViewDirections
            waypoints={coordinates}
            origin={coordinates[0]}
            destination={coordinates[coordinates.length - 1]}
            apikey="AIzaSyC_uhizMxcvd4H0ku2IOf3-o0w4OvsKBZo"
            mode={'DRIVING'}
            strokeWidth={2}
            strokeColor="red"
            optimizeWaypoints={true}
            splitWaypoints={true}
            strokeColors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          />
        </Map>
      )}
    </View>
  );
};

export default observer(DisplayDirectionModal);
