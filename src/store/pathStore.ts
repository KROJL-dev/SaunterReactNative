import AsyncStorage from '@react-native-community/async-storage';

import { action, makeAutoObservable, observable } from 'mobx';
import _ from 'lodash';

import { IPath, IDirectionData } from 'models/path';

import { RootStore } from './store';

import generateId from '../utils/generateId';

export default class TodoStore {
  rootStore: RootStore;
  @observable pathList: IPath[] = [];

  @observable currentCordinatesForDisplay?: IDirectionData;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  @action
  logoutPathList = () => {
    this.pathList = [];
  };

  @action
  refreshPathList = (pathList: IPath[]) => {
    this.pathList = _.cloneDeep(pathList);
  };
  @action
  setCurrentCoordinatesForDisplay = (data: IDirectionData) => {
    this.currentCordinatesForDisplay = _.cloneDeep(data);
  };

  @action
  changeFavorite = async (id: string) => {
    if (this.rootStore.userStore.currentUser !== undefined) {
      let newPathList = _.cloneDeep(this.pathList);

      newPathList.map((path) => {
        if (path.id === id) {
          path.isFavourite = !path.isFavourite;
        }
      });
      this.pathList = newPathList;
      await AsyncStorage.setItem(
        `${this.rootStore.userStore.currentUser?.id}pathList`,
        JSON.stringify(this.pathList)
      );
    } else {
      console.log('user = undefined. Add path');
    }
  };

  @action
  addPath = async (
    title: string,
    description: string,
    currentCoodinatesInfo: IDirectionData
  ) => {
    if (this.rootStore.userStore.currentUser !== undefined) {
      this.pathList = [
        ...this.pathList,
        {
          title,
          description,
          isFavourite: false,
          id: generateId(),
          directionData: _.cloneDeep(currentCoodinatesInfo),
        },
      ];
      await AsyncStorage.setItem(
        `${this.rootStore.userStore.currentUser?.id}pathList`,
        JSON.stringify(this.pathList)
      );
    } else {
      console.log('user = undefined. Add path');
    }
  };
}
