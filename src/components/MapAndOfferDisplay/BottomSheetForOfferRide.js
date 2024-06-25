import React, {useRef, useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {date} from 'yup';
import {
  addCount,
  addDay,
  addStartTime,
  addSource,
  addTravelInfo,
  addIsRideAdded,
} from '../../src/features/driverInfoSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import Snackbar from 'react-native-snackbar';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {app, auth, db} from '../../firebase';
import uuid from 'react-native-uuid';

const BottomSheetForOfferRide = ({navigation}) => {
  const [showSeatSheet, setShowSeatSheet] = useState(false);
  const [day, setDay] = useState('');
  const [count, setcount] = useState(null);
  const [time, setTime] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [driverDetails, setDriverDetails] = useState({});
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [driverData, setDriverData] = useState({});

  const bottomSheetRef = useRef(null);
  const dispatch = useDispatch();
  // const vehicle = useSelector(state => state.vehicleDetails);
  // console.log('vehicle',vehicle.type)

  useEffect(() => {
    const getData = async () => {
      try {
        const name = await AsyncStorage.getItem('name');
        const id = await AsyncStorage.getItem('id');
        const Type = await AsyncStorage.getItem('type');
        const registerNumber = await AsyncStorage.getItem('registerNumber');
        const modelName = await AsyncStorage.getItem('modelName');
        const brandName = await AsyncStorage.getItem('brandName');
        const upiId = await AsyncStorage.getItem('upiID');
        const phoneNumber = await AsyncStorage.getItem('phoneNumber');
        if (name && id && Type) {
          setDriverDetails({name, id});
          setVehicleDetails({
            type: Type,
            registerNumber: registerNumber,
            modelName: modelName,
            brandName: brandName,
          });
        }
        console.log('name', driverDetails);

        if (upiId && phoneNumber) {
          console.log(phoneNumber, upiId);
          setDriverData({upiId: upiId, driverPhone: phoneNumber});
        }
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };
    getData();
  }, []);

  const onSeatSubmit = async () => {
    if (vehicleDetails.type == 'Bike') {
      const id = uuid.v4();

      try {
        const rideData = {
          id: id,
          sourceCoords: travelData.source.sourceCoords,
          sourceName: travelData.source.sourceName,
          destinationCoords: travelData.destination.destinationCoords,
          destinationName: travelData.destination.destinationName,
          startTime: startTime?.toLocaleTimeString(),
          registerNumber: vehicleDetails.registerNumber,
          driverName: driverDetails.name,
          distance: travelData.distance,
          totalTime: travelData.time,
          day: day,
          carName: vehicleDetails.modelName,
          driverID: driverDetails.id,
          totalSeat: 1,
          passengers: passengers,
          status: 'pending',
          expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          driverPhone: driverData.driverPhone,
          driverUPI: driverData.upiId,
        };

        await firestore()
          .collection('rides')
          .doc(id)
          .set(rideData)
          .then(() => {
            Snackbar.show({
              text: 'Ride Added Successfully',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'grey',
            });
          })
          .catch(e => {
            console.log('fail with', e);
          });
        navigation.navigate('OfferRideSearchLocation');
      } catch (error) {
        Snackbar.show({
          text: `Error Adding Ride ${error}`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#a91b0d',
        });
        console.log(error);
      }
    }

    if (day && startTime) {
      bottomSheetRef.current.close();
      setShowSeatSheet(true);
    } else {
      Snackbar.show({
        text: 'Enter the Day, Time',
        duration: Snackbar.LENGTH_SHORT, // Adjust duration as needed
        backgroundColor: '#FF3E4D',
      });
    }
  };

  // redux
  const travelData = useSelector(state => state.driverInfo);
  const vehicleData = useSelector(state => state.vehicleDetails);
  //array of length number of seats
  const passengers = new Array(count).fill(null);

  const onSubmit = async () => {
    if (count) {
      setShowSeatSheet(false);
      dispatch(addCount(count));
      dispatch(addStartTime(startTime?.toLocaleTimeString()));
      dispatch(addDay(day));
      dispatch(addIsRideAdded(true));

      const id = uuid.v4();

      try {
        const rideData = {
          id: id,
          sourceCoords: travelData.source.sourceCoords,
          sourceName: travelData.source.sourceName,
          destinationCoords: travelData.destination.destinationCoords,
          destinationName: travelData.destination.destinationName,
          startTime: startTime?.toLocaleTimeString(),
          registerNumber: vehicleDetails.registerNumber,
          driverName: driverDetails.name,
          distance: travelData.distance,
          totalTime: travelData.time,
          day: day,
          carName: vehicleDetails.modelName,
          driverID: driverDetails.id,
          totalSeat: count,
          passengers: passengers,
          status: 'pending',
          expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          driverPhone: driverData.driverPhone,
          driverUPI: driverData.upiId,
        };

        await firestore()
          .collection('rides')
          .doc(id)
          .set(rideData)
          .then(() => {
            Snackbar.show({
              text: 'Ride Added Successfully',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'grey',
            });
          })
          .catch(e => {
            console.log('fail with', e);
          });
        navigation.navigate('OfferRideSearchLocation');
      } catch (error) {
        Snackbar.show({
          text: `Error Adding Ride ${error}`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#a91b0d',
        });
        console.log(error);
      }
    }
  };

  const handleCount = count => {
    setcount(count);
  };

  const showTimePicker = () => {
    setShowPicker(true);
  };

  const onChange = (e, selectedTime) => {
    // setTime(selectedTime);
    setStartTime(selectedTime);
    setShowPicker(false);
  };

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={['25%', '30%']}
        backgroundComponent={() => (
          <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}} />
        )}>
        <View
          style={[
            {backgroundColor: 'white', padding: 16},
            styles.timeContainer,
          ]}>
          <Text style={styles.timeTitleText}>Select Time</Text>

          <View style={styles.InfoContainer}>
            <View style={styles.box1}>
              <TouchableOpacity
                style={[
                  styles.today,
                  {backgroundColor: day == 'Today' ? '#89CFF0' : 'lightblue'},
                ]}
                onPress={() => setDay('Today')}>
                <Text
                  style={[
                    styles.text,
                    {color: day == 'Today' ? 'black' : 'grey'},
                  ]}>
                  Today
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tomorrow,
                  {
                    backgroundColor:
                      day == 'Tomorrow' ? '#89CFF0' : 'lightblue',
                  },
                ]}
                onPress={() => setDay('Tomorrow')}>
                <Text
                  style={[
                    styles.text,
                    {color: day == 'Tomorrow' ? 'black' : 'grey'},
                  ]}>
                  Tomorrow
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <View style={styles.box2}>
                <TouchableOpacity onPress={showTimePicker}>
                  <Text style={styles.text}>
                    {startTime == null
                      ? 'Pick Time'
                      : startTime.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={time}
                mode={'time'}
                is24Hour={false}
                onChange={onChange}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.submitTimeBtn}
              onPress={onSeatSubmit}>
              <Text style={styles.submitText}>
                {vehicleDetails.type == 'Car' ? 'No. of Passengers' : 'Submit'}{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
      {showSeatSheet && vehicleDetails.type == 'Car' && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={['25%', '30%']}
          backgroundComponent={() => (
            <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex: 1}} />
          )}>
          <View
            style={[
              {backgroundColor: 'white', padding: 16},
              styles.dateContainer,
            ]}>
            <Text style={styles.timeTitleText}>Your car can take</Text>
            <View style={styles.countContainer}>
              {/* <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: count == 1 ? '#ffce20' : '#90ee90'},
                ]}
                onPress={() => handleCount(1)}>
                <Text style={styles.countText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: count == 2 ? '#ffce20' : '#90ee90'},
                ]}
                onPress={() => handleCount(2)}>
                <Text style={styles.countText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: count == 3 ? '#ffce20' : '#90ee90'},
                ]}
                onPress={() => handleCount(3)}>
                <Text style={styles.countText}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: count == 4 ? '#ffce20' : '#90ee90'},
                ]}
                onPress={() => handleCount(4)}>
                <Text style={styles.countText}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: count == 5 ? '#ffce20' : '#90ee90'},
                ]}
                onPress={() => handleCount(5)}>
                <Text style={styles.countText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: count == 6 ? '#ffce20' : '#90ee90'},
                ]}
                onPress={() => handleCount(6)}>
                <Text style={styles.countText}>6</Text>
              </TouchableOpacity> */}

              {Array.from({length: 6}, (_, index) => (
                <TouchableOpacity
                  key={index + 1}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        count === index + 1 ? '#ffce20' : '#90ee90',
                    },
                  ]}
                  onPress={() => handleCount(index + 1)}>
                  <Text style={styles.countText}>{index + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={[
                  styles.submitCountBtn,
                  {backgroundColor: count ? 'green' : '#2eb17f'},
                ]}
                onPress={onSubmit}>
                <Text style={[styles.submitText]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // flex:1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  timeContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    // backgroundColor: '#ffce20',
  },
  timeTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    paddingHorizontal: 10,
  },
  submitTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2eb17f',
    justifyContent: 'center',
    marginTop: 60,
    padding: 20,
    width: 350,
    borderRadius: 30,
  },
  submitCountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#2eb17f',
    justifyContent: 'center',
    marginTop: 60,
    padding: 20,
    width: 350,
    borderRadius: 30,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  dateContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    // backgroundColor: '#ffce20',
  },
  // temp
  InfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignItems: 'center',
    marginTop: 20,
  },
  box1: {
    width: 160,
    height: 50,
    backgroundColor: 'lightblue',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
  },
  today: {
    height: 50,
    justifyContent: 'center',
    width: 65,
  },
  tomorrow: {
    height: 50,
    justifyContent: 'center',
    width: 85,
  },
  box2: {
    width: 150,
    height: 50,
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  countContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    // backgroundColor: 'green',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  countText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default BottomSheetForOfferRide;
