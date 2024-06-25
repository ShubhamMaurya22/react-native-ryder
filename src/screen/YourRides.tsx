import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';

import {auth} from '../../firebase';
import Snackbar from 'react-native-snackbar';
import imagePath from '../constant/imagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FinalMapScreen from './FinalMapScreen';

const YourRides = ({navigation}: any) => {
  const [name, setName] = useState<String | null>('');
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log('User signed out');
        Snackbar.show({
          text: 'Log Out Successful.',
          duration: Snackbar.LENGTH_LONG, // Adjust duration as needed
        });
      })
      .catch(error => {
        console.error('Error signing out:', error);
      });
  };

  const handleUserName = async () => {
    const name = await AsyncStorage.getItem('name');
    setName(name);
  };
  handleUserName();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={imagePath.driverImage} style={styles.image} />
      <Text style={styles.name}>{name?.toUpperCase()}</Text>
      {/* <TouchableOpacity style={styles.editVehicle} onPress={() => navigation.navigate('Brand')}>
        <Text style={styles.editVehicleText}>Edit Vehicle</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={styles.editVehicle}>
        <Text style={styles.editVehicleText}>Your Ride</Text>
      </TouchableOpacity> */}
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
          width: 100,
          marginHorizontal: 150,
          marginTop: 200,
        }}>
        <TouchableOpacity onPress={handleLogout}>
          <Text
            style={{
              backgroundColor: '#E5554E',
              padding: 15,
              textAlign: 'center',
              color: 'black',
              fontWeight: 'bold',
            }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    // <FinalMapScreen />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    marginTop: 40,
  },
  name: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  editVehicle: {
    backgroundColor: '#FFCB00',
    width: 300,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  editVehicleText: {
    fontSize: 22,
    fontWeight: '500',
    color: 'black',
  },
});

export default YourRides;
