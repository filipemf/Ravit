import React from 'react'
import { TextInput, View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import Colors from '../../utils/Colors'

import Fire from '../../../Fire'

export default class AddListModal extends React.Component {
    backgroundColor = ["#5CD859", "#24A6D9", "#595BD9", "#8022D9", "#D159D8", "#D85963", "#D88559"]
    tasksOptions = ["Fácil", "Difícil", "Máximo"]

    avaliableIcons = ["ios-fitness", "ios-alarm", "ios-alert", "ios-calculator", "ios-book", "ios-build", "ios-cafe", "ios-calendar"]

    state = {
        name: "",
        color: this.backgroundColor[0],
        icon: this.avaliableIcons[2]
    }

    renderColors = () => {
        return this.backgroundColor.map(color => {
            return (
                <TouchableOpacity key={color} style={[styles.colorSelect, { backgroundColor: color }]} onPress={() => this.setState({ color })} />
            )
        })
    }

    renderIcons = () => {
        return this.avaliableIcons.map(name => {
            return (
                <TouchableOpacity key={name} style={{}} onPress={() => this.setState({ icon: name })}>
                    <Ionicons name={name} size={28} color={this.state.icon == name ? "#000" : "#c9c9c9"} />
                </TouchableOpacity>
            )
        })
    }

    createToDo = async () => {
        const { name, color, icon } = this.state
        console.log(name)

        await Fire.shared.addList({
            name: name,
            timestamp: Fire.shared.timestamp,
            ioniconIcon: icon,
            color: color,
            todos: []
        })

        this.setState({ name: "" })

        this.props.closeModal()
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <TouchableOpacity style={{ left: 320 }} onPress={this.props.closeModal}>
                    <AntDesign name="close" size={24} color={Colors.black} />
                </TouchableOpacity>

                <View style={{ alignSelf: 'stretch', marginHorizontal: 32 }}>

                    <View style={{ marginVertical: 15 }}>
                        <Text style={styles.title}>Lista de listas</Text>
                        <TextInput maxLength={18} style={styles.input} placeholder="Um nome para as suas novas metas" onChangeText={text => this.setState({ name: text })} />

                        <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: 12 }}>
                            {this.renderColors()}
                        </View>
                    </View>

                    <View style={{ marginVertical: 50 }}>
                        <Text style={styles.title}>Escolha um ícone para a sua coleção</Text>
                        <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: 12 }}>
                            {this.renderIcons()}
                        </View>
                    </View>



                    <TouchableOpacity style={[styles.create, { backgroundColor: this.state.color }]} onPress={this.createToDo}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 22 }}>Criar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: Colors.black,
        marginBottom: 16,
        alignSelf: 'center',
        fontFamily: 'Helvetica-Nue'
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.black,
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'Helvetica-Nue'
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    colorSelect: {
        width: 30,
        height: 30,
        borderRadius: 4
    }
})