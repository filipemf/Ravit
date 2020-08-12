import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, StatusBar, Text, StyleSheet, ScrollView, TextInput, Image, Button, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import UserPermissions from '../../utils/UserPermission'
import { Ionicons, AntDesign } from '@expo/vector-icons';

import Fire from '../../../Fire'


export default function MyAccount(props) {
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [newName, setNewName] = useState("")
    const [newUsername, setNewUsername] = useState("")
    const [newProfilePic, setNewProfilePic] = useState("")

    useEffect(() => {
        initialLoad()
    }, [])

    const initialLoad = async () => {
        setIsLoading(true)

        const user = props.uid || Fire.shared.uid

        this.unsubcribe = await Fire.shared.firestore
            .collection("users")
            .doc(user)
            .onSnapshot(doc => {
                setUser(doc.data())
            });
    }

    const handlePickAvatar = async () => {
        UserPermissions.getCameraPermission()

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.cancelled) {
            setNewProfilePic(result.uri);
        }
    }

    if (isLoading == false) {
        return (
            <ActivityIndicator />
        )
    }
    else {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <StatusBar backgroundColor="transparent" barStyle="dark-content" />

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginBottom: 40, marginTop: 10, marginLeft: 10 }} onPress={props.closeModal}>
                            <AntDesign name="close" size={34} color="#000" />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 28, marginLeft: 55, fontFamily: 'Helvetica-Nue', fontWeight: 'bold' }}>Editar conta</Text>
                    </View>



                    <TouchableOpacity onPress={handlePickAvatar} style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <Image source={newProfilePic == "" ? user.avatar ? { uri: user.avatar } : require("../../../assets/tempAvatar.jpg") : { uri: newProfilePic }} style={styles.avatar} />
                        <Ionicons name='ios-add' size={40} color='#fff' style={{ bottom: 70 }} />
                    </TouchableOpacity>



                    <View style={styles.form}>
                        <Text style={styles.inputTitle}>Meu atual nome: <Text style={[styles.inputTitle], { color: "#000", fontWeight: 'bold' }}>{user.name}</Text> </Text>
                        <TextInput
                            style={{ marginBottom: 40, marginTop: 10, fontSize: 18, fontFamily: 'Helvetica-Nue', borderBottomWidth: 0.8, borderRadius: 2, width: '100%', height: 50, padding: 10 }}
                            placeholder=" Digite um novo nome..."
                            autoCapitalize="none"
                            onChangeText={newName => setNewName(newName)}
                            value={newName}
                            onSubmitEditing={() => setNewName("")}>

                        </TextInput>

                        <Text style={styles.inputTitle}>Meu atual nome de usuário: <Text style={[styles.inputTitle], { color: "#000", fontSize: 19.5, fontWeight: 'bold' }}>{user.username}</Text> </Text>
                        <TextInput
                            style={{ marginBottom: 40, marginTop: 10, fontSize: 18, fontFamily: 'Helvetica-Nue', borderBottomWidth: 0.8, borderRadius: 2, width: '100%', height: 50, padding: 10 }}
                            placeholder=" Digite um novo nome de usuário..."
                            autoCapitalize="none"
                            onChangeText={newUsername => setNewUsername(newUsername)}
                            value={newUsername}
                            onSubmitEditing={() => setNewUsername("")}>
                        </TextInput>

                        <Text>{"\n\n\n"}</Text>
                        <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                            <Button title="Salvar alterações" onPress={async () => {
                                await Fire.shared.updateUserInfo(newName, newUsername, newProfilePic, user).then(async () => {
                                    await setNewUsername("")
                                    await setNewName("")
                                    await setNewProfilePic("")
                                })

                            }
                            } />
                        </View>

                        <Text>{""}</Text>
                    </View>



                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar: {
        width: 126,
        height: 126,
        borderRadius: 68,
        top: 15,
    },
    form: {
        alignSelf: 'center',
        width: '80%',
        //backgroundColor: '#ffffff',
        top: '5%',
        paddingBottom: 20,
        fontSize: 32,
        alignItems: 'flex-start',
        alignContent: 'center',
        flexWrap: 'wrap'
    },
    inputTitle: {
        color: '#000',
        fontWeight: '900',
        fontSize: 20,
        //textTransform: 'uppercase'
        fontFamily: 'Helvetica-Nue'
    }
})

