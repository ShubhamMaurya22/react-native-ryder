import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import {object, string} from 'yup';
import Snackbar from 'react-native-snackbar';
import {auth} from '../../firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Loader from './Loader';
// import { useAuth } from '../Hooks/useAuth';
// import { firebase } from '@react-native-firebase/auth';

const Login = ({navigation}: any) => {
  // const {user} = useAuth();
  const [visible, setVisible] = useState(false);

  let LoginUserSchema = object({
    email: string().email().required('An Email is required'),
    password: string()
      .required()
      .min(6)
      .max(16, 'large')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]/,
        // /^[A-Za-z]+[@][A-Za-z]+[.][A-Za-z]+$/,
        'Password must contain at least one letter, one number, and one special character (@#$!%*?&)',
      ),
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      // console.log(user?.emailVerified);
      // if(user == undefined){
      //   Snackbar.show({
      //     text: 'Email is not varified!',
      //     duration: Snackbar.LENGTH_LONG, // Adjust duration as needed
      //     backgroundColor: '#FF3E4D'
      //   });
      // }
      setVisible(true);
      firestore()
        .collection('users')
        .where('userEmail', '==', email)
        .get()
        .then((res: any) => {
          setVisible(false);
          // console.log('data yetoy',JSON.stringify(res.docs[0].data().phone));
          setUserData(
            res.docs[0].data().userEmail,
            res.docs[0].data().userName,
            res.docs[0].data().userId,
            res.docs[0].data().phoneNumber,
            res.docs[0].data().userId,
          );
          setVehicleData(
            res.docs[0].data().vehicleData.modelName,
            res.docs[0].data().vehicleData.registerNumber,
            res.docs[0].data().vehicleData.type,
          );
        });
    } catch (error) {
      setVisible(false);
      console.log(error);
      Snackbar.show({
        text: 'Login failed. Please check your email and password.',
        duration: Snackbar.LENGTH_LONG, // Adjust duration as needed
      });
    }
  };

  const setUserData = async (
    email: string,
    name: string,
    userId: any,
    phoneNumber: string,
    upiId: string,
  ) => {
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('id', userId);
    await AsyncStorage.setItem('phoneNumber', phoneNumber);
    await AsyncStorage.setItem('upiID', upiId);
    // await AsyncStorage.setItem('modelName', modelName)
    // await AsyncStorage.setItem('registerNumber', registerNumber)
    // await AsyncStorage.setItem('type', type)
  };

  const setVehicleData = async (
    modelName: string,
    registerNumber: string,
    type: string,
  ) => {
    console.log('values', modelName, type); // Add this line
    await AsyncStorage.setItem('modelName', modelName);
    await AsyncStorage.setItem('registerNumber', registerNumber);
    await AsyncStorage.setItem('type', type);
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
      <View style={{paddingHorizontal: 20}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/login.jpg')}
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
          Login{' '}
        </Text>
        {/* login form */}
        <Formik
          initialValues={{email: '', password: ''}}
          validationSchema={LoginUserSchema}
          onSubmit={value => handleLogin(value.email, value.password)}
          // onSubmit={value => console.log(value.email)}
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
                  borderBottomColor:
                    isValid || values.email.length == 0 ? '#CCC' : 'red',
                  borderBottomWidth: 1,
                  paddingBottom: 8,
                  marginBottom: 20,
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
              <View
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomColor:
                      isValid || values.password.length == 0 ? '#CCC' : 'red',
                    borderBottomWidth: 1,
                    paddingBottom: 8,
                    marginBottom: 20,
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
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text
                    style={{color: 'orange', fontWeight: '700', fontSize: 16}}>
                    Forgot ?
                  </Text>
                </TouchableOpacity>
              </View>
              {/* {values.email.length > 1  ? (
             <Text style={{backgroundColor: 'black'}}>email error</Text>
        ): ("")} */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  padding: 20,
                  borderRadius: 20,
                  marginBottom: 30,
                  backgroundColor: isValid ? '#FF7518' : '#FFCB00', // Change background color based on isValid
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#FFF',
                  }}>
                  Login
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 30,
                }}>
                <Text style={{fontSize: 16, color: 'black'}}>
                  {' '}
                  New To App ?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text
                    style={{color: 'orange', fontWeight: '700', fontSize: 16}}>
                    {' '}
                    Register{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
      {/* <Loader visible={visible}/> */}
    </SafeAreaView>
  );
};

export default Login;
