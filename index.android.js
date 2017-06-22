import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import Splash from './src/components/Splash'
import Login from './src/components/Login'
import Register from './src/components/Register'
import Sell from './src/components/Sell'
import Buy from './src/components/Buy'
import Auctions from './src/components/Auctions'
import Profile from './src/components/Profile'
import Product from './src/components/Product'
import OwnProduct from './src/components/OwnProduct'
import {
  Router,
  Scene,
  Schema,
  ActionConst,
  Modal
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
const TabIcon = ({title,selected,pic}) => {
  return (
    <View style={styles.icon}>
      <Icon name={pic} size={20} color={selected?'#f15a24':'#333333'}/>
      <Text style={{color:selected?'#f15a24':'#333333'}}>{title}</Text>
    </View>
    );
};
export default class Auction extends Component {
  render() {
    return (
      <Router>
          <Scene key='root'>
            <Scene key='splash' component={Splash}  hideNavBar='false' title='Splash' titleStyle={{color:'#009688',fontSize:18}} navigationBarStyle={{borderBottomWidth:0}}/>
            <Scene key='login' component={Login} title='Login' titleStyle={{color:'#ffffff',fontSize:18,}} navigationBarStyle={{borderBottomWidth:0,backgroundColor:'#f15a24',}} type={ActionConst.RESET}/>
            <Scene key='register' component={Register} title='Register' titleStyle={{color:'#ffffff',fontSize:18,}} navigationBarStyle={{borderBottomWidth:0,backgroundColor:'#f15a24',}}/>
            <Scene key="tabbar"
            tabs tabBarStyle={{backgroundColor:'#eee'}}>
              <Scene key='sell' component={Sell} title='Sell' icon={TabIcon} pic='ios-pricetag-outline' titleStyle={{color:'#ffffff',fontSize:18,}} navigationBarStyle={{borderBottomWidth:0,backgroundColor:'#f15a24',}}/>
              <Scene key='buy' component={Buy} BackHandler={()=>{alert('')}} title='Bid' icon={TabIcon} pic='ios-pricetag' titleStyle={{color:'#ffffff',fontSize:18,}} navigationBarStyle={{borderBottomWidth:0,backgroundColor:'#f15a24',}}/>
              <Scene key='auctions' component={Auctions} title='My auctions' icon={TabIcon} pic='ios-pricetags-outline' titleStyle={{color:'#ffffff',fontSize:18,}} navigationBarStyle={{borderBottomWidth:0,backgroundColor:'#f15a24',}}/>
              <Scene key='profile' component={Profile} title='Profile' icon={TabIcon} pic='md-person' titleStyle={{color:'#ffffff',fontSize:18,}} navigationBarStyle={{borderBottomWidth:0,backgroundColor:'#f15a24',}}/>
              <Scene key="product" title="Auction details" hideNavBar={false} direction="vertical" component={Product} titleStyle={{color:'#ffffff',fontSize:18,}} navigationBarStyle={{borderBottomWidth:0,backgroundColor:'#f15a24',}}/>
              <Scene key="ownproduct"  title="Your auction details" hideNavBar={false} direction="vertical" component={OwnProduct} titleStyle={{color:'#ffffff',fontSize:18,}} navigationBarStyle={{borderBottomWidth:0,backgroundColor:'#f15a24',}} schema="modal"/>
            </Scene>
            
          </Scene>
      </Router>
    );
  }
}
const styles = StyleSheet.create({
icon: {
    alignItems:'center',
    justifyContent:'center',
  },
});

AppRegistry.registerComponent('Auction', () => Auction);
