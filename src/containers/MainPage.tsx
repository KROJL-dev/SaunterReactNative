import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import {
  Container,
  Center,
  Button,
  Flex,
  View,
  ScrollView,
  Text,
} from 'native-base';

import { NavigationStackProp } from 'react-navigation-stack';

import _ from 'lodash';

import { observer } from 'mobx-react';

import { useStore } from '../store/store';

import PathCard from '../components/PathCard';

import AsyncStorage from '@react-native-community/async-storage';

import { IPath } from 'models/path';
import { TouchableOpacity } from 'react-native';

interface IProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

const MainPage: React.FC<IProps> = ({ navigation }) => {
  const { pathStore, userStore } = useStore();

  const [cureentPathList, setCurrentPathList] = useState<IPath[]>([]);
  const [isFilter, setIsFilter] = useState<boolean>(false);

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
        navigation.navigate('AuthPage');
      }
    })();
  }, [userStore.isCurrentUser]);

  useEffect(() => {
    setCurrentPathList(_.cloneDeep(pathStore.pathList));
  }, [pathStore.pathList]);

  useEffect(() => {
    if (isFilter) {
      let tempArr = _.cloneDeep(pathStore.pathList);
      tempArr = tempArr.filter((path) => path.isFavourite === true);
      setCurrentPathList(tempArr);
    } else {
      setCurrentPathList(pathStore.pathList);
    }
  }, [isFilter]);

  return (
    <View
      w="100%"
      // style={{ borderStyle: 'solid', borderWidth: 5, borderColor: 'red' }}
    >
      <Center>
        <Container style={{ marginTop: 10 }}>
          <Center>
            <Flex>
              <View>
                <ScrollView style={{ marginBottom: 50 }}>
                  {cureentPathList.length
                    ? cureentPathList.map((path) => (
                        <PathCard
                          navigation={navigation}
                          path={path}
                          key={path.id}
                        />
                      ))
                    : null}
                </ScrollView>
              </View>
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
      <TouchableOpacity
        onPress={() => setIsFilter(!isFilter)}
        style={style.filterBtn}
      >
        <Text w={Dimensions.get('screen').height} style={style.filter}>
          Filter
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default observer(MainPage);

const style = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    bottom: 0,
  },
  filterBtn: {
    position: 'absolute',
    right: 0,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width / 10.7,

    zIndex: -1,
  },
  filter: {
    lineHeight: 25,
    fontSize: 25,
    width: 100,
    position: 'absolute',
    left: -35,
    top: Dimensions.get('screen').height/2-100,
    transform: [{ rotate: '90deg' }],
  },
});
