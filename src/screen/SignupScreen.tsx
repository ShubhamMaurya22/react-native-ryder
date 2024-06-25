import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SelectDropdown from 'react-native-select-dropdown';
import {Formik} from 'formik';
import {object, string} from 'yup';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {app, auth, db} from '../../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
// import { collection, addDoc, doc , setDoc, Firestore } from 'firebase/firestore';
// import { firebase } from '@react-native-firebase/auth'
// import { getFirestore } from 'firebase/firestore';
import Snackbar from 'react-native-snackbar'


const Signup = ({navigation}: any) => {
  // yup is used
  let LoginUserSchema = object({
    email: string().email().required('An Email is required'),
    password: string()
      .required()
      .min(6)
      .max(16, 'large')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]/,
        'Password must contain at least one letter, one number, and one special character (@#$!%*?&)',
      ),
    name: string().required('Enter Name'),
    phoneNumber: string().required('Phone Number is required'),
    upiId: string().required('UPI ID is required'),
  });

  const handleSignup = async (
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    upiId: string,
  ) => {
    try {
            const response = await createUserWithEmailAndPassword(auth,email, password)
      //       const userUID = response.user.uid;
      //       console.log(userUID);

      //       const userData = {
      //         userEmail : email,
      //         userPass : password,
      //         userName : name,
      //         userId: userUID
      //       };
      //           const userRef = doc( db,'users', userUID);
      //           await setDoc(userRef, userData)
      //           // const usersCollection  = collection(db, 'users')
      //           // await addDoc(usersCollection, {
      //           //   name,
      //           //   email,
      //           //   password,
      //           //   uid: userUID, // Store the user's UID in Firestore for future reference
      //           // });

      const userID = uuid.v4();
      firestore().collection('users').doc(String(userID)).set({
                userEmail : email,
                userPass : password,
                userName : name,
                userId: userID,
                phoneNumber: phoneNumber,
                upiId: upiId,
                isVehiclePublished: false,
                rideTaken: [],
      }).then(() => {
        Snackbar.show({
          text: 'Signup successful',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'green'
        });
        gotoStorage(
          email, name, userID, phoneNumber, upiId
        )
      })
    } catch (error) {
      Snackbar.show({
        text: `Signup failed , ${error}`,
        duration: Snackbar.LENGTH_LONG, // Adjust duration as needed
        backgroundColor: 'red',
      });
      console.log(error);
    }
  };

  const gotoStorage = async (email : string, name: string, userId : any, phoneNumber: string, upiId: string) => {
      await AsyncStorage.setItem('email', email)
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('id', userId)
      await AsyncStorage.setItem('phoneNumber', phoneNumber)
      await AsyncStorage.setItem('upiID', upiId)
  }


  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
      <View style={{paddingHorizontal: 20}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/signup.jpg')}
            style={{height: 300, width: 400}}
          />
        </View>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            color: 'black',
            marginVertical: 10,
            textAlign: 'center',
          }}>
          {' '}
          Signup
        </Text>

        {/* formik start  */}
        <Formik
          initialValues={{name: '', email: '', password: '', role: '', phoneNumber: '',upiId:'' }}
          validationSchema={LoginUserSchema}
          onSubmit={value =>
            handleSignup(value.email, value.password, value.name,value.phoneNumber, value.upiId)
          }
          validateOnMount={true}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  paddingBottom: 8,
                  marginBottom: 20,
                  marginVertical: 10,
                }}>
                <Ionicons
                  name="mail"
                  size={25}
                  color="#666"
                  style={{marginRight: 5}}
                />
                <TextInput
                  placeholder="Enter Email"
                  placeholderTextColor={'black'}
                  style={{
                    flex: 1,
                    paddingVertical: 0,
                    fontSize: 16,
                    color: 'black',
                  }}
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </View>
              {touched.email && errors.email &&
                <Text style={styles.errorText}>{errors.email}</Text>
              }
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  paddingBottom: 8,
                  marginBottom: 20,
                  marginVertical: 10,
                }}>
                <AntDesign
                  name="user"
                  size={25}
                  color="#666"
                  style={{marginRight: 5}}
                />
                <TextInput
                  placeholder="Enter Name"
                  placeholderTextColor={'black'}
                  style={{
                    flex: 1,
                    paddingVertical: 0,
                    fontSize: 16,
                    color: 'black',
                  }}
                  keyboardType="email-address"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
              </View>
              {touched.name && errors.name &&
                <Text style={styles.errorText}>{errors.name}</Text>
              }
              <View style={styles.inputContainer}>
                <MaterialIcons name="phone" size={25} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="Enter Phone Number"
                  placeholderTextColor={'black'}
                  style={styles.input}
                  keyboardType="phone-pad"
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  value={values.phoneNumber}
                />
              </View>
              {touched.phoneNumber && errors.phoneNumber &&
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              }
              <View
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomColor: '#CCC',
                    borderBottomWidth: 1,
                    paddingBottom: 8,
                    marginBottom: 20,
                    marginVertical: 10,
                  },
                ]}>
                <MaterialIcons
                  name="password"
                  size={25}
                  color="#666"
                  style={{marginRight: 5}}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={'black'}
                  style={{
                    flex: 1,
                    paddingVertical: 0,
                    fontSize: 16,
                    color: 'black',
                  }}
                  secureTextEntry={true}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
              </View>
              {touched.password && errors.password &&
                <Text style={styles.errorText}>{errors.password}</Text>
              }
              <View style={styles.inputContainer}>
                <Ionicons name="wallet" size={25} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="Enter UPI ID"
                  placeholderTextColor={'black'}
                  style={styles.input}
                  onChangeText={handleChange('upiId')}
                  onBlur={handleBlur('upiId')}
                  value={values.upiId}
                />
              </View>
              {touched.upiId && errors.upiId &&
                <Text style={styles.errorText}>{errors.upiId}</Text>
              }
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  padding: 20,
                  borderRadius: 20,
                  marginBottom: 30,
                  backgroundColor: isValid ? '#FF7518' : '#FFCB00', // Change background color based on isValid
                  // marginTop: 40,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#FFF',
                  }}>
                  Signup
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 40,
                }}>
                <Text style={{fontSize: 16, color: 'black'}}>
                  {' '}
                  Already have a Account ?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text
                    style={{color: 'orange', fontWeight: '700', fontSize: 16}}>
                    {' '}
                    Login{' '}
                  </Text>
                </TouchableOpacity>
              </View>
             
            
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    color: 'black',
  },
  errorText:{
    color: 'red',
    marginTop:0,
    paddingTop: 0
  }
})
export default Signup;
