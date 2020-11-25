import React, { useRef, forwardRef } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Linking, Image, Dimensions} from 'react-native';
import { Modalize } from 'react-native-modalize';
//import faker from 'faker';

import { useCombinedRefs } from '../utils/use-combined-refs';
import { WebView } from 'react-native-webview';

const { height } = Dimensions.get('window');

export const SimpleContent = forwardRef((_, ref) => {
  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const webViewRef = useRef(null);
  
  const Bold = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

  
  
  const renderContent = () => [
    <View style={s.content__header} key="0">
      <View style={{flexDirection:'row', width:'100%'}}>
        <Text style={[s.content__heading, {fontWeight:'bold'}]}>{_.items.title}</Text>
        
      </View>

      <Text style={s.content__subheading}><Bold>{_.items.date}</Bold></Text>
      <Text style={s.content__heading}>Por: <Bold>{_.items.author}</Bold></Text>
    </View>,

    <View style={s.content__inside} key="1">
        <Image source={{ uri: _.items.cover }} style={{width: '100%',height: 220,borderRadius: 14, marginTop:10}}/>
        <Text style={s.content__paragraph}>{_.items.text}</Text>
        <Text style={{fontSize:16, top: 30, fontFamily: 'Helvetica-Nue-Bold'}}>Acessar a matéria completa:</Text>
          
        <TouchableOpacity style={{justifyContent:'flex-end'}} onPress={()=>Linking.openURL(_.items.link)}>
            <Text style={{fontSize:16, top: 30, color:'#86a0d1', textDecorationLine: 'underline'}}>
            {
                //modalData.link
            }
            clique aqui
            </Text>
        </TouchableOpacity>

      <ScrollView style={s.content__scrollview} horizontal>
       
      </ScrollView>

      {/* <Text style={s.content__paragraph}>{faker.lorem.paragraphs(5)}</Text> */}

    </View>,
  ];

  return (
    <Modalize
      ref={combinedRef}
      snapPoint={300}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        stickyHeaderIndices: [0],
      }}
    >
      {renderContent()}
    </Modalize>
  );
});

const s = StyleSheet.create({
  content__header: {
    padding: 15,
    paddingBottom: 0,

    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  content__heading: {
    marginBottom: 2,

    fontSize: 22,
    //fontWeight: 'bold',
    color: '#333',
  },

  content__subheading: {
    marginBottom: 20,

    fontSize: 16,
    color: '#ccc',
  },

  content__inside: {
    padding: 15,
  },

  content__paragraph: {
    fontSize: 15,
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },

  content__scrollview: {
    marginVertical: 20,
  },

  content__block: {
    width: 200,
    height: 80,

    marginRight: 20,

    backgroundColor: '#ccc',
  },

  content__input: {
    paddingVertical: 15,
    marginBottom: 10,

    width: '100%',

    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#cdcdcd',
    borderRadius: 6,
  },
});
