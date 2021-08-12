import React, { useEffect } from 'react';
import { LogBox, Button, AppRegistry } from 'react-native';

import { observer } from 'mobx-react';

import { NativeBaseProvider, Flex, Image } from 'native-base';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainPage from './containers/MainPage';
import AddPathModal from './containers/AddPathModal';
import DisplayDirectionModal from './containers/DisplayDirectionModal';
 

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
            <RootStack.Screen name="MainPage" component={MainPage} />
          </RootStack.Group>
          <RootStack.Group screenOptions={{ presentation: 'modal' }}>
            <RootStack.Screen name="AddPathModal" component={AddPathModal} />
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
