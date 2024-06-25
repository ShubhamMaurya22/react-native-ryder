import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {auth} from '../../firebase';
import Snackbar from 'react-native-snackbar';

const logout = () => {
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
  return (
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        width: 100,
        marginHorizontal: 150,
      }}>
      <TouchableOpacity onPress={handleLogout}>
        <Text
          style={{
            backgroundColor: '#FFCB00',
            padding: 15,
            textAlign: 'center',
            color: 'black',
            fontWeight: 'bold',
          }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default logout;

const styles = StyleSheet.create({});
