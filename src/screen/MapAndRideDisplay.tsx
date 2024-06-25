import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import BottomSheet from '../../components/MapAndRideDisplay/BottomSheetComponent';
import Header from '../../components/MapAndRideDisplay/Header';
import imagePath from '../constant/imagePath';
import Geolocation from '@react-native-community/geolocation';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {API_KEY} from '../constant/googleMapAPIKey';
import {UseSelector, useSelector} from 'react-redux';

MapLibreGL.setAccessToken(null);

const MapAndRideDisplay = ({navigation}: any) => {
  // const origin = [73.439031366401, 17.0471870781106];
  // const destination = [73.300003, 16.994444];
  const apikey = API_KEY;
  const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apikey}`;

  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);

  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    [],
  );

  const [instructions, setInstructions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [data, setData] = useState(null);
  const [timeTaken, setTimeTaken] = useState<string | null>('');
  const [distance, setDistance] = useState<number | null>(null);
  const [cityAndTownNames, setCityAndTownNames] = useState<string[]>([]);
  const [nearestRoads, setNearestRoads] = useState<string[]>([]);

  //redux
  const reduxResponse = useSelector(state => state.passInfo);
  const {source, destination} = reduxResponse;

  useEffect(() => {
    setCurrentPosition(source.sourceCoords);
    getRouteCoordinates(source.sourceCoords, destination.destinationCoords);
  }, [source, destination]);

  const parseRouteCoordinates = (routeCoords: string) => {
    return routeCoords.split(';').map(coord => {
      const [lon, lat] = coord.split(',').map(parseFloat);
      return [lon, lat];
    });
  };

  function getRouteCoordinates(
    origin: [number, number],
    destination: [number, number],
  ) {
    const url = 'https://api.stadiamaps.com/route/v1';
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locations: [
          {lon: origin[0], lat: origin[1], type: 'break'},
          {lon: destination[0], lat: destination[1], type: 'break'},
        ],
        costing: 'auto',
        costing_options: {
          auto: {
            use_tolls: 1,
            use_highways: 0,
          },
        },
        directions_options: {
          units: 'km',
        },
      }),
    };

    fetch(`${url}?api_key=${apikey}`, requestOptions)
      .then(response => response.json())
      .then((data: any) => {
        console.log('data', data);
        setData(data);
        if (
          data.trip &&
          data.trip.legs &&
          data.trip.legs[0] &&
          data.trip.legs[0].maneuvers
        ) {
          const routeCoords = data.trip.legs[0].shape;
          const parsedRouteCoords = parseRouteCoordinates(routeCoords);
          setRouteCoordinates(parsedRouteCoords);
          // console.log('route', data.trip.legs[0].shape)

          const maneuvers = data.trip.legs[0].maneuvers;
          const parsedInstructions = maneuvers.map((maneuver: any) => {
            return maneuver.instruction;
          });
          setInstructions(parsedInstructions);
        } else {
          console.error('Invalid API response', data);
        }
      })
      .catch(err => {
        console.log('error fetching route coords', err);
      });
  }

  const updateRouteInstructions = () => {
    if (currentPosition && routeCoordinates.length > 1) {
      const [lon, lat] = currentPosition;
      const url = 'https://api.stadiamaps.com/route/v1';
      const requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locations: [
            {lon: lon, lat: lat, type: 'break'},
            {
              lon: routeCoordinates[routeCoordinates.length - 1][0],
              lat: routeCoordinates[routeCoordinates.length - 1][1],
              type: 'break',
            },
          ],
          consting: 'auto',
          costing_options: {
            auto: {
              use_tolls: 1,
              use_highways: 0,
            },
          },
          directions_options: {
            units: 'miles',
          },
        }),
      };
      fetch(`${url}?api_key=${apikey}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          if (
            data.trip &&
            data.trip.legs &&
            data.trip.legs[0] &&
            data.trip.legs[0].maneuvers
          ) {
            const maneuvers = data.trip.legs[0].maneuvers;
            const parsedInstructions = maneuvers.map((maneuver: any) => {
              return maneuver.instruction;
            });
            setInstructions(parsedInstructions);
          } else {
            console.error('Invalid Api response', data);
          }
        })
        .catch(error => {
          console.error('errorfetching route instructions', error);
        });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(updateRouteInstructions, 10000);
    return () => clearInterval(intervalId);
  }, [currentPosition, routeCoordinates]);

  const handlePlaceSelect = (selectedPlace: any) => {
    if (currentPosition) {
      const startCoords = currentPosition;
      const endCoords = selectedPlace.geometry.coordinates;

      getRouteCoordinates(startCoords, endCoords);

      setSuggestions([]);
    }
  };

  const calculateRouteSummary = () => {
    if (currentPosition && data) {
      const distance = Math.floor(data.trip.summary.length);
      const totalSeconds = data.trip.summary.time;
      const totalMinutes = Math.floor(totalSeconds / 60); // Convert seconds to minutes

      const hours = Math.floor(totalMinutes / 60); // Calculate hours
      const remainingMinutes = Math.floor(totalMinutes % 60); // Calculate remaining minutes

      let formattedTime = '';

      if (hours > 0) {
        formattedTime += `${hours} hour(s) `;
      }

      if (remainingMinutes > 0) {
        formattedTime += `${remainingMinutes} minute(s)`;
      }

      if (formattedTime === '') {
        formattedTime = 'Less than a minute'; // If the total time is less than a minute
      }

      setTimeTaken(formattedTime);
      setDistance(distance);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(calculateRouteSummary, 1000);
    return () => clearInterval(intervalId);
  }, [data]);

  // useEffect(()=> {
  //   if (currentPosition && data) {
  //     console.log('data', data)
  //     const time = data.trip.summary.time;
  //     const distance = Math.round(data.trip.summary.length);
  //     const hour = Math.floor(time / 3600);
  //     const minute = Math.floor((time * 3600) / 60);
  //     const second = Math.floor(time % 60);
  //     const timeObj = {
  //       hour: hour,
  //       minute: minute,
  //       second: second,
  //     };
  //     setTimeTaken(timeObj);
  //     setDistance(distance);
  //   }
  // },[routeCoordinates])
  // console.log('time',timeTaken)

  return (
    <>
      <Header navigation={navigation} />
      <View style={styles.container}>
        <MapLibreGL.MapView style={styles.map} styleURL={styleUrl}>
          {source && (
            <MapLibreGL.PointAnnotation
              key="currentPosition"
              id=" currentPosition"
              coordinate={source.sourceCoords}
            />
          )}
          {destination && (
            <MapLibreGL.PointAnnotation
              id=" destinationPosition"
              coordinate={destination.destinationCoords}
            />
          )}
          {source && destination && (
            <MapLibreGL.ShapeSource
              id="lineSource"
              shape={{
                type: 'LineString',
                coordinates: [
                  source.sourceCoords,
                  destination.destinationCoords,
                ],
              }}>
              <MapLibreGL.LineLayer
                id="lineLayer"
                style={{
                  lineColor: '#FF0000',
                  lineWidth: 2,
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
          {routeCoordinates.length >= 0 && (
            <MapLibreGL.ShapeSource
              id="routeSource"
              shape={{type: 'LineString', coordinates: routeCoordinates}}>
              <MapLibreGL.LineLayer
                id="routeLayer"
                style={{lineColor: '#FF0000', lineWidth: 2}}
              />
            </MapLibreGL.ShapeSource>
          )}
          {source && (
            <MapLibreGL.Camera
              zoomLevel={10}
              pitch={40}
              centerCoordinate={source.sourceCoords}
              animationDuration={2000}
            />
          )}
          {destination && (
            <MapLibreGL.Camera
              zoomLevel={10}
              pitch={40}
              centerCoordinate={destination.destinationCoords}
              animationDuration={2000}
            />
          )}
        </MapLibreGL.MapView>
        <View style={styles.sammaryDisplayComponent}>
          <Text style={styles.time}>{timeTaken}</Text>
          <Text style={styles.distance}>{distance} KM</Text>
        </View>
      </View>

      <BottomSheet navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // flex:1,
    // height: '55%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  // map: {
  //   ...StyleSheet.absoluteFillObject,
  // },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  sammaryDisplayComponent: {
    backgroundColor: 'grey',
    width: 120,
    height: 'auto',
    position: 'absolute',
    top: 20,
    right: 10,
    borderRadius: 10,
  },
  time: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffce20',
    textAlign: 'center',
  },
  distance: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MapAndRideDisplay;
