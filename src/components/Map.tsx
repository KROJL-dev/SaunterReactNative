import React, { useRef, useEffect } from 'react';

import { Dimensions } from 'react-native';

import generateId from '../utils/generateId';

import MapView, { Marker, LatLng, MapEvent, Camera } from 'react-native-maps';

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

  useEffect(() => {
    console.log('coordinatesForMarker', coordinatesForMarker);
  }, [coordinatesForMarker]);
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
