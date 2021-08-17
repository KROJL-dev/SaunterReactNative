import React, { useEffect } from 'react';
import { LogBox, Button, AppRegistry } from 'react-native';

import { observer } from 'mobx-react';

import { NativeBaseProvider, Flex } from 'native-base';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainPage from './containers/MainPage';
import AddPathModal from './containers/AddPathModal';
import DisplayDirectionModal from './containers/DisplayDirectionModal';
import AuthPage from './containers/AuthPage';

import { NavigationStackProp } from 'react-navigation-stack';

import { useStore } from './store/store';

interface IProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

AppRegistry.registerComponent('Kekoliandia', () => App);

const App: React.FC<IProps> = () => {
  const { userStore, pathStore } = useStore();
  const RootStack = createStackNavigator();

  useEffect(() => {
    userStore.checkUserAfterturnOnApp();
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
                headerLeft: () => null,
                headerRight: () => (
                  <Flex direction="row">
                    <Button
                      onPress={() => {
                        userStore.logout();
                        pathStore.logoutPathList();
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
