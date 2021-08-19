import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import {
  Container,
  Center,
  Button,
  Flex,
  View,
  ScrollView,
  Text,
} from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';

import { NavigationStackProp } from 'react-navigation-stack';

import _ from 'lodash';

import { observer } from 'mobx-react';

import { useStore } from '../store/store';

import PathCard from '../components/PathCard';

import { IPath } from 'models/path';
import { TouchableOpacity } from 'react-native';

interface IProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

const sortByFavourite = (
  pathArr: IPath[],
  sortBy: string,
  searchStr: string = ''
): IPath[] => {
  let newPathList = _.cloneDeep(pathArr);
  switch (sortBy) {
    case 'favourite':
      newPathList.sort((a, b) => {
        return +b.isFavourite - +a.isFavourite;
      });
    case 'search':
      if (searchStr !== '') {
        newPathList = newPathList.filter((path) => {
          return path.title.match(searchStr) !== null;
        });
      }
  }

  return newPathList;
};

const MainPage: React.FC<IProps> = ({ navigation }) => {
  const { pathStore, userStore } = useStore();

  const [cureentPathList, setCurrentPathList] = useState<IPath[]>([]);
  const [isFilter, setIsFilter] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!userStore.isCurrentUser) {
        navigation.navigate('AuthPage');
      }
    })();
  }, [userStore.isCurrentUser]);

  useEffect(() => {
    setLoading(true);
    if (pathStore.pathList.length === 0) {
      (async () => {
        AsyncStorage.getItem(`${userStore.currentUser?.id}pathList`).then(
          (result) => {
            if (result !== null) {
              pathStore.refreshPathList(
                JSON.parse(result) as unknown as IPath[]
              );
            } else {
              navigation.navigate('AddPathModal');
            }
          }
        );
      })();
    }
    setCurrentPathList(
      sortByFavourite(_.cloneDeep(pathStore.pathList), 'favourite')
    );
    setLoading(false);
  }, [pathStore.pathList]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (search.length) {
      setCurrentPathList(
        sortByFavourite(_.cloneDeep(pathStore.pathList), 'search', search)
      );
    } else {
      setCurrentPathList(_.cloneDeep(pathStore.pathList));
    }
  }, [search]);

  useEffect(() => {
    if (isFilter) {
      let tempArr = _.cloneDeep(pathStore.pathList);
      tempArr = tempArr.filter((path) => path.isFavourite === true);
      setCurrentPathList(tempArr);
    } else {
      setCurrentPathList(
        sortByFavourite(_.cloneDeep(pathStore.pathList), 'favourite')
      );
    }
  }, [isFilter]);

  return (
    <View w="100%">
      <Center>
        <Container style={{ marginVertical: 10 }}>
          <Center>
            <TextInput
              style={style.search}
              onChangeText={setSearch}
              value={search}
              placeholder="search path"
              placeholderTextColor="black"
            />
            {loading ? (
              <Center>
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={{
                    height: 150,
                    width: 150,
                  }}
                />
              </Center>
            ) : cureentPathList.length ? (
              <Flex>
                <View>
                  <ScrollView style={{ marginVertical: 60 }}>
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
            ) : (
              <Text style={{ lineHeight: 20, marginVertical: 60 }}>
                path not found
              </Text>
            )}

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
  search: {
    backgroundColor: 'white',
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    color: 'black',
    top: 0,
    width: Dimensions.get('screen').width - 75,
    height: 50,
  },
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
    top: Dimensions.get('screen').height / 2 - 100,
    transform: [{ rotate: '90deg' }],
  },
});
