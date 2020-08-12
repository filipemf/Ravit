import React, { useState } from 'react'
import { Animated, View, StatusBar, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'

import LottieView from 'lottie-react-native';

const data = [
  {
    type: 'Comidas',
    heading: 'Compartilhe suas invenções na cozinha!',
    description: 'Você pode tanto postar a foto e a receita de um prato que você fizer, como compartilhar alguma dica ou boa ideia que você teve!',
    key: 'first',
    color: '#9dcdfa',
    lottieAnimation: require('../../assets/Animations/animation-postRecipe.json')
  },
  {
    type: 'Metas',
    heading: 'Construa novos hábitos',
    description: 'A chave para superar maus habitos é a superação. Por isso, nós te ajudaremos a manter o registro das suas metas.',
    key: 'second',
    color: '#db9efa',
    lottieAnimation: require('../../assets/Animations/animation-goal.json')
  },
  {
    type: 'Social',
    heading: 'Interação',
    description:
      'Com as pessoas que a gente ama tudo fica melhor. Por isso, compartilhe seus avanços, descobertas e criações para que seus amigos vejam!',
    key: 'third',
    color: '#999',
    lottieAnimation: require('../../assets/Animations/6192-mobile-chat.json')
  },
  {
    type: 'Conectar-se',
    heading: '',
    description:
      '',
    key: 'fourth',
    color: '#a1e3a1',
    lottieAnimation: require('../../assets/Animations/4659-avocad-bros.json')
  },
];

const { width, height } = Dimensions.get('window');
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 40;
const DOT_SIZE = 40;
const TICKER_HEIGHT = 40;

const Circle = ({ scrollX }) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
      {data.map(({ color }, index) => {
        const inputRange = [
          (index - 0.55) * width,
          index * width,
          (index + 0.55) * width,
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0, 1, 0],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0, 0.2, 0],
        });
        return (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              {
                backgroundColor: color,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const Ticker = ({ scrollX }) => {
  const inputRange = [-width, 0, width];
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [TICKER_HEIGHT, 0, -TICKER_HEIGHT],
  });
  return (
    <View style={styles.tickerContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {data.map(({ type }, index) => {
          return (
            <Text key={index} style={styles.tickerText}>
              {type}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};

const Item = ({ heading, description, index, scrollX, lottieAnimation, type, navigation }) => {

  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const inputRangeOpacity = [
    (index - 0.3) * width,
    index * width,
    (index + 0.3) * width,
  ];

  const translateXHeading = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.1, 0, -width * 0.1],
  });

  const translateXDescription = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.7, 0, -width * 0.7],
  });

  const opacity = scrollX.interpolate({
    inputRange: inputRangeOpacity,
    outputRange: [0, 1, 0],
  });

  return (
    <View style={styles.itemStyle}>
      <LottieView
        style={[
          styles.imageComidas,
          { justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 50, bottom: 20 }
        ]}
        speed={1}
        autoPlay
        source={lottieAnimation}
      />
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.heading,
            {
              opacity,
              transform: [{ translateX: translateXHeading }],
            },
          ]}
        >
          {heading}
        </Animated.Text>

        {type != "Conectar-se" ?
          <Animated.Text
            style={[
              styles.description,
              {
                fontFamily: 'Helvetica-Nue',
                opacity,
                transform: [
                  {
                    translateX: translateXDescription,
                  },
                ],
              },
            ]}
          >
            {description}
          </Animated.Text>
          :
          <View style={{ alignItems: 'center', alignSelf: 'center', alignContent: 'center' }}>

            <Text style={{ fontFamily: 'Helvetica-Nue-Condensed', fontSize: 22, top: 70 }}>Clique no botão abaixo para começar</Text>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#d62048', width: 100, height: 35, top: 60 }]} onPress={() => navigation.navigate("AuthScreens")}>
              <Text style={{ color: '#fff', fontWeight: '500', fontFamily: 'Helvetica-Nue-Bold' }}>Entrar</Text>
            </TouchableOpacity>

          </View>
        }
      </View>
    </View>
  );
};

const Pagination = ({ scrollX }) => {
  const inputRange = [-width, 0, width];
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-DOT_SIZE, 0, DOT_SIZE],
  });
  return (
    <View style={[styles.pagination]}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          {
            position: 'absolute',
            transform: [{ translateX }],
          },
        ]}
      />
      {data.map((item) => {

        return (
          <View key={item.key} style={styles.paginationDotContainer}>
            <View
              style={[styles.paginationDot, { backgroundColor: item.color }]}
            />
          </View>
        );
      })}
    </View>
  );
};

export default function App({ navigation }) {
  const [bgColor, setBgColor] = useState("#fff");

  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={[styles.container]}>
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
      <Circle scrollX={scrollX} />
      <Animated.FlatList
        keyExtractor={(item) => item.key}
        data={data}
        renderItem={({ item, index }) => (
          <>
            <Item {...item} index={index} navigation={navigation} scrollX={scrollX} />
          </>
        )}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />

      <Pagination scrollX={scrollX} />
      <Ticker setBgColor={setBgColor} scrollX={scrollX} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  itemStyle: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: width * 0.75,
    height: width * 0.75,
  },
  imageComidas: {
    width: 150,
    height: 150,
    top: -5

  },
  imageMetas: {
    width: 100,
    height: 100,
    left: 80,
    right: 50,
    bottom: 10
  },
  imageSocial: {
    width: 240,
    height: 240,
    left: 5,
    right: 50,
    bottom: 50
  },
  imageConnect: {
    width: 170,
    height: 170,
    left: 30,
    right: 20,
    bottom: 10,
    left: -10
  },
  textContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    flex: 0.8,
    width: width
  },
  heading: {

    color: '#404040',
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 'bold',
    top: 110,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20
  },
  description: {
    color: '#424242',
    fontWeight: '600',
    textAlign: 'left',
    width: width * 0.75,

    fontSize: 18,
    lineHeight: 16 * 1.5,
    top: 130,
    marginLeft: 20,
    marginRight: 20
  },
  logo: {
    opacity: 0.9,
    height: LOGO_HEIGHT,
    width: LOGO_WIDTH,
    resizeMode: 'contain',
    position: 'absolute',
    left: 10,
    bottom: 10,
    transform: [
      { translateX: -LOGO_WIDTH / 2 },
      { translateY: -LOGO_HEIGHT / 2 },
      { rotateZ: '-90deg' },
      { translateX: LOGO_WIDTH / 2 },
      { translateY: LOGO_HEIGHT / 2 },
    ],
  },
  pagination: {
    position: 'absolute',
    right: 100,
    bottom: 50,
    flexDirection: 'row',
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  tickerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    overflow: 'hidden',
    height: TICKER_HEIGHT,
  },
  tickerText: {
    fontSize: TICKER_HEIGHT,
    lineHeight: TICKER_HEIGHT,
    fontFamily: 'Helvetica-Nue-Condensed'
  },

  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: '100%',
    height: '100%',
    bottom: 400,
    position: 'absolute',
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50
  },
  button: {
    margin: 35,
    backgroundColor: 'coral',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
