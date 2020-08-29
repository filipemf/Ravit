import React, { useState, useEffect } from 'react'
import { StatusBar, View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Animated, Dimensions } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import colors from '../../utils/Colors'
import ToDoList from '../../components/HabitsComponent/ToDoList'
import AddListModal from '../../components/HabitsComponent/AddListModal'
import Fire from '../../../Fire'

import LottieView from 'lottie-react-native';


export default function HabitsScreen({ navigation }) {
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
            <ToDoList list={list} updateList={updateList} />
        )
    }

    // const addList = async list => {
    //     await Fire.shared.addList({
    //         name: list.name,
    //         timestamp: Fire.shared.timestamp,
    //         color: list.color,
    //         todos: []
    //     })
    // }

    const updateList = async list => {
        await Fire.shared.updateList(list)
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            <Modal animationType="slide" visible={addTodoVisible}>
                <AddListModal closeModal={() => toggleAddTodoModal()} addList={() => addList()} />
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
                    <AntDesign name="plus" size={16} color="#000" style={{ fontWeight: 'bold' }} />
                </TouchableOpacity>

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
        flex: 1,
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