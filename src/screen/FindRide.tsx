import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import InputComponent from '../components/FindRideComponents/InputComponent';
import Header from '../components/FindRideComponents/Header';
import SchedulePools from '../components/FindRideComponents/SchedulePools';
import BenefitIndicater from './BenefitIndicater';
import RideSelected from '../components/FindRideComponents/RideSelected';

const FindRide = ({navigation}: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      {/* <BenefitIndicater /> */}
      <View style={styles.centerContainer}>
        <InputComponent navigation={navigation} isPosting={undefined} />
      </View>
      {/* <SchedulePools /> */}
      <RideSelected navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default FindRide;
