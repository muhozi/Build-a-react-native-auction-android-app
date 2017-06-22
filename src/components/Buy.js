import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Text,
  View,
  StatusBar,
  TextInput,
  FlatList,
  Image,
  AsyncStorage,
  NetInfo,
  
} from 'react-native';
import {
  Actions,
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../config/main';
import Styles from '../styles/Styles';
import Colors from '../styles/Colors';
class Buy extends React.Component {
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
    NetInfo.isConnected.fetch().done(
        (isConnected) => { this.setState({isConnected}); }
    );
    this.setState({networkResponse:'Loading...'})
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
                        this.fetchAuctions($token = authData.token_type+' '+authData.access_token)
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
    
  }

  state={
    respoData:'',
    networkResponse:'',
    statusColor:'rgba(0,255,0,0.8)',
    isConnected:null,
  }
  handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  }
  fetchAuctions(token){
    if (this.state.isConnected) {
    fetch(config.url+'api/buy',{
        method: 'GET',
        headers:
          {'Accept':'application/json',
            'Authorization':token
          }
      })
            .then((response) => response.json())
            .then((responseData) => {
              if (!responseData.error) {
                this.setState({respoData:responseData})
                //console.log(this.state.respoData);
              }
              else{
                this.setState({statusColor: 'red'})
                this.setState({responseMsg:"Please Login!"})
                this.setState({networkResponse:"You are not logged in"})
                Actions.login({type:'reset'});
              }
            })
            .catch((error) => {
              this.setState({statusColor: 'rgba(255,0,0,1)'})
              this.setState({responseMsg:"Internet network failed !"})
              this.setState({networkResponse:"Internet network failed ! Check your internet and try again."})
              this.setState({statusColor:"rgba(255,0,0,0.8)"})
              //console.log(error),
            })
            .done();
            //console.log(this.state.respoData);
          }
          else{
            this.setState({
              networkResponse: 'No internet network',
              statusColor: 'red',
            })
          }
  }
  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  }
  render() {
    return (
      <View style={[styles.container],{paddingBottom:53,paddingTop:53}}>
      <ScrollView>
      <StatusBar backgroundColor='#f15a24'/>
      {(!this.state.isConnected)?<View style={{backgroundColor:'red',alignItems:'center'}}><Text style={{color:'#ffffff'}}>Please check your Internet! </Text></View>:null}
        <View style={styles.body}>

        {(this.state.respoData)?<FlatList
          data={this.state.respoData}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => 
            <TouchableHighlight onPress={this.viewProduct.bind(this, item)} underlayColor={"rgba(241, 90, 36, 0.21)"}>
            <View style={{padding:10,borderBottomWidth:1,borderBottomColor:'rgba(241, 90, 36, 0.3)',flex:1,flexDirection:'row'}}>
            <View>
              <Image
                style={{width: 80, height: 80,borderRadius:50}}
                source={{uri: item.picture}}
              />
            </View>
            <View style={{paddingLeft:10}}>
              <Text style={{fontWeight: 'bold',color: 'rgba(107, 35, 9, 0.84)'}}>{item.product_name}</Text>
              <Text><Text style={styles.label}>Initial price</Text> {item.minimal_price}</Text>
              {(item.is_bidden)?<Text style={{paddingTop:5,color: 'rgba(25, 43, 62, 0.9)'}}>
                  <Text style={styles.label}>Highest bid</Text> &nbsp;
                  {item.high_price}
              </Text>:<Text style={{fontWeight:'bold'}}>Not yet bidden</Text>}
              <Text style={{paddingTop:5,color: 'rgba(25, 43, 62, 0.9)'}}>
                  <Text style={styles.label}>Will end on</Text> &nbsp;
                  {item.end_date_time}&nbsp;&nbsp;&nbsp;
              </Text>
            </View>
            </View>
            </TouchableHighlight>
        }
        />:<View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.statusColor}}><Text style={{color:'#555'}}>{(this.state.networkResponse)?this.state.networkResponse:'Loading...'}</Text></View>}
        </View>
        </ScrollView>
      </View>
    );
  }
  viewProduct(details){
    Actions.product({product:details});     
  }
}

const styles = Styles;

export default Buy
