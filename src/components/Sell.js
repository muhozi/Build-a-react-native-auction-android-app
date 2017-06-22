import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Text,
  View,
  StatusBar,
  TextInput,
  DatePickerAndroid,
  TimePickerAndroid,
  TouchableWithoutFeedback,
  NetInfo,
  Image,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Actions,
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Styles from '../styles/Styles';
import Colors from '../styles/Colors';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';
import pick from './picker';
import RNFetchBlob from 'react-native-fetch-blob';
import config from '../config/main';
class Sell extends React.Component {
  state={
    productName: '',
    price: '',
    description:'',
    endDate: new Date(),
    auctionEndDate: null,
    endDateText: 'Select auction end date ...',
    endTimeHour: null,
    endTimeMinute: null,
    endTimeText: 'Select auction end time ...',
    auctionEndTime: null,
    pictureSource: null,
    picture:null,
    traffic:0,
    statusColor: 'green',
    successStatus: '',
    isConnected:null,
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
  }
  handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  }
  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  }
  showDatePicker = async (stateKey, options) => {
    try {
      var dateState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        //newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        var month = date.getMonth() + 1;
        var unixDate = date.getFullYear() + "-" + month + "-" + date.getDate();
        var day_ = date.getDate() + 1;
        var unixDate_ = date.getFullYear() + "-" + month + "-" + day_;
        dateState[stateKey + 'DateText'] = date.toDateString();
        dateState[stateKey + 'Date'] = new Date(unixDate_.replace('-',','));
        dateState['auctionEndDate'] = unixDate;
      }
      this.setState(dateState)
    } catch ({code, message}) {
      alert("An error occurs")
    }
  }
  formatTime(hour, minute) {
    return hour + ':' + (minute < 10 ? '0' + minute : minute);
  }
  showTimePicker = async (stateKey, options) => {
    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      var timeState = {};
      if (action === TimePickerAndroid.timeSetAction) {
        timeState[stateKey + 'Text'] = this.formatTime(hour, minute);
        timeState['auctionEndTime'] = this.formatTime(hour, minute);
        timeState[stateKey + 'Hour'] = hour;
        timeState[stateKey + 'Minute'] = minute;
      } else if (action === TimePickerAndroid.dismissedAction) {
        //newState[stateKey + 'Text'] = 'dismissed';
      }
      this.setState(timeState);
    } catch ({code, message}) {
      alert("An error occurs")
    }
  }
  onLayout(e) {
      const {nativeEvent: {layout: {height}}} = e;
      this.height = height;
      this.forceUpdate();
  }
  validate(){
    if(this.state.productName == "" || this.state.auctionEndTime == null || this.state.auctionEndDate == null || this.state.picture == null || this.state.price == "" || this.state.description == ""){
      this.setState({responseMsg:"Please fill all the required (*)"})
      this.setState({statusColor: 'red'})
      return false;
    }
    else if(/[^a-zA-Z0-9 ]/.test(this.state.productName) || this.state.productName.length < 5){
      this.setState({responseMsg:"Please enter valid product name"})
      this.setState({statusColor: 'red'})
      return false;
    }
    else if(/[^a-zA-Z0-9 ]/.test(this.state.description) || this.state.description.length < 5){
      this.setState({responseMsg:"Please enter valid product description"})
      this.setState({statusColor: 'red'})
      return false;
    }    
    else if(/[^0-9]/.test(this.state.price) || parseInt(this.state.price) < 500){
      this.setState({
        responseMsg:"Please enter a valid price (not less than Rwf 500)",
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
  sendData(){
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
                        var data = [
                            { name: 'productName', data: this.state.productName },
                            { name: 'price', data: this.state.price },
                            { name: 'endDateTime', data: this.state.auctionEndDate + ' ' + this.state.auctionEndTime },
                            { name: 'description', data: this.state.description },
                            { name: 'productImage', filename: 'product.jpeg', data: this.state.picture },
                            ]
                        //Validate Then Send
                        if (this.validate()) {
                          RNFetchBlob.fetch('POST', config.url+'api/auctions/save', {
                          Authorization : authData.token_type+' '+authData.access_token,
                          'Content-Type' : 'multipart/form-data',
                          'Accept' : 'application/json',
                          }, data).then((response)=>{
                            var resp = response.json()
                            if (resp.status=='success') {
                              this.setState({
                                responseMsg:"",
                                traffic:0,
                                successStatus:resp.message,
                                productName: '',
                                price: '',
                                description:'',
                                endDate: new Date(),
                                auctionEndDate: null,
                                endDateText: 'Select auction end date ...',
                                endTimeHour: null,
                                endTimeMinute: null,
                                endTimeText: 'Select auction end time ...',
                                auctionEndTime: null,
                                pictureSource: null,
                                picture:null,
                              })
                            }
                            else{
                              this.setState({responseMsg:"Something went wrong!",traffic:0,statusColor:'red'})
                            }
                          }).catch((errorMessage, statusCode)=>{
                            console.log(errorMessage)
                            this.setState({responseMsg:"Something went wrong!",traffic:0,statusColor:'red'})
                          });
                        }
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
  render() {
    let img = this.state.pictureSource == null? null:<Lightbox underlayColor="white" backgroundColor={colors.darkTransparent} navigator={this.props.navigator}>
              <View style={styles.center}><Image
        source={this.state.pictureSource}
        style={styles.image}
      /></View></Lightbox>
    return (
      <View style={styles.container}>
      <ScrollView>
      <StatusBar backgroundColor={colors.accent}/>
      {(!this.state.isConnected)?<View style={styles.loadBar}><Text style={styles.white}>Please check your Internet! </Text></View>:null}
        <View style={styles.body}>
        <View style={styles.form}>
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-person" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={styles.formInputText} placeholder="Product name..." underlineColorAndroid={colors.transparent} onChangeText={(product)=>{this.setState({productName:product})}} value={this.state.productName} autoCorrect={false} returnKeyType='next' ref='1' onSubmitEditing={()=>{this.focusNextField('2')}}/>
                </View>
            </View>
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="ios-pricetag" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={styles.formInputText} placeholder="Minimal price..." keyboardType='numeric' underlineColorAndroid={colors.transparent} onChangeText={(price)=>{this.setState({price:price})}} value={this.state.price} autoCorrect={false} returnKeyType='next' ref='2'/>
                </View>
            </View>
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-calendar" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TouchableWithoutFeedback onPress={this.showDatePicker.bind(this, 'end', {
              date: this.state.endDate,
              minDate: Date.now()+172800000,
              maxDate: Date.now()+62208000000,
            })}>
              <View><Text style={{paddingTop:15,paddingBottom:15}}>{this.state.endDateText}</Text></View>
            </TouchableWithoutFeedback>
                </View>
            </View>
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-clock" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TouchableWithoutFeedback onPress={this.showTimePicker.bind(this, 'endTime', {
                      hour: this.state.endTimeHour,
                      minute: this.state.endTimeMinute,
                      is24Hour: true,
                    })}>
                    <View><Text style={{paddingTop:15,paddingBottom:15}}>{this.state.endTimeText}</Text></View>
                  </TouchableWithoutFeedback>
                </View>
            </View>
            <TouchableHighlight style={[styles.formButton]} onPress={this.show.bind(this)} underlayColor={colors.transparent}>
              <View>
                <View style={styles.photoSelect}><Icon style={styles.labelText} name="md-image" size={20}/><Text style={styles.photoSelectText}>Add a photo of your product</Text></View>
              </View>
            </TouchableHighlight>
            {(img)?<View style={styles.imgHolder}>{img}</View>:null}
            <View style={[styles.formRow]}>
                <View style={styles.formLabelDescription}>
                  <Text style={styles.labelText}><Icon name="md-information-circle" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={styles.formInputTextArea} multiline={true} placeholder="Description..." underlineColorAndroid={colors.transparent} onChangeText={(description)=>{this.setState({description:description})}} value={this.state.description} autoCorrect={false} returnKeyType='go' onSubmitEditing={()=>{this.sendData()}} numberOfLines={8}/>
                </View>
            </View>
            {(this.state.responseMsg)?<View style={styles.statusText}><Text style={{color:this.state.statusColor}}>{this.state.responseMsg}</Text></View>:null}
            {(this.state.successStatus)?<View style={styles.statusText}><Text style={styles.success}>{this.state.successStatus}</Text></View>:null}
            <View style={styles.formRowButtons}>
                {(this.state.traffic==0)?<TouchableHighlight style={styles.buttonTouch} onPress={()=>{this.sendData()}} underlayColor={colors.accent}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Sell product</Text>
                  </View>
                </TouchableHighlight>:null}
            </View>
        </View>
        </View>
        </ScrollView>
      </View>
    );
  }
  show(){
    pick((source, data) => {this.setState({pictureSource: source, picture: data})});
  }
}

const styles = Styles
const colors = Colors
export default Sell
