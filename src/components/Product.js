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
  NetInfo,
  AsyncStorage,
} from 'react-native';
import {
  Actions,
  Modal,
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Lightbox from 'react-native-lightbox';
import Styles from '../styles/Styles';
import Colors from '../styles/Colors';
import config from '../config/main';
class Product extends React.Component {
  state={
    networkResponse:'',
    isConnected:null,
    responseMsg:"",
    successStatus:'',
    price: '',
    statusColor:'green',
    traffic:0,
  }
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
    this.setState({
      responseMsg:"",
      successStatus:'',
    });
  }
  handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  }
  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  }
    validate(){
    if(this.state.price == ""){
      this.setState({responseMsg:"Please enter the your bid price"})
      this.setState({statusColor: 'red'})
      return false;
    }  
    else if(/[^0-9]/.test(this.state.price) || parseInt(this.state.price) < 500){
      this.setState({
        responseMsg:"Please enter a valid price (number & not less than Rwf 500)",
        statusColor: 'red'
      })
      return false;
    }
    else{
      this.setState({
        statusColor: 'green',
        responseMsg:"Saving auction details ....",
        traffic:1,
      })
      return true;
    }

  }
  sendBid(){
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
                        //this.fetchProfileData($token = authData.token_type+' '+authData.access_token)
                        //Validate Then Send
                        if (this.validate()) {
                          fetch(config.url+'api/bid/'+this.props.product.id, {
                            method: 'POST',
                            headers: {
                              Authorization : authData.token_type+' '+authData.access_token,
                              Accept : 'application/json',
                              'Content-Type':'application/json'
                              },
                            body: JSON.stringify({price: this.state.price})
                          })
                          .then((response) => response.json())
                          .then((responseData)=>{
                            if (responseData.status=='success') {
                              this.setState({
                                responseMsg:"",
                                traffic:0,
                                successStatus:responseData.message,
                                price: '',
                              })
                              this.dismissMsg()
                            }
                            if (responseData.status=='error') {
                              this.setState({
                                responseMsg:responseData.errors.price[0],
                                traffic:0,
                                statusColor:'red'
                              })
                              this.dismissMsg()
                            }
                          })
                          .catch((error) => {
                            this.setState({statusColor: 'rgba(255,0,0,1)'})
                            this.setState({responseMsg:"Internet network failed !"})
                            console.log(error)
                            this.setState({networkResponse:"Internet network failed ! Check your internet and try again."})
                            this.setState({statusColor:"rgba(255,0,0,0.8)"})
                          })
                          .done();
                        }
                      }
                      else{
                        //Actions.login({type:'reset'})
                        alert("No Token");
                      }
                    }
                    else{
                        //Actions.login({type:'reset'})
                        alert("Unable to pass Token");
                    }
                }
                else{
                  //Actions.login({type:'reset'})
                  alert("Null data");
                }
                })
                .catch((error) => {
                  //Actions.login({type:'reset'}) //Critical Point
                  alert(error)
                })
                .done();
              }
              else{
                  //Actions.login({type:'reset'})
                  alert("No async value")
              }
          }
          else{
            //Actions.login({type:'reset'})
            alert("No async value")
          }
          })
          .catch((error) => {Actions.login({type:'reset'})})
          .done();
  }
  dismissMsg(){
    setTimeout (() => { 
      this.setState({
        successStatus:'',
        responseMsg:'',
        price:'',
      }) },2000)
  }
  render() {

    return (
      <View style={[styles.container]}>
      <ScrollView>
      <StatusBar backgroundColor={colors.accent}/>
      {(!this.state.isConnected)?<View style={styles.loadBar}><Text style={styles.white}>Please check your Internet! </Text></View>:null}
        <View style={[styles.body,styles.padDetails]}>
        {(this.props.product.id)?
            <View>
            <View style={styles.padView}>
              <Text style={styles.title}>{this.props.product.product_name}</Text>
            </View>
            <View style={[styles.padView],{alignItems: 'center'}}>
            <Lightbox underlayColor="white" backgroundColor={colors.darkTransparent} navigator={this.props.navigator}>
              <View style={styles.center}>
                <Image
                  style={styles.image}
                  source={{uri: this.props.product.picture}}
                />
              </View>
              </Lightbox>
            </View>
            <View>
              <Text><Text style={styles.label}>{'\n'}Initial price</Text> {this.props.product.minimal_price}</Text>
              {(this.props.product.is_bidden)?<Text style={styles.padTop}>
                  <Text style={styles.label}>Was bidden</Text> &nbsp;
                  {this.props.product.bids_no}
              </Text>:<Text style={styles.mute}>No any bid yet</Text>}
              {(this.props.product.is_bidden)?<Text style={styles.padTop}>
                  <Text style={styles.label}>Highest bid price</Text> &nbsp;
                  {this.props.product.high_price}
              </Text>:<Text style={styles.mute}>Not yet bidden</Text>}
              <Text style={styles.padTop}>
                  <Text style={styles.label}>{(this.props.product.is_ended)?'Ended on':'Will end on'}</Text> &nbsp;
                  {this.props.product.end_date_time}&nbsp;&nbsp;&nbsp;
              </Text>
              <Text>{'\n'+this.props.product.description}</Text>
            </View>
            <View>
            <View style={styles.center}><Text style={styles.title}>Bid this product</Text></View>
            {/*Bid Form*/}
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-arrow-round-up" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={styles.formInputText} keyboardType='numeric' placeholder={"Enter your price... Min("+this.props.product.bid_price+")"} underlineColorAndroid={colors.transparent} onChangeText={(price)=>{this.setState({price:price})}} value={this.state.price} autoCorrect={false} returnKeyType='go' ref='1' onSubmitEditing={()=>this.sendBid()}/>
                </View>
            </View>
            {(this.state.responseMsg)?<View style={styles.statusText}><Text style={{color:this.state.statusColor}}>{this.state.responseMsg}</Text></View>:null}
            {(this.state.successStatus)?<View style={styles.statusText}><Text style={styles.success}>{this.state.successStatus}</Text></View>:null}
            <View style={styles.formRowButtons}>
                  {(this.state.traffic==0)?<TouchableHighlight onPress={()=>{this.sendBid()}} style={styles.buttonTouchForm} underlayColor={colors.accent}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Bid this product</Text>
                    </View>
                  </TouchableHighlight>:null}
              </View>
            </View>
            </View>:<View style={styles.loadBar}><Text style={styles.white}>{(this.state.networkResponse)?this.state.networkResponse:'Loading...'}</Text></View>}
        </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = Styles
const colors = Colors
export default Product
