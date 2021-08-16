import firestore from '@react-native-firebase/firestore';

import { IPath  } from 'models/path';

export const addPath = (path: IPath) => {
  firestore().collection('Path').add({ description : path.description});
};