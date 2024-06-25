import {StyleSheet, Text, View, Animated} from 'react-native';
import React, {useEffect} from 'react';
import imagePath from '../constant/imagePath';
import {Image} from 'react-native-elements';
import ApppStack from '../routes/AppStack';

const Splash = () => {
  useEffect(() => {
    const fadeIn = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {});
    };

    const fadeAnim = new Animated.Value(0);
    fadeIn();
  }, []);

  const checkLogin = () => {};
  return (
    <View style={[styles.splashContainer]}>
      <Image source={require('../assets/Blue-PNG.png')} style={styles.image} />
      <View style={{flex: 1}}></View>
      <Text style={styles.subText}>from</Text>
      <Text style={styles.text}>RMCET</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    // backgroundColor: '#0C090A',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  image: {
    marginTop: 100,
    // marginHorizontal: 20,
    width: 350,
    height: 400,
  },
  subText: {
    color: '#212121',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Splash;
