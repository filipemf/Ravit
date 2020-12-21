import React from 'react'
import {ScrollView, Image, View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native'
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import UserPermissions from '../../utils/UserPermission'
import * as ImagePicker from 'expo-image-picker'

import Fire from '../../../Fire'

export default class RegisterScreen extends React.Component{
    state ={
        user: {
            name: "",
            email: "",
            password: "",
            avatar: null,
            username: "",
            secureTextEntry: true
        },
        errorMessage: null,
        loading: false
    }
    onIconPress = ()=>{
      this.setState(prev => ({user: {...prev.user, secureTextEntry: !this.state.user.secureTextEntry } }));
  }

    handlePickAvatar = async () => {
        UserPermissions.getCameraPermission()

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
          });
      
          if (!result.cancelled) {
            this.setState({ user: {...this.state.user, avatar: result.uri} });
          }
    }

    handleSignUp = async () => {
      this.setState({loading: true}, async()=>{
        await Fire.shared.createUser(this.state.user).catch(error => this.setState({errorMessage: error.message}))
        this.setState({loading: false})
      })
    }
    
    render() {
      if(this.state.loading==false){
        return (
          <ScrollView>
            <View style={{ position: 'absolute', top: 24, alignItems: 'center', width: '100%'}}>
              <Text style={styles.greeting}>Registre-se para começar.</Text>
            </View>

        
            <View style={styles.form}>
              <View style={{ marginTop: 22, alignSelf: 'center', top: 10 }}>
                <TouchableOpacity style={styles.avatarPlaceholder} onPress={this.handlePickAvatar}>
                        <Image source={{ uri: this.state.user.avatar }} style={styles.avatar}/>
                        <Ionicons name='ios-add' size={40} color='#fff' style={{ marginTop: 6, marginLeft: 2 }}/>
                </TouchableOpacity>
              </View>


              <View style={styles.errorMessage}>
                {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
              </View>

              <View style={{bottom: 50}}>
                <View>
                  <Text style={styles.inputTitle}>Nome completo</Text>
                    <TextInput style={styles.input}
                      placeholder="Este será o nome que aparecerá na tela"
                      onChangeText={name =>
                      this.setState({ user: { ...this.state.user, name } })
                      }
                      value={this.state.user.name}>    
                    </TextInput>
                </View>

                <View style={{ marginTop: 22 }}>
                  <Text style={styles.inputTitle}>Nome de usuário</Text>
                  <TextInput style={styles.input} autoCapitalize='words'
                    onChangeText={username =>
                      this.setState({ user: { ...this.state.user, username } })
                    }
                    value={this.state.user.username}
                  ></TextInput>
                </View>

                <View style={{ marginTop: 12 }}>
                  <Text style={styles.inputTitle}>Email</Text>
                  <TextInput style={styles.input} autoCapitalize='none'
                    placeholder="Ex: aaaaa@aaaa.com"
                    onChangeText={email =>
                      this.setState({ user: { ...this.state.user, email } })
                    }
                    value={this.state.user.email}>
                  </TextInput>
                </View>

          
                <View style={{ marginTop: 12 }}>
                  <TouchableOpacity style={{left: '90%', top: 10}} onPress={this.onIconPress}>
                    <MaterialCommunityIcons size={25} name="eye"/>
                  </TouchableOpacity>

                  <Text style={styles.inputTitle}>Senha</Text>
                  <TextInput style={styles.input} autoCapitalize='none' secureTextEntry={this.state.user.secureTextEntry}
                    onChangeText={password =>
                      this.setState({ user: { ...this.state.user, password } })
                    }
                    value={this.state.user.password}>
                  </TextInput>
                </View>
              </View>

              <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                <Text style={{ color: '#fff', fontWeight: '500' }}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
        
            
                      
              
          </ScrollView>
        );
      }
      else{
        return(
          <View style={{flex:1, alignSelf:'center', alignContent:'center', alignItems:'center', flexDirection:'row'}}>
            <ActivityIndicator size="large" color="black"/>
              <Text style={{fontFamily: 'Helvetica-Nue-Condensed'}}>    Fazendo cadastro...</Text>
          </View>
        )
      }
    }
}
        

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    greeting: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#000',
      fontFamily: 'Helvetica-Nue'
    },
    form: {
      bottom: 30,
      margin: 30
    },
    inputTitle: {
      color: '#585a61',
      fontWeight:'bold',
      fontSize: 18,
      fontFamily: 'Helvetica-Nue'
    },
    input: {
      borderBottomColor: '#8a8f9e',
      borderBottomWidth: StyleSheet.hairlineWidth,
      height: 40,
      fontSize: 17,
      fontFamily:'Helvetica-Nue',
      color: '#161f3d',
    },
    errorMessage: {
      height: 72,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 30,
      margin: 15
    },
    button: {
      marginHorizontal: 30,
      backgroundColor: '#E9446a',
      borderRadius: 4,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',

    },
    error: {
      color: '#e9446a',
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center'
    },
    back: {
      position: 'absolute',
      top: 48,
      left: 22,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(21, 22, 48, 0.1)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      backgroundColor: '#e1e2e6',
      borderRadius: 50,
      marginTop: 48,
      justifyContent: 'center',
      alignItems: 'center'
    },
    avatar: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50
    }
  });