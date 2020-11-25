import React from 'react'
import { View, StatusBar, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import * as firebase from 'firebase';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import * as Google from 'expo-google-app-auth';
import Fire from '../../../Fire'
import * as Facebook from 'expo-facebook';

console.disableYellowBox = true;

export default class LoginScreen extends React.Component {

    state = {
        email: "",
        password: "",
        errorMessage: null,
        secureTextEntry: true,
        loading: false
    }

    AsyncEnterUsernameAlert = async () => new Promise((resolve) => {
        Alert.prompt(
            "Digite o seu nome de usuário",
            "Escolha um nome de usuario para a sua conta",
            [
                {
                    text: "Cancel",
                    onPress: () => false,
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: username => this.returnUsername(username)
                }
            ],
            "plain-text"
        );
    });

    onSignIn = googleUser => {
        //console.log('Google Auth Response', googleUser)
        var unsubscribe = firebase
            .auth()
            .onAuthStateChanged(async function (firebaseUser) {
                unsubscribe()
                if (!this.isUserEqual(googleUser, firebaseUser)) {
                    var credential = await firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    )

                    await firebase.auth().signInAndRetrieveDataWithCredential(credential)
                        .then(async result => {
                            await Fire.shared.createUserWithGmailAccount(result)
                        })
                        .catch(function (error) {
                            var errorCode = error.code
                            var errorMessage = error.message

                            var email = error.email

                            var credential = error.credential
                        })

                }
                else {
                    console.log('Uma conta já foi registrada com esse email.')
                }
            }.bind(this))
    }

    AsyncErrorAlert = async (error) => new Promise((resolve) => {
        Alert.alert(
            'Ops, algo deu errado!',
            String(error),
            [
                {
                    text: 'ok',
                    onPress: () => {
                        resolve('YES');
                    },
                },
            ],
            { cancelable: false },
        );
    });

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (
                    providerData[i].providerId ===
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()
                ) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    };

    async loginWithFacebook() {
        await Facebook.initializeAsync("320585932309372", "NutriFit")
        //ENTER YOUR APP ID 
        const { type, token } = await Facebook.logInWithReadPermissionsAsync('320585932309372', { permissions: ['public_profile'] })

        switch (type) {
            case 'success': {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                const credential = await firebase.auth.FacebookAuthProvider.credential(token);
                await firebase.auth().signInAndRetrieveDataWithCredential(credential).then(async result => {
                    await Fire.shared.createUserWithFacebookAccount(result)
                }).catch(function (error) {
                    var errorCode = error.code
                    var errorMessage = error.message

                    var email = error.email

                    var credential = error.credential
                })

                return Promise.resolve({ type: 'success' });
            }
            case 'cancel': {
                return Promise.reject({ type: 'cancel' });
            }
        }
    }

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: "553706303073-bph817en2m5sghogafh8so25d7l511as.apps.googleusercontent.com",
                //iosClientId: YOUR_CLIENT_ID_HERE,
                behavior: 'web',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                await this.onSignIn(result)
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    handleLogin = async () => {
        const { email, password } = this.state

        await this.setState({ loading: true }, async () => {
            firebase.
                auth().
                signInWithEmailAndPassword(email, password).catch(error =>{
                    console.log(error.message)
                    if(error.message=="The email address is badly formatted."){
                        this.setState({ errorMessage: "A formatação do email está incorreta." })
                    }
                    if(error.message=="There is no user record corresponding to this identifier. The user may have been deleted."){
                        this.setState({ errorMessage: "Não há registro de nenhum usuário com este email." })
                    }
                    if(error.message=="The password is invalid or the user does not have a password."){
                        this.setState({ errorMessage: "A senha é invalida ou esté usuário não existe." })
                    }

                    this.setState({ loading: false })
                })
                    

        })
    }

    onIconPress = () => {
        this.setState({ secureTextEntry: !this.state.secureTextEntry })
    }

    //<Text style={[styles.greetings, { fontSize: 16, fontFamily: 'Helvetica-Nue-Condensed' }]}>Bem vindo! Faça login para continuar.</Text>

    render() {
        if (this.state.loading == false) {
            return (
                <ScrollView style={styles.container}>
                    <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                   

                    <Text style={{fontSize: 42, fontFamily:'Helvetica-Nue', color: "#000", alignSelf: 'center', marginTop: 25, marginBottom: 45, top:30}}>Ravit</Text>

                    <View style={styles.errorMessage}>
                        {this.state.errorMessage && <Text style={styles.errorLog}>{this.state.errorMessage}</Text>}
                    </View>

                    <View style={styles.form}>
                        <View style={{}}>
                            <Text style={styles.inputTitle}>Email</Text>

                            <View style={{ borderBottomWidth: 1 }}>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    onChangeText={email => this.setState({ email })}
                                    value={this.state.email}>
                                </TextInput>
                            </View>

                        </View>

                        <View style={{ marginTop: 32 }}>
                            <Text style={styles.inputTitle}>Senha</Text>

                            <TouchableOpacity style={{ left: '90%', top: -10, left: 340 }} onPress={this.onIconPress}>
                                <MaterialCommunityIcons size={28} name="eye" />
                            </TouchableOpacity>

                            <View style={{ borderBottomWidth: 1 }}>
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry={this.state.secureTextEntry}
                                    autoCapitalize="none"
                                    onChangeText={password => this.setState({ password })}
                                    value={this.state.password}>
                                </TextInput>
                            </View>


                        </View>
                    </View>

                    <TouchableOpacity style={[styles.button, { backgroundColor: '#d62048', marginBottom: 18 }]} onPress={this.handleLogin}>
                        <Text style={{ color: '#fff', fontWeight: '500', fontFamily: 'Helvetica-Nue-Bold' }}>Entrar</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={[styles.button, { backgroundColor: '#fff', flexDirection: 'row', marginTop: 10 }]} onPress={() => this.signInWithGoogleAsync()}>
                        <AntDesign name="google" size={24} />
                        <Text style={{ fontFamily: 'Helvetica-Nue', margin: 20, fontWeight: 'bold' }}>Entrar com o Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: '#1367ad', flexDirection: 'row', marginTop: 10 }]} onPress={this.loginWithFacebook}>
                        <AntDesign name="facebook-square" size={24} color="#fff" />
                        <Text style={{ fontFamily: 'Helvetica-Nue', margin: 20, fontWeight: 'bold', color: '#fff' }}>Entrar com o Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: 32 }} onPress={() => this.props.navigation.navigate("Register")}>
                        <Text style={{ color: '#414959', fontSize: 16, fontFamily: 'Helvetica-Nue-Condensed' }}>
                            Novo por aqui? <Text style={{ fontWeight: '500', color: '#E9446A', fontFamily: 'Helvetica-Nue-Condensed' }}>Se cadastre</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: 32 }} onPress={() => alert("To trabalhando nisso ainda. \nPor enquanto vem de zap que eu resolvo.")}>
                        <Text style={{ color: '#414959', fontSize: 16, fontFamily: 'Helvetica-Nue-Condensed' }}>
                            Esqueceu sua senha?
                        </Text>
                    </TouchableOpacity>

                    <View style={{ marginBottom: 50 }}></View>

                </ScrollView>
            )
        }
        else {
            return (
                <View style={{ flex: 1, alignSelf: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <ActivityIndicator color="black" size="large" />
                    <Text style={{ fontFamily: 'Helvetica-Nue-Condensed' }}>    Entrando...</Text>

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    greetings: {
        marginTop: 28,
        fontSize: 18,
        fontWeight: '200',
        textAlign: 'center'
    },
    errorMessage: {
        height: 72,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30
    },
    form: {
        alignSelf: 'center',
        width: '90%',
        //backgroundColor: '#ffffff',
        top: '-1%',
        paddingBottom: 20,
        fontSize: 32
    },
    inputTitle: {
        color: '#4a4a4a',
        fontSize: 20,
        //textTransform: 'uppercase'
        fontFamily: 'Helvetica-Nue-Condensed'
    },
    input: {
        borderBottomColor: 'black', //#8A89FE
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 60,
        fontSize: 21,
        color: '#161F3D',
        fontFamily:'Helvetica-Nue'
    },
    errorLog: {
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center'
    },
    button: {
        marginHorizontal: 50,
        backgroundColor: 'coral',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
