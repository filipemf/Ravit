import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import moment from 'moment'
import Fire from '../../../Fire'

import AnimatedLoader from 'react-native-animated-loader';

const firebase = require('firebase')

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [feedType, setFeedType] = useState("feed");
  const [loading, setLoading] = useState(false);
  const [stateTags, setStateTags] = useState([])

  let tagFilters = [
    { key: 1, color: "#5CD859", name: "100açucar" },
    { key: 2, color: "#24A6D9", name: "100glutem" },
    { key: 3, color: "#595BD9", name: "100academia" },
    { key: 4, color: "#8022D9", name: "100carboidratos" },
    { key: 5, color: "#D159D8", name: "não-fritura" },
    { key: 6, color: "#D85963", name: "com-carne" },
    { key: 7, color: "#D88559", name: "rapido" }
  ]

  useEffect(() => {
    setStateTags([])
    initialLoad()
  }, []);

  const initialLoad = async () => {
    console.disableYellowBox = true;

    await setLoading(true)
    if (feedType == "feed") {

      try {
        setPosts(await Fire.shared.getFeedPosts())
      } catch (error) {
        console.log(error)
      }

    }
    else {
      try {
        await setPosts([])
      } catch (error) {
        console.log(error)
      }
    }
    await setLoading(false)



  }

  const onRefresh = async () => {
    await setStateTags([])
    if (feedType == "feed") {
      await setIsFetching(true);
      await setPosts(await Fire.shared.getFeedPosts())
      await setIsFetching(false);
    } else {
      await setPosts([])
    }
  }

  const handleOpenImage = (post) => {
    if (post.typeOfPost == "OUTROS") {
      navigation.navigate("OtherPosts", post)
    } else {
      navigation.navigate("RecipesPosts", post)
    }
  }

  const renderPost = post => {

    const tags = post.tags

    for (let i = 0; i < post.tags.length; i++) {
      for (let j = 0; j < stateTags.length; j++) {
        if (post.tags[i].item.name == stateTags[j]) {
          return (
            <>
            </>
          )
        }
      }

    }

    if (post != undefined || null) {
      return (
        <>
          <TouchableOpacity onPress={() => handleOpenImage(post)}>
            <View style={styles.feedItem}>
              <Image source={{ uri: post.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <View>
                    <Text style={styles.name}>{post.username}</Text>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{post.typeOfPost == 'RECIPE' ? <Text>RECEITA</Text> : <Text>OUTROS</Text>}</Text>
                    <Text style={styles.timestamp}>
                      {moment(post.timestamp).fromNow()}
                    </Text>
                  </View>

                  <Ionicons name="ios-more" size={24} style={{ right: 10 }} color="#73788B" />

                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 16 }}>{post.titleText}</Text>
                <Text numberOfLines={4} style={styles.post}>{post.text}</Text>
                <Image
                  source={{ uri: post.image }}
                  style={styles.postImage}
                  resizeMode="cover"
                />

                <View style={{ flexDirection: 'row', right: 70, flexWrap: 'wrap' }}>
                  <AntDesign name="tags" size={24} />
                  <Text style={{ fontWeight: "bold" }}>  TAGS: </Text>
                </View>
                <View style={{ flexDirection: 'row', right: 80, flexWrap: 'wrap' }}>
                  {
                    tags.map(data => (
                      <Text style={{ backgroundColor: data.item.color, left: 40 }}> <Text style={{ color: "#FFF", fontFamily: 'Metropolis-Regular' }}>{data.item.name}</Text> </Text>
                    ))
                  }
                </View>
              </View>

            </View>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text>Ooops... Ou você não está seguindo ninguém, ou nenhuma das pessoas que você está seguindo fez um post ainda. Tente o feed universal!</Text>
        </View>
      )
    }

  };

  const filterPosts = async item => {
    const array2 = await stateTags.concat(item.name)
    await setStateTags(array2)

  }

  const unFilterPosts = async item => {

    var arr = stateTags
    var index = arr.indexOf(item.name);

    if (index >= 0) {
      arr.splice(index, 1);
    }
    setStateTags(arr)

  }

  const handleFilters = async item => {
    if (stateTags.includes(item.name)) {
      unFilterPosts(item)
    }
    else {
      filterPosts(item)
    }
  }

  const renderFilters = (item) => {
    return (
      <TouchableOpacity style={{ padding: 10, backgroundColor: stateTags.includes(item.name) ? "#595757" : item.color, margin: 5, borderRadius: 4 }} onPress={() => handleFilters(item)}>
        <Text style={{ color: '#fff', fontFamily: 'Metropolis-Regular' }}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  if (loading == false) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={styles.header}>

          <FlatList
            style={{ marginLeft: 10 }}
            data={tagFilters}
            extraData={stateTags}
            horizontal={true}
            renderItem={(item) => renderFilters(item.item)}
            showsHorizontalScrollIndicator={false}/>

          <TouchableOpacity onPress={() => setStateTags([])} style={{}}>
            <Ionicons name="ios-trash" size={28} color="#73788B" style={{ marginLeft: 30, marginTop: 10, right: 15 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Search")} style={{}}>
            <Ionicons name="md-search" size={24} color="#73788B" style={{ marginLeft: 40, marginTop: 10, right: 25 }} />
          </TouchableOpacity>

        </View>


        <FlatList
          style={styles.feed}
          data={posts}
          extraData={stateTags}
          onRefresh={onRefresh}
          refreshing={isFetching}
          renderItem={({ item }) => renderPost(item)}
          keyExtractor={(i, k) => k.toString()}
          showsVerticalScrollIndicator={false}/>

      </View>
    )
  } else {
    return (
      <View style={[styles.loading, { flexDirection: 'row' }]}>
        <Text style={{ bottom: 90, fontSize: 26, color: '#000', fontFamily: 'Helvetica-Nue-Condensed' }}>Carregando...</Text>
        <AnimatedLoader visible={true} overlayColor="rgba(255,255,255,0.75)" source={require("../../../assets/Animations/animation-load.json")} animationStyle={{ width: 60, height: 60 }} speed={1} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ced0de",
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 0.2,
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10
  },
  feed: {
    marginHorizontal: 16
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 50,
    marginRight: 16
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000"
  },
  timestamp: {
    fontSize: 16,
    color: "#C4C6CE",
    marginTop: 4
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
    fontSize: 16
  },
  postImage: {
    right: 75,
    width: 295,
    height: 150,
    borderRadius: 5,
    marginVertical: 5
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

