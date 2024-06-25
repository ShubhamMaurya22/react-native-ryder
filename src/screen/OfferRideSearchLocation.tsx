import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/FindRideComponents/Header';
import InputComponentOfferRide from '../../components/OfferRideComponents/InputComponentOfferRide';
import {useSelector} from 'react-redux';
import OfferRide from './OfferRide';
import OfferRoute from '../../components/OfferRideComponents/OfferRoute';

const OfferRideSearchLocation = ({navigation, routePublish}: any) => {
  const vehicle = useSelector((state: any) => state.vehicleDetails);
  const [showCarPublished, setShowCarPublished] = useState(false);
  console.log(vehicle.isVehiclePublished);

  useEffect(() => {
    if (vehicle.isVehiclePublished) {
      setShowCarPublished(true);
      setTimeout(() => {
        setShowCarPublished(false);
      }, 2000);
    }
  }, [vehicle.isVehiclePublished]);

  return (
    <SafeAreaView>
      <Header navigation={navigation} />
      <InputComponentOfferRide navigation={navigation} isPosting={true} />
      {/* <SchedulePools /> */}
      {showCarPublished && (
        <View style={styles.publishedContainer}>
          <Text style={styles.publishText}>Car Published!</Text>
        </View>
      )}
      <OfferRoute navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  publishedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 20,
    marginTop: 100,
    marginHorizontal: 50,
    borderRadius: 14,
    backgroundColor: '#f0f8ff',
  },
  publishText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2eb17f',
  },
});
export default OfferRideSearchLocation;
