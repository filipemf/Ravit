import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Dimensions} from 'react-native'
import Colors from '../../utils/Colors'
import ToDoModal from './ToDoModal'
import Fire from '../../../Fire'

import { Ionicons } from '@expo/vector-icons'

import moment from 'moment/min/moment-with-locales'

const { height, width } = Dimensions.get('window');

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

        moment.locale('pt'); 
        moment().format("ll");

        let date = moment(list.timestamp).fromNow()

        return (
            <View style={{flex:1}}>
                <Modal animationType="slide" visible={this.state.showListVisible} onRequestClose={() => this.toggleListModal()} swipeDirection={'right'} propagateSwipe>
                    <ToDoModal list={list} closeModal={() => this.toggleListModal()} updateList={this.props.updateList} swipeDirection={'right'} propagate />
                </Modal>

                <View style={{ alignItems: 'center', margin: 5 }}>


                    <TouchableOpacity style={[styles.listContainer, { backgroundColor: list.color }]} onPress={() => this.toggleListModal()} onLongPress={() => this.AsyncDeleteAlert()}>
                        <View style={{}}>
                            <View style={{ position: 'absolute', alignSelf: 'flex-end', right: 10, bottom: list.ioniconIcon=="ios-fitness"||list.ioniconIcon=="ios-calendar"||list.ioniconIcon=="ios-build"?-15:-50, flexWrap:'wrap'}}>
                                <Ionicons name={list.ioniconIcon} size={150} color="#fcfcfc"/>
                            </View>

                            <View style={{ alignItems: 'flex-start', margin: 5, marginLeft: 10, width: 180, }}>
                                <Text style={styles.listTitle} >
                                    {list.name}
                                </Text>
                            </View>

                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 10, top: -18, flexWrap:'wrap'}}>
                                <Text style={[styles.subtitle, { color: "#000", fontFamily: 'Helvetica-Nue-Condensed'}]}>Completada:{' '}</Text>
                                <Text style={[styles.count, { color: "#000", fontWeight: 'bold'}]}>{completedCount}</Text>
                            </View>

                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 10, top: -18, flexWrap:'wrap'}}>
                                <Text style={[styles.subtitle, { color: "#000", fontFamily: 'Helvetica-Nue-Condensed'}]}>Faltando:{' '}</Text>
                                <Text style={[styles.count, { color: "#000", fontWeight: 'bold'}]}>{remainingCount}</Text>

                            </View>

                            <View style={{ alignItems: 'center', marginLeft: 20, top: 145, position: 'absolute', flexWrap:'wrap'}}>
                                <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Nue', color: '#f5f5f5', fontWeight:'bold'}}>adicionada {date}</Text>
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
        width: (width*80)/100,
        height: 180
    },
    listTitle: {
        fontSize: 26,
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
        fontSize: 22,
        color: Colors.white
    }
})