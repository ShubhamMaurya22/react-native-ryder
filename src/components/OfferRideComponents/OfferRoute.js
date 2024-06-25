import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useMemo, useCallback, useState, useRef, useEffect} from 'react';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowRight,
  faLocationDot,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import imagePath from '../../constant/imagePath';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {app, auth, db} from '../../../firebase';

const OfferRoute = ({navigation}) => {
  const [data, setData] = useState([]);
  const [ID, setID] = useState(null);

  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (id !== null) {
        setID(id);
      }
    } catch (e) {
      console.log('error in username', e);
    }
  };

  //redux
  // const travelData = useSelector((state) => state.driverInfo)
  // const vehicleData = useSelector((state) => state.vehicleDetails)

  // useEffect(()=> {
  //   const info = {
  //     source: travelData.source,
  //     destination: travelData.destination,
  //     startTime: travelData.startTime,
  //     registerNumber: vehicleData.registerNumber,
  //     distance: travelData.distance,
  //     totalTime: travelData.time,
  //     day: travelData.day,
  //     carName: vehicleData.modelName
  //   }
  //   setData(prevData => [...prevData, info]);
  // }, [travelData, vehicleData])

  //delete entry
  const deleteEntry = async entryId => {
    try {
      // Perform deletion operation here
      // For example:
      await firestore().collection('rides').doc(entryId).delete();
      // After deletion, fetch updated data
      fetchData();
    } catch (error) {
      console.log('Error deleting entry:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call getData to retrieve the ID
        await getData();

        // Fetch data from Firestore using the retrieved ID
        // const querySnapshot = await firestore()
        //   .collection('rides')
        //   .where('driverID', '==', ID)
        //   .where('status', '==', 'pending')
        //   .get()

        const unsubscribe = firestore()
          .collection('rides')
          .where('driverID', '==', ID)
          .where('status', '==', 'pending')
          .onSnapshot(querySnapshot => {
            const newData = [];
            querySnapshot.forEach(doc => {
              newData.push(doc.data());
            });
            setData(newData);
          });
        return () => unsubscribe();
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [ID]);

  const handleRideOpen = (entryId, coords) => {
    navigation.navigate('FinalMap', {rideId: entryId, sourceCoords: coords});
  };

  return (
    <View style={styles.bottomSheet}>
      <Text style={styles.bottomSheetTitle}>Rides Offered</Text>
      {/*  */}

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => handleRideOpen(item.id, item.sourceCoords)}>
              <View style={styles.searchResultContainer}>
                <View style={styles.searchTopSection}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.topText}>
                      {item.day} || {item.startTime}
                    </Text>
                    <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        color="#a91b0d"
                        size={25}
                        style={styles.deleteIcons}
                      />
                    </TouchableOpacity>
                  </View>
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    marginHorizontal: 20,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
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
    // width: 350
  },
  searchTopSection: {
    backgroundColor: '#f1ce20',
    padding: 10,
  },
  topText: {
    fontSize: 16,
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
    // marginLeft: 2,
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
  deleteIcons: {
    alignSelf: 'flex-end',
    marginTop: 0,
  },
});

export default OfferRoute;
