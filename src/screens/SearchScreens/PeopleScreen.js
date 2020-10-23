import React from 'react'
import {StatusBar ,View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Button, ScrollView, ActivityIndicator, Dimensions} from 'react-native'
import {Ionicons, Entypo, FontAwesome5} from '@expo/vector-icons'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import Fire from '../../../Fire'
import styled from 'styled-components'
const firebase = require("firebase")

const numColumns = 2
export default class PeopleScreen extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      username: this.props.navigation.getParam('username'),
      avatar: this.props.navigation.getParam('avatar'),
      name: this.props.navigation.getParam('name'),
      userUid: this.props.navigation.getParam('uid'),
      posts: [],
      isLoading: false,
      postsQuantity: 0,
      isFollowing: false,
      currentUserUid: "",
      followers:0,
      following:0
  };
  }
  componentWillMount(){
  console.log("aaaaaa")
}

  async componentDidMount(){
    //await this.setState({isLoading: true})
    
    await this.getFollowersQuantity()
    await this.getFollowingQuantity()
    await this.getUsersPosts()
    await this.setState({isFollowing: await Fire.shared.VerifyIfIsAlredyFollowingUser(this.state.userUid)}, ()=> console.log(this.state.isFollowing))
    
    await this.setState({isLoading: false})
   
    
    
  }

getUsersPosts = async () =>{
  const allPosts = [];

  await Fire.shared.firestore.collection('posts').where('uid', '==', this.state.userUid).onSnapshot(async data=>{
      data.forEach(async doc => {
          if(doc&&doc.exists){
              let values = {}
              const postData = doc.data()
              values.avatar = this.state.avatar
              values.username = postData.username
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
          }
      })
      let sorted_array = allPosts.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({
          posts: allPosts
      }, ()=>{
         // console.log(this.state.posts)
          const totalProps = Object.keys(this.state.posts).length //3
          this.setState({postsQuantity: totalProps})
      })
  })
}

VerifyIfIsAlredyFollowingUser = async () => {
  const isFollowingResult = await Fire.shared.VerifyIfIsAlredyFollowingUser(this.state.userUid)
  this.setState({isFollowing: isFollowingResult})
}

handleRemoveFollow = async()=> {
  await this.setState({isLoading: true})
  //REMOVER FOLLOW(AMIZADE)
  const stopToFollow = await Fire.shared.stopToFollow(this.state.userUid)
  this.setState({isFollowing: stopToFollow})

  await this.setState({isLoading: false})
}

handleFollow = async ()=> {
    await this.setState({isLoading: true})
    //INSERIR FOLLOW(AMIZADE)
    const startToFollow = await Fire.shared.startToFollow(this.state.userUid)
    //const booleanResult = await Fire.shared.sendBoolean()
    await this.setState({isFollowing: startToFollow})

    await this.setState({isLoading: false})
}

handleRemoveOrFollow = async ()=>{
  if(this.state.isFollowing == true){
    await this.handleRemoveFollow()
    await this.getFollowersQuantity()
  }else{
    await this.handleFollow()
    await this.getFollowersQuantity()
  }
  await this.VerifyIfIsAlredyFollowingUser()
}

getFollowingQuantity = async ()=>{
  const user = this.state.userUid
  this.setState({following: await Fire.shared.getFollowingQuantity(user)})
}
getFollowersQuantity = async ()=>{
  const user = this.state.userUid
  this.setState({followers: await Fire.shared.getFollowersQuantity(user)})
}

handleOpenImage = (post)=>{
  if(post.typeOfPost == "OUTROS"){
    this.props.navigation.navigate("OtherPosts", post)
  }else{
    this.props.navigation.navigate("RecipesPosts", post)
  }
}

renderPost = ({item, index}) => {
  let {itemStyle, itemText} = styles
  return (
      <View style={itemStyle}>
        <TouchableOpacity onPress={()=> this.handleOpenImage(item)}><Image source={{uri: item.image}} style={styles.postImage}/></TouchableOpacity>
      </View>
  )
}

render(){
  if(this.state.isLoading==false){
  return(
      <View style={styles.container}>
          <TouchableOpacity style={{marginLeft: 12, top: 30}} onPress={() => this.props.navigation.goBack(null)}>
            <Ionicons name='md-arrow-back' size={34} color='black'></Ionicons>
          </TouchableOpacity>
          <View style={{marginTop: 25, alignItems: 'center'}}>

            <View style={{flexDirection: 'row'}}>
              <View style={[styles.avatarContainer], {right: 170, position:'absolute'}}>
                  <TouchableOpacity>
                      <Image source={this.state.avatar ? {uri: this.state.avatar}: require("../../../assets/tempAvatar.jpg")} style={styles.avatar}/>
                  </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row', width: ( (Dimensions.get('window').width*55)/100), left: 70}}>
                  <Text style={styles.name}>{this.state.name}</Text>
                </View>

                <View style={{alignSelf:'center', alignContent:'center', alignItems:'center', marginTop:45, flexDirection:'row'}}>
                  <TouchableOpacity style={{bottom: -15,  flexDirection:'column', backgroundColor:'#116673', padding:10, borderRadius: 5}} onPress={this.handleRemoveOrFollow}>
                    
                    {this.state.isFollowing?
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: "#fff", marginRight: 10, fontFamily:'Helvetica-Nue', alignSelf:'center'}}>Clique para parar de seguir</Text>
                        <FontAwesome5 name="user-friends" size={28} color="#fff"/>
                      </View>
                    :
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: "#fff", marginRight: 10, fontFamily:'Helvetica-Nue', alignSelf:'center'}}>Clique para começar a seguir</Text>
                        <Ionicons name="ios-person-add"  size={32} color="#fff" />
                      </View>

                    }
                  </TouchableOpacity>

                </View>
              </View>
              

            </View>
            
              <View style={styles.statsContainer}>

                    <Text style={styles.statAmount}>Posts: <Text style={{color: "black", fontSize: 20}}>{this.state.postsQuantity}</Text></Text>

                    <Text style={styles.statAmount}>Followers: <Text style={{color: "black", fontSize: 20}}>{this.state.followers}</Text></Text>

                    <Text style={styles.statAmount}>Following: <Text style={{color: "black", fontSize: 20}}>{this.state.following}</Text></Text>
                  
              </View>
          </View>

          <Divider/>
         
          <FlatList 
              style={styles.feed} 
              data={this.state.posts} 
              extraData={this.state}
              numColumns={numColumns}
              keyExtractor={(i, k) => k.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderPost}
          />
      </View>
  )
  }else{
    return(
      <View style={{flex:1, alignSelf:'center', alignContent:'center', alignItems:'center', flexDirection:'row'}}>
        <ActivityIndicator color="black" size="large"/>
        <Text style={{fontFamily: 'Helvetica-Nue-Condensed'}}>    Carregando...</Text>
      </View>
    )
  }
}
}


const Divider = styled.View`
  border-bottom-color: #000;
  border-bottom-width: 2px;
  width: 100%;
  bottom: 25px;
`

const styles = StyleSheet.create({
container: {
  flex: 1,
  bottom: 20
},
avatarContainer: {
  shadowColor: "#151734",
  shadowRadius: 30,
  shadowOpacity: 0.4
},
avatar: {
  width: 96,
  height: 96,
  borderRadius: 68
},
name: {
  marginTop: 24,
  fontSize: 22,
  fontWeight: "bold"
},
statsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  margin: 32
},
stat: {
  alignContent: 'center',
  flex: 1
},
statAmount: {
  color: "#4F566D",
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 18
},
statTitle: {
  color: '#C3C5CD',
  fontSize: 15,
  fontWeight: '500',
  marginTop: 4
},
postImage: {
  width: '100%',
  height: 180,
  borderRadius: 5,
  marginVertical: 16,
  
},
feed: {
  bottom:40
},
itemStyle: {
  flex: 1,
  margin: 3
}
})