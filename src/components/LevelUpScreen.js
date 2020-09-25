import React from 'react'
import {Modal, Button, StatusBar, View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native'
import LottieView from 'lottie-react-native';
import { AntDesign} from '@expo/vector-icons'

export default class LevelUpScreen extends React.Component{
    state = {
        progress: new Animated.Value(0),
        loop: false,
        playingAnimation: false

    }

    async componentDidMount(){
        this.toggleLop()
    }



    toggleLop = async ()=>{
        
        await this.animation.reset()
        
        this.playAnimation()

        await setTimeout(async () => {
            await this.playAnimation2()
        }, 1000);

        setTimeout(() => {
            this.props.closeModal()
        }, 2000);

        
    }


    playAnimation = async ()=>{
        await this.animation.play(1, 120)
        await this.setState({playingAnimation: true})
    }
    playAnimation2 = async ()=>{
        await this.animation.play(47, 47)
    }


    toggleAddTodoModal(){
        this.setState({addTodoVisible: !this.state.addTodoVisible})
    }

    openModal = ()=>{
        return(
            <Modal animationType="slide" visible={this.state.addTodoVisible}>
                <Button title="Fechar"/>
            </Modal>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />

                <TouchableOpacity style={{marginBottom: 40, marginTop: 10}} onPress={this.props.closeModal}>
                    <AntDesign name="close" size={34} color="#000"/>
                </TouchableOpacity>

                <View style={{justifyContent: 'center'}}>
                    <Text style={{ fontFamily: 'Helvetica-Nue-Condensed', fontSize: 48, marginHorizontal: 40}}>Parabéns! {"\n"}Você acaba de passar de nível!</Text>

                    <TouchableOpacity onPress={async () => { await this.toggleLop() }}>
                        <LottieView
                            style={{ width: 190, height: 190 }}
                            ref={animation => {
                                this.animation = animation;
                            }}
                            speed={1}
                            progress={this.state.progress}

                            source={require('../../assets/Animations/677-trophy.json')}
                        />
                    </TouchableOpacity>
                </View>

                
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
    },

})