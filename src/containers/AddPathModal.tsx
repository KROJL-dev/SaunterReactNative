import React, { useState, useEffect } from 'react';

import { Center, Container, Input, Stack } from 'native-base';

import { Text, View, StyleSheet, Dimensions } from 'react-native';

import { useForm, Controller } from 'react-hook-form';

import { NavigationStackProp } from 'react-navigation-stack';

import generateId from '../utils/generateId';

import { Button } from 'native-base';

import { useStore } from '../store/store';

import Map from '../components/Map';

import { Marker, LatLng, MapEvent } from 'react-native-maps';

import MapViewDirections, {
  MapViewDirectionsWaypoints,
} from 'react-native-maps-directions';

import { IDirectionData } from 'models/path';

export interface IProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

type onSumbitData = {
  title: string;
  description: string;
};

const AddPathModal: React.FC<IProps> = ({ navigation }) => {
  const { pathStore } = useStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [directionData, setDirectionData] = useState<IDirectionData>({
    coordinate: [],
    directionSize: 0,
  });

  const onSubmit = (data: onSumbitData) => {
    pathStore.addPath(data.title, data.description, directionData);
    navigation.goBack();
  };

  const onClickMap = (e: MapEvent) => {
    setDirectionData({
      ...directionData,
      coordinate: [...directionData?.coordinate, e.nativeEvent.coordinate],
    });
  };

  return (
    <Center w={Dimensions.get('window').width}>
      <Container w="100%" style={styles.container}>
        <Stack space={4} w="100%">
          <Controller
            control={control}
            rules={{
              required: true,
              maxLength: 10,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                w="100%"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="title"
              />
            )}
            name="title"
            defaultValue=""
          />
          {errors.firstName && <Text>This is required.</Text>}

          <Controller
            control={control}
            rules={{
              required: true,
              maxLength: 160,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                w="100%"
                style={styles.input}
                placeholder="description"
              />
            )}
            name="description"
            defaultValue=""
          />
        </Stack>
      </Container>
      <Stack space={4} w="100%">
        <Map onClick={onClickMap}>
          {directionData.coordinate.length
            ? directionData.coordinate.map((coordinate) => (
                <Marker
                  key={generateId()}
                  coordinate={coordinate as unknown as LatLng}
                />
              ))
            : null}
          {directionData.coordinate.length > 1 && (
            <MapViewDirections
              waypoints={directionData.coordinate}
              origin={directionData.coordinate[0]}
              destination={
                directionData.coordinate[directionData.coordinate.length - 1]
              }
              apikey="AIzaSyC_uhizMxcvd4H0ku2IOf3-o0w4OvsKBZo"
              strokeWidth={6}
              strokeColor="red"
              optimizeWaypoints={false}
              onReady={(result) => {
                setDirectionData({
                  ...directionData,
                  directionSize: result.distance,
                });
              }}
            />
          )}
        </Map>
        <Center w="100%">
          <Container w="100%">
            <Stack space={4} w="100%">
              {directionData.directionSize !== undefined && (
                <Text style={{ alignSelf: 'stretch', height: 20 }}>
                  Distance: {directionData.directionSize} km{' '}
                </Text>
              )}
              <Button
                w="100%"
                onPress={() => {
                  setDirectionData({ coordinate: [], directionSize: 0 });
                }}
              >
                Clear maps
              </Button>
              <Button w="100%" onPress={handleSubmit(onSubmit)}>
                Submit
              </Button>
            </Stack>
          </Container>
        </Center>
      </Stack>
    </Center>
  );
};
export default AddPathModal;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    backgroundColor: '#fff',
  },
});
