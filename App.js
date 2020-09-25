import 'react-native-gesture-handler';
import React from 'react';
import {Ionicons, AntDesign} from '@expo/vector-icons';

//Navigation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from 'react-navigation-stack'
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import * as Font from 'expo-font'

import {decode, encode} from 'base-64'

import InitialScreen from './src/screens/InitialScreen'
import LoadingScreen from './src/screens/LoadingScreen'

//AuthScreens
import RegisterScreen from './src/screens/AuthScreens/RegisterScreen'
import LoginScreen from './src/screens/AuthScreens/LoginScreen'

//BottomTabScreens
import HomeScreen from './src/screens/BottomTabScreens/HomeScreen'
import AddPostScreen from './src/screens/BottomTabScreens/AddPostScreen'
import NotificationScreen from './src/screens/BottomTabScreens/NotificationScreen'
import HabitsScreen from './src/screens/BottomTabScreens/HabitsScreen'
import ProfileScreen from './src/screens/BottomTabScreens/ProfileScreen'

//SearchScreens
import SearchScreen from './src/screens/SearchScreens/SearchScreen'
import SearchResultScreen from './src/screens/SearchScreens/PeopleScreen'

//PostScreens
import OtherPosts from './src/screens/PostScreens/OtherPosts'
import RecipesPosts from './src/screens/PostScreens/RecipesPosts'

import TodosModal from './src/components/HabitsComponent/ToDoModal'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

Font.loadAsync({
  'Helvetica-Nue-Condensed': require('./assets/fonts/helvetica-neue-67-medium-condensed.otf'),
  'Helvetica-Nue': require('./assets/fonts/helvetica-neue.ttf'),
  'Metropolis-Regular': require('./assets/fonts/Metropolis-Regular.otf'),
  'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
  'Helvetica-Nue-Black': require('./assets/fonts/helvetica-neue-condensed-black.ttf'),
  'Helvetica-Nue-Bold': require('./assets/fonts/helvetica-neue-bold.ttf'),
  'Palatino-Linotype': require('./assets/fonts/palatino-linotype.ttf'),
  'Helvetica-Neue-Alt': require('./assets/fonts/helvetica-neue-alt.ttf'),
  'Helvetica-Neue-Roman': require('./assets/fonts/helvetica-neue-roman.ttf')
}); 

function UserScreens() {
  return (
    <NavigationContainer>
      <Tab.Navigator swipeEnabled={true} tabBarOptions={{labelStyle: { fontSize: 15, fontWeight: 'bold'}, tabStyle:{top: 15, margin:15}} }>
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Register" component={RegisterScreen} options={{ tabBarLabel: 'Registrar' }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const AppContainer = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            tabBarIcon: ({tintColor})=> <Ionicons name="ios-home" size={28} color={tintColor}/>
          }
        },
        Habits: {
          screen: HabitsScreen,
          navigationOptions: {
            gesturesEnabled: true,
            tabBarIcon: ({tintColor})=> <AntDesign name="profile" size={28} color={tintColor}/>
          }
        },
        AddPost: {
          screen: AddPostScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons
                name="ios-add-circle"
                size={68}
                color={tintColor}
                style={{
                  shadowColor: "black",
                  shadowOffset: { width: 0, height: 10 },
                  shadowRadius: 10,
                  shadowOpacity: 0.3,
                  bottom:7
                }}
              />
            )
          }
        },
        Notification: {
          screen: NotificationScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name="ios-notifications" size={28} color={tintColor} />
            )
          }
        },
        Profile: {
          screen: ProfileScreen,
          navigationOptions: {
            gesturesEnabled: true,
            tabBarIcon: ({ tintColor }) => (
              <Ionicons name="ios-person" size={28} color={tintColor} />
            )
          }
        }
      },
      {
        tabBarOptions: {
          activeTintColor: "#161F3D",
          inactiveTintColor: "#B8BBC4",
          showLabel: false
        },

      }
    ),
    OtherPosts:{
      screen: OtherPosts
    },
    RecipesPosts:{
      screen: RecipesPosts
    },
    TodosModal:{
      screen:TodosModal
    },
    InitialScreen:{
      screen: InitialScreen,
      navigationOptions: {
        headerShown: null
      }
    },
    AuthScreens:{
      screen: UserScreens
    },
    SearchContainer: createStackNavigator({
      Search:{
        screen: SearchScreen,
      },
      SearchResult:{
        screen: SearchResultScreen
      },
    },
    {
      mode: "modal",
      headerMode: 'none',
      cardStyle:{
        backgroundColor:"transparent",
        opacity:0.99
      }  
    }),
  },
  {
    defaultNavigationOptions:{
      headerShown:null
    },
    mode: "modal",
    headerMode: "none",
    navigationOptions:{
      headerShown: false
    },
    cardStyle:{
      backgroundColor:"transparent",
      opacity:0.99
    }  
  },
)

const Tab = createMaterialTopTabNavigator();

const AuthStack = createStackNavigator(
  {
  Initial: {screen: InitialScreen, navigationOptions:{headerShown:false}},
  AuthScreens:{
    screen: UserScreens,
    navigationOptions: {
      header: null
    }
  }
},
{
  navigationOptions: {
    headerShown: null
  }
},

)

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppContainer,
      Auth:AuthStack
    },
    {
      defaultNavigationOptions: {
        headerShown: null
      },
      initialRouteName: "Loading"
    }
  )
)