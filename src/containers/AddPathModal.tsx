import React, { useState, useEffect } from 'react';

import { Center, Container, Input, Stack, Alert } from 'native-base';

import { Text, View, StyleSheet, Dimensions, TextInput } from 'react-native';

import { useForm, Controller } from 'react-hook-form';

import { NavigationStackProp } from 'react-navigation-stack';

import { Button } from 'native-base';

import { useStore } from '../store/store';

import Map from '../components/Map';

import { LatLng, MapEvent } from 'react-native-maps';

import { observer } from 'mobx-react';

import MapViewDirections, {
  MapViewDirectionsWaypoints,
} from 'react-native-maps-directions';

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

  const [coordinate, setCoordinate] = useState<MapViewDirectionsWaypoints[]>(
    []
  );
  const [directionSize, setDirectionSize] = useState<number>(0);

  const onSubmit = (data: onSumbitData) => {
    const directionData = { coordinate, directionSize };
    pathStore.addPath(data.title, data.description, directionData);
    navigation.goBack();
  };

  const onClickMap = (e: MapEvent) => {
    setCoordinate([...coordinate, e.nativeEvent.coordinate]);
  };

  useEffect(() => {
    setDirectionSize(pathStore.currentDirectionSize);
  }, [pathStore.currentDirectionSize]);

  useEffect(() => {
   pathStore.unsetCurrentDirectionSize();
  }, [ ]);
  return (
    <Center w={Dimensions.get('window').width} style={{ position: 'absolute' }}>
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
          {errors.title && (
            <View>
              <View
                style={{
                  position: 'absolute',
                  top: -20,
                  left: -40,
                  width: Dimensions.get('screen').width,
                  zIndex: 1212,
                }}
              >
                <Alert w="100%">
                  <Alert.Icon />
                  <Alert.Title>EROR</Alert.Title>
                  <Alert.Description>
                    {errors.title.type === 'maxLength'
                      ? 'max length: 10'
                      : 'title is required'}
                  </Alert.Description>
                </Alert>
              </View>
            </View>
          )}

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
          {errors.description && (
            <View>
              <View
                style={{
                  position: 'absolute',
                  top: -20,
                  left: -40,
                  width: Dimensions.get('screen').width,
                  zIndex: 1212,
                }}
              >
                <Alert w="100%">
                  <Alert.Icon />
                  <Alert.Title>EROR</Alert.Title>
                  <Alert.Description>
                    {errors.description.type === 'maxLength'
                      ? 'max length: 160'
                      : 'description is required'}
                  </Alert.Description>
                </Alert>
              </View>
            </View>
          )}
        </Stack>
      </Container>
      <Stack space={4} w="100%">
        <Map
          onClick={onClickMap}
          coordinatesForMarker={coordinate as unknown as LatLng[]}
        />

        <Center w="100%">
          <Container w="100%">
            <Stack space={4} w="100%">
              {directionSize !== undefined && (
                <Text style={{ alignSelf: 'stretch', height: 20 }}>
                  Distance: {directionSize} km{' '}
                </Text>
              )}
              <Button
                w="100%"
                onPress={() => {
                  setDirectionSize(0);
                  setCoordinate([]);
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
export default observer(AddPathModal);

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
