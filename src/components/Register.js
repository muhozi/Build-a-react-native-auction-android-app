import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Text,
  View,
  StatusBar,
  TextInput,
  NetInfo,
} from 'react-native';
import {
  Actions,
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../config/main';
class Register extends React.Component {
  state={
    firstname: '',
    lastname: '',
    email:'',
    phone:'',
    password: '',
    repassword: '',
    traffic:0,
    responseMsg:'',
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
  validate(){
    if(this.state.firstname == "" || this.state.lastname == "" || this.state.email == "" || this.state.phone == "" || this.state.password == ""){
      this.setState({responseMsg:"Please fill all fields"})
      this.setState({statusColor: 'red'})
      return false;
    }
    else if(/[^a-zA-Z ]/.test(this.state.firstname) || this.state.firstname.length < 2){
      this.setState({responseMsg:"Please enter valid name (firsname)"})
      this.setState({statusColor: 'red'})
      return false;
    }
    else if(/[^a-zA-Z ]/.test(this.state.lastname) || this.state.lastname.length < 2){
      this.setState({responseMsg:"Please enter valid name (lastname)"})
      this.setState({statusColor: 'red'})
      return false;
    }
    else if(!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email))){
      this.setState({
        responseMsg:"Please enter a valid email address",
        statusColor: 'red'
      })
      return false;
    }
    else if(this.state.phone.length < 10){
      this.setState({responseMsg:"Please enter a valid phone number \n (07XXXXXXXX)"})
      this.setState({statusColor: 'red'})
      return false;
    }
    
    else if(/[^0-9]/.test(this.state.phone) || this.state.phone.length !== 10){
      this.setState({
        responseMsg:"Please enter a valid phone number \n (07XXXXXXXX)",
        statusColor: 'red'
      })
      return false;
    }
    else{
      this.setState({
        statusColor: 'green',
        responseMsg:"Sending ...",
        traffic:1,
      })
      return true;
    }
  }
  register(){
    if(this.validate()){
          fetch(config.url+'api/register', {
            method: 'POST',
            headers:{'Accept':'application/json','Content-Type':'application/json'},
            body: JSON.stringify({firstname: this.state.firstname,lastname: this.state.lastname,email:this.state.email,phone:this.state.phone,password:this.state.password})
          })
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            password: "",
            repassword:"",
            responseMsg:responseData.message,
            statusColor: "green",
            traffic:0,
          })
        })
        .catch((error) => {
          this.setState({
            statusColor: 'rgba(255,0,0,1)',
            responseMsg:"A problem occurs, Try again later.",
            traffic:0,
          })
        })
        .done();
    }
  }
  render() {
    return (
      <View style={styles.container}>
      <ScrollView>
      <StatusBar backgroundColor='#f15a24'/>
      {(!this.state.isConnected)?<View style={{backgroundColor:'red',alignItems:'center'}}><Text style={{color:'#ffffff'}}>Please check your Internet! </Text></View>:null}
        <View style={styles.body}>
          <View style={styles.registerForm}>
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-person" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={styles.formInputText} placeholder="Firstname..." underlineColorAndroid='rgba(0, 0, 0, 0)' onChangeText={(fname)=>{this.setState({firstname:fname})}} value={this.state.firstname} autoCorrect={false} returnKeyType='next' ref='1' onSubmitEditing={() => this.focusNextField('2')}/>
                </View>
            </View>
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-person" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={[styles.formInputText]} placeholder="Lastname..." underlineColorAndroid='rgba(0, 0, 0, 0)' onChangeText={(lname)=>{this.setState({lastname:lname})}} value={this.state.lastname} autoCorrect={false} returnKeyType='next' ref='2' onSubmitEditing={() => this.focusNextField('3')}/>
                </View>
            </View>

            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-mail" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={[styles.formInputText]} placeholder="Email..." underlineColorAndroid='rgba(0, 0, 0, 0)' onChangeText={(email)=>{this.setState({email:email})}} value={this.state.email} autoCorrect={false} keyboardType='email-address' returnKeyType='next' ref='3' onSubmitEditing={() => this.focusNextField('4')}/>
                </View>
            </View>
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-call" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={[styles.formInputText]} placeholder="Phone number..." underlineColorAndroid='rgba(0, 0, 0, 0)' onChangeText={(phone)=>{this.setState({phone:phone})}} value={this.state.phone} autoCorrect={false} keyboardType='phone-pad' returnKeyType='next' ref='4' onSubmitEditing={() => this.focusNextField('5')}/>
                </View>
            </View>
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-lock" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={[styles.formInputText]} placeholder="Password..." underlineColorAndroid='rgba(0, 0, 0, 0)' onChangeText={(pass)=>{this.setState({password:pass})}} value={this.state.password} autoCorrect={false} secureTextEntry={true} returnKeyType='next' ref='5' onSubmitEditing={() => this.focusNextField('6')}/>
                </View>
            </View>
            <View style={[styles.formRow]}>
                <View style={styles.formLabel}>
                  <Text style={styles.labelText}><Icon name="md-lock" size={20}/></Text>
                </View>
                <View style={styles.formInputControl}>
                  <TextInput style={[styles.formInputText]} placeholder="Confirm password..." underlineColorAndroid='rgba(0, 0, 0, 0)' onChangeText={(repass)=>{this.setState({repassword:repass})}} value={this.state.repassword} autoCorrect={false} secureTextEntry={true} ref='6'/>
                </View>
            </View>
            {(this.state.responseMsg!='')?<View style={styles.status}>
              <Text style={[{flex:1,textAlign: 'center',color: this.state.statusColor}]}>&nbsp;&nbsp;&nbsp;{this.state.responseMsg}</Text>
            </View>:null}
            {(this.state.traffic==0)?<View>
              <View style={styles.formRowButtons}>
                  <TouchableHighlight onPress={()=>{this.register()}}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Register</Text>
                    </View>
                  </TouchableHighlight>
              </View>
              <View style={styles.formRowButtons}>
                  <TouchableHighlight style={styles.buttonTouch} onPress={()=>{Actions.pop()}}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Have an account? Login</Text>
                    </View>
                  </TouchableHighlight>
              </View>
            </View>:null}
          </View>
        </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
container: {
    marginTop:53,
    backgroundColor:'#fff',
    flex:1,
  },
  body:{
    flex: 1,
    flexDirection:'column',
    justifyContent:'flex-start',
  },
  registerForm:{
    marginBottom:30,
  },
  status:{
    justifyContent:'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  formRow:{
    flexDirection:'row',
    marginLeft: 30,
    marginTop: 30,
    marginRight: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f15a24',
    padding:1,
    borderRadius:4,
  },
  formLabel:{
    backgroundColor:'#fff',
    flex:1,
    alignItems:'center',
    justifyContent: 'center',
  },
  labelText:{
    color: '#f15a24',
  },
  formInputControl:{
    flex:10,
  },
  formRowButtons:{
    marginLeft: 30,
    marginTop: 30,
    marginRight: 30,
    padding:1,
    borderRadius:4,
    justifyContent:'center',
  },
  button:{
    backgroundColor:'#f15a24',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 35,
    paddingRight: 35,
    borderRadius:4,
  },
  buttonText:{
    color:'#ffffff',
  },
  buttonTouch:{
    borderRadius: 4,
  },
});

export default Register
