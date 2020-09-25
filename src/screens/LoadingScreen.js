import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as firebase from 'firebase';

import AnimatedLoader from 'react-native-animated-loader';

export default class LoadingScreen extends React.Component{
    async componentDidMount(){
        firebase.auth().onAuthStateChanged(user =>{
            this.props.navigation.navigate(user ? "App": "Auth")
        })
    }
    
    render(){
        return(
            <View style={[styles.loading, {flexDirection:'row'}]}>
                <Text style={{bottom: 90, fontSize: 26, color: '#000', fontFamily:'Helvetica-Nue'}}>Carregando...</Text>
                <AnimatedLoader visible={true} overlayColor="rgba(255,255,255,0.75)" source={require("../../assets/Animations/animation-load.json")} animationStyle={{width: 60,    height: 60}} speed={1}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      },
})