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
    title: 'Dicas para manter a forma dentro de casa',
    text: 'Antes de recorrer a atividade física em sua casa, confira algumas dicas para otimizar seus exercícios: Uma avaliação física é fundamental. Antes de tudo, faça um aquecimento para que o sangue circule e evite lesões. Com até 10 minutos de exercício aeróbico já é o suficiente. Você pode pular corda, fazer polichinelos, correr no bairro, entre outros. Cuidado para não se lesionar. Já que você não tem um professor para te ajudar com os movimentos corretos, a dica é procurar vídeos online que expliquem cada atividade e o movimento ideal para fazer, como o bróder do Saúde na Rotina. Em contrapartida, se você sofre de problemas em áreas específicas (joelhos, costas, pescoço, ombro), a melhor coisa é procurar um profissional da saúde para fazer a indicação correta das atividades que você pode fazer. Em princípio, o mais importante do que utilizar maior quantidade de peso para a atividade, é fazer o movimento correto. Priorize a segunda escolha, faça o exercício com movimentos devagar e seus músculos aproveitarão melhor o exercício.',
    link: 'https://manualdohomemmoderno.com.br/fitness/10-exercicios-fisicos-que-voce-pode-fazer-em-casa',
    location: '',
    author: 'LEONARDO FILOMENO',
    date: moment('2020-11-21').fromNow(),
    cover:
      'https://s2.glbimg.com/gikxPUpSoa_UlKuTjxkwhLnDDjA=/e.glbimg.com/og/ed/f/original/2018/04/10/exercicios-fisicos-casa.jpg',
  },
  {
    title: 'Aceitação do corpo melhora os hábitos alimentares',
    text: 'Resumo da notícia: '+
    'O movimento body positive incentiva a descoberta dos aspectos positivos do corpo.'+
    ' A abordagem destaca o autoconhecimento e a liberdade para escolher como se alimentar.'+
    ' Não incentiva a busca por um corpo "ideal" nem dietas restritivas.'+
    ' O autocuidado, o respeito pelo corpo e o amor-próprio estimulam escolhas alimentares mais saudáveis.'+
    ' Nutricionistas comportamentais podem contribuir para melhorar a relação com a aparência e os hábitos alimentares.',
    link: 'https://www.uol.com.br/vivabem/noticias/redacao/2020/11/12/body-positive-a-aceitacao-do-corpo-melhora-os-habitos-alimentares.htm',
    location: 'Mumbai, India',
    author: 'Samantha Cerquetani',
    date: moment('2020-11-12').fromNow(),
    cover:
      'https://conteudo.imguol.com.br/c/entretenimento/d0/2017/09/28/decisoes--doce-1506608103666_v2_450x600.jpg',
  },
  {
    title: '8 exercícios para fazer em casa na quarentena',
    text:'Como fazer Execute os exercícios abaixo em circuito: realize um movimento por 30 segundos e passe imediatamente para o próximo. Ao terminar o último, descanse por 30 segundos a 1 minuto. Isso é 1 volta no circuito'+ 
    'Polichinelo completo.'+
    'Agachamento com deslocamento lateral.'+
    'Prancha com toque nas pernas.'+
    'Salto com afundo.'+
    'Abdominal grupado.'+
    'Flexão de braços com peito no chão.'+
    'Salto patinador.'+
    'Burpee.',
    link: 'https://www.uol.com.br/vivabem/noticias/redacao/2020/03/23/exercicios-para-fazer-em-casa-treino-para-queimar-calorias-na-quarentena.htm',
    author: 'VivaBem',
    date: moment('2020-03-23').fromNow(),
    cover:
      'https://exame.com/wp-content/uploads/2020/03/gettyimages-1206266266.jpg?quality=70&strip=info',
  },
  {
    title: 'Dieta da proteína emagrece? O que pode comer, benefícios e cardápio',
    text: 'Agora eu fiquei doce, doce, doce, doce Agora eu fiquei do-do-do-do-doce, doce [2x] Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Quando eu passava por você na minha Cg Você nem me olhava Fazia de tudo pra me ver, pra me perceber Mas nem me olhava Aí veio a herança do meu véio, Resolveu os meus problemas, minha situação E do dia pra noite fiquei rico Tô na grife, tô bonito Tô andando igual patrão Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Agora você vem, né? E agora você ',
    link: 'https://globoesporte.globo.com/eu-atleta/nutricao/noticia/dieta-da-proteina-emagrece-o-que-pode-comer-beneficios-e-cardapio.ghtml',
    author: 'João Almeida',
    date: moment('2020-11-25').fromNow(),
    cover:
      'https://blog.gsuplementos.com.br/wp-content/uploads/2017/02/iStock-505592886.jpg',
  },

];



const DATA_exer = [
  {
    title: 'Dicas para manter a forma dentro de casa',
    text: 'Antes de recorrer a atividade física em sua casa, confira algumas dicas para otimizar seus exercícios: Uma avaliação física é fundamental. Antes de tudo, faça um aquecimento para que o sangue circule e evite lesões. Com até 10 minutos de exercício aeróbico já é o suficiente. Você pode pular corda, fazer polichinelos, correr no bairro, entre outros. Cuidado para não se lesionar. Já que você não tem um professor para te ajudar com os movimentos corretos, a dica é procurar vídeos online que expliquem cada atividade e o movimento ideal para fazer, como o bróder do Saúde na Rotina. Em contrapartida, se você sofre de problemas em áreas específicas (joelhos, costas, pescoço, ombro), a melhor coisa é procurar um profissional da saúde para fazer a indicação correta das atividades que você pode fazer. Em princípio, o mais importante do que utilizar maior quantidade de peso para a atividade, é fazer o movimento correto. Priorize a segunda escolha, faça o exercício com movimentos devagar e seus músculos aproveitarão melhor o exercício.',
    link: 'https://manualdohomemmoderno.com.br/fitness/10-exercicios-fisicos-que-voce-pode-fazer-em-casa',
    location: '',
    author: 'LEONARDO FILOMENO',
    date: moment('2020-11-21').fromNow(),
    cover:
      'https://s2.glbimg.com/gikxPUpSoa_UlKuTjxkwhLnDDjA=/e.glbimg.com/og/ed/f/original/2018/04/10/exercicios-fisicos-casa.jpg',
  },
  {
    title: '8 exercícios para fazer em casa na quarentena',
    text:'Como fazer Execute os exercícios abaixo em circuito: realize um movimento por 30 segundos e passe imediatamente para o próximo. Ao terminar o último, descanse por 30 segundos a 1 minuto. Isso é 1 volta no circuito'+ 
    'Polichinelo completo.'+
    'Agachamento com deslocamento lateral.'+
    'Prancha com toque nas pernas.'+
    'Salto com afundo.'+
    'Abdominal grupado.'+
    'Flexão de braços com peito no chão.'+
    'Salto patinador.'+
    'Burpee.',
    link: 'https://www.uol.com.br/vivabem/noticias/redacao/2020/03/23/exercicios-para-fazer-em-casa-treino-para-queimar-calorias-na-quarentena.htm',
    author: 'VivaBem',
    date: moment('2020-03-23').fromNow(),
    cover:
      'https://exame.com/wp-content/uploads/2020/03/gettyimages-1206266266.jpg?quality=70&strip=info',
  },
];


const DATA_nutri = [
  {
    title: 'Aceitação do corpo melhora os hábitos alimentares',
    text: 'Resumo da notícia: '+
    'O movimento body positive incentiva a descoberta dos aspectos positivos do corpo.'+
    ' A abordagem destaca o autoconhecimento e a liberdade para escolher como se alimentar.'+
    ' Não incentiva a busca por um corpo "ideal" nem dietas restritivas.'+
    ' O autocuidado, o respeito pelo corpo e o amor-próprio estimulam escolhas alimentares mais saudáveis.'+
    ' Nutricionistas comportamentais podem contribuir para melhorar a relação com a aparência e os hábitos alimentares.',
    link: 'https://www.uol.com.br/vivabem/noticias/redacao/2020/11/12/body-positive-a-aceitacao-do-corpo-melhora-os-habitos-alimentares.htm',
    location: 'Mumbai, India',
    author: 'Samantha Cerquetani',
    date: moment('2020-11-12').fromNow(),
    cover:
      'https://conteudo.imguol.com.br/c/entretenimento/d0/2017/09/28/decisoes--doce-1506608103666_v2_450x600.jpg',
  },
  {
    title: 'Dieta da proteína emagrece? O que pode comer, benefícios e cardápio',
    text: 'Agora eu fiquei doce, doce, doce, doce Agora eu fiquei do-do-do-do-doce, doce [2x] Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Quando eu passava por você na minha Cg Você nem me olhava Fazia de tudo pra me ver, pra me perceber Mas nem me olhava Aí veio a herança do meu véio, Resolveu os meus problemas, minha situação E do dia pra noite fiquei rico Tô na grife, tô bonito Tô andando igual patrão Agora eu fiquei doce igual caramelo Tô tirando onda de camaro amarelo Agora você diz:   Vem cá que eu te quero!   Quando eu passo no camaro amarelo Agora você vem, né? E agora você ',
    link: 'https://globoesporte.globo.com/eu-atleta/nutricao/noticia/dieta-da-proteina-emagrece-o-que-pode-comer-beneficios-e-cardapio.ghtml',
    author: 'João Almeida',
    date: moment('2020-11-25').fromNow(),
    cover:
      'https://blog.gsuplementos.com.br/wp-content/uploads/2017/02/iStock-505592886.jpg',
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
          data={DATA}
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
          data={DATA_nutri}
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
          data={DATA_exer}
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