import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowRight,
  faLocationDot,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import imagePath from '../../src/constant/imagePath';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RideSelected = ({navigation}) => {
  const [data, setData] = useState([]);
  const [Id, setID] = useState(null);
  const [loading, setLoading] = useState(true);

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

  getData();

  // useEffect(() => {
  //   getData();
  //   const fetchData = async () => {
  //     try {
  //       const userId = await AsyncStorage.getItem('id');
  //       if (!userId) {
  //         console.log('User ID not found');
  //         return;
  //       }

  //       const userDoc = await firestore().collection('users').doc(userId).get();
  //       const userData = userDoc.data();
  //       if (!userData) {
  //         console.log('User data not found');
  //         return;
  //       }

  //       const ridesPromises = userData.rideTaken.map(async (rideId) => {
  //         const rideDoc = await firestore().collection('rides').doc(rideId).get();
  //         return rideDoc.data();
  //       });

  //       const ridesData = await Promise.all(ridesPromises);
  //       setData(ridesData.filter(Boolean));
  //     } catch (error) {
  //       console.log('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [Id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('id');
        if (!userId) {
          console.log('User ID not found');
          return;
        }

        const userDoc = await firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (!userData) {
          console.log('User data not found');
          return;
        }

        const ridesPromises = userData.rideTaken.map(async rideId => {
          const rideDoc = await firestore()
            .collection('rides')
            .doc(rideId)
            .get();
          return rideDoc.data();
        });

        const ridesData = await Promise.all(ridesPromises);
        setData(ridesData.filter(Boolean));
      } catch (error) {
        console.log('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, [Id]);

  console.log('ride show', data);

  const handleRide = (id, sourceCoords) => {
    navigation.navigate('RideFinalScreen', {
      rideId: id,
      sourceCoords: sourceCoords,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bottomSheetTitle}>Rides Offered</Text>
      <View style={styles.searchResultContainer}></View>
      {/* {!loading && data.length > 0 && ( */}
      <FlatList
        data={data}
        keyExtractor={item => item.id || item.someUniqueIdentifier}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleRide(item.id, item.sourceCoords)}>
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
                  {/* <TouchableOpacity onPress={() => deleteEntry(item.id)} style={{ flexDirection: 'row' }}>
                  <FontAwesomeIcon icon={faTrash} color='#a91b0d' size={25} style={styles.deleteIcons} />
                  <Text style={{ fontSize: 18, color: 'red' }}>Cancel</Text>
                </TouchableOpacity> */}
                </View>
                <View style={styles.innerContainer}>
                  <View style={styles.locationDetails}>
                    <Text style={styles.sourceLocation}>{item.sourceName}</Text>
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
                    <Text style={styles.destinationTime}>{item.distance}</Text>
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
        )}
      />
      {/* )} */}

      {!loading && data.length === 0 && <Text>No rides offered</Text>}
    </View>
  );
};

{
  /*  */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 10,
    overflow: 'hidden',
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
  deleteIcons: {
    alignSelf: 'flex-end',
    marginTop: 0,
  },
});

export default RideSelected;
