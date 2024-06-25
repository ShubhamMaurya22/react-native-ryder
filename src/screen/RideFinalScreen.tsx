import {ScrollView, StyleSheet, Text, View, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/FinalMapScreenComponents/Header';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {API_KEY} from '../constant/googleMapAPIKey';
import {Image} from 'react-native-elements';
import imagePath from '../constant/imagePath';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {faPhone, faLocationDot} from '@fortawesome/free-solid-svg-icons';
import Geolocation from '@react-native-community/geolocation';
import Snackbar from 'react-native-snackbar';
import Communications from 'react-native-communications';
import {passengerInfo} from '../features/passengerInfoSlice';

const RideFinalScreen = ({navigation, route}: any) => {
  const {rideId, sourceCoords} = route.params;
  const [data, setData] = useState({});
  const [receiverPhoneNum, setReceiverPhoneNum] = useState('');
  const [myId, setMyId] = useState('');
  const [myPhoneNum, setMyPhoneNum] = useState('');
  // const [source, setSource] = useState([]);
  const [driver, setDriver] = useState('');
  const [phone, setPhone] = useState('');
  const [passengerData, setPassengerData] = useState([]);
  const tempCurr = [73.439031366401, 17.0471870781106];
  const apikey = API_KEY;
  const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apikey}`;

  const [showPassengerInfo, setShowPassengerInfo] = useState(true);
  const [startRideClicked, setStartRideClicked] = useState(false);

  // const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const senderNumber = myPhoneNum;
  // const receiverNumber = passengerData.phone; // Replace with the passenger's phone number
  const message = 'Check out my live location:';
  let location = {latitude: 73.439031366401, longitude: 17.0471870781106};

  const handleStartRide = () => {
    setShowPassengerInfo(true);
    setStartRideClicked(true);
  };

  const getPhoneNumber = async () => {
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    const id = await AsyncStorage.getItem('id');
    setMyPhoneNum(phoneNumber);
    setMyId(id);
  };
  getPhoneNumber();

  // console.log('reciever phone', passengerData.phone)
  useEffect(() => {
    // Start watching for location updates when the component mounts
    const id = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        // setLocation({ latitude, longitude });
      },
      error => console.log('Error getting location:', error),
      {enableHighAccuracy: true, distanceFilter: 10}, // Update every 10 meters
    );
    setWatchId(id);

    // Stop watching for location updates when the component unmounts
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const handleSendLocation = (receiverNumber: any) => {
    console.log('receiverNumber', receiverNumber);
    if (location) {
      const locationURL = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
      const whatsappMessage = `${message} ${locationURL}`;

      try {
        const url = `https://api.whatsapp.com/send?phone=${receiverNumber}&text=${encodeURIComponent(
          whatsappMessage,
        )}`;
        Linking.openURL(url);
        console.log('Message sent successfully!');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.log('Location not available');
      Snackbar.show({
        text: 'Location not available',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'grey',
      });
    }
  };

  useEffect(() => {
    fetchRide();
  }, []);

  const fetchRide = async () => {
    try {
      const rideDoc = await firestore().collection('rides').doc(rideId).get();
      const rideData = rideDoc.data();
      const passengers = rideData?.passengers;

      if (passengers) {
        const newPassengerData = passengers
          .filter(pass => pass) // Filter out null values
          .map(pass => ({
            userName: pass.userName,
            id: pass.userId,
            phone: pass.userPhone,
          }));

        setPassengerData(prevPassengerData => [
          ...prevPassengerData,
          ...newPassengerData,
        ]);
      }

      // setSource(rideData?.sourceCoords);
      setData(rideData);
      setDriver(rideData.driverName);
      setPhone(rideData.driverPhone);
    } catch (error) {
      console.log('error while fetching', error);
    }
  };

  const handlePhoneCall = (phoneNumber: string) => {
    console.log(typeof phoneNumber);
    Communications.phonecall('8698014214', true);
  };

  const handleMessage = (id: any, name: any) => {
    const item = {
      userId: id,
      userName: name,
    };
    navigation.navigate('ChatScreen', {id: myId, data: item});
  };

  // console.log(data.driverName)
  return (
    <>
      <Header navigation={navigation} />
      <View style={styles.container}>
        <MapLibreGL.MapView style={styles.map} styleURL={styleUrl}>
          {/* {data?.sourceCoords && ( */}
          <MapLibreGL.PointAnnotation
            id="currentPosition"
            coordinate={sourceCoords}
          />

          <MapLibreGL.Camera
            zoomLevel={10}
            pitch={40}
            centerCoordinate={sourceCoords}
            animationDuration={2000}
          />
          {/* )} */}
          {/* {data?.destinationCoords && (
                    <MapLibreGL.PointAnnotation
                    id="destinationPosition"
                    coordinate={data?.destinationCoords}
                    />
                )} */}
        </MapLibreGL.MapView>
      </View>

      {/* {!startRideClicked && (
          <View style={styles.passengerInfo}>
            <TouchableOpacity style={styles.startRideButton} onPress={handleStartRide}>
              <Text style={styles.startRideText}>Start Ride</Text>
            </TouchableOpacity>
          </View>
        )} */}

      {/* {showPassengerInfo && (
         
        )} */}

      <View style={styles.passengerInfo}>
        {/* {passengerData.map((passenger, index) => ( */}

        <View key={index} style={styles.passInfoBox}>
          <Image source={imagePath.passengerImage} style={styles.userImage} />
          <Text style={styles.passName}>{driver}</Text>
          {/* <TouchableOpacity style={styles.msgIcon} onPress={() => handlePhoneCall(passenger.phone)}> */}
          {/* <TouchableOpacity style={styles.msgIcon} onPress={() => Communications.phonecall('8698014214', true)}>
                  <FontAwesomeIcon icon={faPhone} color="#3c3c3c" size={20} />
                </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.msgIcon}
            onPress={() => handleSendLocation(phone)}>
            <FontAwesomeIcon icon={faLocationDot} color="#3c3c3c" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.msgIcon}
            onPress={() => handleMessage(passenger.id, passenger.userName)}>
            <FontAwesomeIcon icon={faEnvelope} size={25} />
          </TouchableOpacity>
        </View>
        {/* ))} */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  startRideButton: {
    // Add your button styles here
  },
  startRideText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  passengerInfo: {
    flex: 1,

    position: 'absolute',
    bottom: '5%',
    left: '5%',
    right: '5%',
    paddingVertical: '2%',
  },
  passInfoBox: {
    backgroundColor: '#2eb17f',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 6,
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 30,
  },
  passName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  msgIcon: {
    backgroundColor: 'green',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default RideFinalScreen;
