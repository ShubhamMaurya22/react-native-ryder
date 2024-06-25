import {View, Text, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

// screen
// import Home from './screens/HomeScreen';
import Login from './screen/LoginScreen';
import Signup from './screen/SignupScreen';
import ForgotPassword from './screen/ForgetPassScreen';
import GetRide from './screens/GetRide';
import PostRide from './screens/PostRide';
import Routes from './routes/Routes';
// import SplashScreen from 'react-native-splash-screen';
import MapLibreGL from '@maplibre/maplibre-react-native';

import Home from './new/Home';
// import SearchComponent from './new/components/SearchComponent';
import ApppStack from './routes/AppStack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from './store/store';
import Splash from './screen/Splash';
import ChatScreen from './screen/ChatScreen';

const Stack = createNativeStackNavigator();

MapLibreGL.setAccessToken(null);

const App = () => {
  // const ComponentDidMount = () => {
  //   SplashScreen.hide();
  // }

  return (
    // <NavigationContainer >
    //   <Stack.Navigator initialRouteName='Home'>
    //     {/* <Stack.Screen name='Login' component={Login}/> */}
    //     <Stack.Screen name='Home' component={Home}/>
    //     {/* <Stack.Screen name='Signup' component={Signup}/> */}
    //     <Stack.Screen name='ForgotPassword' component={ForgotPassword}/>
    //     <Stack.Screen  name='GetRide'  component={GetRide} options={{headerShown: false, }} />
    //     <Stack.Screen   name='PostRide' component={PostRide} options={{  headerShown: false, }} />
    //   </Stack.Navigator>
    // </NavigationContainer>

    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <Routes />
          {/* <ChatScreen navigation={undefined} /> */}
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
//   return (
//     <>
//       <View style={styles.container}>
//         <MapView
//           provider={PROVIDER_GOOGLE}
//           style={styles.map}
//           region={{
//             latitude: 16.994444,
//             longitude: 73.300003,
//             latitudeDelta: 0.015,
//             longitudeDelta: 0.0121,
//           }}>
//           <Marker
//             coordinate={{
//               latitude: 16.994444,
//               longitude: 73.300003,
//             }}
//           />
//         </MapView>
//       </View>
//     </>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     flex:1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

export default App;
