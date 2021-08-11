import AsyncStorage from '@react-native-community/async-storage';

import { action, makeAutoObservable, observable } from 'mobx';

import { Path, IDirectionData } from 'models/path';

import { RootStore } from './store';

import generateId from '../utils/generateId';

export default class TodoStore {
  rootStore: RootStore;
  @observable pathList: Path[] = [];
  @observable currentCoodinatesInfo?: IDirectionData;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  @action
  setCurrentCoordinatesInfo = (data: IDirectionData) => {
    this.currentCoodinatesInfo = data;
  };

  @action
  addPath = (title: string, description: string) => {
    if (
      this.currentCoodinatesInfo !== undefined &&
      this.currentCoodinatesInfo.coordinate.length >= 2
    ) {
      this.pathList = [
        ...this.pathList,
        {
          title,
          description,
          isFavourite: false,
          id: generateId(),
          directionData: this.currentCoodinatesInfo,
        },
      ];
    } else {
      throw new Error('kek');
    }
  };
}
