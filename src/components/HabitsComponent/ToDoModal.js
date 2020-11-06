import React from 'react'
import { Modal, Button, FlatList, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Keyboard, Animated } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import Colors from '../../utils/Colors'

import { Swipeable } from 'react-native-gesture-handler'

import Fire from '../../../Fire'

import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";

import LevelUpScreen from '../../components/LevelUpScreen'

export default class ToDoModal extends React.Component {
    state = {
        newTodo: "",
        levelUpTodo: false
    }

    toggleLevelUpModal = async () => {
        this.setState({levelUpTodo: !this.state.levelUpTodo})
    }

    toggleTodoCompleted = async index => {
        const user = this.props.uid || Fire.shared.uid

        let list = this.props.list
        list.todos[index].completed = !list.todos[index].completed

        await this.props.updateList(list)

        await Fire.shared.firestore.collection('users').doc(user).get().then(async doc=>{
            let userLevel = await doc.data().level
            let userExperience = await doc.data().experience

            if(userExperience<100&&list.todos[index].completed==true){
                if(userExperience+5<100){
                    await Fire.shared.firestore.collection('users').doc(user).set({
                        experience: userExperience+5
                    }, {merge: true})

                    showMessage({
                        message: "Parabéns!🥳",
                        description: "Você acaba de adquirir 5 pontos de experiencia. Continue assim! 😄",
                        type: "default",
                        backgroundColor: "#2be381", // background color
                        color: "#fff", // text color
                    }).then(()=>{
                        setTimeout(() => {
                            this.props.closeModal()
                        }, 500);
                    })
                }
                else{
                    let untilExperience = 100-userExperience
                    let finalXp = 5-untilExperience

                    await Fire.shared.firestore.collection('users').doc(user).set({
                        experience: finalXp,
                        level: userLevel+1
                    }, {merge:true})

                    this.toggleLevelUpModal()

                }
            }
        })

    }

    addTodo = async () => {
        let list = this.props.list
        if (!list.todos.some(todo => todo.title === this.state.newTodo)) {
            list.todos.push({ title: this.state.newTodo, completed: false })
            this.props.updateList(list)
        }
        this.setState({ newTodo: "" })
        Keyboard.dismiss()
    }

    deleteTodo = index => {
        let list = this.props.list
        list.todos.splice(index, 1)

        this.props.updateList(list)
    }

    rightActions = (dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.9],
            extrapolate: 'clamp'
        })
        return (
            <TouchableOpacity onPress={() => this.deleteTodo(index)}>
                <Animated.View style={styles.deleteButton}>
                    <Animated.Text style={{ color: Colors.white, fontWeight: 'bold', transform: [{ scale }] }}>Deletar</Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        )
    }

    renderToDo = (todo, index) => {
        return (
            <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)}>
                <View style={styles.todoContainer}>
                    <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                        <Ionicons
                            name={todo.completed ? "ios-square" : "ios-square-outline"}
                            size={24}
                            color={Colors.lightGrey}
                            style={{ width: 32 }} />
                    </TouchableOpacity>

                    <Text style={[styles.todo, { textDecorationLine: todo.completed ? 'line-through' : 'none', color: todo.completed ? Colors.grey : Colors.black }]}>{todo.title}</Text>
                </View>
            </Swipeable>
        )
    }


    render() {
        const list = this.props.list

        const taskCount = list.todos.length
        const completedCount = list.todos.filter(todo => todo.completed).length

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity style={{ position: 'absolute', top: 64, right: 12, zIndex: 10, top: 25 }} onPress={this.props.closeModal}>
                        <AntDesign name="close" size={26} color={Colors.black} />
                    </TouchableOpacity>

                    <View style={[styles.section, styles.header, { backgroundColor: list.color, borderBottomColor: '#000' }]}>
                        <View>
                            <View style={{ left: 20, marginRight: 10, position: 'absolute' }}>
                                <Ionicons name={list.ioniconIcon} size={58} color="#fff" />
                            </View>

                            <Text style={styles.title}>{list.name}</Text>
                            <Text style={styles.taskCount}>{completedCount} de {taskCount} completadas</Text>
                        </View>
                    </View>

                    <Modal animationType="slide" visible={this.state.levelUpTodo}>
                        <LevelUpScreen closeModal={() => this.toggleLevelUpModal()} />
                    </Modal>

                    <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
                        <FlatList data={list.todos}
                            renderItem={({ item, index }) => this.renderToDo(item, index)}
                            keyExtractor={item => item.title}
                            showsVerticalScrollIndicator={false} />
                    </View>

                    <View style={[styles.section, styles.footer]}>
                        <TextInput style={[styles.input, { borderColor: list.color }]} onChangeText={text => this.setState({ newTodo: text })} value={this.state.newTodo} />
                        <TouchableOpacity style={[styles.addTodo, { backgroundColor: list.color }]} onPress={() => this.addTodo()}>
                            <AntDesign name="plus" size={16} color={Colors.white} />
                        </TouchableOpacity>
                    </View>

                    <FlashMessage position="bottom" style={{marginBottom:160}} titleStyle={{fontFamily:'Helvetica-Nue-Condensed', fontSize:19}} textStyle={{fontFamily:'Helvetica-Nue', fontSize: 16}}/>
                    
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    section: {
        alignSelf: 'stretch'
    },
    header: {
        justifyContent: 'center',
        //marginLeft: 64,
        borderBottomWidth: 2,
        paddingTop: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.white,
        marginLeft: 84,
        fontFamily: 'Helvetica-Nue'
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: "#f5f5f5",
        fontWeight: '600',
        marginLeft: 114,
        fontFamily: 'Helvetica-Nue',
        fontWeight: 'bold'
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: 'row',
        paddingLeft: 32,
        alignItems: 'center'
    },
    todo: {
        color: Colors.black,
        fontWeight: 'bold',
        fontSize: 16

    },
    deleteButton: {
        flex: 1,
        backgroundColor: Colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80

    }
})