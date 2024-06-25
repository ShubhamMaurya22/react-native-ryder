import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCrosshairs,
  faAngleRight,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import {Image} from 'react-native-elements';
import {VehicleInfo} from '../new/constant/vehicleInfo';
import {useNavigation} from '@react-navigation/native';

const VehicleItemList = ({data, type}) => {
  const navigation = useNavigation();
  // console.log(data)
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={item => item.name}
        renderItem={({item}) => (
          <>
            <TouchableOpacity
              style={styles.currentLocationContainer}
              onPress={() =>
                navigation.navigate('ModalDetails', {
                  BrandName: item.name,
                  Data: item.models,
                  Type: type
                })
              }>
              <View style={styles.selectLocation}>
                <Image source={item.image} style={{width: 20, height: 20}} />
                <Text style={styles.locationText}>{item.name}</Text>
                
              </View>
              {/* Additional logic to handle models */}
              {/* {item.models && (
              <View style={styles.modelsContainer}>
              {item.models.map((model, index) => (
                  <Text key={index} style={styles.modelText}>
                  {model}
                  </Text>
                  ))}
                  </View>
          )} */}
            </TouchableOpacity>
            <View style={styles.separetor} />
          </>
        )}
      />
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
    color: 'grey'
  },
  separetor: {
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderColor: 'grey',
  },
});

export default VehicleItemList;
