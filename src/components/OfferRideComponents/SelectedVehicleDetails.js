import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectVehicleType from './SelectVehicleType';
import Header from './Header';
import {Image} from 'react-native-elements';
import imagePath from '../../src/constant/imagePath';
import firestore from '@react-native-firebase/firestore';

//toolkit
import {useDispatch} from 'react-redux';
import {addVehicle} from '../../src/features/carPublishInfoSlice';

const SelectedVehicleDetails = ({route, navigation}) => {
  const {modelName, brandName, type} = route.params;
  const [registerNumber, setRegisterNumber] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // console.log('brand: ', brandName, modelName, type)
  //selected the specific image
  const vehicleImage = imagePath[modelName.toLowerCase()];

  const dispatch = useDispatch();

  const authenticateLicense = async () => {
    const regex = /^[A-Z]{2}\s\d{2}\s[A-Z\d]+\s\d{1,4}$/;
    if (registerNumber === '') {
      Toast.show({
        type: 'error',
        text1: 'Alert',
        text2: 'Enter the Register Vehicle Number',
      });
    }

    if (regex.test(registerNumber.toUpperCase())) {
      setIsAuthenticated(true);
      console.log(type, brandName, modelName, registerNumber);
      dispatch(addVehicle({type, brandName, modelName, registerNumber}));

      setVehicleData(type, brandName, modelName, registerNumber);
      navigation.navigate('OfferRideSearchLocation');

      //adding  vehicle in database
      const userID = await AsyncStorage.getItem('id');
      if (userID) {
        try {
          await firestore().collection('users').doc(userID).update({
            vehicleData: {
              type,
              brandName,
              modelName,
              registerNumber,
            },
          });
          console.log('Vehicle data added to user document successfully');
        } catch (error) {
          console.error('Error adding vehicle data to user document:', error);
        }
      } else {
        console.error('User ID not found in AsyncStorage');
      }
    } else {
      setIsAuthenticated(false);
      Toast.show({
        type: 'error',
        text1: 'Alert',
        text2: 'Enter the Valid Register Vehicle Number',
      });
    }
  };

  async function setVehicleData(type, brandName, modelName, registerNumber) {
    await AsyncStorage.setItem('type', type);
    await AsyncStorage.setItem('brandName', brandName);
    await AsyncStorage.setItem('modelName', modelName);
    await AsyncStorage.setItem('registerNumber', registerNumber);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header navigation={navigation} />
        <SelectVehicleType />
        <View style={styles.mainContainer}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image source={vehicleImage} style={styles.carImage} />
          </View>
          <Text style={styles.licenseText}>What's your license number?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="MH 08 AB 1234"
            placeholderTextColor={'grey'}
            autoCapitalize="characters"
            value={registerNumber}
            onChangeText={text => setRegisterNumber(text)}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={authenticateLicense}>
            <Text style={styles.btnText}>ADD YOUR VEHICLE</Text>
            <FontAwesomeIcon icon={faAngleRight} color="#3c3c3c" size={20} />
          </TouchableOpacity>
        </View>
        <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: 340,
    height: 250,
    resizeMode: 'contain',
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  licenseText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 20,
    marginLeft: 30,
  },
  textInput: {
    marginTop: 10,
    backgroundColor: '#a1a1a1',
    width: 320,
    fontWeight: 'bold',
    paddingLeft: 16,
    borderWidth: 2,
    borderColor: '#212121',
    color: 'black',
  },
  submitBtn: {
    backgroundColor: '#FFCE20',
    width: 320,
    padding: 6,
    borderBottomEndRadius: 14,
    borderBottomLeftRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    borderWidth: 2,
  },
  btnText: {
    paddingLeft: 20,
    color: 'black',
    fontWeight: '500',
  },
});

export default SelectedVehicleDetails;
