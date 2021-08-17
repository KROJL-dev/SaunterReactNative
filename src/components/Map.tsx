import React, { useRef, useState, useEffect } from 'react';

import { Dimensions, StyleSheet, Text, ActivityIndicator } from 'react-native';

import generateId from '../utils/generateId';
import { getCurrentPos } from '../utils/geolocationControl';

import MapView, { Marker, LatLng, MapEvent, Camera } from 'react-native-maps';
import { View, Center, Image } from 'native-base';

import { useStore } from '../store/store';

import { observer } from 'mobx-react';

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

const USERICON = 'https://image.flaticon.com/icons/png/512/106/106175.png';
const Map: React.FC<IProps> = ({
  children,
  onClick,
  coordinatesForMarker,
  height = Dimensions.get('screen').height / 2.4,
  weight = Dimensions.get('screen').width,
  center = DEFAULTCENTER,
}) => {
  const { userStore } = useStore();
  const map = useRef<MapView>(null);
  const [currentlocation, setCurrentlocation] = useState<LatLng>();
  const [loading, setLoading] = useState<boolean>(false);

  const [isFirstUserIcon, setIsFirstUserIcon] = useState<boolean>(false);
  const [currentCoordinationForMarket, setCurrentCoordinationForMarket] =
    useState<LatLng[]>([]);

  useEffect(() => {
    if (userStore.userPosition !== undefined && coordinatesForMarker?.length) {
      console.log('useef if ', userStore.userPosition);

      setIsFirstUserIcon(true);
      setCurrentCoordinationForMarket([
        { ...userStore.userPosition },
        ...coordinatesForMarker,
      ]);
    } else {
      setIsFirstUserIcon(false);
      coordinatesForMarker !== undefined &&
        setCurrentCoordinationForMarket(coordinatesForMarker);
    }
  }, [userStore.userPosition]);

  useEffect(() => {
    console.log('currentCoordinationForMarket', currentCoordinationForMarket);
  }, [currentCoordinationForMarket]);
  // useEffect(() => {
  //   if (coordinatesForMarker !== undefined) {
  //     setCurrentCoordinationForMarket([
  //       ...currentCoordinationForMarket,
  //       ...coordinatesForMarker,
  //     ]);
  //   }
  //   if (!coordinatesForMarker?.length) {
  //     setLoading(true);
  //     getCurrentPos((latitude: number, longitude: number) => {
  //       setLoading(false);
  //       let position = {
  //         latitude,
  //         longitude,
  //       };
  //       map?.current?.getCamera().then((cam: Camera) => {
  //         cam.zoom = 13;
  //         cam.center = position;

  //         map?.current?.animateCamera(cam);
  //         setCurrentlocation(position);
  //       });
  //     });
  //   }
  // }, []);

  return (
    <View>
      <Center
        style={{
          height: height,
          width: weight,
          display: loading ? 'flex' : 'none',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{
            height: 150,
            width: 150,
          }}
        />
      </Center>
      <MapView
        ref={map}
        style={{
          height: height,
          width: weight,
          opacity: +!loading,
        }}
        onPress={(e: MapEvent) => {
          onClick !== undefined && onClick(e);
        }}
        onMapReady={() => {
          map?.current?.getCamera().then((cam: Camera) => {
            cam.zoom = 13;
            if (coordinatesForMarker?.length) {
              cam.center = coordinatesForMarker[0];
            } else {
              cam.center = center;
            }
            map?.current?.animateCamera(cam);
          });
        }}
      >
        {currentlocation !== undefined ? (
          <Marker coordinate={currentlocation} />
        ) : null}
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
                        {isFirstUserIcon?index:index+1}
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
