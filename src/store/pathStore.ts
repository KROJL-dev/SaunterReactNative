import AsyncStorage from '@react-native-community/async-storage';

import { action, makeAutoObservable, observable } from 'mobx';
import _ from 'lodash'

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
  addPath = (
    title: string,
    description: string,
    currentCoodinatesInfo: IDirectionData
  ) => {
    console.log('currentCoodinatesInfo', currentCoodinatesInfo.coordinate);
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
    console.log('this.pathList', this.pathList);
    this.pathList.map((path) => {
      console.log('kek', path.directionData.coordinate);
    });
  };
}
