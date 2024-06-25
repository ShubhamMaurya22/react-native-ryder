import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCrosshairs,
  faAngleRight,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

import SelectVehicleType from './SelectVehicleType';
import Header from './Header';
import {VehicleInfo} from '../../src/constant/vehicleInfo';

const ModalDetails = ({navigation, route}) => {
  const {BrandName, Data, Type} = route.params;
  console.log(BrandName);
  // const result = Data.find((item, index) => console.log('abc',item.data[index].name));
  // console.log('zyx', Data)
  return (
    <View>
      <Header navigation={navigation} />
      <SelectVehicleType />
      <View>
        <View style={{marginTop: 80}}>
          <FlatList
            data={Data}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <>
                <TouchableOpacity
                  style={styles.currentLocationContainer}
                  onPress={() =>
                    navigation.navigate('SelectedVehicleDetails', {
                      modelName: item,
                      brandName: BrandName,
                      type: Type,
                    })
                  }>
                  <View style={styles.selectLocation}>
                    <Text style={styles.locationText}>
                      {item.toUpperCase()}
                    </Text>
                  </View>
                  <FontAwesomeIcon icon={faAngleRight} size={22} color="grey" />
                </TouchableOpacity>
                <View style={styles.separetor} />
              </>
            )}
          />
        </View>
      </View>
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
    color: 'grey',
  },
  separetor: {
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderColor: 'grey',
  },
});

export default ModalDetails;
