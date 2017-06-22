import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import{
  Actions,
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

class Splash extends React.Component {
  componentDidMount () {

      setTimeout (() => {
        AsyncStorage.getItem('authenticated')
          .then((value) => {
          if (value !== null) {
              if (value==1) {
                AsyncStorage.getItem('authData')
                .then((data) => {
                if (data !== null) {
                    if (JSON.parse(data)) {
                      var authData = JSON.parse(data)
                      if(authData.access_token && authData.refresh_token && authData.token_type && authData.refresh_token && authData.expires_in){
                        Actions.tabbar({type:'reset',auth: authData.token_type+' '+authData.access_token})
                      }
                      else{
                        Actions.login({type:'reset'})
                      }
                    }
                    else{
                        Actions.login({type:'reset'})
                    }
                }
                else{
                  Actions.login({type:'reset'})
                }
                })
                .catch((error) => {Actions.login({type:'reset'})})
                .done();
              }
              else{
                  Actions.login({type:'reset'})
              }
          }
          else{
            Actions.login({type:'reset'})
          }
          })
          .catch((error) => {Actions.login({type:'reset'})})
          .done();
        
          
      }, 2000); 
  }
  render() {
    return (
      <View style={styles.container}>
      <StatusBar backgroundColor='#fff'/>
        <Icon name="md-trending-up" size={100} color='#f15a24'/>
        <Text style={styles.appname}>
          Auction
        </Text>
        <Text style={styles.instructions}>Sell on your desired bids</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  appname: {
    fontSize: 20,
    textAlign: 'center',
    margin: 0,
    color: '#f15a24',
  },
  instructions: {
    textAlign: 'center',
    color: '#f15a24',
    marginBottom: 100,
  },
});

export default Splash
