import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
  } from 'react-native';
  import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCar, faPersonBiking} from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native';

const SelectVehicleType = () => {
    const [selectVehicle, setSelectVehicle] = useState(0);
    const navigation = useNavigation();
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
    <View style={styles.Container}>
      <TouchableOpacity
        style={[
          styles.selectContainer,
          {
            backgroundColor: selectVehicle === 0 ? 'white' : '#FFCE20',
            borderWidth: selectVehicle === 0 ? 1 : 0,
          },
        ]}
        onPress={() => {
          navigation.navigate('OfferRideScreen', {vehicleType: 'Car'})
          setSelectVehicle(0);
        }}>
        <FontAwesomeIcon icon={faCar} color="green" size={20} />
        <Text style={styles.selectText}>Car</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.selectContainer,
          {
            backgroundColor: selectVehicle === 1 ? 'white' : '#FFCE20',
            borderWidth: selectVehicle === 1 ? 1 : 0,
          },
        ]}
        onPress={() => {
          setSelectVehicle(1); 
          navigation.navigate('OfferRideScreen', {vehicleType: 'Bike'});
        }}>
        <FontAwesomeIcon icon={faPersonBiking} color="green" size={20} />
        <Text style={styles.selectText}>Bike</Text>
      </TouchableOpacity>
    </View>
  </View>
  )
}


const styles = StyleSheet.create({
    Container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: 300,
      height: 60,
      backgroundColor: '#FFCE20',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'grey',
    },
    selectContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingVertical: 10,
      borderRadius: 10,
      borderColor: 'grey',
    },
    selectText: {
      marginLeft: 8,
      fontWeight: 'bold',
      fontSize: 16,
      color: 'black',
    },
  });

export default SelectVehicleType

