import React from 'react'
import { SafeAreaView, StatusBar, View, StyleSheet, Image, FlatList, ScrollView, TouchableOpacity, TextInput, Text, Dimensions} from 'react-native'
import Fire from '../../../Fire'
import { AntDesign, MaterialIcons} from '@expo/vector-icons'
import moment from 'moment'

import styled from 'styled-components'

import Colors from '../../utils/Colors'

import AnimatedLoader from 'react-native-animated-loader';

export default class RecipesPosts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatar: this.props.navigation.getParam('avatar'),
      username: this.props.navigation.getParam('username'),
      timestamp: this.props.navigation.getParam('timestamp'),
      text: this.props.navigation.getParam('text'),

      ingredients: this.props.navigation.getParam('ingredients'),
      prepareMode: this.props.navigation.getParam('prepareMode'),
      tags: this.props.navigation.getParam('tags'),

      image: this.props.navigation.getParam('image'),
      titleText: this.props.navigation.getParam('titleText'),
      typeOfPost: this.props.navigation.getParam('typeOfPost'),

      avatarImage: "",
      uid: this.props.navigation.getParam('uid'),
      commentary: "",
      comments: [],
      isFetching: false,
      commentedIdAndUserAreTheSame: false,
      userCommentaries: [],
      isLoading: false,
      fontsLoaded: false
    }
    this.textInput = React.createRef()
  }


  async componentDidMount() {
    await this.setState({ isLoading: true }, async () => {
      await this.getComments(this.state.uid, this.state.timestamp, this.state.image, this.state.text)
      await this.setState({ isLoading: false })
    })

  }

  getComments = async (uid, timestamp, image, text) => {
    const post = await Fire.shared.firestore.collection('posts').where('uid', '==', uid).where('timestamp', '==', timestamp).where('image', '==', image).where('text', '==', text).get()
    const data = post.docs[0].id;
    await Fire.shared.firestore.collection('commentaries').doc(data).onSnapshot(async comments => {

      const allComments = []
      const userComments = []
      const commentsData = comments.data().comments
      commentsData.map(async element => {
        const user = await Fire.shared.firestore.collection('users').doc(element.whoCommented).get()
        const avatar = user.data().avatar
        element.avatar = avatar
        allComments.push(element)
        if (element.whoCommented == Fire.shared.uid) {
          userComments.push(element)
        }

        allComments.sort((a, b) => b.timestamp - a.timestamp);
        userComments.sort((a, b) => b.timestamp - a.timestamp);
        //console.log(allComments)
        this.setState({ comments: allComments }, async () => {
          await this.setState({ userCommentaries: userComments })
        })

      })
    })


  }

  clearText = async () => {
    await this.setState({ commentary: "" })
    await this.setState({ commentary: "" })
    await this.setState({ commentary: "" })
  }

  sendCommentary = async () => {
    const theComment = this.state.commentary

    if (theComment != "") {
      await this.setState({ isLoading: true }, async () => {
        await Fire.shared.addComment(this.state.uid, this.state.timestamp, this.state.image, this.state.text, theComment)
      })
      await this.setState({ commentary: "" }, async () => {
        await this.setState({ isLoading: false })
      })
    }
  }

  removePost = async (image, text, timestamp, titleText, uid, username) => {
    await this.setState({ isLoading: true }, async () => {
      const post = await Fire.shared.firestore.collection('posts').where('image', '==', image).where('text', '==', text).where('timestamp', '==', timestamp).where('titleText', '==', titleText).where('uid', '==', uid).where('username', '==', username).get()
      const data = post.docs[0].id;

      //Remove
      await Fire.shared.firestore.collection('posts').doc(data).delete().then(() => console.log('post deletado com sucesso'))
      await Fire.shared.firestore.collection('commentaries').doc(data).delete().then(() => console.log("todos os comentarios foram deletados"))
      await this.setState({ isLoading: false }, () => {
        this.props.navigation.goBack(null)
      })
    })
  }

  removeCommentary = async (commentary, postId, timestamp, usernameCommented, whoCommented) => {
    await this.setState({ isLoading: true }, async () => {
      await Fire.shared.removeCommentary(commentary, postId, timestamp, usernameCommented, whoCommented)
      await this.setState({ isLoading: false })
    })

  }

  renderCommentaries = (comments) => {
    try {
      if (comments != undefined || null) {
        return (
          <View style={styles.feedItem}>
            {comments.whoCommented == Fire.shared.uid ? <TouchableOpacity onPress={() => this.removeCommentary(comments.commentary, comments.postId, comments.timestamp, comments.usernameCommented, comments.whoCommented)} style={{ position: 'absolute', left: 300, top: 5 }}><AntDesign name="delete" size={24} /></TouchableOpacity> : <></>}
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Image source={comments.avatar ? { uri: comments.avatar } : require("../../../assets/tempAvatar.jpg")} style={styles.personalAvatar} />
                <Text style={styles.name}>{comments.usernameCommented}</Text>
              </View>
              <Text style={{ left: 88, bottom: 33, color: "#383838", fontWeight:'bold'}}>{moment(comments.timestamp).fromNow()}</Text>
              <Text style={styles.postCommentary}>{comments.commentary}</Text>
            </View>
          </View>
        );
      }
    } catch (error) {
      alert(error)
    }
  };


  render() {
    if (this.state.isLoading == true) {
      return (
        <View style={styles.loading}>
          <Text style={{ bottom: 90, fontSize: 26, color: '#000', fontFamily: 'Helvetica-Nue-Condensed' }}>Carregando...</Text>
          <AnimatedLoader visible={this.state.isLoading} overlayColor="rgba(255,255,255,0.75)" source={require("../../../assets/Animations/animation-postRecipe.json")} animationStyle={{ width: 100, height: 100 }} speed={1} />
        </View>
      )
    }
    else {
      return (
        <View style={{flex:1}}>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <Back>
            <TouchableOpacity style={{ left: 5, top: 15 }} onPress={() => this.props.navigation.goBack(null)}>
              <AntDesign name="arrowleft" size={28} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={{ left: '310%', top: 15, backgroundColor: "#fc034e", borderRadius: 4, padding: 10, height: 40, width: 85 }}>
              <Text style={{ fontWeight: 'bold' }} onPress={this.sendCommentary}>Comentar</Text>
            </TouchableOpacity>
          </Back>


          <ScrollView showsVerticalScrollIndicator={false}>
            <Container>
              <RecipeBackground source={{ uri: this.state.image }}>
                <SafeAreaView>

                  <MainRecipe>
                    <Text style={{
                      fontWeight: 'bold',
                      fontSize: 30,
                      fontFamily: 'Metropolis-Regular',
                      textShadowColor: 'rgba(0, 0, 0, 1.0)',
                      textShadowOffset: { width: -1, height: 1 },
                      textShadowRadius: 25,
                      alignSelf: 'center',
                      bottom: 30,
                      color: "#FFF"
                    }}><Text MetropolisRegular style={{ color: "#FFF" }}>{this.state.titleText}</Text></Text>
                  </MainRecipe>

                </SafeAreaView>

              </RecipeBackground>

              <RecipesContainer style={{maxWidth: Dimensions.get('screen').width, flex:1}}>
                <View style={{ flexDirection: 'row', bottom: '10%' }}>

                  <View style={{flexDirection:'row'}}>
                                      
                    {this.state.uid == Fire.shared.uid ? <TouchableOpacity onPress={() => this.removePost(this.state.image, this.state.text, this.state.timestamp, this.state.titleText, this.state.uid, this.state.username)} style={{ right: '10%', top:10,maxWidth: Dimensions.get('screen').width/3}}><MaterialIcons name="delete-forever" size={32} /></TouchableOpacity> : <></>}
                
                    <Image source={this.state.avatar ? { uri: this.state.avatar } : require("../../../assets/tempAvatar.jpg")} style={styles.avatar} />
                    <Text style={{fontFamily: 'Lato-Regular', fontSize: 17, left: 95, fontWeight:'bold',maxWidth: Dimensions.get('screen').width/5}}>{moment(this.state.timestamp).fromNow()}</Text>
                  </View>

                </View>

                <View style={{ flexDirection: 'row', bottom: 65, marginHorizontal: 45, right: 70 }}>
                  <Text style={{fontFamily: 'Lato-Regular', fontSize: 26, fontWeight: 'bold'}}>@{this.state.username}</Text>
                </View>

                <View style={{ flexDirection: 'row', flex:1}}>
                  <AntDesign name="tags" size={24} color="black" />
                  <Text style={{ fontWeight: "bold", color: "#000",fontFamily: 'Lato-Regular', fontSize: 17, fontWeight: 'bold'}}>  TAGS: </Text>
                </View>


                <View style={{ flexDirection: 'row', right: 35, flexWrap: 'wrap', maxWidth: Dimensions.get('screen').width/3}}>

                  {
                    this.state.tags.map(data => (
                      <Text style={{ backgroundColor: data.item.color, left: 40 ,fontFamily: 'Lato-Regular', fontSize: 18}}> <Text style={{ color: "#FFF" }}>{data.item.name}</Text> </Text>
                    ))
                  }
                </View>

                <Text>{"\n"}</Text>


                <Text style={{fontFamily: 'Lato-Regular', fontSize: 24, fontWeight: 'bold'}}>
                  Ingredientes
                    </Text>
                <Text style={{fontFamily: 'Lato-Regular', fontSize: 19}}>
                  {this.state.ingredients}
                  {"\n"}
                </Text>

                <Text style={{fontFamily: 'Lato-Regular', fontSize: 24, fontWeight: 'bold'}}>
                  Modo de Preparo
                    </Text>
                <Text style={{fontFamily: 'Lato-Regular', fontSize: 19}}>
                  {this.state.prepareMode}
                </Text>

              </RecipesContainer>


              <View style={{ alignSelf: 'center' }}>
                <TextInput
                  ref={component => this.messageInput = component}
                  maxLength={140}
                  autoFocus={false}
                  multiline={true}
                  numberOfLines={2}
                  style={{ fontSize: 20, maxWidth: 235, color: '#000', fontFamily: 'Helvetica-Nue', borderBottomWidth: 1.2, position: 'relative' }}
                  placeholder='Quer compartilhar algo?'
                  onChangeText={commentary => this.setState({ commentary })}
                  value={this.state.commentary}
                ></TextInput>
              </View>

              <FlatList
                style={styles.feed}
                data={this.state.comments}
                renderItem={(comments) => this.renderCommentaries(comments.item)}
                keyExtractor={(i, k) => k.toString()}
                showsVerticalScrollIndicator={false} />

            </Container>
          </ScrollView>

        </View>
      )
    }

  }
}


const RecipesContainer = styled.View`

  padding: 32px;
  background-color: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`

const MainRecipe = styled.View`
  padding: 0 32px;
  margin: 200px 0 32px 0;
`

// const Text = styled.Text`
//   color: ${(props) => (props.dark ? "#000" : props.grey ? "#adaaaa" : "#FFF")};
//   font-family: 'Metropolis-Regular';

//   ${({ title, large, small }) => {
//     switch (true) {
//       case title:
//         return `font-size: 32px`;
//       case large:
//         return `font-size: 20px`;
//       case small:
//         return `font-size: 13px`;
//     }
//   }}

//   ${({ bold, heavy }) => {
//     switch (true) {
//       case bold:
//         return `font-weight: bold`;
//       case heavy:
//         return `font-weight: 700`
//     }
//   }}

// ${({ MetropolisRegular, LatoRegular, Helvetica, HelveticaCondensed }) => {
//     switch (true) {
//       case MetropolisRegular:
//         return `font-family: 'Metropolis-Regular`;
//       case LatoRegular:
//         return `font-family: 'Lato-Regular`;
//       case Helvetica:
//         return `font-family: 'Helvetica-Nue-Condensed'`;
//       case HelveticaCondensed:
//         return `font-family: 'Helvetica-Nue`;
//     }
//   }}
// `

const Back = styled.View`
  border-color: 'rgba(0,0,0,1.0)';
  align-content:center;
  flex-direction: row;
  align-items: center;
  top:0px;
  width:120%;
  height:75px;
  background-color: 'rgba(255,255,255,1.0)';
  border-width: 0.5;
`

const Container = styled.View`
  flex: 1;
  background-color: #FFF;
  
`;

const RecipeBackground = styled.ImageBackground`
  width: 100%;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black
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

  avatarContainer: {
    shadowColor: "#151734",
    shadowRadius: 30,
    shadowOpacity: 0.4
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 68,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    left:70,
    bottom: 50,
    overflow: "hidden",
    borderWidth: 2.0,
    borderColor: "rgba(0, 0,0, 2)",
  },
  name: {
    //marginTop: 24,
    fontSize: 20,
    fontWeight: "900",
    left: 10,
    right: 15,
    color: 'black'
  },
  username: {
    //marginTop: 24,
    fontSize: 22,
    fontWeight: "900",
    left: 10,
    right: 15,
    color: '#fff'
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 32
  },
  state: {
    alignContent: 'center',
    flex: 1
  },
  statAmount: {
    color: "#4F566D",
    fontSize: 18,
    fontWeight: '300',
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
    height: 350,
    borderRadius: 5,
    marginVertical: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D9DB'
  },
  postCommentary: {
    fontSize: 25,
    marginVertical: 15,
    alignContent: 'center',
    alignSelf: 'center',
    right: 25,
    fontSize: 20,
    marginLeft: 60,
    marginRight: 15,
    color: "#000",
    fontFamily: 'Helvetica-Nue'

  },
  timestamp: {
    fontSize: 18,
    color: "#383838",
    marginLeft: 50,
    right: 10,
    top: 30
  },
  feed: {
    flex: 1,
    marginHorizontal: 16,
    position: 'relative',
  },
  feedItem: {
    backgroundColor: "#ebebeb",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
    borderColor: Colors.lightGrey,
    borderWidth: 1.5
  },
  personalAvatar: {
    width: 66,
    height: 66,
    borderRadius: 50,
    marginRight: 16
  },
})