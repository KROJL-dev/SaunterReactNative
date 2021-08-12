import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import { Flex, Image, ScrollView, Text, View } from 'native-base';

import { Path } from '../models/path';

import { observer } from 'mobx-react';

import { useStore } from '../store/store';

import { NavigationStackProp } from 'react-navigation-stack';

interface IProps {
  path: Path;
  navigation?: NavigationStackProp<{ userId: string }>;
}

const PathCard: React.FC<IProps> = ({ path, navigation }) => {
  const { pathStore } = useStore();

  const onPressCard = () => {
      console.log('kek', path.directionData.coordinate);
    pathStore.setCurrentCoordinatesForDisplay(path.directionData);
    navigation !== undefined && navigation.navigate('DisplayDirectionModal');
  };
  return (
    <TouchableOpacity style={{ alignSelf: 'stretch' }} onPress={onPressCard}>
      <Flex
        w="100%"
        direction="row"
        style={style.card}
        alignItems="center"
        justifyContent="space-between"
      >
        <Image
          source={{
            uri: 'https://image.flaticon.com/icons/png/512/44/44755.png',
          }}
          alt="logo"
          style={style.image}
        ></Image>
        <Flex direction="column">
          <Text style={style.title} w="100%">
            {path.title}
          </Text>
          <View w="100%" style={style.description}>
            <ScrollView w="100%">
              <Text w="100%"> {path.description}</Text>
            </ScrollView>
          </View>
        </Flex>
        <Text style={style.directionSize}>
          {path.directionData.directionSize}
        </Text>
      </Flex>
    </TouchableOpacity>
  );
};
export default observer(PathCard);

const style = StyleSheet.create({
  card: {
    marginBottom: 15,
    paddingHorizontal: 10,
    height: Dimensions.get('screen').height / 8,
    backgroundColor: '#fff',
  },
  image: {
    height: Dimensions.get('screen').height / 14,
    width: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    width: Dimensions.get('screen').width / 3,
  },
  description: {
    maxHeight: Dimensions.get('screen').height / 8 - 80,
  },
  directionSize: {},
});
