import remotedev from 'mobx-remotedev';

import { configure, makeAutoObservable, observable } from 'mobx';

import { createContext, useContext } from 'react';

import PathStore from './pathStore'

configure({ enforceActions: 'observed' });
@remotedev({ global: true })

export class RootStore {
  @observable pathStore: PathStore;
  constructor() {
    this.pathStore = new PathStore(this);
    makeAutoObservable(this);
  }
}

const store = new RootStore();
export const StoreContext = createContext<RootStore>(store);

export const useStore = (): RootStore => {
  const store = useContext(StoreContext);

  if (!store) {
    console.log('You have forgot to use StoreProvider, shame on you.');
  }
  return store;
};

export default store;
