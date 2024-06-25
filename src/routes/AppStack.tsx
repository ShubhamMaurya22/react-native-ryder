import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {View, Dimensions, TouchableOpacity, Text} from 'react-native';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMagnifyingGlass,
  faSquarePlus,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useIsFocused} from '@react-navigation/native';

// screen
import FindRide from '../screen/FindRide';
import OfferRide from '../screen/OfferRide';
import YourRides from '../screen/YourRides';
import SearchComponent from '../screen/SearchComponent';
import BrandScreen from '../screen/BrandScreen';
import InboxScreen from '../screen/InboxScreen';
import ChatScreen from '../screen/ChatScreen';
import MapAndRideDisplay from '../screen/MapAndRideDisplay';
import ModalDetails from '../components/OfferRideComponents/ModalDetails';
import SelectVehicleType from '../components/OfferRideComponents/SelectVehicleType';
import SelectedVehicleDetails from '../components/OfferRideComponents/SelectedVehicleDetails';
import OfferRideSearchLocation from '../screen/OfferRideSearchLocation';
import MapForOfferRide from '../screen/MapForOfferRide';
import SearchComponentOffer from '../screen/SearchComponentOffer';
import Whatsapp from '../screen/Whatsapp';
import FinalMapScreen from '../screen/FinalMapScreen';
import RideFinalScreen from '../screen/RideFinalScreen';

const Findride = 'FindRide';
const Offerride = 'OfferRide';
const YourRide = 'YourRides';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const {width, height} = Dimensions.get('window');
const TabNavigation = () => {
  // console.log('vehicle', vehicle.isVehiclePublished)
  return (
    <View style={{width, height}}>
      <Tab.Navigator
        initialRouteName="FindRide"
        screenOptions={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({focused, color, size}) => {
            let iconname;
            let rn = route.name;

            if (rn === Findride) {
              iconname = faMagnifyingGlass;
            } else if (rn === Offerride) {
              iconname = faSquarePlus;
            } else if (rn === YourRide) {
              iconname = faClock;
            }

            return (
              <FontAwesomeIcon icon={iconname} size={size} color={color} />
            );
          },
          tabBarStyle: {height: 70},
          tabBarLabelStyle: {paddingBottom: 10, fontSize: 14},
        })}>
        <Tab.Screen
          name="FindRide"
          component={FindRideStack}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="OfferRide"
          component={OfferRideStack}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="YourRides"
          component={YourRides}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </View>
  );
};

const getTabBarVisibility = route => {
  const routeName = getFocusedRouteNameFromRoute(route);

  if (routeName === 'ChatScreen') {
    return false; // Hide tab bar for ChatScreen
  }

  return true;
};

const FindRideStack = ({route}: any) => {
  const isFocused = useIsFocused();
  return (
    <Stack.Navigator
      initialRouteName="FindRide"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarVisible: getTabBarVisibility(route),
      })}>
      <Stack.Screen name="FindRideScreen" component={FindRide} />
      <Stack.Screen name="SearchComponent" component={SearchComponent} />
      <Stack.Screen name="InboxScreen" component={InboxScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="MapAndRideDisplay" component={MapAndRideDisplay} />
      <Stack.Screen name="whatsapp" component={Whatsapp} />
      <Stack.Screen name="RideFinalScreen" component={RideFinalScreen} />
    </Stack.Navigator>
  );
};

const OfferRideStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OfferRide"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="OfferRideScreen" component={OfferRide} />
      <Stack.Screen name="Brand" component={BrandScreen} />
      <Stack.Screen name="ModalDetails" component={ModalDetails} />
      <Stack.Screen name="SelectVehicleType" component={SelectVehicleType} />
      <Stack.Screen
        name="SelectedVehicleDetails"
        component={SelectedVehicleDetails}
      />
      <Stack.Screen name="MapForOfferRide" component={MapForOfferRide} />
      <Stack.Screen
        name="SearchComponentOffer"
        component={SearchComponentOffer}
      />
      <Stack.Screen name="FinalMap" component={FinalMapScreen} />
      <Stack.Screen
        name="OfferRideSearchLocation"
        component={OfferRideSearchLocation}
      />
    </Stack.Navigator>
  );
};

const ApppStack = () => {
  return (
    <NavigationContainer>
      <TabNavigation />
    </NavigationContainer>
  );
};

export default ApppStack;
