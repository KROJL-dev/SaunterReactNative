import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';

import { Container, Center, Button, Flex } from 'native-base';

import { NavigationStackProp } from 'react-navigation-stack';

import { observer } from 'mobx-react';

import { useStore } from '../store/store';

import PathCard from '../components/PathCard';

interface IProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

const MainPage: React.FC<IProps> = ({ navigation }) => {
  const { pathStore } = useStore();
 
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
          <Button
            w="100%"
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
