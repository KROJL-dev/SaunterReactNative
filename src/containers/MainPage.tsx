import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import { Container, Center, Button, Flex } from 'native-base';

import { NavigationStackProp } from 'react-navigation-stack';

import { observer } from 'mobx-react';

import { useStore } from '../store/store';

import PathCard from '../components/PathCard';

import AsyncStorage from '@react-native-community/async-storage';

import { IPath } from 'models/path';

interface IProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

const MainPage: React.FC<IProps> = ({ navigation }) => {
  const { pathStore, userStore } = useStore();

  useEffect(() => {
    (async () => {
      if (userStore.isCurrentUser) {
        
        let storagePaths = await AsyncStorage.getItem(
          `${userStore.currentUser?.id}pathList`
        );

        if (storagePaths !== null) {
          pathStore.refreshPathList(
            JSON.parse(storagePaths) as unknown as IPath[]
          );
        } else {
          navigation.navigate('AddPathModal');
        }
      } else {
        navigation?.navigate('AuthPage');
      }
    })();
  }, [userStore.isCurrentUser]);
  return (
    <Center
      w={Dimensions.get('screen').width}
      h={Dimensions.get('screen').height / -110}
    >
      <Container w="100%" h="99%">
        <Center w="100%" h="100%">
          <Flex w="100%" h="100%">
            {pathStore.pathList.length
              ? pathStore.pathList.map((path) => (
                  <PathCard navigation={navigation} path={path} key={path.id} />
                ))
              : null}
          </Flex>
          <Button
            w="100%"
            style={style.addBtn}
            onPress={() => {
              navigation.navigate('AddPathModal');
            }}
          >
            Add path
          </Button>
        </Center>
      </Container>
    </Center>
  );
};

export default observer(MainPage);

const style = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    bottom: 0,
  },
});
