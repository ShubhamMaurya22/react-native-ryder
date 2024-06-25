import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft, faXmark} from '@fortawesome/free-solid-svg-icons';
import CurrentLocation from '../../components/FindRideComponents/CurrentLocation';
import SchedulePools from '../../components/FindRideComponents/SchedulePools';
import Geolocation from '@react-native-community/geolocation';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {API_KEY} from '../constant/googleMapAPIKey';
import {faCrosshairs, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {UseDispatch} from 'react-redux';

MapLibreGL.setAccessToken(null);

const SearchComponentOffer = ({route, navigation}: any) => {
  const apikey = API_KEY;
  const {isSource, from} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      const url = `https://api.stadiamaps.com/geocoding/v1/autocomplete?text=${encodeURIComponent(
        searchQuery,
      )}&api_key=${apikey}`;

      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.features) {
            setSuggestions(data.features);
            // console.log('all', data.features.properties.label)
          }
        })
        .catch(err => {
          console.log('error for autocomplete suggestion', err);
        });
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handlePlaceSelect = (selectedPlace: any) => {
    const endCoords = selectedPlace.geometry.coordinates;
    const endLocationName = selectedPlace.properties.label;
    // console.log('destination',selectedPlace.properties.label)
    const result = {
      endCoords: endCoords,
      endLocationName: endLocationName,
    };
    if (isSource) {
      route.params.fetchSourceCoords(result);
    } else {
      route.params.fetchDestinationCoords(result);
    }
    setSuggestions([]);
    navigation.goBack();
  };

  //get current location
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentPosition([longitude, latitude]);
        console.log(position.coords);
      },
      error => {
        console.log('error during current position', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    console.log('my loc', currentPosition);
  }, []);

  const onCurrentLocSubmit = () => {
    const tempCurr = [73.5699, 17.0498];
    const res = {
      // endCoords: currentPosition,
      endCoords: tempCurr,
      endLocationName: 'RMCET Ambav',
    };
    route.params.fetchSourceCoords(res);
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.searchInputContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.searchBackArrow}
            onPress={() =>
              from === 'offerRide'
                ? navigation.navigate('OfferRideScreen')
                : navigation.navigate('FindRideScreen')
            }>
            <FontAwesomeIcon icon={faAngleLeft} size={20} color="grey" />
          </TouchableOpacity>

          <TouchableOpacity>
            <TextInput
              placeholder="Search a place ..."
              placeholderTextColor={'grey'}
              style={styles.searchInputField}
              // numberOfLines={1}
              // ellipsizeMode="tail"
              onChangeText={text => setSearchQuery(text)}
              value={searchQuery}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchCross}
          onPress={() => {
            setSearchQuery(''), setSuggestions([]);
          }}>
          <FontAwesomeIcon icon={faXmark} size={20} color="grey" />
        </TouchableOpacity>
      </View>
      {suggestions && (
        <View style={styles.suggestion}>
          <FlatList
            data={suggestions}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handlePlaceSelect(item)}>
                <Text style={styles.suggestionText}>
                  {item.properties.label}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.properties.id}
          />
        </View>
      )}
      {isSource === true ? (
        <>
          <TouchableOpacity
            style={styles.currentLocationContainer}
            onPress={onCurrentLocSubmit}>
            <View style={styles.selectLocation}>
              <FontAwesomeIcon icon={faCrosshairs} color="green" size={22} />
              <Text style={styles.locationText}>Use current location</Text>
            </View>
            <FontAwesomeIcon icon={faAngleRight} size={22} color="grey" />
          </TouchableOpacity>
          <View style={styles.separetor}></View>
        </>
      ) : (
        ''
      )}
      {/* <SchedulePools /> */}
    </>
  );
};

const styles = StyleSheet.create({
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    margin: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#e0ffff',
    // overflow: 'hidden'
    paddingRight: 24,
  },
  searchBackArrow: {
    alignItems: 'center',
  },

  searchInputField: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
  },
  searchCross: {},
  suggestion: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  suggestionItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionText: {
    fontSize: 15,
    color: '#212121',
  },
  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  selectLocation: {
    flexDirection: 'row',
  },
  locationText: {
    fontSize: 18,
    fontWeight: '700',
    paddingLeft: 15,
    color: 'grey',
  },
  separetor: {
    borderBottomWidth: 1.5,
    marginHorizontal: 20,
    marginTop: 10,
    borderColor: 'grey',
  },
});

export default SearchComponentOffer;
