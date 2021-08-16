import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';

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
    if (pathStore.pathList.length === 0) {
      navigation.navigate('AddPathModal');
    }
  }, []);
  useEffect(() => {
    (async () => {
      if (!userStore.isCurrentUser) {
        navigation?.navigate('AuthPage');
        let storagePaths = await AsyncStorage.getItem(
          `${userStore.currentUser?.id}pathList`
        );
        if (storagePaths !== null) {
          pathStore.refreshPathList(
            JSON.parse(storagePaths) as unknown as IPath[]
          );
        }
      }
    })();
  }, [userStore.isCurrentUser]);
  return (
    <Center w={Dimensions.get('screen').width}>
      <Container w="100%">
        <Center w="100%">
          <Flex w="100%">
            {pathStore.pathList.length
              ? pathStore.pathList.map((path) => (
                  <PathCard navigation={navigation} path={path} key={path.id} />
                ))
              : null}
          </Flex>
        </Center>
      </Container>
    </Center>
  );
};

export default observer(MainPage);
