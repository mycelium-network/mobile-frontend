/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten template
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */

import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import {
  ApplicationProvider,
  Button,
  Icon,
  IconRegistry,
  Layout,
  Text,
  Avatar,
  Input
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import * as Constants from './constants';

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */
const HeartIcon = (props) => (
  <Icon {...props} name='heart' />
);

const AlertIcon = (props) => (
  <Icon {...props} name='alert-circle-outline' />
);

export default function App() {
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [errorText, setErrorText] = React.useState('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [errorTextVisible, setErrorTextVisible] = React.useState(false);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  // Login Components
  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function login() {
    console.log("Login("+username+", "+password+")")

    fetch(Constants.API_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: "grant_type=&username=" + username + "&password=" + password + "&scope=&client_id=&client_secret=",
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((responseJson) => {
            setErrorText(responseJson.detail)
            setErrorTextVisible(true)
          });
          return undefined
        } else {
          setErrorTextVisible(false)
        }
        return response.json()
      }).then((responseJson) => {
        if(responseJson === undefined){
          return
        }
        getUser(responseJson.access_token);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getUser(access_token) {
    fetch('API_USER_ME', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Bearer '+access_token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((responseJson) => {
            setErrorText(responseJson.detail)
            setErrorTextVisible(true)
          });
          return undefined
        } else {
          setErrorTextVisible(false)
        }
        return response.json()
      }).then((responseJson) => {
        if(responseJson === undefined){
          return
        }
        Alert.alert("Hello "+responseJson.full_name);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const renderError = () => (
    <Text style={styles.error}>
      Error: {errorText}
    </Text>
  );

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Layout style={styles.container}>
          <Image style={styles.avatar} shape='round' size='giant' source={require('./assets/images/icon-circle-lg.png')} />
          <Text style={styles.text}>Mycelium Network</Text>
          <View style={styles.separator} />
          <Input
            style={styles.input}
            value={username}
            placeholder='Username'
            onChangeText={nextValue => setUsername(nextValue)}
          />
          <Input
            style={styles.input}
            value={password}
            placeholder='Password'
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            onChangeText={nextValue => setPassword(nextValue)}
          />
          <Button
            style={styles.button}
            onPress={() => login()}
          >
            LOGIN
          </Button>
          <View>{errorTextVisible ? (renderError()) : null}</View>
        </Layout>
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    marginVertical: 16,
  },
  avatar: {
    height: 120,
    width: 120
  },
  input: {
    marginHorizontal: 16,
  },
  error: {
    textAlign: 'center',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 3,
    backgroundColor: '#FF3D71',
  }
});
