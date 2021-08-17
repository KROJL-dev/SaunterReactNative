import React, { useRef } from 'react';

import { Dimensions, StyleSheet, Text } from 'react-native';

import generateId from '../utils/generateId';

import MapView, { Marker, LatLng, MapEvent, Camera } from 'react-native-maps';
import { View, Center } from 'native-base';
import { color } from 'styled-system';

interface IProps {
  children?: any;
  onClick?: Function;
  coordinatesForMarker?: LatLng[];
  height?: number;
  weight?: number;
  center?: LatLng;
}

const DEFAULTCENTER: LatLng = {
  latitude: 48.46767671849983,
  longitude: 35.05476746651536,
};

const Map: React.FC<IProps> = ({
  children,
  onClick,
  coordinatesForMarker,
  height = Dimensions.get('screen').height / 2.4,
  weight = Dimensions.get('screen').width,
  center = DEFAULTCENTER,
}) => {
  const map = useRef<MapView>(null);

  return (
    <MapView
      ref={map}
      style={{
        height: height,
        width: weight,
      }}
      onMapReady={() => {
        map?.current?.getCamera().then((cam: Camera) => {
          cam.zoom = 13;
          cam.center = center;
          map?.current?.animateCamera(cam);
        });
      }}
      onPress={(e: MapEvent) => {
        onClick !== undefined && onClick(e);
      }}
    >
      {coordinatesForMarker !== undefined &&
        coordinatesForMarker.map((coordinate, index) => (
          <Marker
            key={generateId()}
            coordinate={coordinate as unknown as LatLng}
          >
            <View style={style.marker}>
              <Center>
                <Text style={{ color: 'white', lineHeight:23 }}>{index+1}</Text>
              </Center>
            </View>
          </Marker>
        ))}
      {children !== undefined ? children : null}
    </MapView>
  );
};
export default Map;

const style = StyleSheet.create({
  marker: {
    backgroundColor: '#550bbc',
    width: 25,
    height: 25,
    borderRadius: 12,
     
  },
});
