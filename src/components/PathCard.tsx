import React from 'react';
import {  StyleSheet, Dimensions } from 'react-native';

import { Flex, Image, ScrollView, Text, View } from 'native-base';

import { Path } from '../models/path';
import { backgroundColor, paddingRight } from 'styled-system';

interface IProps {
  path: Path;
}

const PathCard: React.FC<IProps> = ({path}) => {
  return (
    <Flex w="100%" direction="row" style={style.card} alignItems="center" justifyContent="space-between">
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
      <Text style={style.directionSize}>{path.directionData.directionSize}</Text>
    </Flex>
  );
};
export default PathCard;

const style = StyleSheet.create({
  card: {
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
  directionSize: {
     
  },
});