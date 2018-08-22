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
import Styles from '../styles/Styles';
import Colors from '../styles/Colors';
import config from '../config/main';

/**
 * Product component
 * TODO: Refactor codes
 */
class Profile extends React.Component {
  state = {
    names: '',
    phone: '',
    email: '',
    auctions: '',
    networkInfo: '',
    responseMsg: '',
    isConnected: null
  };
  focusNextField = nextField => {
    this.refs[nextField].focus();
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
    this.setState({ networkResponse: 'Loading...' });
    AsyncStorage.getItem('authenticated')
      .then(value => {
        if (value !== null) {
          if (value == 1) {
            AsyncStorage.getItem('authData')
              .then(data => {
                if (data !== null) {
                  if (JSON.parse(data)) {
                    var authData = JSON.parse(data);
                    if (
                      authData.access_token &&
                      authData.user &&
                      authData.expires_at
                    ) {
                      this.fetchProfileData(`Bearer ${authData.access_token}`);
                    } else {
                      Actions.login({ type: 'reset' });
                    }
                  } else {
                    Actions.login({ type: 'reset' });
                  }
                } else {
                  Actions.login({ type: 'reset' });
                }
              })
              .catch(error => {
                Actions.login({ type: 'reset' });
              })
              .done();
          } else {
            Actions.login({ type: 'reset' });
          }
        } else {
          Actions.login({ type: 'reset' });
        }
      })
      .catch(error => {
        Actions.login({ type: 'reset' });
      })
      .done();
  }
  handleConnectivityChange = isConnected => {
    this.setState({
      isConnected
    });
  };
  fetchProfileData(token) {
    if (this.state.isConnected) {
      fetch(config.url + 'api/user', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: token
        }
      })
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(responseData => {
          if (!responseData.error) {
            this.setState({ respoData: responseData });
            this.setState({
              names: responseData.firstname + ' ' + responseData.lastname,
              phone: responseData.phone,
              email: responseData.email,
              auctions: responseData.auctions
            });
          } else {
            this.setState({ statusColor: 'rgba(255,0,0,1)' });
            this.setState({ responseMsg: 'Please Login!' });
            this.setState({ networkResponse: 'You are not logged in' });
            this.setState({ statusColor: 'rgba(255,0,0,0.8)' });
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({ statusColor: 'rgba(255,0,0,1)' });
          this.setState({ responseMsg: 'Internet network failed !' });
          this.setState({
            networkResponse:
              'Internet network failed ! Check your internet and try again.'
          });
          this.setState({ statusColor: 'rgba(255,0,0,0.8)' });
        })
        .done();
    } else {
      this.setState({
        networkInfo: 'Please Check your internet and try again'
      });
    }
  }
  logout() {
    AsyncStorage.getItem('authenticated')
      .then(value => {
        if (value !== null) {
          if (value == 1) {
            AsyncStorage.getItem('authData')
              .then(data => {
                if (data !== null) {
                  if (JSON.parse(data)) {
                    var authData = JSON.parse(data);
                    if (
                      authData.access_token &&
                      authData.user &&
                      authData.expires_at
                    ) {
                      this.sendLogout(`Bearer ${authData.access_token}`);
                    } else {
                      Actions.login({ type: 'reset' });
                    }
                  } else {
                    Actions.login({ type: 'reset' });
                  }
                } else {
                  Actions.login({ type: 'reset' });
                }
              })
              .catch(error => {
                Actions.login({ type: 'reset' });
              })
              .done();
          } else {
            Actions.login({ type: 'reset' });
          }
        } else {
          Actions.login({ type: 'reset' });
        }
      })
      .catch(error => {
        Actions.login({ type: 'reset' });
      })
      .done();
  }
  sendLogout(token) {
    if (this.state.isConnected) {
      fetch(config.url + 'api/logout', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: token
        }
      })
        .then(response => response.json())
        .then(responseData => {
          if (!responseData.error) {
            if (responseData.status == 'success') {
              AsyncStorage.clear();
              Actions.login({ type: 'reset' });
            } else {
              this.setState({ responseMsg: 'Something went wrong' });
              this.setState({ statusColor: 'red' });
            }
          } else {
            this.setState({ responseMsg: 'Please Login!' });
            this.setState({ statusColor: 'red' });
          }
        })
        .catch(error => {
          this.setState({ responseMsg: 'Internet network failed !' });
          this.setState({
            networkResponse:
              'Internet network failed ! Check your internet and try again.'
          });
          this.setState({ statusColor: 'red' });
        })
        .done();
    } else {
      this.setState({
        networkInfo: 'Please Check your internet and try again'
      });
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <StatusBar backgroundColor={colors.accent} />
          {!this.state.isConnected ? (
            <View style={styles.loadBar}>
              <Text style={styles.white}>Please check your Internet! </Text>
            </View>
          ) : null}
          <View style={styles.body}>
            <View style={styles.center}>
              <View>
                <View style={styles.center}>
                  <Icon name="ios-contact" size={200} />
                </View>
                <Text style={styles.indent}>
                  <Text style={styles.labeled}>Names</Text>: {this.state.names}
                </Text>
                <Text style={styles.indent}>
                  <Text style={styles.labeled}>Phone</Text>: {this.state.phone}
                </Text>
                <Text style={styles.indent}>
                  <Text style={styles.labeled}>Email</Text>: {this.state.email}
                </Text>
              </View>
              <View>
                <Text style={styles.indent}>{this.state.auctions}</Text>
              </View>
              <TouchableHighlight
                onPress={() => this.logout()}
                style={styles.buttonTouch}
                underlayColor={colors.accent}
              >
                <View style={styles.button}>
                  <Text style={styles.white}>Logout</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = Styles;
const colors = Colors;
export default Profile;
