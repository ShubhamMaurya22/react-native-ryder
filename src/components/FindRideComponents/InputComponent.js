import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCompass,
  faCrosshairs,
  faLocationDot,
  faCalendarDays,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from './DateTimePicker';
import {useDispatch, useSelector} from 'react-redux';
import {
  addDestination,
  addSource,
  addCount,
  addTravelInfo,
} from '../../src/features/passengerInfoSlice';
import Toast from 'react-native-toast-message';
import Snackbar from 'react-native-snackbar';

const InputComponent = ({navigation, isPosting}) => {
  const [isSourceSelected, setIsSourceSelected] = useState(false);
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [sourceName, setSourceName] = useState(null);
  const [destinationName, setDestinationName] = useState(null);
  const [count, setCount] = useState(1);
  const [timeInfo, setTimeInfo] = useState('Today');
  const dispatch = useDispatch();

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

    if (sourceCoords === null || destinationCoords === null) {
      Snackbar.show({
        text: 'Enter the Locations',
        duration: Snackbar.LENGTH_SHORT, // Adjust duration as needed
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
      dispatch(addCount(count));
      dispatch(addTravelInfo(timeInfo));
      navigation.navigate('MapAndRideDisplay');
    }
  };
  return (
    <View style={styles.parentContainer}>
      <View style={styles.searchContainer}>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SearchComponent', {
                isSource: true,
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
          {/* <TouchableOpacity style={styles.xMark}>
           <FontAwesomeIcon icon={faXmark} color="grey" size={20} />
      </TouchableOpacity> */}
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SearchComponent', {
              isSource: false,
              fetchCoords: getDestinationCoords,
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
            !isSourceSelected && styles.disabled,
            ,
            {
              backgroundColor:
                sourceCoords && destinationCoords ? '#2eb17f' : '#b9f2ff',
            },
          ]} // Apply disabled style if source is not selected
          onPress={handleSearchSubmit}
          // disabled={!isSourceSelected}
        >
          <Text
            style={[
              styles.searchText,
              {color: sourceCoords && destinationCoords ? 'black' : 'grey'},
            ]}>
            Search{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginHorizontal: 10,
    backgroundColor: '#f5f5f5',
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
    // marginLeft: 20,
    // marginRight: 20
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
    backgroundColor: '#b9f2ff', // if true dark it
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
    color: 'grey',
  },
});

export default InputComponent;
