import React from 'react'
import { View, Text, StyleSheet, Image, FlatList, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import Fire from '../../../Fire'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import moment from 'moment'

export default class OtherPosts extends React.Component {
  backgroundColor = ["#5CD859", "#24A6D9", "#595BD9", "#8022D9", "#D159D8", "#D85963", "#D88559"]
  constructor(props) {
    super(props)
    this.state = {
      avatar: this.props.navigation.getParam('avatar'),
      username: this.props.navigation.getParam('username'),
      timestamp: this.props.navigation.getParam('timestamp'),

      text: this.props.navigation.getParam('text'),
      ingredients: this.props.navigation.getParam('ingredients'),
      prepareMode: this.props.navigation.getParam('prepareMode'),

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
      color: this.backgroundColor[0]
    }
  }

  async componentDidMount() {
    console.log(this.state.typeOfText)
    await this.getComments(this.state.uid, this.state.timestamp, this.state.image, this.state.text)

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
        this.setState({ comments: allComments }, () => {
          this.setState({ userCommentaries: userComments }, () => {
          })

        })

      })
    })
  }


  sendCommentary = async () => {
    if (this.state.commentary != "" && this.state.commentary != undefined) {
      await Fire.shared.addComment(this.state.uid, this.state.timestamp, this.state.image, this.state.text, this.state.commentary)
      this.setState({ commentary: "" })
    }

  }

  removePost = async (image, text, timestamp, titleText, uid, username) => {
    const post = await Fire.shared.firestore.collection('posts').where('image', '==', image).where('text', '==', text).where('timestamp', '==', timestamp).where('titleText', '==', titleText).where('uid', '==', uid).where('username', '==', username).get()
    const data = post.docs[0].id;

    //Remove
    await Fire.shared.firestore.collection('posts').doc(data).delete().then(() => console.log('post deletado com sucesso'))
    await Fire.shared.firestore.collection('commentaries').doc(data).delete().then(() => console.log("todos os comentarios foram deletados"))
    this.props.navigation.navigate("Profile")
  }

  removeCommentary = async (commentary, postId, timestamp, usernameCommented, whoCommented) => {
    try {
      await Fire.shared.removeCommentary(commentary, postId, timestamp, usernameCommented, whoCommented)
    } catch (e) {
      alert(e)
    }

  }

  renderOutrosPost = (comments) => {
    try {
      if (comments != undefined || null) {
        return (

          <View style={styles.feedItem}>
            {comments.whoCommented == Fire.shared.uid ? <TouchableOpacity onPress={() => this.removeCommentary(comments.commentary, comments.postId, comments.timestamp, comments.usernameCommented, comments.whoCommented)} style={{ position: 'absolute', left: 300, top: 5 }}><AntDesign name="closecircleo" size={24} /></TouchableOpacity> : <></>}
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Image source={comments.avatar ? { uri: comments.avatar } : require("../../../assets/tempAvatar.jpg")} style={styles.personalAvatar} />
                <Text style={styles.name}>{comments.usernameCommented}</Text>
              </View>
              <Text style={{ left: 88, bottom: 33, fontSize: 16, color: "#C4C6CE", }}>{moment(comments.timestamp).fromNow()}</Text>
              <Text style={styles.postCommentary}>{comments.commentary}</Text>
            </View>
          </View>
        );
      } else {
        return (
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text>Ooops... Ou você não está seguindo ninguém, ou nenhuma das pessoas que você está seguindo fez um post ainda. Tente o feed universal!</Text>
          </View>
        )
      }
    } catch (error) {
      alert(error)
    }

  };


  render() {
    return (
      <View style={styles.container}>
        <ScrollView >

          <View style={{ alignItems: "center", flexDirection: 'row' }}>
            <Image source={this.state.avatar ? { uri: this.state.avatar } : require("../../../assets/tempAvatar.jpg")} style={[styles.avatar], { overflow: "hidden", borderWidth: 3, borderColor: "red" }} />
            {this.state.uid == Fire.shared.uid ? <TouchableOpacity onPress={() => this.removePost(this.state.image, this.state.text, this.state.timestamp, this.state.titleText, this.state.uid, this.state.username)} style={{ left: '110%', bottom: '10%' }}><AntDesign name="closecircleo" size={24} /></TouchableOpacity> : <></>}
          </View>

          <View style={{ alignItems: "center" }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.name}>@{this.state.username}</Text>
              <Text style={styles.timestamp}>{moment(this.state.timestamp).fromNow()}</Text>
            </View>

            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 16 }}>{this.state.titleText}</Text>
            <Text style={styles.post}>{this.state.text}</Text>

          </View>

          <Image source={{ uri: this.state.image }} style={styles.postImage} resizeMode="cover" />

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity><Ionicons style={{ marginLeft: 18 }} name="ios-chatboxes" size={34} color="#73788B" /></TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <TextInput
              autoFocus={false}
              multiline={true}
              numberOfLines={2}
              style={{ flex: 1, fontSize: 20, maxWidth: 235, left: '15%' }}
              placeholder='Quer compartilhar algo?'
              onChangeText={commentary => this.setState({ commentary })}
              value={this.state.commentary}></TextInput>

            <TouchableOpacity style={{ left: '70%', backgroundColor: "#DDDDDD", padding: 10, alignItems: "center", height: 35, width: 100, position: 'absolute' }}><Text style={{ fontWeight: 'bold' }} onPress={this.sendCommentary}>Comentar</Text></TouchableOpacity>

          </View>

          <FlatList
            style={styles.feed}
            data={this.state.comments}
            renderItem={(comments) => (
              this.renderOutrosPost(comments.item)
            )}
            keyExtractor={(i, k) => k.toString()}
            showsVerticalScrollIndicator={false}
          />

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  name: {
    fontSize: 24,
    fontWeight: "900",
    left: 10
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
  postImage: {
    width: '100%',
    height: 350,
    borderRadius: 5,
    marginVertical: 16
  },
  post: {
    fontSize: 25,
    marginVertical: 15,
  },
  postCommentary: {
    fontSize: 25,
    marginVertical: 15,
    alignContent: 'center',
    alignSelf: 'center',
    right: 25,
    fontSize: 20,
    marginLeft: 60,
    marginRight: 15
  },
  timestamp: {
    fontSize: 21,
    color: "#C4C6CE",
    marginLeft: 150,
    right: 10
  },
  feed: {
    flex: 1,
    marginHorizontal: 16,
    position: 'relative'
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  personalAvatar: {
    width: 66,
    height: 66,
    borderRadius: 50,
    marginRight: 16
  },
})