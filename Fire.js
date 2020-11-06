import * as firebase from 'firebase'
import FirebaseKeys from './config'

//import '@react-native-firebase/app'
//import admob, { MaxAdContentRating } from '@react-native-firebase/admob';
require('firebase/firestore');

class Fire {
    constructor(){
          // Initialize Firebase
        firebase.initializeApp(FirebaseKeys);
            //firebase.analytics();
        firebase.database.enableLogging(true);

        console.log(firebase.auth().languageCode); // null
        firebase.auth().languageCode = 'pt';
        console.log(firebase.auth().languageCode); // 'fr

    }

    addComment = async (uid, timestamp, image, text, commentary) => {
      const post = await this.firestore.collection('posts').where('uid', '==', uid).where('timestamp', '==', timestamp).where('image', '==', image).where('text', '==', text).get()
      const usernameData = await this.firestore.collection('users').doc(this.uid).get()
      const username = usernameData.data().username

      const data = post.docs[0].id;

      
      //console.log(data)
      //console.log(typeof data)
      
      const commentsData = {
        "whoCommented": this.uid,
        "usernameCommented": username,
        "commentary": commentary,
        "timestamp": this.timestamp,
        "postId": data}

      return new Promise(async (res, rej) => {
        const checkComments = await this.firestore.collection('commentaries').doc(data).get()
        if(checkComments&&checkComments.exists){
          await this.firestore
            .doc(`commentaries/${data}`)
            .update({comments: firebase.firestore.FieldValue.arrayUnion(commentsData)})
            .then(async () => {})
            .catch(error => {console.log(error)});
        }else{
          await this.firestore
            .doc(`commentaries/${data}`)
            .set({comments: [commentsData]})
            .then(ref => {
              res(ref);
            })
            .catch(error => {
              rej(error);
            });
        }
  })
    }

    getComment = async(uid, timestamp, image, text)=>{
      const post = await this.firestore.collection('posts').where('uid', '==', uid).where('timestamp', '==', timestamp).where('image', '==', image).where('text', '==', text).get()
      
      const data = post.docs[0].id;
      const comments = await this.firestore.collection('commentaries').doc(data).get()
      //console.log(comments.data())
      return comments.data().comments
    }

    getAvatar = async(uid)=>{
      const data = await this.firestore.collection('users').doc(uid).get()
      return data.data().avatar
     
    }

    addPost = async ({typeOfPost, text, ingredients, prepareMode,localUri, username, titleText, tags}) => {
      const remoteUri = await this.uploadPhotoAsync(
        localUri,
        `photos/${this.uid}/${Date.now()}`
      );

        
      return new Promise(async (res, rej) => {
          
        this.firestore
          .collection(`posts`)
          .add({
            typeOfPost: typeOfPost,
            uid: this.uid,
            username: username,
            titleText: titleText,
            text: text,
            timestamp: this.timestamp,
            image: remoteUri,

            ingredients: ingredients,
            prepareMode: prepareMode,
            tags: tags
          })
          .then(ref => {
            res(ref);
          })
          .catch(error => {
            rej(error);
          });
      })
    };

    uploadPhotoAsync = async (uri, filename) => {
        return new Promise(async (res, rej) => {
          const response = await fetch(uri);
          const file = await response.blob();
    
          let upload = firebase
            .storage()
            .ref(filename)
            .put(file);
    
          upload.on(
            'state_changed',
            snapshot => {},
            err => {
              rej(err);
            },
            async () => {
              const url = await upload.snapshot.ref.getDownloadURL();
              res(url);
            }
          );
        });
    };

    VerifyIfIsAlredyFollowingUser = async (userId) => {
      const docResult = await this.firestore.collection('following').doc(this.uid).get()
      console.log(docResult.usersId)
      const ids = docResult.data().usersId
      for(let i = 0; i < ids.length; i++){
        if(ids[i] == userId){
          return true
        }
      }
      return false
    }

    getFeedPosts = async ()=>{
      const docResult = await this.firestore.collection('following').doc(this.uid).get()
      const ids = docResult.data().usersId

      const allPosts = [];
      
      for(let i = 0; i < ids.length; i++){
        const data = await firebase.firestore().collection('posts').where('uid', '==', ids[i]).get()
        const dataUser = await this.firestore.collection('users').doc(ids[i]).get()
        const user = dataUser.data().avatar

        
          data.forEach(async doc => {
            if(doc&&doc.exists){
            let values = {}
            const postData = doc.data()
              values.avatar = user
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
      }
      let sorted_array = allPosts.sort((a, b) => b.timestamp - a.timestamp);
      return allPosts
    }

    getAllUserPosts = async (user)=>{
      const data = await firebase.firestore().collection('posts').where('uid', '==', user).get()
      const allPosts = [];

      data.forEach(async doc => {
        if(doc&&doc.exists){
          let values = {}
          const postData = doc.data()
          values.avatar = user
          values.username = postData.username
          values.image = postData.image,
          values.titleText = postData.titleText,
          values.text = postData.text
          values.timestamp = postData.timestamp
          values.uid = postData.uid
          allPosts.push(values)
        }
      })
      console.log(allPosts)
      return allPosts
    }

    getUFeedPosts = async ()=>{
      //const docResult = await this.firestore.collection('posts').orderBy('random').limit(7).get()
      //var rand = URL.createObjectURL(new Blob([])).slice(-36).replace(/-/g, "")
      //const ids = docResult.data().usersId
      //console.log(rand)
      /*const allPosts = [];
      
      for(let i = 0; i < ids.length; i++){
        const data = await this.firestore.collection('posts').doc(ids[i]).get()
        const dataUser = await this.firestore.collection('users').doc(ids[i]).get()
        
        if(data&&data.exists){
          const user = dataUser.data().avatar
          const posts = data.data().usersPosts
  
          console.log(posts)
          console.log(posts.length)

          for(let j = 0; j < posts.length; j++){
            let values = {}
  
            values.avatar = user
            values.username = postData.username
            values.image = postData.image,
            values.titleText = postData.titleText,
            values.text = postData.text
            values.timestamp = postData.timestamp
            values.uid = postData.uid
            allPosts.push(values)
          }
        }
        //allPosts.push(values)
      }
      
      console.log(allPosts)
      let sorted_array = allPosts.sort((a, b) => b.timestamp - a.timestamp);
      return allPosts*/
    }

    startToFollow = async (userId) => {
      await this.insertFollowing(userId)
      await this.insertFollower(userId)
      return true
    }

    stopToFollow = async (userId) => {
      await this.removeFollower(userId)
      await this.removeFollowing(userId)
      return false
    }

    insertFollowing = async (userId)=> {
      console.log(userId)
      const docFollowing = await this.firestore.collection('following').doc(this.uid).get()
      if(docFollowing && docFollowing.exists){
        await this.firestore
          .doc(`following/${this.uid}`)
          .update({usersId: firebase.firestore.FieldValue.arrayUnion(userId)})
          .then(async () => {
            //console.log("inserido na lista de following")
            return true
          }).catch(error => {console.log(error); return false});
      }else{
        //console.log("Coleção não existente no banco de dados. Criando...")
        await this.firestore
          .collection('following')
          .doc(this.uid)
          .set({usersId: [userId]})
          .then(()=> {return true}).catch(error => {console.log(error); return false});
      }
    }

    insertFollower= async (userId) => {
      console.log(userId)
      const docFollower = await this.firestore.collection('followers').doc(userId).get()
      if(docFollower && docFollower.exists){
        await this.firestore
        .doc(`followers/${userId}`)
        .update({usersId: firebase.firestore.FieldValue.arrayUnion(this.uid)})
        .then(()=> {
          //console.log(`seu id:${this.uid} foi inserido com sucesso nos followers: ${userId}`)
          return true
        }).catch(error => {console.log(error); return false});
      }
      else{
        //console.log("Coleção não existente no banco de dados. Criando...")
        await this.firestore
            .collection('followers')
            .doc(userId)
            .set({usersId: [this.uid]})
            .then(async () => {console.log("inserido na lista de followers"); return true}).catch(error => {console.log(error); return false});
        }
    }

    removeFollowing = async (userId)=> {
      const docFollowing = await this.firestore.collection('following').doc(this.uid).get()
      if(docFollowing && docFollowing.exists){
        await this.firestore
          .doc(`following/${this.uid}`)
          .update({usersId: firebase.firestore.FieldValue.arrayRemove(userId)})
          .then(async () => {
            //console.log("removido da lista de following")
            return false
          }).catch(error => {console.log(error); return false});
      }else{
        return false
      }
    }

    removeFollower = async (userId)=> {
      const docFollower = await this.firestore.collection('followers').doc(userId).get()
      if(docFollower && docFollower.exists){
        await this.firestore
        .doc(`followers/${userId}`)
        .update({usersId: firebase.firestore.FieldValue.arrayRemove(this.uid)})
        .then(()=> {
          //console.log(`seu id:${this.uid} foi removido com sucesso nos followers: ${userId}`)
          return false
        }).catch(error => {console.log(error); return false});
      }
      else{
        return false       
      }
    }

    removeCommentary = async (commentary, postId, timestamp,usernameCommented, whoCommented)=>{
      console.log("vou tentar apagar")
      try{
        console.log(commentary, postId, timestamp, usernameCommented, whoCommented)
       await this.firestore.collection('commentaries').doc(postId).update({ 
         comments: firebase.firestore.FieldValue.arrayRemove({"commentary": commentary, "postId": postId, "timestamp": timestamp, "usernameCommented": usernameCommented,"whoCommented": whoCommented})
       })
      }catch(e){
        console.log(e)
      }
    }

    //MEXE AQUI ANIMAL
    updateUserInfo = async(newName, newUsername, newProfilePic, pastUserData)=>{
      let db = this.firestore.collection("users").doc(this.uid)

      try {
        if (newUsername != ""){
          const usernameValidated = await this.verifyUsername(newUsername)
          console.log(usernameValidated)
          if(usernameValidated == true){
            throw alert("Nome de usuário ja em uso. Por favor utilize outro")
          
          }else{
            db.set({username: newUsername}, {merge: true})
          }
          
        }

        if (newName != ""){
          db.set({name: newName}, {merge: true})
        }
        
        if (newProfilePic != ""){
          remoteUri = await this.uploadPhotoAsync(newProfilePic, `avatars/${this.uid}`)
          db.set({avatar: remoteUri}, {merge: true})
  
          let pastProfilePic = firebase.storage().refFromURL(pastUserData.avatar)
          pastProfilePic.delete().then(()=>console.log("sucesso")).catch(e=>console.log(e))
  
        }

      }catch(e){
        console.log(e)
        throw e;
      }
    }
       
    getFollowersQuantity = async (userId)=>{
      const docResult = await this.firestore.collection('followers').doc(userId).get()
      if(docResult.exists){
        const ids = docResult.data().usersId
        console.log(ids.length)
        return ids.length
      }else{
        return "0"
      }
      
    }

    getFollowingQuantity = async (userId)=>{
      const docResult = await this.firestore.collection('following').doc(userId).get()
      if(docResult.exists){
        const ids = docResult.data().usersId
        console.log(ids.length)
        return ids.length
      }else{
        return "0"
      }
    }

    verifyUsername = async (username)=>{
      let usernamesMatches = false
      const usernameValue = username

      const data = await firebase
      .firestore()
      .collection('users')
      .where('username', '==', username)
      .get()
      await data.forEach(async doc => {
        const {username} = doc.data()
        if(username == usernameValue){
          usernamesMatches = true
        }
      })
      console.log(usernamesMatches)
      return usernamesMatches
    }

    returnUsername = async username =>{
      return username
    }

    createUserWithFacebookAccount = async user=>{
      let remoteUri = null
      try {
        console.log(JSON.stringify(this.uid))
        //console.log(user.additionalUserInfo.profile)
        console.log("FULL NAME: "+user.additionalUserInfo.profile.name)
        console.log("USERNAME: "+user.additionalUserInfo.profile.first_name+user.additionalUserInfo.profile.last_name)


        console.log("vou inserir os dados no banco de dados")
        let db = await this.firestore.collection("users").doc(this.uid)

        let number = Math.floor(10 + Math.random() * 90)
        let username = await user.additionalUserInfo.profile.first_name+user.additionalUserInfo.profile.last_name+"_"+number.toString()

        if(user.additionalUserInfo.isNewUser==true){
          remoteUri = await this.uploadPhotoAsync(user.additionalUserInfo.profile.picture.data.url, `avatars/${this.uid}`)
          db.set({
            name: user.additionalUserInfo.profile.name,
            avatar: remoteUri,
            username: username.toLowerCase(),
            uid: this.uid,
            level:1,
            experience:0
          })

        }
        
      }
      catch(e){
        console.log(e)
        throw e;
      }
        
    } 

    createUserWithGmailAccount = async user=>{
      let remoteUri = null
      try {
        console.log(JSON.stringify(this.uid))
        //console.log(user.additionalUserInfo.profile)
        console.log(user)
        console.log("vou inserir os dados no banco de dados")
        let db = await this.firestore.collection("users").doc(this.uid)

        let number = Math.floor(10 + Math.random() * 90)
        let username = await user.additionalUserInfo.profile.given_name+user.additionalUserInfo.profile.family_name+"_"+number.toString()

        if(user.additionalUserInfo.isNewUser==true){
          remoteUri = await this.uploadPhotoAsync(user.additionalUserInfo.profile.picture, `avatars/${this.uid}`)
          db.set({
            name: user.additionalUserInfo.profile.name,
            avatar: remoteUri,
            username: username.toLowerCase(),
            uid: this.uid,
            level:1,
            experience:0
          })
        
        }
      }
      catch(e){
        console.log(e)
        throw e;
      }
        
    } 

    createUser = async user => {
          let remoteUri = null
          try {
            const usernameValidated = await this.verifyUsername(user.username)
            console.log(usernameValidated)
            if(usernameValidated == true){
              throw alert("Nome de usuário ja em uso. Por favor utilize outro")
            }
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

              console.log("vou inserir os dados no banco de dados")
              let db = this.firestore.collection("users").doc(this.uid)
              db.set({
                name: user.name,
                avatar: null,
                username: user.username,
                uid: this.uid,
                level:1,
                experience:0
              })
              if (user.avatar){
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`)
                db.set({avatar: remoteUri}, {merge: true})
              }
          } 
          catch(e){
            throw e;
          }
    }

    getUserList = async (callback)=>{
      let ref = this.ref.orderBy('timestamp')
      this.unsubscribe = ref.onSnapshot(snapshot=>{
        lists = []
        snapshot.forEach(doc=>{
          lists.push({id: doc.id, ...doc.data()})
        })
        callback(lists)
      })
    }

    addList(list){
      console.log(list)
      let ref = this.ref
      ref.add(list)
    }

    updateList(list){
      let ref = this.ref
      console.log(list.id)
      ref.doc(list.id).update(list)
    }

    /*getUserList = async (callback)=>{
      let ref = this.firestore
        .collection('lists')
        .doc(this.uid)
        .collection('usersLists')
        
        this.unsubscribe = ref.onSnapshot(snapshot =>{
          lists = []
          snapshot.forEach(doc=>{
            lists.push({id: doc.id, ...doc.data()})
          })
          callback(lists)
        })
    }*/

    insertNewList = async(list)=>{
      try{
        const checkList = await this.firestore.collection('lists').doc(this.uid).get()
        console.log(list)
        if(checkList && checkList.exists){
          await this.firestore.collection('lists').doc(this.uid).collection('userLists').update({
            name: list.name,
            color: list.color,
            timestamp: this.timestamp,
            todos: [] 
          }).then(()=> console.log("updatado"))
        }else{
          console.log(list.name, list.color)
          await this.firestore.collection('lists').doc(this.uid).collection('userLists').add({
            name: list.name,
            color: list.color,
            timestamp: this.timestamp
          }).then(()=> console.log('criado com sucesso'))
        }
      }catch(error){
        console.log(error)
      }
      
    }

    /*addTodoToList = async(id, title)=>{
      try{
        const checkData = await this.firestore.collection('lists').doc(this.uid).collection('userLists').doc(id).get()
        //const todosResult = checkData.data().todos
        todosData = {
          "title": title,
          "completed": false
        }
  
        if(typeof checkData != undefined){
          await this.firestore.collection('lists').doc(this.uid).collection('userLists').doc(id).update({
            todos: firebase.firestore.FieldValue.arrayUnion(todosData)
          }).then(()=> console.log('dei update do todo la no negocio'))
        }else{
          await this.firestore.collection('lists').doc(this.uid).collection('userLists').doc(id).set({
            todos: [{
              "title": title,
              "completed": false
            }]
          }, {merge: true}).then(()=> console.log("criei o todo la no negocio"))
        }
      }catch(er){
        console.log(er)
      }
    }*/


    detach(){
      this.unsubscribe()
    }

    signOut = () => {
      firebase.auth().signOut()
    }

    getAvatar = async ()=>{
      let username = await this.firestore.collection("users").doc(this.uid).get()
      const avatar = await username.data().avatar
      return avatar
    }

      
    get username(){
      return this.firestore
        .collection("users")
        .doc(this.uid)
        .get()
        .then(doc => {
          const username = doc.data().username
          console.log(username)
          return username
        });
    }

    get ref(){
      return this.firestore.collection('lists').doc(this.uid).collection('userLists')
    }

    get firestore() {
      return firebase.firestore();
    }
      
    get uid() {
      return (firebase.auth().currentUser || {}).uid;
    }
      
    get timestamp() {
      return Date.now();
    }
  }
      
    Fire.shared = new Fire();
    export default Fire;