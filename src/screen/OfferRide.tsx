import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCar, faPersonBiking} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/OfferRideComponents/Header';
import ModalDetails from '../components/OfferRideComponents/ModalDetails';
import BrandScreen from './BrandScreen';
import SelectVehicleType from '../components/OfferRideComponents/SelectVehicleType';
import {UseSelector, useSelector} from 'react-redux';
import OfferRideSearchLocation from './OfferRideSearchLocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const OfferRide = ({route, navigation}: any) => {
  const {vehicleType} = route.params || {vehicleType: 'Car'};
  const [selectVehicle, setSelectVehicle] = useState(0);
  const [modalName, setModalName] = useState(null);

  // const vehicle = useSelector(state => state.vehicleDetails)
  // console.log('details',vehicle.isVehiclePublished)

  // async function getVehicle (){
  //   const registerNum = await AsyncStorage.getItem('registerNumber')
  //   setModalName(registerNum)
  // }
  // getVehicle();
  console.log(modalName, 'modalname');

  const fetchVehicleName = async () => {
    const userID = await AsyncStorage.getItem('id');
    if (userID) {
      try {
        const userDoc = await firestore().collection('users').doc(userID).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData && userData.vehicleData) {
            const {type, brandName, modelName, registerNumber} =
              userData.vehicleData;
            console.log('Vehicle Data:');
            console.log('Type:', type);
            console.log('Brand Name:', brandName);
            console.log('Model Name:', modelName);
            console.log('Register Number:', registerNumber);
            setModalName(modelName);
          } else {
            console.log('No vehicle data found for the user');
          }
        } else {
          console.log('User document not found');
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    } else {
      console.error('User ID not found in AsyncStorage');
    }
  };

  fetchVehicleName();

  return (
    <>
      {modalName ? (
        <OfferRideSearchLocation navigation={navigation} />
      ) : (
        <SafeAreaView>
          <Header navigation={navigation} />

          <SelectVehicleType />
          <BrandScreen navigation={navigation} vehicleType={vehicleType} />
        </SafeAreaView>
      )}
    </>
  );
};

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

export default OfferRide;

{
  /* <View style={{flex: 1, alignItems: 'center'}}>
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
            onPress={() => setSelectVehicle(1)}>
            <FontAwesomeIcon icon={faPersonBiking} color="green" size={20} />
            <Text style={styles.selectText}>Bike</Text>
          </TouchableOpacity>
        </View>
      </View> */
}
