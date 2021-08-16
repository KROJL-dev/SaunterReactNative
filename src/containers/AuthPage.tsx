import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  View,
  Text,
  Alert,
  TouchableHighlight,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';

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
  const [error, setError] = useState('');
  const [isValid, setValid] = useState(true);

  const SignUp = () => {
    userStore.singIn(email, password);
  };
  const CreateUserValidasition = () => {
    userStore.createUser(email, password);
  };

  useEffect(() => {
    userStore.checkUserAfterturnOnApp();
  }, []);
  useEffect(() => {
    if (userStore.isCurrentUser) {
      navigation?.navigate('MainPage');
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
            setError;
            setEmail(text);
          }}
        />

        <TextInput
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      {error ? (
        <View>
          <Text>{error}</Text>
        </View>
      ) : null}
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
            setError;
            setEmail(text);
          }}
        />

        <TextInput
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      {error ? (
        <View>
          <Text>{error}</Text>
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
    </SafeAreaView>
  );
};

export default observer(AuthPage);
