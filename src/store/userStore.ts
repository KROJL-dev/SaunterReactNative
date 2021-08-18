import AsyncStorage from '@react-native-community/async-storage';

import { action, makeAutoObservable, observable } from 'mobx';
import _ from 'lodash';

import { IUser } from '../models/user';

import { RootStore } from './store';

import auth from '@react-native-firebase/auth';
import { LatLng } from 'react-native-maps';

export default class UserStore {
  rootStore: RootStore;

  @observable currentUser?: IUser;
  @observable isCurrentUser: boolean = false;
  @observable userError: string = '';

  @observable userPosition?: LatLng;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  @action
  setUserPosition = (latitude: number, longitude: number) => {
    this.userPosition = _.cloneDeep({ latitude, longitude });
  };
  @action
  unsetUserPosition = () => {
    this.userPosition = undefined;
  };
  @action
  createUser = async (email: string, password: string) => {
    if (this.validation(email, password)) {
      try {
        let response = await auth().createUserWithEmailAndPassword(
          email,
          password
        );
        if (response && response.user) {
          this.currentUser = { email, password, id: response.user.uid };
          this.isCurrentUser = true;
          await AsyncStorage.setItem(
            'currentUser',
            JSON.stringify(this.currentUser)
          );
        }
      } catch (e) {
        this.userError = e.message;
      }
    }
  };

  isValidEmail(emailAddress: string) {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    return pattern.test(emailAddress);
  }

  validation = (email: string, password: string): boolean => {
    if (!email) {
      this.userError = 'Email required *';
      setTimeout(() => {
        this.userError = '';
      }, 3000);
      return false;
    } else if (!password && password.trim() && password.length > 6) {
      this.userError = 'Weak password, minimum 5 chars';
      setTimeout(() => {
        this.userError = '';
      }, 3000);
      return false;
    } else if (!this.isValidEmail(email)) {
      this.userError = 'Invalid Email';
      setTimeout(() => {
        this.userError = '';
      }, 3000);
      return false;
    }
    return true;
  };

  @action
  logout = async () => {
    console.log('logout');
    await AsyncStorage.removeItem('currentUser');
    this.currentUser = undefined;
    this.isCurrentUser = false;
  };

  @action
  singIn = async (email: string, password: string) => {
    if (this.validation(email, password)) {
      try {
        let response = await auth().signInWithEmailAndPassword(email, password);

        if (response && response.user) {
          this.currentUser = { email, password, id: response.user.uid };
          this.isCurrentUser = true;

          await AsyncStorage.setItem(
            'currentUser',
            JSON.stringify(this.currentUser)
          );
        }
      } catch (e) {
        this.userError = e.message;
      }
    }
  };

  @action
  checkUserAfterturnOnApp = async () => {
    let currentUser = await AsyncStorage.getItem('currentUser');

    if (currentUser !== null) {
      this.currentUser = _.cloneDeep(currentUser) as unknown as IUser;
      this.isCurrentUser = true;
    }
  };
}
