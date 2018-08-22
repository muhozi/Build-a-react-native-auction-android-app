import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Text,
  View,
  StatusBar,
  TextInput,
  AsyncStorage,
  NetInfo
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../config/main';

/**
 * Login component
 * TODO: Refactor codes
 */
class Login extends React.Component {
  state = {
    username: '',
    password: '',
    traffic: 0,
    isConnected: null
  };
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'change',
      this.handleConnectivityChange
    );
  }
  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'change',
      this.handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(isConnected => {
      this.setState({ isConnected });
    });
    AsyncStorage.clear();
  }
  handleConnectivityChange = isConnected => {
    this.setState({
      isConnected
    });
  };
  focusNextField = nextField => {
    this.refs[nextField].focus();
  };
  validate() {
    if (this.state.username == '' || this.state.password == '') {
      this.setState({ responseMsg: 'Please fill all fields' });
      this.setState({ statusColor: 'red' });
      return false;
    } else if (
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        this.state.username
      )
    ) {
      this.setState({
        responseMsg: 'Please enter a valid email address',
        statusColor: 'red'
      });
      return false;
    } else {
      this.setState({
        statusColor: 'green',
        responseMsg: 'Sending ...',
        traffic: 1
      });
      return true;
    }
  }
  login() {
    if (this.validate()) {
      fetch(config.url + 'api/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.username,
          password: this.state.password
        })
      })
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(responseData => {
          console.log(responseData);
          if (!responseData.error) {
            AsyncStorage.setItem(
              'authData',
              JSON.stringify(responseData),
              () => {
                AsyncStorage.setItem(
                  'authenticated',
                  '1',
                  () => {
                    Actions.tabbar({ type: 'reset' });
                  },
                  error => {
                    alert(error);
                  }
                );
              },
              error => {
                alert(error);
              }
            );
            this.setState({
              statusColor: 'green',
              responseMsg: 'Login successful',
              traffic: 0
            });
          } else {
            responseData.error == 'invalid_credentials'
              ? (message = 'Wrong email or password')
              : (message = responseData.error);
            this.setState({
              statusColor: 'rgba(255,0,0,1)',
              responseMsg: message,
              traffic: 0
            });
          }
        })
        .catch((error, response) => {
          console.log(error);
          this.setState({
            statusColor: 'rgba(255,0,0,1)',
            responseMsg: 'A problem occurs, Try again later.',
            traffic: 0
          });
        })
        .done();
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <StatusBar backgroundColor="#f15a24" />
          <View style={styles.body}>
            <View style={styles.loginForm}>
              <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}>
                    <Icon name="md-person" size={20} />
                  </Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput
                    style={styles.formInputText}
                    placeholder="Email..."
                    underlineColorAndroid="rgba(0, 0, 0, 0)"
                    onChangeText={uname => {
                      this.setState({ username: uname });
                    }}
                    value={this.state.username}
                    autoCorrect={false}
                    keyboardType="email-address"
                    returnKeyType="next"
                    ref="1"
                    onSubmitEditing={() => {
                      this.focusNextField('2');
                    }}
                  />
                </View>
              </View>

              <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}>
                    <Icon name="md-lock" size={20} />
                  </Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput
                    style={[styles.formInputText]}
                    placeholder="Password..."
                    underlineColorAndroid="rgba(0, 0, 0, 0)"
                    onChangeText={pass => {
                      this.setState({ password: pass });
                    }}
                    value={this.state.password}
                    autoCorrect={false}
                    secureTextEntry={true}
                    ref="2"
                  />
                </View>
              </View>
              {this.state.responseMsg ? (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 20
                  }}
                >
                  <Text style={{ color: this.state.statusColor }}>
                    {this.state.responseMsg}
                  </Text>
                </View>
              ) : null}
              {this.state.traffic == 0 ? (
                <View>
                  <View style={styles.formRowButtons}>
                    <TouchableHighlight
                      onPress={() => {
                        this.login();
                      }}
                    >
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.formRowButtons}>
                    <TouchableHighlight
                      style={styles.buttonTouch}
                      onPress={() => {
                        Actions.register();
                      }}
                    >
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>
                          Need an account? Register
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 53,
    backgroundColor: '#fff',
    flex: 1
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  loginForm: {
    marginTop: 60
  },
  formRow: {
    flexDirection: 'row',
    marginLeft: 30,
    marginTop: 30,
    marginRight: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f15a24',
    padding: 1,
    borderRadius: 4
  },
  formLabel: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  labelText: {
    color: '#f15a24'
  },
  formInputControl: {
    flex: 10
  },
  formRowButtons: {
    marginLeft: 30,
    marginTop: 30,
    marginRight: 30,
    padding: 1,
    borderRadius: 4,
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#f15a24',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 35,
    paddingRight: 35,
    borderRadius: 4
  },
  buttonText: {
    color: '#ffffff'
  },
  buttonTouch: {
    borderRadius: 4
  },
  status: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Login;
