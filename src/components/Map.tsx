import React, { useRef, useState, useEffect, useMemo } from 'react';

import { Dimensions, StyleSheet, Text } from 'react-native';

import generateId from '../utils/generateId';

import MapView, { Marker, LatLng, MapEvent, Camera } from 'react-native-maps';
import { View, Center, Image } from 'native-base';

import _ from 'lodash';
import { useStore } from '../store/store';

import { observer } from 'mobx-react';

import MapViewDirections from 'react-native-maps-directions';

interface IProps {
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

const RADIUS = 0.000012;

const USERICON = 'https://image.flaticon.com/icons/png/512/106/106175.png';

const Map: React.FC<IProps> = ({
  children,
  onClick,
  coordinatesForMarker,
  height = Dimensions.get('screen').height / 2.4,
  weight = Dimensions.get('screen').width,
  center = DEFAULTCENTER,
}) => {
  const { userStore, pathStore } = useStore();
  
  const map = useRef<MapView>(null);

  const [isFirstUserIcon, setIsFirstUserIcon] = useState<boolean>(false);
  const [currentCoordinationForMarket, setCurrentCoordinationForMarket] = useState<LatLng[]>([]);

  const checkUserPositionAtMarkers = (
    markers: LatLng[],
    userPosition: LatLng
  ) => {
    markers.map((marker, index) => {
      let currentRadius =
        Math.pow(userPosition.latitude - marker.latitude, 2) +
        Math.pow(userPosition.longitude - marker.longitude, 2);
      if (currentRadius <= RADIUS) {
        markers.splice(index, 1);

        return;
      }
    });
  };

  useEffect(() => {
    if (userStore.userPosition !== undefined && coordinatesForMarker?.length) {
      checkUserPositionAtMarkers(coordinatesForMarker, userStore.userPosition);

      setIsFirstUserIcon(true);

      let currentCoordForMarkTempArr = [
        { ...userStore.userPosition },
        ...coordinatesForMarker,
      ];

      setCurrentCoordinationForMarket(currentCoordForMarkTempArr);

      map?.current?.getCamera().then((cam: Camera) => {
        cam.zoom = 15;
        cam.center = currentCoordForMarkTempArr[0];
        map?.current?.animateCamera(cam);
      });
    } else {
      setIsFirstUserIcon(false);

      if (pathStore.currentCordinatesForDisplay !== undefined) {
        let newCoordForDisp = _.cloneDeep(
          pathStore.currentCordinatesForDisplay.coordinate
        ) as unknown as LatLng[];

        setCurrentCoordinationForMarket(newCoordForDisp);

        map?.current?.getCamera().then((cam: Camera) => {
          cam.zoom = 15;
          cam.center = newCoordForDisp[0];
          map?.current?.animateCamera(cam);
        });
      }
    }
  }, [userStore.userPosition]);

  useEffect(() => {
    coordinatesForMarker !== undefined &&
      setCurrentCoordinationForMarket(coordinatesForMarker);
  }, [coordinatesForMarker]);

  return (
    <View>
      <MapView
        ref={map}
        style={{
          height: height,
          width: weight,
        }}

        onPress={(e: MapEvent) => {
          onClick !== undefined && onClick(e);
        }}

        onMapReady={() => {
          map?.current?.getCamera().then((cam: Camera) => {
            cam.zoom = 15;
            if (coordinatesForMarker?.length) {
              cam.center = coordinatesForMarker[0];
            } else {
              cam.center = center;
            }
            map?.current?.animateCamera(cam);
          });
        }}
      >
        {useMemo(
          () => (
            <MapViewDirections
              waypoints={currentCoordinationForMarket}
              origin={
                userStore.userPosition !== undefined
                  ? userStore.userPosition
                  : currentCoordinationForMarket[0]
              }
              destination={
                currentCoordinationForMarket[
                  currentCoordinationForMarket.length - 1
                ]
              }
              apikey="AIzaSyC_uhizMxcvd4H0ku2IOf3-o0w4OvsKBZo"
              mode={'DRIVING'}
              strokeWidth={2}
              strokeColor="red"
              optimizeWaypoints={false}
              splitWaypoints={true}
              strokeColors={[
                'rgba(255, 255, 255, 0.2)',
                'rgba(255, 255, 255, 1)',
              ]}
            />
          ),
          [currentCoordinationForMarket, userStore.userPosition]
        )}

        {currentCoordinationForMarket.length
          ? currentCoordinationForMarket.map((coordinate, index) => (
              <Marker
                key={generateId()}
                coordinate={coordinate as unknown as LatLng}
              >
                <View
                  style={
                    isFirstUserIcon && index === 0
                      ? style.iconMarker
                      : style.marker
                  }
                >
                  <Center>
                    {isFirstUserIcon && index === 0 ? (
                      <Image
                        source={{ uri: USERICON }}
                        style={{ height: 60, width: 60 }}
                        alt="user"
                      />
                    ) : (
                      <Text style={{ color: 'white', lineHeight: 23 }}>
                        {isFirstUserIcon ? index : index + 1}
                      </Text>
                    )}
                  </Center>
                </View>
              </Marker>
            ))
          : null}

        {children !== undefined ? children : null}
        
      </MapView>
    </View>
  );
};
export default observer(Map);

const style = StyleSheet.create({
  marker: {
    backgroundColor: '#550bbc',
    width: 25,
    height: 25,
    borderRadius: 12,
  },
  iconMarker: {
    height: 60,
    width: 60,
  },
});
