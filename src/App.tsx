import React, { useEffect } from 'react';
import { LogBox, Button, AppRegistry } from 'react-native';

import { observer } from 'mobx-react';

import { NativeBaseProvider, Flex, Image } from 'native-base';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainPage from './containers/MainPage';
import AddPathPage from './containers/AddPathPage';

import { useStore } from './store/store';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

AppRegistry.registerComponent('Kekoliandia', () => App);

const App: React.FC<{}> = () => {
  
  const RootStack = createStackNavigator();
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen
              name="MainPage"
              component={MainPage}
            />
          </RootStack.Group>
          <RootStack.Group screenOptions={{ presentation: 'modal' }}>
            <RootStack.Screen name="AddPathPage" component={AddPathPage} />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
export default observer(App);
