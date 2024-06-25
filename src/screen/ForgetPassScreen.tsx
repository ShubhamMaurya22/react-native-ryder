import { SafeAreaView, Text, View ,TextInput,Image, TouchableOpacity} from 'react-native'
import React from 'react';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Formik } from 'formik';
import { object, string, } from 'yup';
import Snackbar from 'react-native-snackbar';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from 'firebase/auth';
import {auth} from '../../firebase'


// import LogoImage from '../assets/Logo.jpg'

const Login = ({navigation}) => {

    let LoginUserSchema = object({
        email: string().email().required('An Email is required') 
      });

    const charngePassword = async (email: string) => {
        try {
           await fetchSignInMethodsForEmail(auth ,email)
          .then(async (res) => {
            // if(res.length == 0){
            //   Snackbar.show({
            //     text: 'Email does not exits !',
            //     duration: Snackbar.LENGTH_LONG, // Adjust duration as needed
            //     backgroundColor: '#E83350'
            //   }); 
            // }else{
            //   const response = await sendPasswordResetEmail(auth , email)
            //   Snackbar.show({
            //     text: 'Password reset email sent.',
            //     duration: Snackbar.LENGTH_LONG, // Adjust duration as needed
            //     backgroundColor: 'green'
            //   }); 
            // }
            console.log(res);
            
          })
        
        } catch (error) {
          
        }
      }
  return (
   <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
    <View style={{paddingHorizontal: 20}}>
      <View style={{alignItems: 'center'}}>
        <Image
        source  ={require('../assets/forgotPassword.jpg')}
        // source  ={LogoImage}
        style={{height: 300, width: 400}}
        />
      </View>
      <Text
        style={{fontSize: 25, fontWeight: 'bold', color:'black', marginVertical: 10, textAlign: 'center'}}
      >
          Forgot Password
        </Text>
{/* login form */}
    <Formik
    initialValues={{email: ''}}
    validationSchema={LoginUserSchema}
    onSubmit={(value) => charngePassword(value.email)}
    validateOnMount={true}
    >
      {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         isValid
      }) => (
        <>
       <View style={{flexDirection: 'row',borderBottomColor: isValid ? '#ccc' : 'red', borderBottomWidth: 1,paddingBottom:8, marginBottom: 20 }}>
            <Ionicons name='mail' size={25} color='#666' style={{marginRight: 5}} />
            <TextInput 
            placeholder='Enter Email'
            placeholderTextColor={'black'}
            style={{ flex: 1, paddingVertical: 0,fontSize:16,color:'black'}}
            keyboardType='email-address'
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            />
        </View>
        <TouchableOpacity onPress={handleSubmit}
            style={{
                padding: 20,
                borderRadius: 20,
                marginBottom: 30,
                backgroundColor: isValid ? '#FF7518' : '#FFCB00', // Change background color based on isValid
              }}
        >
            <Text style={{textAlign: 'center',  fontSize: 16, fontWeight: '700',color: '#FFF'}}>Send Request</Text>
        </TouchableOpacity>
        </>
        
     )}
      </Formik>
    </View>
   </SafeAreaView>
  )
}


export default Login
