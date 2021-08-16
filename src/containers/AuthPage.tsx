import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import { Alert, Center } from 'native-base';
import { NavigationStackProp } from 'react-navigation-stack';

import { useStore } from '../store/store';

interface IProps {
  navigation?: NavigationStackProp<{ userId: string }>;
}

const AuthPage: React.FC<IProps> = ({ navigation }) => {
  const { userStore } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fetching, setFetching] = useState(false);

  const [loading, setLoading] = useState(false);

  const SignUp = () => {
    userStore.singIn(email, password);
    setLoading(true);
  };
  const CreateUserValidasition = () => {
    userStore.createUser(email, password);
    setLoading(true)
  };

  useEffect(() => {
    userStore.checkUserAfterturnOnApp();
     
  }, []);
  useEffect(() => {
    if (userStore.isCurrentUser) {
      navigation?.navigate('MainPage');
      setLoading(false);
    }
  }, [userStore.isCurrentUser]);
  return (
    <SafeAreaView>
      <View style={{ flex: 0.2 }}>
        {!!fetching && <ActivityIndicator color="blue" />}
      </View>
      <View>
        <Text> Sign Up </Text>
      </View>
      <View>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Mail address"
          onChangeText={(text) => {
            setEmail(text);
          }}
        />

        <TextInput
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <View>
        <TouchableHighlight onPress={SignUp}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <Text>Continue</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View>
        <Text>Regisration</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Mail address"
          onChangeText={(text) => {
            setEmail(text);
          }}
        />

        <TextInput
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      {userStore.userError !== '' ? (
        <View>
          <View
            style={{
              position: 'absolute',
              top: 50,
              left: Dimensions.get('screen').width / 2 - 100,
            }}
          >
            <Alert w="200">
              <Alert.Icon />
              <Alert.Title>EROR</Alert.Title>
              <Alert.Description>{userStore.userError}</Alert.Description>
            </Alert>
          </View>
        </View>
      ) : null}

      <View>
        <TouchableHighlight onPress={CreateUserValidasition}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <Text>Continue</Text>
          </View>
        </TouchableHighlight>
      </View>
      {loading && (
        <Center>
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{
              height: 150,
              width: 150,
            }}
          />
        </Center>
      )}
    </SafeAreaView>
  );
};

export default observer(AuthPage);
