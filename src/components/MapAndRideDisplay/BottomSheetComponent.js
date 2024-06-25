import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useMemo, useCallback, useState, useRef, useEffect} from 'react';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {TouchEventType} from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowRight, faLocationDot} from '@fortawesome/free-solid-svg-icons';
import imagePath from '../../src/constant/imagePath';
import RNUpiPayment from 'react-native-upi-payment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {client_id, client_secret} from '../../src/constant/upiKey';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import {err} from 'react-native-svg';

const BottomSheetComponent = ({navigation}) => {
  const snapPoint = useMemo(() => ['50%', '80%'], []);
  const paymentSnapPoint = useMemo(() => ['40%', '40%'], []);
  const [openPlaymentModal, setOpenPaymentModal] = useState(true);
  const [upiId, setUpiId] = useState('');
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const {source, destination} = useSelector(state => state.passInfo);
  const currentTime = new Date();

  const bottomSheetRef = useRef(null);
  const paymentBottomSheetRef = useRef(null);

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

  const upi = false;

  useEffect(() => {
    const getData = async () => {
      try {
        const name = await AsyncStorage.getItem('name');
        const id = await AsyncStorage.getItem('id');

        if (name && id) {
          setUserData({
            name: name,
            id: id,
          });
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };
    getData();
  }, []);

  // Find the index where the passenger should be added
  const index = data?.passengers?.length;

  function handlePayment(id, name, upi, distance) {
    // navigation.navigate('whatsapp')

    // if(upiId == ''){

    //   setOpenPaymentModal(true)
    //   paymentBottomSheetRef.current?.present();
    //   bottomSheetRef.current?.dismiss();
    // }else{}
    // setOpenPaymentModal(false)
    // paymentBottomSheetRef.current?.dismiss();
    // bottomSheetRef.current?.present();

    if (data.totalSeat <= 0) {
      Snackbar.show({
        text: 'No seats available',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      return;
    }

    // console.log('data ->>' , data.driverUPI)
    RNUpiPayment.initializePayment(
      {
        vpa: upi, // or can be john@ybl or mobileNo@upi
        payeeName: name,
        amount: parseFloat(distance) * 3,
        transactionRef: '1212-44454-545454',
      },
      successCallback,
      failureCallback,
    );

    function successCallback(data) {
      console.log('success', data);
    }

    function failureCallback(data) {
      // console.log('failure',data)

      try {
        //add user in ride collection

        const rideRef = firestore().collection('rides').doc(id);

        rideRef
          .update({
            passengers: firestore.FieldValue.arrayUnion({
              userId: userData.id,
              userName: userData.name,
              userPhone: '8698014214',
              source: source,
              destination: destination,
            }),
            totalSeat: firestore.FieldValue.increment(-1),
          })
          .then(() => {
            console.log('User added to the ride successfully');
            Snackbar.show({
              text: 'User added to the ride successfully',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'green',
            });
            navigation.goBack();
          })
          .catch(error => {
            console.error('Error adding user to the ride: ', error);
          });
      } catch (error) {
        console.log('Error adding user to the ride', error);
        Snackbar.show({
          text: `Error adding user to the ride`,
          duration: Snackbar.LENGTH_SHORT, // Adjust duration as needed
          backgroundColor: '#FF3E4D',
        });
      }
      //add ride info in user collection
      try {
        const userRef = firestore().collection('users').doc(userData.id);

        userRef
          .update({
            rideTaken: firestore.FieldValue.arrayUnion(id), // Add the ride ID to the rideTaken array
          })
          .then(() => {
            console.log('Ride ID added to rideTaken array successfully');
          })
          .catch(error => {
            console.error('Error adding ride ID to rideTaken array: ', error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleUPISubmit = async () => {
    // if(!upiId){
    //   console.log('enter upi id')
    // }else{
    //   // bottomSheetRef.current?.present();
    //   const upi_id = await AsyncStorage.setItem('UPI_id',upiId)
    // }
  };

  // useEffect(() => {
  //   try{
  //       const url = "https://production.deepvue.tech/v1/verification/upi?vpa=shubhu1135@okaxis";
  //       const headers = {
  //         'Authorization': 'Bearer free_tier_maurya.shubham_485200217e',
  //         'x-api-key': 'fb4e849e933e4153859a9ae18b4d238b',
  //         // 'x-api-key': client_secret,
  //       };

  //       fetch(url, {
  //         method: 'GET',
  //         headers: headers
  //       })
  //       .then(response => {
  //         if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //         }
  //         return response.text();
  //       })
  //       .then(data => {
  //         console.log(data);
  //       })
  //       .catch(error => {
  //         console.error('There was a problem with the fetch operation:', error);
  //       });
  // } catch (error) {
  //   console.log(error)
  // }
  // }, [])

  // console.log('data--->', data)
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const unsubscribe = await firestore()
          .collection('rides')
          .where('sourceName', '==', source.sourceName)
          .where('destinationName', '==', destination.destinationName)
          // .where('expirationTime', '>', currentTime)
          // .where('totalSeat', '!==', 0)
          .onSnapshot(querySnapshot => {
            if (querySnapshot) {
              const newData = [];
              querySnapshot.forEach(doc => {
                newData.push(doc.data());
              });
              setData(newData);
            } else {
              console.log('No documents found matching the query criteria.');
            }
            return () => unsubscribe();
          });
      } catch (error) {
        console.log('error while fetching rides', error);
      }
    };

    fetchRides();
  }, []);

  // console.log('daata',data)

  return (
    <View style={{flex: 1}}>
      <BottomSheetModal
        snapPoints={snapPoint}
        detached={false}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
        index={0}>
        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Rides along the route</Text>

          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              const passengers = item.passengers || [];
              const passengerAlreadyAdded = passengers.some(
                passenger => passenger?.userId === userData.id,
              );
              const totalSeats = item.totalSeat;
              //If the passenger is already added, return null to skip rendering this ride

              if (passengerAlreadyAdded) {
                // return null;
                return (
                  <View style={styles.noRideContainer}>
                    <Text style={styles.noRideText}>Already in the ride</Text>
                  </View>
                );
              }

              return (
                item.totalSeat > 0 && (
                  <View style={styles.searchResultContainer}>
                    <View style={styles.searchTopSection}>
                      <Text style={styles.topText}>
                        {item.day} || {item.startTime}
                      </Text>
                      <View style={styles.innerContainer}>
                        <View style={styles.locationDetails}>
                          <Text style={styles.sourceLocation}>
                            {item.sourceName}
                          </Text>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            size={16}
                            color="#3c3c3c"
                            style={{marginLeft: 10}}
                          />
                          <Text style={styles.destinationLocation}>
                            {item.destinationName}
                          </Text>
                        </View>
                        <View style={styles.timeDetails}>
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            size={20}
                            color="green"
                          />
                          <Text style={styles.destinationTime}>
                            {item.distance}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.searchButtonSection}>
                      <View style={styles.innerSection}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={imagePath.driverImage}
                            style={{width: 40, height: 40}}
                          />
                          <Text style={styles.driverName}>
                            {item.driverName?.toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.carDetails}>
                          <Text style={styles.carName}>
                            {item.carName?.toUpperCase()}
                          </Text>
                          <Text style={styles.carNoPlate}>
                            {item.registerNumber?.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.seatContainer}>
                        <Text style={styles.seatText}>
                          {item.totalSeat} Seats lefts
                        </Text>
                        <TouchableOpacity
                          style={styles.joinRideBtn}
                          onPress={() =>
                            handlePayment(
                              item.id,
                              item.driverName,
                              item.driverUPI,
                              item.distance,
                            )
                          }>
                          <Text style={styles.joinRideText}>
                            Join Now | &#8377; {parseFloat(item.distance) * 3}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              );
            }}
          />

          {data.length === 0 && (
            <View style={styles.noRideContainer}>
              <Text style={styles.noRideText}>No rides on this route</Text>
            </View>
          )}

          {/* </ScrollView> */}
        </View>
      </BottomSheetModal>

      {/* {openPlaymentModal && (
        <BottomSheetModal 
        snapPoints={paymentSnapPoint}
        detached={false}
        ref={paymentBottomSheetRef}
        enablePanDownToClose={true}
        index={0}
        >
         <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ backgroundColor: '#e8f9ff', flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      >
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ marginBottom: 10, fontWeight: 'bold', color: 'black'}}>Enter UPI id</Text>
          <TextInput
            style={{ backgroundColor: 'white', borderRadius: 8, padding: 10 }}
            value={upiId}
            onChangeText={setUpiId}
            placeholder="Enter UPI ID"
          />
         <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={styles.paymentBtn} onPress={handleUPISubmit}>
              <Text style={styles.paymentBtnText}>Submit</Text>
            </TouchableOpacity>
         </View>
        </View>
      </KeyboardAvoidingView>
        </BottomSheetModal>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    marginHorizontal: 20,
  },
  bottomSheetTitle: {
    fontSize: 22,
    color: '#3c3c3c',
    fontWeight: 'bold',
  },
  searchResultContainer: {
    marginTop: 10,
    borderWidth: 1,
    // margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 30,
  },
  searchTopSection: {
    backgroundColor: '#ffce20',
    padding: 10,
  },
  topText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3c3c3c',
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceLocation: {
    fontSize: 16,
    color: '#3c3c3c',
    fontWeight: '500',
  },
  destinationLocation: {
    fontSize: 16,
    color: '#3c3c3c',
    fontWeight: '500',
    marginLeft: 10,
    width: 100,
  },
  timeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationTime: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 2,
    color: '#3c3c3c',
  },
  searchButtonSection: {
    backgroundColor: '#dcdcdc',
    padding: 10,
  },
  innerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carDetails: {},
  driverName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3c3c3c',
    marginLeft: 10,
  },
  carName: {
    fontSize: 15,
    fontWeight: '500',
    color: 'grey',
  },
  carNoPlate: {
    fontSize: 13,
    fontWeight: '500',
    color: 'grey',
  },
  seatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  joinRideBtn: {
    backgroundColor: '#2eb17f',
    width: 130,
    height: 45,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3c3c3c',
  },
  joinRideText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  //
  paymentBtn: {
    backgroundColor: 'white',
    width: 100,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paymentBtnText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'grey',
  },
  noRideContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffce20',
    padding: 10,
    marginTop: 30,
    borderRadius: 10,
  },
  noRideText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default BottomSheetComponent;
