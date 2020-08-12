import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert } from 'react-native'
import Colors from '../../utils/Colors'
import ToDoModal from './ToDoModal'
import Fire from '../../../Fire'

import { Ionicons } from '@expo/vector-icons'

import moment from 'moment'


export default class ToDoList extends React.Component {
    state = {
        showListVisible: false
    };

    toggleListModal() {
        this.setState({ showListVisible: !this.state.showListVisible })
    }

    deleteList = async () => {
        const user = this.props.uid || Fire.shared.uid
        Fire.shared.firestore.collection("lists").doc(user).collection('userLists').where("timestamp", "==", this.props.list.timestamp).where("todos", '==', this.props.list.todos).get().then(snapshot => snapshot.forEach(result => result.ref.delete()));
    }

    AsyncDeleteAlert = async () => new Promise((resolve) => {
        Alert.alert(
            'Atenção',
            'Deseja apagar esta lista?',
            [
                {
                    text: 'Não',
                    onPress: () => {
                        resolve('YES');
                    },
                },
                {
                    text: 'Sim',
                    onPress: () => {
                        this.deleteList()
                    },
                },
            ],
            { cancelable: false },
        );
    });

    render() {
        const list = this.props.list

        let completedCount = list.todos.filter(todo => todo.completed).length
        let remainingCount = list.todos.length - completedCount

        let date = moment(list.timestamp).locale('pt').fromNow()

        return (
            <View>
                <Modal animationType="slide" visible={this.state.showListVisible} onRequestClose={() => this.toggleListModal()} swipeDirection={'right'} propagateSwipe>
                    <ToDoModal list={list} closeModal={() => this.toggleListModal()} updateList={this.props.updateList} swipeDirection={'right'} propagate />
                </Modal>

                <View style={{ alignItems: 'center', margin: 5 }}>


                    <TouchableOpacity style={[styles.listContainer, { backgroundColor: list.color }]} onPress={() => this.toggleListModal()} onLongPress={() => this.AsyncDeleteAlert()}>
                        <View>
                            <View style={{ position: 'absolute', alignSelf: 'flex-end', right: 15, bottom: 5 }}>
                                <Ionicons name={list.ioniconIcon} size={150} color="#fcfcfc" />
                            </View>

                            <View style={{ alignItems: 'flex-start', margin: 5, marginLeft: 10 }}>
                                <Text style={styles.listTitle} numberOfLines={1}>
                                    {list.name}
                                </Text>
                            </View>

                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 20, bottom: 10 }}>
                                <Text style={[styles.subtitle, { color: "#6bf567", fontFamily: 'Helvetica-Nue-Condensed' }]}>Completada:{' '}</Text>
                                <Text style={[styles.count, { color: "#6bf567" }]}>{completedCount}</Text>

                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 20, bottom: 10 }}>
                                <Text style={[styles.subtitle, { color: "#c93e56", fontFamily: 'Helvetica-Nue-Condensed' }]}>Faltando:{' '}</Text>
                                <Text style={[styles.count, { color: "#c93e56" }]}>{remainingCount}</Text>

                            </View>

                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 20, marginTop: 10 }}>
                                <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Nue', color: '#d9d9d9' }}>adicionada há {date}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>



            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 12,
        borderRadius: 6,
        marginHorizontal: 12,
        width: 330,
        height: 180
    },
    listTitle: {
        fontSize: 30,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 18,
    },
    count: {
        fontSize: 22,
        fontWeight: '200',
        color: Colors.white
    },
    subtitle: {
        fontFamily: 'Helvetica-Nue-Condensed',
        fontSize: 24,
        color: Colors.white
    }
})