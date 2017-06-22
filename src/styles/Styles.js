import {
  StyleSheet,
  Dimensions,
} from 'react-native'
import Colors from './Colors'
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const colors = Colors
const Styles = StyleSheet.create({
  container: {
    marginTop:53,
    backgroundColor:'#fff',
    flex:1,
    marginBottom:53,
  },
  padDetails:{
    paddingBottom:30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  title:{
    fontWeight: 'bold',
    color: colors.accent,
    paddingTop:5,
  },
  body:{
    flex: 1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    
  },
  form:{
    flex:1,
    paddingBottom:150,
    paddingTop:20,
  },
  label:{
    color:'#f15a24',
  },
  loginForm:{
    marginTop:60,
  },
  padBoth:{
    paddingLeft:10,
    paddingRight:10
  },
  wellBox:{
    padding:10,
    borderWidth:StyleSheet.hairlineWidth,
    marginTop:10,
    padding:10,
    borderColor:'rgba(241, 90, 36, 0.3)',
    borderRadius:5
  },
  formButton:{
    flexDirection:'row',
    marginLeft: 15,
    marginTop: 15,
    marginRight: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
    padding:1,
    borderRadius:4,
    padding:13,
  },
  padView:{
   // paddingLeft:10,
    paddingTop:5,
  },
  imgHolder:{
    marginLeft:15,
    marginRight:15,
    marginTop:15,
  },
  image:{
    width: windowWidth-20,
    height: 300,
    borderRadius:4,
  },
  mute:{
    fontWeight:'bold',
  },
  padTop:{
    paddingTop: 5,
  },
  formLabelDescription:{
    backgroundColor:'#fff',
    flex:1,
    alignItems:'center',
    justifyContent: 'flex-start',
    marginTop:10,
  },
  formRow:{
    flex:1,
    flexDirection:'row',
    marginLeft: 15,
    marginTop: 15,
    marginRight: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
    padding:1,
    borderRadius:4,
  },
  formInputText:{
    //textAlignVertical: 'top',
  },
  photoSelect:{
    flexDirection:'row'
  },
  photoSelectText:{
    paddingLeft: 8,
  },
  formInputTextArea:{
    textAlignVertical: 'top',
  },
  formLabel:{
    backgroundColor:'#fff',
    flex:1,
    alignItems:'center',
    justifyContent: 'center',
  },
  labelText:{
    color: colors.accent,
  },
  formInputControl:{
    flex:10,
  },
  formRowButtons:{
    marginLeft: 15,
    marginTop: 15,
    marginRight: 15,
    padding:1,
    borderRadius:4,
    justifyContent:'center',
  },
  button:{
    backgroundColor:colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius:4,
  },
  buttonText:{
    color:'#ffffff',
  },
  buttonTouch:{
    backgroundColor:colors.accent,
    borderRadius:4,
    alignItems:'center',
    paddingTop:3,
    paddingBottom:3,
  },
  labeled:{
    fontWeight:'bold',
    color:colors.accent
  },
  indent:{
    fontSize:20,
    paddingTop:10
  },
  center:{
    alignItems:'center',
    justifyContent:'center',
  },
  loadBar:{
    backgroundColor:'red',
    alignItems:'center',
  },
  buttonTouchForm:{
    backgroundColor:colors.accent,
    borderRadius:4,
    alignItems: 'center',
  },
  button:{
    padding:30,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:colors.accent,
    borderRadius:4,
  },
  statusText:{
    alignItems:'center',
    justifyContent: 'center',
    paddingTop:15,
  },
  success:{
    color:'green',
  },
  white:{
    color:'#fff',
  },
  button:{
    padding:30,paddingTop:10,paddingBottom:10,backgroundColor:colors.accent,borderRadius:4
  },
});
export default Styles