import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCrosshairs,
  faAngleRight,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import {Image} from 'react-native-elements';
import {VehicleInfo} from '../constant/vehicleInfo';
import VehicleItemList from '../../components/OfferRideComponents/VehicleItemList';

const BrandScreen = ({navigation, vehicleType}: any) => {
  const data = VehicleInfo.find(item => item.type === vehicleType)?.data || [];

  return (
    <View style={{marginTop: 80}}>
      <VehicleItemList data={data} type={vehicleType} />
    </View>
  );
};

const styles = StyleSheet.create({
  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginVertical: 20,
  },
  selectLocation: {
    flexDirection: 'row',
  },
  locationText: {
    fontSize: 18,
    fontWeight: '700',
    paddingLeft: 15,
  },
  separetor: {
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderColor: 'grey',
  },
});

export default BrandScreen;
