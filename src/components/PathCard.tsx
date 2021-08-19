import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import { Flex, Image, ScrollView, Text, View } from 'native-base';

import { IPath } from '../models/path';

import { observer } from 'mobx-react';

import { useStore } from '../store/store';

import { NavigationStackProp } from 'react-navigation-stack';

interface IProps {
  path: IPath;
  navigation?: NavigationStackProp<{ userId: string }>;
}

const FAVOURITEICON =
  'https://image.flaticon.com/icons/png/512/1828/1828614.png';
const NOTFAVOURITEICON =
  'https://image.flaticon.com/icons/png/512/1828/1828970.png';
const LOGO = 'https://image.flaticon.com/icons/png/512/44/44755.png';

const DELETEICON = 'https://image.flaticon.com/icons/png/512/1214/1214428.png';

const PathCard: React.FC<IProps> = ({ path, navigation }) => {
  const { pathStore } = useStore();

  const [currentIcon, setCurrentIcon] = useState<string>(NOTFAVOURITEICON);

  const onPressCard = () => {
    pathStore.setCurrentCoordinatesForDisplay(path.directionData);
    navigation !== undefined && navigation.navigate('DisplayDirectionModal');
  };

  useEffect(() => {
    path.isFavourite
      ? setCurrentIcon(FAVOURITEICON)
      : setCurrentIcon(NOTFAVOURITEICON);
  }, [path.isFavourite]);

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
            uri: LOGO,
          }}
          alt="logo"
          style={style.image}
        ></Image>
        <Flex direction="column">
          <Text style={style.title} w="100%">
            {path.title}
          </Text>
          <View w="100%">
            <ScrollView w="100%">
              <Text w="100%" style={style.description}>
                {' '}
                {path.description}
              </Text>
            </ScrollView>
          </View>
        </Flex>
        <Text style={style.directionSize}>
          {path.directionData.directionSize}
        </Text>
      </Flex>
      <TouchableOpacity
        style={style.favouriteIcon}
        onPress={() => pathStore.changeFavorite(path.id)}
      >
        <Image source={{ uri: currentIcon }} alt="Kek" w="100%" h="100%" />
      </TouchableOpacity>
      <TouchableOpacity
        style={style.deleteIcon}
        onPress={() => {
          pathStore.deletePath(path.id);
          pathStore.unsetCurrentDirectionSize();
        }}
      >
        <Image source={{ uri: DELETEICON }} alt="Kek" w="100%" h="100%" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
export default observer(PathCard);

const style = StyleSheet.create({
  deleteIcon: {
    position: 'absolute',
    bottom: 7,
    width: 40,
    height: 40,
    right: 40,
  },
  favouriteIcon: {
    position: 'absolute',
    right: 0,
    bottom: 7,
    width: 40,
    height: 40,
  },
  card: {
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  image: {
    height: 60,
    width: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    width: Dimensions.get('screen').width / 3,
  },
  description: {
    lineHeight: 20,
  },
  directionSize: {},
});
