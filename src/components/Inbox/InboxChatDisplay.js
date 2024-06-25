import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight, faLocationDot} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import { isAsyncThunkAction } from '@reduxjs/toolkit';

const InboxChatDisplay =   ({navigation}) => {
  const [user, setUser] = useState([])
  const [currUserId, setCurrUserId] = useState("")
  let id = ''
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    id = await AsyncStorage.getItem('id')
    setCurrUserId(id)
    let tempData = [];
    const email = await AsyncStorage.getItem('email')
    firestore().collection('users').where('userEmail', '!=', email).get()
    .then((res) => {
      if(res.docs != []){
        res.docs.map((item) => {
          tempData.push(item.data())
        })
      }
      setUser(tempData)
      // console.log(user)
    }).catch((err) => {
      console.log('error ahe ',err)
    })
  
    
  };
      
  return (
    <>
    <FlatList 
      data={user}
      renderItem={({item}, index) => {
        return(
        
          <View>
            <TouchableOpacity
          style={styles.userInbox}
          onPress={() => navigation.navigate('ChatScreen', {data: item, id: currUserId})}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../../assets/user.png')}
              style={styles.userImage}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.userName.toUpperCase()}</Text>
              {/* <Text style={styles.userMsg}>Hello mitra </Text> */}
            </View>
          </View>
          <Text style={styles.userCountMsg}>1</Text>
        </TouchableOpacity>
        <View style={styles.separetor} />
          </View>
         )
      }}
    /> 
     

      {/*  */}
    </>
  );
};

const styles = StyleSheet.create({
  userInbox: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 50,
    height: 50,
  },
  userDetails: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3c3c3c',
  },
  userMsg: {
    color: 'grey',
  },
  userCountMsg: {
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: '#2eb17f',
    borderRadius: 40,
    width: 20,
    textAlign: 'center',
  },
  separetor: {
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderColor: 'grey',
  },
  //
});

export default InboxChatDisplay;
