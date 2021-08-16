import React, { useEffect } from 'react';
import { LogBox, Button, AppRegistry } from 'react-native';

import { observer } from 'mobx-react';

import { NativeBaseProvider, Flex, Image } from 'native-base';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainPage from './containers/MainPage';
import AddPathModal from './containers/AddPathModal';
import DisplayDirectionModal from './containers/DisplayDirectionModal';
import AuthPage from './containers/AuthPage';

import { NavigationStackProp } from 'react-navigation-stack';

import firebase from 'react-native-firebase';
import firestore from '@react-native-firebase/firestore';

import { useStore } from './store/store';

interface IProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

AppRegistry.registerComponent('Kekoliandia', () => App);

const App: React.FC<IProps> = ({ navigation }) => {
  const { userStore, pathStore } = useStore();

  const RootStack = createStackNavigator();
   
  useEffect(() => {
    // firebase
    //   .auth()
    //   .signInAnonymously()
    //   .then(() => {
    //     return firebase
    //       .firestore()
    //       .collection('Path')
    //       .doc('3AvH1JJuI7YS6JmKxvbT')
    //       .set({
    //         id: 'fadsa',
    //       });
    //   }) 
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // const kek = firestore()
    //   .collection('Path')
    //   .doc('3AvH1JJuI7YS6JmKxvbT')
    //   .get();
    // console.log('kek', kek);
  }, []);
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen name="AuthPage" component={AuthPage} />
            <RootStack.Screen
              name="MainPage"
              component={MainPage}
              options={{
                headerLeft: () => (
                  <Button
                    title="Add path"
                    onPress={() => {
                      navigation.navigate('AddPathModal');
                    }}
                  />
                ),
                headerRight: () => (
                  <Flex direction="row">
                    <Button
                      onPress={() => {
                        userStore.logout();
                      }}
                      title="Logout"
                    />
                  </Flex>
                ),
              }}
            />
          </RootStack.Group>
          <RootStack.Group screenOptions={{ presentation: 'modal' }}>
            <RootStack.Screen
              name="AddPathModal"
              component={AddPathModal}
              options={
                pathStore.pathList.length === 0
                  ? {
                      headerLeft: () => null,
                    }
                  : {}
              }
            />
            <RootStack.Screen
              name="DisplayDirectionModal"
              component={DisplayDirectionModal}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
export default observer(App);
