import React, { useRef, useEffect, useState } from 'react';

import { Dimensions } from 'react-native';

import generateId from '../utils/generateId';

import MapView, { Marker, LatLng, MapEvent, Camera } from 'react-native-maps';

interface IProps {
  children?: any;
  onClick?: Function;
  coordinatesForMarker?: LatLng[];
  height?: number;
  weight?: number;
}
const Map: React.FC<IProps> = ({
  children,
  onClick,
  coordinatesForMarker,
  height = Dimensions.get('screen').height / 2.4,
  weight = Dimensions.get('screen').width,
}) => {
  const map = useRef<MapView>(null);

  return (
    <MapView
      ref={map}
      style={{
        height: height,
        width: weight,
      }}
      initialRegion={{
        latitude: 47.78825,
        longitude: 35.05754025013747,
        latitudeDelta: 47.78844,
        longitudeDelta: 35.05754025013747,
      }}
      onMapReady={() => {
        map?.current?.getCamera().then((cam: Camera) => {
          cam.zoom = 13;
          cam.center = {
            latitude: 48.46927011975755,
            longitude: 35.05287915753189,
          };
          map?.current?.animateCamera(cam);
        });
      }}
      onPress={(e: MapEvent) => {
        onClick !== undefined && onClick(e);
      }}
    >
      {coordinatesForMarker !== undefined &&
        coordinatesForMarker.map((coordinate) => (
          <Marker
            key={generateId()}
            coordinate={coordinate as unknown as LatLng}
          />
        ))}
      {children !== undefined ? children : null}
    </MapView>
  );
};
export default Map;
