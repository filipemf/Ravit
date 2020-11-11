import React, { useState, useEffect } from 'react'
import { Modal, StatusBar, View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Animated, Dimensions, Alert } from 'react-native'
import AnimatedLoader from 'react-native-animated-loader';
import styled from 'styled-components'

const firebase = require("firebase")

const numColumns = 2

import { ProgressBar, Colors } from 'react-native-paper';

import Fire from '../../../Fire'
import MyAccount from './MyAccount'
import LevelUpScreen from '../../components/LevelUpScreen'
import { set } from 'react-native-reanimated';

export default function ProfileScreen(props, { navigation }) {
    const [todoVisible, setTodoVisible] = useState(false);
    const [myAccountVisible, setMyAccountVisible] = useState(false)
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [postsQuantity, setPostsQuantity] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);

    const [level, setLevel] = useState(1)
    const [xp, setXp] = useState(0)

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        initialLoad()
    }, []);

    const initialLoad = async () => {
        await setIsLoading(true)
        const user = props.uid || Fire.shared.uid

        await Fire.shared.firestore
            .collection("users")
            .doc(user)
            .onSnapshot(async doc => {
                await setUser(doc.data())
            });

        //Get all necessary data
        await getAllUserPosts()
        

        await getFollowersQuantity()
        await getFollowingQuantity()

        await setIsLoading(false)

    }

    const getAllUserPosts = async () => {
        const user2 = props.uid || Fire.shared.uid
        const allPosts = [];


        await setPosts([])
        await Fire.shared.firestore.collection('posts').where('uid', '==', user2).get().then(async data => {
            data.forEach(async doc => {
                if (doc && doc.exists) {
                    let values = {}
                    const postData = doc.data()

                    values.avatar = user.avatar

                    values.username = user.username
                    values.image = postData.image,
                        
                    values.titleText = postData.titleText,
                    values.text = postData.text
                    values.timestamp = postData.timestamp
                    values.uid = postData.uid
                    values.typeOfPost = postData.typeOfPost

                    values.ingredients = postData.ingredients
                    values.prepareMode = postData.prepareMode
                    values.tags = postData.tags

                    allPosts.push(values)
                   // console.log(allPosts)
                    const totalProps = await Object.keys(allPosts).length
                    await setPostsQuantity(totalProps)

                } else {
                    console.log("deu errado")
                }
            })
        })


        if (allPosts != []) {
            await setPosts(allPosts)
        }

    }

    const getFollowersQuantity = async () => {
        const user = props.uid || Fire.shared.uid
        await setFollowers(await Fire.shared.getFollowersQuantity(user))
    }

    const getFollowingQuantity = async () => {
        const user = props.uid || Fire.shared.uid
        await setFollowing(await Fire.shared.getFollowingQuantity(user))
    }

    const onRefresh = async () => {
        await setIsFetching(true)
        await initialLoad()
        await setIsFetching(false)
    }

    const AsyncSignOutAlert = async () => new Promise((resolve) => {
        Alert.alert(
            'Atenção',
            'Deseja sair?',
            [
                {
                    text: 'Não',
                    onPress: () => {
                        resolve('YES');
                    },
                },
                {
                    text: 'Sim',
                    onPress: () => {
                        Fire.shared.signOut()
                    },
                },
            ],
            { cancelable: false },
        );
    });

    const toggleAddTodoModal = async () => {
        setTodoVisible(!todoVisible)
    }

    const toggleMyAccountModal = async () => {
        setMyAccountVisible(!myAccountVisible)
    }

    const renderPost = ({ item, index }) => {
        let { itemStyle } = styles
        if(item.typeOfPost=="OUTROS"){
            return (
                <View style={itemStyle}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("OtherPosts", item)}><Image source={{ uri: item.image }} style={styles.postImage} /></TouchableOpacity>
                </View>
            )
        }
        else{
            return (
                <View style={itemStyle}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("RecipesPosts", item)}><Image source={{ uri: item.image }} style={styles.postImage} /></TouchableOpacity>
                </View>
            )
        }

    }

    if (isLoading == false) {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />

                <Modal animationType="slide" visible={todoVisible}>
                    <LevelUpScreen closeModal={() => toggleAddTodoModal()} />
                </Modal>

                <Modal animationType="slide" visible={myAccountVisible}>
                    <MyAccount closeModal={() => toggleMyAccountModal()} />
                </Modal>

                <View style={{ backgroundColor: '#fff', borderBottomColor: '#000', borderBottomWidth: 1.5 }}>

                    <TouchableOpacity onPress={() => toggleMyAccountModal()} onRequestClose={() => toggleMyAccountModal()} style={{ borderColor: '#000', borderWidth: 1.5, alignItems: 'center', padding: 10, width: 300, alignSelf: 'center', marginTop: 10, marginBottom: 30 }}>
                        <Text style={{ fontFamily: 'Helvetica-Nue', fontSize: 16 }}>Editar Perfil</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'column', marginLeft: 5, backgroundColor: '#fff' }}>
                        <TouchableOpacity style={{ position: 'absolute', top: 10 }} onPress={() => AsyncSignOutAlert()}>
                            <Image source={user.avatar ? { uri: user.avatar } : require("../../../assets/tempAvatar.jpg")} style={styles.avatar} />
                        </TouchableOpacity>
                        <View style={styles.statsContainer}>
                            <View style={{ flexDirection: 'column', margin: 7 }}>
                                <Text style={{ fontFamily: 'Helvetica-Nue', fontSize: 16, color: "#000" }}>Posts</Text>
                                <Text style={{ fontFamily: 'Helvetica-Nue-Condensed', fontWeight: 'bold', alignSelf: 'center', fontSize: 17, color: "#000" }}>{postsQuantity}</Text>
                            </View>

                            <View style={{ flexDirection: 'column', margin: 7 }}>
                                <Text style={{ fontFamily: 'Helvetica-Nue', fontSize: 16, color: "#000" }}>Seguidores</Text>
                                <Text style={{ fontFamily: 'Helvetica-Nue-Condensed', fontWeight: 'bold', alignSelf: 'center', fontSize: 17, color: "#000" }}>{followers}</Text>
                            </View>

                            <View style={{ flexDirection: 'column', margin: 7 }}>
                                <Text style={{ fontFamily: 'Helvetica-Nue', fontSize: 16, color: "#000" }}>Seguindo</Text>
                                <Text style={{ fontFamily: 'Helvetica-Nue-Condensed', fontWeight: 'bold', alignSelf: 'center', fontSize: 17, color: "#000" }}>{following}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row',left: 10, marginBottom: 20}}>

                        <TouchableOpacity onPress={() => toggleAddTodoModal()} onRequestClose={() => toggleAddTodoModal()} style={{ left: 140, marginTop: 20, marginBottom: 50 }}>
                            <Text style={[styles.name], { position: 'relative', fontFamily: 'Helvetica-Nue-Condensed', fontWeight: '900', fontSize: 22, color: '#000' }}>{user.name}</Text>
                        </TouchableOpacity>


                        <View style={{ flexDirection: 'row', top: 60, right:130, marginTop: 10, flex:1}}>
                            <Text style={{ fontWeight:'900',right:30, fontSize: 20, color: '#000', fontFamily:'Helvetica-Nue'}}>Nível: {user.level}</Text>
                            {
                                //<Text style={{ bottom:1.5, right:30, fontWeight: 'bold', fontSize: 18, color: '#000', fontFamily:'Helvetica-Nue'}}>{user.level} </Text>
                            }
                            <Text style={{alignSelf:'center', fontSize: 18, color: '#000', fontFamily:'Helvetica-Nue-Bold', bottom:20, left:30}}>     {user.experience}/100</Text>
                            
                        </View>

                    </View>
                    <View style={{bottom:5, width:300, alignSelf:'center'}}>
                        <ProgressBar progress={user.experience/100} color={Colors.red800} />
                    </View>
                    
                </View>

                <FlatList
                    style={{ backgroundColor: '#fff', marginTop: 5 }}
                    data={posts}

                    keyExtractor={(i, k) => k.toString()}

                    onRefresh={onRefresh}
                    refreshing={isFetching}

                    showsVerticalScrollIndicator={false}
                    
                    numColumns={numColumns}
                    renderItem={renderPost}
                />

            </View>
        )
    } else {
        return (
            <View style={[styles.loading, { flexDirection: 'row' }]}>
                <Text style={{ bottom: 90, fontSize: 26, color: '#000', fontFamily: 'Helvetica-Nue-Condensed' }}>Carregando...</Text>
                <AnimatedLoader visible={true} overlayColor="rgba(255,255,255,0.75)" source={require("../../../assets/Animations/cat-preloader.json")} animationStyle={{ width: 110, height: 110 }} speed={1} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressBar: {
        height: 25,
        width: 150,
        backgroundColor: '#cfcfcf',
    },
    
    avatar: {
        width: 86,
        height: 86,
        borderRadius: 68,
    },
    name: {
        marginTop: 24,
        fontSize: 18,
        fontWeight: "800",

    },
    statsContainer: {
        flexDirection: "row",
        marginLeft: 75,
        left: 35,
        marginTop: 10
    },
    statAmount: {
        color: "#4F566D",
        fontSize: 16,
        fontWeight: "bold",
    },
    statTitle: {
        color: '#C3C5CD',
        fontSize: 15,
        fontWeight: '500',
        marginTop: 4,
        fontWeight: "bold",
    },
    itemStyle: {
        flex: 1,
        margin: 3,
        bottom: 17.5
    },
    postImage: {
        width: '100%',
        height: 180,
        borderRadius: 5,
        marginVertical: 16,
    },
    profileButton: {
        flex: 1,
        backgroundColor: "#fca903",
        justifyContent: 'center',
        alignItems: 'center',
        width: 136,
        height: 136,
        borderRadius: 68
    }
})
