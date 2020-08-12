import React from 'react'
import { FlatList, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Keyboard, Animated } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import Colors from '../../utils/Colors'

import { Swipeable } from 'react-native-gesture-handler'

export default class ToDoModal extends React.Component {
    state = {
        newTodo: ""
    }

    toggleTodoCompleted = async index => {
        let list = this.props.list
        list.todos[index].completed = !list.todos[index].completed

        this.props.updateList(list)
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
                    <TouchableOpacity style={{ position: 'absolute', top: 64, right: 32, zIndex: 10, top: 25 }} onPress={this.props.closeModal}>
                        <AntDesign name="close" size={24} color={Colors.black} />
                    </TouchableOpacity>

                    <View style={[styles.section, styles.header, { backgroundColor: list.color, borderBottomColor: '#000' }]}>
                        <View>
                            <View style={{ left: 20, marginRight: 30, position: 'absolute' }}>
                                <Ionicons name={list.ioniconIcon} size={58} color="#fff" />
                            </View>

                            <Text style={styles.title}>{list.name}</Text>
                            <Text style={styles.taskCount}>{completedCount} de {taskCount} completadas</Text>
                        </View>
                    </View>

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
        marginLeft: 114,
        fontFamily: 'Helvetica-Nue'
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: "#3c3c3c",
        fontWeight: '600',
        marginLeft: 114,
        fontFamily: 'Helvetica-Nue'
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