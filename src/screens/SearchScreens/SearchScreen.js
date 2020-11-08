import React from 'react'
import { StatusBar, ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import { Ionicons} from '@expo/vector-icons'

const firebase = require("firebase")

import { SearchBar } from 'react-native-elements';

export default class SearchScreen extends React.Component {
  state = {
    searchText: "",
    data: [],
    loading: false
  };
  componentDidMount() {
    console.disableYellowBox = true;
  }

  handleSearch = async () => {
    await this.setState({ loading: true })
    await firebase
      .firestore()
      .collection('users')
      .where('username', '==', this.state.searchText)
      .onSnapshot(querySnapshot => {
        const users = []
        querySnapshot.forEach(documentSnapshot => {
          const { avatar, username, name, uid, level} = documentSnapshot.data()
          users.push({
            username: username,
            avatar: avatar,
            name: name,
            uid: uid,
            level: level
          })
          this.setState({ loading: false }, () => {
            this.setState({ data: users })
          })

        })
      })

  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={{}}>

          <SearchBar
            lightTheme
            returnKeyType='search'
            placeholder='Pesquise pelo nome de usuário'
            onChangeText={(text) => this.setState({ searchText: text })}
            backButton={<Ionicons name='md-arrow-back' size={34} color='black'></Ionicons>}
            value={this.state.searchText}
            onSubmitEditing={//() => this.firstSearch()
              this.handleSearch
            }
          />
        </View>

        {
          this.state.loading &&

          <ActivityIndicator
            size="large"
            color="#3498db"
            style={styles.activityStyle}
          />

        }

        <FlatList
          style={{ flex: 1 }}
          data={this.state.data}
          extraData={this.state}
          renderItem={({ item }) =>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.inputContainer} onPress={() => this.props.navigation.navigate('SearchResult', item)}>
                <Image source={item.avatar ? { uri: item.avatar } : require("../../../assets/tempAvatar.jpg")} style={styles.avatar} />
                <Text style={{ fontSize: 18 }}>{item.username}</Text>
                <Ionicons name="ios-arrow-forward" style={{ marginLeft: 160 }} size={24} color="black" />
              </TouchableOpacity>
            </View>
          } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    margin: 32,
    flexDirection: 'row'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16
  },
  photo: {
    alignItems: 'flex-end',
    marginHorizontal: 32
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D9DB'
  }
});