import AsyncStorage from '@react-native-community/async-storage';

import { action, makeAutoObservable, observable } from 'mobx';
import _ from 'lodash';

import { Path, IDirectionData } from 'models/path';

import { RootStore } from './store';

import generateId from '../utils/generateId';

export default class TodoStore {
  rootStore: RootStore;
  @observable pathList: Path[] = [];

  @observable currentCordinatesForDisplay?: IDirectionData;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  @action
  setCurrentCoordinatesForDisplay = (data: IDirectionData) => {
    this.currentCordinatesForDisplay = _.cloneDeep(data);
  };

  @action
  changeFavorite = (id: string) => {
    let newPathList = _.cloneDeep(this.pathList);
    
      newPathList.map((path) => {
      if (path.id === id) {
          path.isFavourite = !path.isFavourite
      }
    });
    this.pathList = newPathList
    
  };

  @action
  addPath = (
    title: string,
    description: string,
    currentCoodinatesInfo: IDirectionData
  ) => {
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
  };
}
