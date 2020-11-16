import React, { useState, useEffect } from 'react'
import { Button, StatusBar, View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Animated, Dimensions } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import colors from '../../utils/Colors'
import ToDoList from '../../components/HabitsComponent/ToDoList'
import AddListModal from '../../components/HabitsComponent/AddListModal'
import Fire from '../../../Fire'

import LottieView from 'lottie-react-native';

import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";

export default function HabitsScreen(props, { navigation }) {
    const [addTodoVisible, setAddTodoVisible] = useState(false);
    const [user, setUser] = useState({});
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        initialLoad()
    }, []);

    const initialLoad = async () => {
        await Fire.shared.getUserList(lists => {
            setLists(lists)
            setLoading(false)
        })
    }

    const toggleAddTodoModal = async () => {
        await setAddTodoVisible(!addTodoVisible)
    }

    const renderList = (list) => {
        return (
            <ToDoList list={list} updateList={updateList}/>
        )
    }

    const updateList = async list => {
        await Fire.shared.updateList(list)
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            <Modal animationType="slide" visible={addTodoVisible}>
                <AddListModal closeModal={() => toggleAddTodoModal()} addList={() => addList()}  />
            </Modal>

            <View style={{ marginVertical: 28 }}>
                <Text style={{ fontFamily: 'Helvetica-Nue-Condensed', fontWeight: 'bold', alignSelf: 'center', fontSize: 28, marginBottom: 15 }}>Metas e Desafios</Text>
                <View style={{ flexDirection: 'row', right: 30 }}>
                    <LottieView
                        style={{ width: 100, height: 100, right: -10, bottom: 10 }}
                        speed={1}
                        autoPlay
                        source={require('../../../assets/Animations/5777-muscle-animation-health.json')}
                    />

                    <LottieView
                        style={{ width: 100, height: 100, right: -20, bottom: 10 }}
                        source={require('../../../assets/Animations/19814-data-list.json')}
                    />

                    <LottieView
                        style={{ width: 100, height: 100, right: -10, bottom: 10 }}
                        speed={1}
                        autoPlay
                        source={require('../../../assets/Animations/5799-water-bottle-icon-animation.json')}
                    />
                </View>

                <TouchableOpacity style={styles.addList} onPress={() => toggleAddTodoModal()} onRequestClose={() => toggleAddTodoModal()}>
                    <Text style={{fontSize: 22, fontWeight: 'bold'}}>+</Text>
                </TouchableOpacity>

                <FlashMessage position="bottom" style={{marginBottom:160}} titleStyle={{fontFamily:'Helvetica-Nue-Condensed', fontSize:19}} textStyle={{fontFamily:'Helvetica-Nue', fontSize: 16}}/>

            </View>


                <FlatList
                    style={{bottom: 70}}
                    showsHorizontalScrollIndicator={false}
                    data={lists}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item, index }) => renderList(item)}/>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
    },

    addList: {
        borderWidth: 2,
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        width: 45,
        bottom: 90
    }
})