import React, { useState, useEffect } from 'react'
import { Modal, StatusBar, View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Fire from '../../../Fire'

import * as ImagePicker from 'expo-image-picker'
const firebase = require("firebase")

import UserPermissions from '../../utils/UserPermission'
import Colors from '../../utils/Colors'
import { ScrollView } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native-paper'

import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

import LevelUpScreen from '../../components/LevelUpScreen'

const numColumns = 4

export default function PostScreen(props, { navigation }) {
  let allBackgroundColor = [
    { key: 1, color: "#5CD859", name: "sem açúcar" },
    { key: 2, color: "#24A6D9", name: "rápido" },
    { key: 3, color: "#595BD9", name: "esporte" },
    { key: 4, color: "#8022D9", name: "sem-sal" },
    { key: 5, color: "#D159D8", name: "de casa" },
    { key: 6, color: "#D85963", name: "doce" },
    { key: 7, color: "#D88559", name: "salgado" },
    { key: 7, color: "#8022D9", name: "sem-açúcar" },
  ]
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [titleText, setTitleText] = useState("");

  const [typeOfPost, setTypeOfPost] = useState("RECIPE");
  const [ingredients, setIngredients] = useState("");
  const [prepareMode, setPrepareMode] = useState("")
  const [tags, setTags] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState(allBackgroundColor);
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    setupEverything()
  }, []);

  const setupEverything = async()=>{
    await setLoading(true)
    UserPermissions.getCameraPermission()
    const user = props.uid || Fire.shared.uid
    await firebase.firestore()
      .collection("users")
      .doc(user)
      .onSnapshot(doc => {
        const avatarImage = doc.data().avatar
        setAvatar(avatarImage)
      })
      
    await setLoading(false)
  }

  const navigateToHome = () => {
    props.navigation.navigate("Home")
  }

  const eraseAllFields = async () => {
    setText("")
    setImage(null)
    setUsername("")
    setAvatar("")
    setTitleText("")
    setIngredients("")
    setPrepareMode("")
    setTags([])
  }

  const handlePost = async () => {
    
    if (typeOfPost == "RECIPE") {
      if (titleText == "") {
        return alert("Por favor, escreva um título.")
      }
      if (ingredients == "") {
        return alert("Por favor, escreva os ingredientes.")
      }
      if (prepareMode == "") {
        return alert("Por favor, escreva o modo de preparo.")
      }
      if (image == "") {
        return alert("Por favor, adicione uma imagem.")
      }
    }

    if (typeOfPost == "OUTROS") {
      if (titleText == "") {
        return alert("Por favor, escreva um título.")
      }
      if (text == "") {
        return alert("Por favor, escreva algo.")
      }
      if (image == "") {
        return alert("Por favor, adicione uma imagem.")
      }
    }
    await setLoading(true)
    const user = props.uid || Fire.shared.uid
    let allData = await firebase.firestore()
      .collection("users")
      .doc(user)
      .get()
    let username = allData.data().username
    
    await Fire.shared
      .addPost({ typeOfPost: typeOfPost, text: text.trim(), ingredients: ingredients.trim(), prepareMode: prepareMode.trim(), localUri: image, username: username, titleText: titleText.trim(), tags: tags })
      .then(async ref => {
        //Adicionando 
        await Fire.shared.firestore.collection('users').doc(user).get().then(async doc => {
          let userLevel = await doc.data().level
          let userExperience = await doc.data().experience

          if (userExperience < 100) {
            if (userExperience + 2 < 100) {
              await Fire.shared.firestore.collection('users').doc(user).set({
                experience: userExperience + 2
              }, { merge: true })

              showMessage({
                message: "Parabéns!🥳",
                description: "Você acaba de adquirir 2 pontos de experiencia. Continue assim! 😄",
                type: "default",
                backgroundColor: "#2be381", // background color
                color: "#fff", // text color
              })
              // .then(() => {
              //   setTimeout(() => {
              //     this.props.closeModal()
              //   }, 500);
              // })
            }
            else {
              let untilExperience = 100 - userExperience
              let finalXp = 2 - untilExperience

              await Fire.shared.firestore.collection('users').doc(user).set({
                experience: finalXp,
                level: userLevel + 1
              }, { merge: true })
              await setLoading(false)
              this.toggleLevelUpModal()

            }
            await setLoading(false)
          }
        })

        await eraseAllFields()
        navigateToHome()
      })
      .catch(error => {
        alert(error);
      });


    await setLoading(false)
  };

  const togglePostType = async () => {
    if (typeOfPost == "RECIPE") {
      await setTypeOfPost("OUTROS")
    }
    if (typeOfPost == "OUTROS") {
      await setTypeOfPost("RECIPE")
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3]
    });
    if (!result.cancelled) {
      await setImage(result.uri)
    }
  };

  const toggleTag = async item => {
    console.log(JSON.stringify(item.name))
    let joined = tags.concat({ item });
    await setTags(joined)
    removeByAttr(allBackgroundColor, "key", item.key)
    await setBackgroundColor(allBackgroundColor)
  }

  const removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value)) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }

  const renderColors = item => {
    return (
      <ScrollView>
        <TouchableOpacity disabled={tags.length > 2 ? true : false} key={item.key} style={{ padding: 10, flexWrap: 'nowrap', backgroundColor: tags.length > 2 ? Colors.lightGrey : item.color, margin: 5, borderRadius: 4 }} onPress={() => toggleTag(item)}>
          <Text style={{ color: '#fff', fontFamily: 'Helvetica-Nue' }}>{item.name}</Text>
        </TouchableOpacity>
      </ScrollView>

    )
  }

  const letsGo = () => {
    props.navigation.goBack(null)
  }

  if(isLoading==true){
    return(
      <ActivityIndicator size="large" color="purple"/>
    )
    
  }
  else{
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="rgba(222, 222, 222, 0.7)" barStyle="dark-content" />
  
        <View style={styles.header}>
          <TouchableOpacity onPress={letsGo}>
            <Ionicons name='md-arrow-back' size={24} color='#7a7a7a'></Ionicons>
          </TouchableOpacity>
  
          <TouchableOpacity onPress={togglePostType}>
            <Text style={{ fontWeight: 'bold', left: 18 }}>{typeOfPost == 'RECIPE' ? <Text>RECEITAS</Text> : <Text>OUTROS</Text>}</Text>
          </TouchableOpacity>
  
          <TouchableOpacity onPress={handlePost}>
            <Text style={{ fontWeight: '300', fontSize: 20, fontFamily: 'Helvetica-Nue-Condensed' }}>POSTAR</Text>
          </TouchableOpacity>
        </View>
  
  
        <ScrollView showsVerticalScrollIndicator={false}>
  
          <View style={styles.inputTitleContainer}>
            <TextInput
              autoFocus={false}
              multiline={true}
              maxLength={48}
              numberOfLines={4}
              style={{ fontSize: 28, fontWeight: 'bold', marginHorizontal: 20, left: 30, bottom: 15 }}
              autoCapitalize="words"
              autoCapitalize="sentences"
              placeholder={typeOfPost == 'RECIPE' ? 'Qual será a sua receita?' : 'Qual será o seu post?'}
              onChangeText={titleText => setTitleText(titleText)}
              value={titleText}
            ></TextInput>
          </View>
  
          <View style={styles.inputPhotoContainer}>
            <Image source={avatar ? { uri: avatar } : require("../../../assets/tempAvatar.jpg")} style={styles.avatar} />
          </View>
  
          {typeOfPost == 'RECIPE' ?
            <>
              <Text style={{ alignSelf: 'center', fontFamily: 'Helvetica-Nue-Condensed', fontSize: 20 }}>Ingredientes: </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  autoFocus={false}
                  multiline={true}
                  numberOfLines={4}
                  style={{ flex: 1, fontWeight: "600", marginLeft: 20, fontSize: 18 }}
                  onFocus={ingredients == "" ? () => setIngredients("■") : console.log()}
                  onKeyPress={({ nativeEvent }) => {
                    nativeEvent.key === 'Enter' ? setIngredients(ingredients + "■") : <></> //other action
                  }}
                  placeholder='Insira aqui os ingredientes usados'
                  onChangeText={ingredients => setIngredients(ingredients)}
                  value={ingredients}>
                </TextInput>
              </View>
  
              <View style={{ margin: 15 }}></View>
  
              <Text style={{ alignSelf: 'center', fontFamily: 'Helvetica-Nue-Condensed', fontSize: 20 }}>Modo de preparo: </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  autoFocus={false}
                  multiline={true}
                  numberOfLines={4}
                  style={{ flex: 1, fontWeight: "600", marginLeft: 20, fontSize: 18 }}
                  placeholder='Insira aqui os ingredientes usados'
                  onFocus={prepareMode == "" ? () => setPrepareMode("■") : console.log()}
                  onKeyPress={({ nativeEvent }) => {
                    nativeEvent.key === 'Enter' ? setPrepareMode(prepareMode + "■") : <></> //other action
                  }}
                  onChangeText={prepareMode => setPrepareMode(prepareMode)}
                  value={prepareMode}
                ></TextInput>
              </View>
            </>
            :
            <View style={styles.inputContainer}>
              <TextInput
                autoFocus={false}
                multiline={true}
                numberOfLines={4}
                style={{ flex: 1, fontWeight: "600", marginLeft: 20, fontSize: 18 }}
                placeholder='Quer compartilhar algo?'
                onChangeText={text => setText(text)}
                value={text}>
              </TextInput>
            </View>}
  
  
  
          <View style={{ marginHorizontal: 15, marginTop: 12, height: 300, bottom: 20, top: 30, backgroundColor: "rgba(222, 222, 222, 3.8)", borderWidth:2,
    borderStyle: 'dotted',
    borderColor:'black',
    borderTopColor:'black',
    borderRadius:3}}>
            {image != null ? <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} /> : <View></View>}
          </View>
  
          <TouchableOpacity style={{ alignContent:'center', alignItems:'center', alignSelf:'center',flex:1,botom: 400, top: -200,marginBottom: 50 }} onPress={pickImage}>
            <Ionicons name='md-camera' size={32} color='#c2c2c2'></Ionicons>
          </TouchableOpacity>
  
          {tags && tags.length > 0 ? <Text style={{ alignSelf: 'center', bottom: 35, fontFamily: 'Helvetica-Nue-Condensed', fontSize: 18 }}>Minhas tags: </Text> : <></>}
          
          {tags != [] ? tags.map(({ item }) => {
            return (
              <View style={{ flexDirection: 'column', margin: 0.5}}>
                <Text style={{alignSelf: 'center', bottom: 30, color: "#FFF", backgroundColor: item.color}}>
                  <Text style={{ color: "#FFF", fontFamily: 'Helvetica-Nue-Bold' }}>{item.name}</Text>
                </Text>
  
              </View>
            )
          }) : <View></View>}
  
  
          <View style={{ flex: 1, marginBottom: 5, padding: 10 }}>
  
            <FlatList
              data={backgroundColor}
              extraData={backgroundColor}
              numColumns={numColumns}
              renderItem={(color) => renderColors(color.item)} />
          </View>
  
          <View style={{ marginBottom: 5, alignItems: 'center' }}>
            <TouchableOpacity style={{ backgroundColor: "#f03553", marginHorizontal: 90, width: '35%', height: 50, borderRadius: 4 }} onPress={() => {
              allBackgroundColor = [
                { key: 1, color: "#5CD859", name: "sem-açucar" },
                { key: 2, color: "#24A6D9", name: "sem-glutem" },
                { key: 3, color: "#595BD9", name: "esporte" },
                { key: 4, color: "#8022D9", name: "sem-sal" },
                { key: 5, color: "#D159D8", name: "aleatório" },
                { key: 6, color: "#D85963", name: "doce" },
                { key: 7, color: "#D88559", name: "salgado" }
              ]
              setTags([])
            }}>
              <Text style={{ color: '#fff', textAlign: 'center', paddingVertical: 15, fontFamily: 'Helvetica-Nue-Bold' }}>Apagar</Text>
            </TouchableOpacity>
          </View>

          <FlashMessage position="bottom" style={{marginBottom:160}} titleStyle={{fontFamily:'Helvetica-Nue-Condensed', fontSize:19}} textStyle={{fontFamily:'Helvetica-Nue', fontSize: 16}}/>
  
        </ScrollView>
  
      </SafeAreaView>
    );
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D9DB'
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1.8,
    borderColor: "#e8e8e8",
    marginHorizontal: 20,
    margin: 2,
    marginTop: 12
  },
  inputPhotoContainer: {
    bottom: 180,
    left: 20,
    position: 'absolute',
    top: 30
  },
  inputTitleContainer: {
    marginLeft: 85,
    marginRight: 20,
    flexDirection: 'row'
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 64,
    marginRight: 30
  },
  photo:{
    borderWidth:1,
    borderStyle: 'dashed',
    borderColor:'red',
    borderTopColor:'white',
    borderRadius:1
  }
});