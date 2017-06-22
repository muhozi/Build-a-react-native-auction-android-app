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
} from 'react-native';
import {
  Actions,
  Modal,
} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Styles from '../styles/Styles';
import Colors from '../styles/Colors';
import Lightbox from 'react-native-lightbox';
class OwnProduct extends React.Component {
  state={
    respoData:'',
    networkResponse:'',
    statusColor:'rgba(0,255,0,0.8)',
    price:'',
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
  render() {
    return (
      <View style={[styles.container]}>
      <ScrollView>
      <StatusBar backgroundColor={colors.accent}/>
        <View style={[styles.body,styles.padDetails]}>
      {(!this.state.isConnected)?<View style={styles.loadBar}><Text style={styles.white}>Please check your Internet! </Text></View>:null}
        {(this.props.product.id)?
            <View>
            <View style={styles.padView}>
            <View style={styles.padView}>
              <Text style={styles.title}>{this.props.product.product_name}</Text>
            </View>
            <View style={styles.padView}>
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
            {(this.props.product.is_bidden)?<View>
            <View style={styles.center}><Text style={styles.title}>Top bid user contact</Text></View>
            {/*Bids on the auction*/}
            <View style={styles.wellBox}>
            <Text><Icon name="md-person" color={colors.accent} size={18}/>{'\t \t'+this.props.product.user+'\n'}</Text>
            <Text><Icon name="md-call" color={colors.accent}/>{'\t \t'+this.props.product.high_bid_user.phone+'\n'}</Text>
            <Text><Icon name="md-mail" color={colors.accent}/>{'\t \t'+this.props.product.high_bid_user.email+'\n'}</Text>
            </View>

            </View>:<View style={{alignItems:'center',paddingTop:20}}><Text style={styles.mute}>This product has not yet bidden</Text></View>}
            </View>
            </View>:<View style={styles.loadBar}><Text>{(this.state.networkResponse)?this.state.networkResponse:'Loading...'}</Text></View>}
        </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = Styles
const colors = Colors
export default OwnProduct
