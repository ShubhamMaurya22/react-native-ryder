import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const BenefitIndicater = () => {
  const [benefitsIndex, setBenefitsIndex] = useState(0);

  useEffect(() => {
    // Set interval to display benefits every 1 second
    // const interval = setInterval(() => {
    //   setBenefitsIndex(prevIndex => (prevIndex + 1) % benefits.length);
    // }, 3300);

    
    return () => clearInterval(interval);
  }, []);

  const benefits = [
    'Save money, reduce emissions, build community: Carpool today!',
    'Share rides, save fuel, make friends: Choose carpooling!',
    'Connect, conserve, contribute: Carpooling for a better world!',
    'Save energy, cut costs, reduce traffic: Join carpooling!',
    'Green commute, happy planet: Embrace carpooling!',
    'Eco-friendly, wallet-friendly: Opt for carpooling!',
    'Reduce emissions, share rides: Carpool for a cleaner environment!',
    'Economical, environmental: Carpooling benefits all!',
    'Conserve resources, connect people: Carpooling is the way!',
    'Save, share, connect: Carpooling app for a happier commute!',
  ];

  return (
    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.container}>
          <Text style={styles.text}>{benefits[benefitsIndex]}</Text>
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 70,
    width: 300,
    backgroundColor: '#2eb17f',
    marginBottom: 20,
    borderWidth: 2,
    borderRadius: 20,
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 12,
},
shadowOpacity: 0.58,
shadowRadius: 16.00,

elevation: 24,
  },
  text:{
    textAlign: 'center',
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121'
  }
});

export default BenefitIndicater;
