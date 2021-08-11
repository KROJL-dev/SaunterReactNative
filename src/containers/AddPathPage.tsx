import React, { Component } from 'react';

import { Center, Container, Input, Stack } from 'native-base';
import { Text, View, Button, StyleSheet, Dimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { NavigationStackProp } from 'react-navigation-stack';

import { useStore } from '../store/store';
import Map from '../components/Map';

export interface IProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

type onSumbitData = {
    title:string,
    description:string
}
const AddPathPage: React.FC<IProps> = ({ navigation }) => {
  const { pathStore } = useStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: onSumbitData) =>
    {
        pathStore.addPath(data.title, data.description);
        navigation.goBack()
    }

  return (
    <Center w={Dimensions.get('window').width}>
      <Container w="100%" style={styles.container}>
        <Stack space={4} w="100%">
          <Controller
            control={control}
            rules={{
              required: true,
              maxLength:10
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                w="100%"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
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
              />
            )}
            name="description"
            defaultValue=""
          />
        </Stack>
      </Container>
      <Stack space={4} w="100%">
        <Map />
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </Stack>
    </Center>
  );
};
export default AddPathPage;

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
