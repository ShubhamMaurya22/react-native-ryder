import React, {useRef, useState, useEffect, useDebugValue} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import MapView from 'react-native-maps';
import BottomSheetForOfferRide from '../components/MapAndOfferDisplay/BottomSheetForOfferRide';
import Header from '../components/MapAndOfferDisplay/Header';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {API_KEY} from '../constant/googleMapAPIKey';
import {UseSelector, useDispatch, useSelector} from 'react-redux';
import {UseDispatch} from 'react-redux';
import {addTime, addDistance} from '../features/driverInfoSlice';
import {Image} from 'react-native-elements';
import imagePath from '../constant/imagePath';

MapLibreGL.setAccessToken(null);

const MapForOfferRide = ({navigation}: any) => {
  const apikey = API_KEY;
  const styleUrl = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${apikey}`;
  const dispatch = useDispatch();

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
  const [distance, setDistance] = useState<string | null>(null);

  //redux
  const reduxResponse = useSelector((state: any) => state.driverInfo);
  const {source, destination} = reduxResponse;
  //  setCurrentPosition(source)
  console.log('redux', source.sourceCoords);
  useEffect(() => {
    setCurrentPosition(source.sourceCoords);
    getRouteCoordinates(source.sourceCoords, destination.destinationCoords);
  }, []);

  useEffect(() => {
    dispatch(addDistance(distance));
    dispatch(addTime(timeTaken));
  }, [timeTaken, distance]);
  //

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

      const distance = Math.floor(data.trip.summary.length);
      const totalDistance = `${distance} KM`;
      setTimeTaken(formattedTime);
      setDistance(totalDistance);
    }
  };
  console.log(timeTaken, 'aa');

  useEffect(() => {
    const intervalId = setInterval(calculateRouteSummary, 1000);
    return () => clearInterval(intervalId);
  }, [data]);

  return (
    <>
      <Header navigation={navigation} />
      <View style={{flex: 1}}>
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
          <Text style={styles.distance}>{distance}</Text>
        </View>
      </View>
      <BottomSheetForOfferRide navigation={navigation} />
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
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 30,
    height: 30,
    backgroundColor: 'blue', // Example background color for the marker
    borderRadius: 15, // Make it a circle if desired
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    position: 'absolute',
    bottom: 30, // Adjust as needed to position the name relative to the marker
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MapForOfferRide;
