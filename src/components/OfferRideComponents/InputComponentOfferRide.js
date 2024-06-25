import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCompass,
  faCrosshairs,
  faLocationDot,
  faCalendarDays,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-toast-message';
import OfferRoute from './OfferRoute';

import {useSelector, useDispatch} from 'react-redux';
import {
  addCount,
  addDestination,
  addSource,
  addTravelInfo,
  addIsRideAdded,
} from '../../features/driverInfoSlice';
import Snackbar from 'react-native-snackbar';

const InputComponentOfferRide = ({navigation, isPosting}) => {
  const [selectDateModal, setSelectDateModal] = useState('close');
  const [offerRouteAdded, setOfferRouteAdded] = useState(true);
  const vehicle = useSelector(state => state.vehicleDetails);
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [sourceName, setSourceName] = useState(null);
  const [destinationName, setDestinationName] = useState(null);
  const [count, setCount] = useState(1);
  const [timeInfo, setTimeInfo] = useState('Today');

  const dispatch = useDispatch();
  const {isRideAdded} = useSelector(state => state.driverInfo);

  const getDestinationCoords = selectedlocation => {
    // console.log('selectedlocation1234',selectedlocation.endCoords)
    setDestinationName(selectedlocation.endLocationName);
    setDestinationCoords(selectedlocation.endCoords);
  };
  const getSourceCoords = selectedlocation => {
    // console.log('selectedlocation1234',selectedlocation)
    setSourceName(selectedlocation.endLocationName);
    setSourceCoords(selectedlocation.endCoords);
  };

  const handleSearchSubmit = () => {
    // console.log('here someting' , destinationCoords)
    // console.log('here someting' , sourceCoords)

    if (sourceCoords == null || destinationCoords == null) {
      Snackbar.show({
        text: 'Enter the Locations',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#FF3E4D',
      });
    } else {
      const sourceInfo = {
        sourceCoords: sourceCoords,
        sourceName: sourceName,
      };

      const destinationInfo = {
        destinationCoords: destinationCoords,
        destinationName: destinationName,
      };

      dispatch(addSource(sourceInfo));
      dispatch(addDestination(destinationInfo));

      navigation.navigate('MapForOfferRide');
    }
  };

  return (
    <>
      <View style={styles.parentContainer}>
        <View style={styles.searchContainer}>
          <Toast />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SearchComponentOffer', {
                isSource: true,
                from: 'offerRide',
                fetchSourceCoords: getSourceCoords,
              })
            }>
            <View style={styles.sourceContainer}>
              <FontAwesomeIcon icon={faCompass} color="green" size={20} />
              <Text style={styles.searchField}>
                {sourceName != null ? sourceName : 'Leaving from'}
              </Text>
              <FontAwesomeIcon icon={faCrosshairs} color="grey" size={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SearchComponentOffer', {
                isSource: false,
                from: 'offerRide',
                fetchDestinationCoords: getDestinationCoords,
              })
            }>
            <View style={styles.sourceContainer}>
              <FontAwesomeIcon icon={faLocationDot} color="green" size={20} />
              <Text style={styles.searchField}>
                {destinationName != null ? destinationName : 'Going to'}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.searchDetails}>
            <TouchableOpacity style={styles.dateDetails}>
              <FontAwesomeIcon icon={faCalendarDays} color="green" />
              <Text style={styles.dateText}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateDetails}>
              <FontAwesomeIcon icon={faUser} color="green" />
              <Text style={styles.countDetail}>1</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.searchBtn,
              {
                backgroundColor:
                  sourceCoords && destinationCoords ? '#2eb17f' : '#b9f2ff',
              },
            ]}
            onPress={handleSearchSubmit}>
            <Text
              style={[
                styles.searchText,
                {color: sourceCoords && destinationCoords ? 'black' : 'grey'},
              ]}>
              Add Ride{' '}
            </Text>
          </TouchableOpacity>
        </View>
        {/* {
        isRideAdded  == true  ? <OfferRoute/> : ''
      } */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
  },
  searchContainer: {
    width: '85%',
    height: 240,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 40,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.53,
    shadowRadius: 13.97,
    elevation: 21,
  },
  sourceContainer: {
    width: 280,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 6,
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
  },
  searchField: {
    width: 220,
    fontWeight: 'bold',
    fontSize: 18,
    paddingLeft: 10,
    color: 'grey',
  },
  searchDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  dateDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 70,
    marginBottom: 30,
  },
  dateText: {
    paddingLeft: 6,
    fontWeight: 'bold',
    color: '#3c3c3c',
    fontSize: 16,
  },
  countDetail: {
    paddingLeft: 6,
    fontWeight: 'bold',
    color: '#3c3c3c',
    fontSize: 16,
  },
  searchBtn: {
    width: '100%',
    height: 50,
    // backgroundColor: '#b9f2ff', // if true dark it
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  searchText: {
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 10,
    fontWeight: 'bold',
    // color: 'grey',
  },
});

export default InputComponentOfferRide;
