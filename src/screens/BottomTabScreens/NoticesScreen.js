import * as React from 'react';
import {
  StatusBar,
  Image,
  FlatList,
  Dimensions,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from 'react-native';
const { width, height} = Dimensions.get('screen');
import { EvilIcons, AntDesign} from '@expo/vector-icons';
import moment from 'moment/min/moment-with-locales'

import {SimpleContent} from '../../components/Modal'

moment.locale('pt'); 
moment().format("ll");

const DATA = [
  {
    title: 'Beber Ovo e Tomar Água Podem Curar seu Cancer? Entenda',
    text: 'Agora eu fiquei doce, doce, doce, doce Agora eu fiquei do-do-do-do-doce, doce [2x] Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Quando eu passava por você na minha Cg Você nem me olhava Fazia de tudo pra me ver, pra me perceber Mas nem me olhava Aí veio a herança do meu véio, Resolveu os meus problemas, minha situação E do dia pra noite fiquei rico Tô na grife, tô bonito Tô andando igual patrão Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Agora você vem, né? E agora você ',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLEurGEf3xZT3Mo8rZOhds4qqYC_aJy706&index=11&ab_channel=RickAstleyVEVO',
    location: 'Mumbai, India',
    author: 'Filipe',
    date: moment([2020, 11, 18]).fromNow(),
    cover:
      'https://conteudo.imguol.com.br/c/parceiros/93/2020/03/29/o-musico-fluminense-zeca-pagodinho-foto-reproducao-1585534395397_v2_1024x768.png',
  },
  {
    title: 'Como fazer um delicioso omelete usando apenas palitos de fosforo e a força de vontade',
    text: 'Agora eu fiquei doce, doce, doce, doce Agora eu fiquei do-do-do-do-doce, doce [2x] Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Quando eu passava por você na minha Cg Você nem me olhava Fazia de tudo pra me ver, pra me perceber Mas nem me olhava Aí veio a herança do meu véio, Resolveu os meus problemas, minha situação E do dia pra noite fiquei rico Tô na grife, tô bonito Tô andando igual patrão Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Agora você vem, né? E agora você ',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLEurGEf3xZT3Mo8rZOhds4qqYC_aJy706&index=11&ab_channel=RickAstleyVEVO',
    author: 'Filipe',
    date: moment([2019, 11, 18]).fromNow(),
    cover:
      'https://conteudo.imguol.com.br/c/parceiros/93/2020/03/29/o-musico-fluminense-zeca-pagodinho-foto-reproducao-1585534395397_v2_1024x768.png',
  },
  {
    title: 'Dicas para parar de treinar e se tornar gordo e sedentario',
    text: 'Agora eu fiquei doce, doce, doce, doce Agora eu fiquei do-do-do-do-doce, doce [2x] Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Quando eu passava por você na minha Cg Você nem me olhava Fazia de tudo pra me ver, pra me perceber Mas nem me olhava Aí veio a herança do meu véio, Resolveu os meus problemas, minha situação E do dia pra noite fiquei rico Tô na grife, tô bonito Tô andando igual patrão Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Agora você vem, né? E agora você ',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLEurGEf3xZT3Mo8rZOhds4qqYC_aJy706&index=11&ab_channel=RickAstleyVEVO',
    author: 'Filipe',
    date: moment([2021, 11, 18]).fromNow(),
    cover:
      'https://conteudo.imguol.com.br/c/parceiros/93/2020/03/29/o-musico-fluminense-zeca-pagodinho-foto-reproducao-1585534395397_v2_1024x768.png',
  },
  {
    title: 'Socializando na quarentena: Como perder o máximo de amigos possível',
    text: 'Agora eu fiquei doce, doce, doce, doce Agora eu fiquei do-do-do-do-doce, doce [2x] Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Quando eu passava por você na minha Cg Você nem me olhava Fazia de tudo pra me ver, pra me perceber Mas nem me olhava Aí veio a herança do meu véio, Resolveu os meus problemas, minha situação E do dia pra noite fiquei rico Tô na grife, tô bonito Tô andando igual patrão Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Agora você vem, né? E agora você ',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLEurGEf3xZT3Mo8rZOhds4qqYC_aJy706&index=11&ab_channel=RickAstleyVEVO',
    date: moment([2020, 11, 9]).fromNow(),
    author: 'Filipe',
    cover:
      'https://conteudo.imguol.com.br/c/parceiros/93/2020/03/29/o-musico-fluminense-zeca-pagodinho-foto-reproducao-1585534395397_v2_1024x768.png',
  },
  {
    title: 'Aumentando Suas Chances de Perder seu Emprego',
    text: 'Agora eu fiquei doce, doce, doce, doce Agora eu fiquei do-do-do-do-doce, doce [2x] Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Quando eu passava por você na minha Cg Você nem me olhava Fazia de tudo pra me ver, pra me perceber Mas nem me olhava Aí veio a herança do meu véio, Resolveu os meus problemas, minha situação E do dia pra noite fiquei rico Tô na grife, tô bonito Tô andando igual patrão Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Agora você vem, né? E agora você ',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLEurGEf3xZT3Mo8rZOhds4qqYC_aJy706&index=11&ab_channel=RickAstleyVEVO',
    date: moment([2020, 18, 11]).fromNow(),
    author: 'Filipe',
    cover:
      'https://conteudo.imguol.com.br/c/parceiros/93/2020/03/29/o-musico-fluminense-zeca-pagodinho-foto-reproducao-1585534395397_v2_1024x768.png',
  },
  {
    title: 'Novas formas de contrabandear drogas para a colombia, entenda',
    text: 'Agora eu fiquei doce, doce, doce, doce Agora eu fiquei do-do-do-do-doce, doce [2x] Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Quando eu passava por você na minha Cg Você nem me olhava Fazia de tudo pra me ver, pra me perceber Mas nem me olhava Aí veio a herança do meu véio, Resolveu os meus problemas, minha situação E do dia pra noite fiquei rico Tô na grife, tô bonito Tô andando igual patrão Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Agora você vem, né? E agora você ',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLEurGEf3xZT3Mo8rZOhds4qqYC_aJy706&index=11&ab_channel=RickAstleyVEVO',
    date: moment([2020, 11, 18]).fromNow(),
    author: 'Filipe',
    cover:
      'https://conteudo.imguol.com.br/c/parceiros/93/2020/03/29/o-musico-fluminense-zeca-pagodinho-foto-reproducao-1585534395397_v2_1024x768.png',
  },
  {
    title: 'Como sair do bronze no overwatch (não tem como)',
    text: 'Agora eu fiquei doce, doce, doce, doce Agora eu fiquei do-do-do-do-doce, doce [2x] Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Quando eu passava por você na minha Cg Você nem me olhava Fazia de tudo pra me ver, pra me perceber Mas nem me olhava Aí veio a herança do meu véio, Resolveu os meus problemas, minha situação E do dia pra noite fiquei rico Tô na grife, tô bonito Tô andando igual patrão Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Agora você vem, né? E agora você ',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLEurGEf3xZT3Mo8rZOhds4qqYC_aJy706&index=11&ab_channel=RickAstleyVEVO',
    date: moment([2020, 11, 18]).fromNow(),
    author: 'Filipe',
    cover:
      'https://conteudo.imguol.com.br/c/parceiros/93/2020/03/29/o-musico-fluminense-zeca-pagodinho-foto-reproducao-1585534395397_v2_1024x768.png',
  },
];


export default function App() {
  const [data, setData] = React.useState(DATA);
  const modalizeRef = React.useRef(null);
  const [modalData, setModalData] = React.useState({});
  const [scrolling, setScrolling] = React.useState(true);

  React.useEffect(() => {
  });

  function onOpen(item){
    setModalData(item);
    setScrolling(false);
    
    modalizeRef.current?.open();
  }
  function onClose(){
    setScrolling(true);
    modalizeRef.current?.close();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />

      <SimpleContent ref={modalizeRef} items={modalData}/>
    
      <ScrollView style={{marginHorizontal: 15}} showsVerticalScrollIndicator={false}>
        <Text style={{fontWeight: 'bold', fontSize: 36, fontFamily:'Helvetica-Nue'}}>Novas notícias</Text>  
        <View style={{flexGrow:1}}>
          <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={data}
          keyExtractor={(_, index) => String(index)}
          horizontal
          renderItem={({ item, index }) => {

            return (
              <TouchableOpacity style={{padding:10, flexDirection:'column', alignContent:'center', flex:1}} onPress={()=> onOpen(item)}>
                  <View style={{position: 'absolute',alignItems: 'center'}}>
                    <Image source={{ uri: item.cover }} style={{width: 420,height: 220,borderRadius: 14}}/>
                    <Text style={{fontWeight:'bold', fontFamily:'Helvetica-Nue'}}>{item.date}</Text>
                  </View>
                  <Text style={{
                    width: 410, height: 220,

                    fontSize: 20,
                    fontFamily: 'Helvetica-Nue-Bold',
                    textShadowColor: 'rgba(0, 0, 0, 1.0)',
                    textShadowOffset: { width: -1, height: 1 },
                    textShadowRadius: 25,
                    top: 100,
                    color: "#FFF",
                  }}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}/>
        </View>
        

        <Text style={{fontWeight: 'bold', fontSize: 24, fontFamily:'Helvetica-Nue'}}>Nutrição</Text>
        <View style={{flexGrow:1}}>
          <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity style={{padding:10, flexDirection:'column'}} onPress={()=> onOpen(item)}>
                <Image source={{ uri: item.cover }} style={{width: 265,height: 155,borderRadius: 14}}/>
                <Text style={{fontWeight:'bold', width: 265, textAlign:'center', color: '#6a93eb', fontFamily:'Helvetica-Nue'}}>{item.date}</Text>
                <Text style={{fontWeight:'bold', width: 265, fontFamily:'Helvetica-Nue'}}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}/>
        </View>
        

        <Text style={{fontWeight: 'bold', fontSize: 24}}>Exercícios</Text>
        <View style={{flexGrow:1}}>
          <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity style={{padding:10, flexDirection:'column'}} onPress={()=> onOpen(item)}>
                <Image source={{ uri: item.cover }} style={{width: 265,height: 155,borderRadius: 14}}/>
                <Text style={{fontWeight:'bold', width: 265, textAlign:'center', color: '#6a93eb', fontFamily:'Helvetica-Nue'}}>{item.date}</Text>
                <Text style={{fontWeight:'bold', width: 265, fontFamily:'Helvetica-Nue'}}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}/>
        </View>
      </ScrollView>


      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  modalButton:{
    alignItems:'center',
    justifyContent:'center',
    padding: 15,
    borderRadius: 7
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  location: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  itemContainer: {
    padding: 2,
  },
  itemContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overflowContainer: {
    overflow: 'hidden',
  },
});