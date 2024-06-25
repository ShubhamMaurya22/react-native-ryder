import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCrosshairs, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import Geolocation from '@react-native-community/geolocation';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {API_KEY} from '../../src/constant/googleMapAPIKey';

MapLibreGL.setAccessToken(null);


  return (
    <>
        <TouchableOpacity style={styles.currentLocationContainer} onPress={onCurrentLocSubmit}>
            <View style={styles.selectLocation}>
                <FontAwesomeIcon icon={faCrosshairs} color='green' size={22}/>
                <Text style={styles.locationText}>Use current location</Text>
            </View>
            <FontAwesomeIcon icon={faAngleRight} size={22} color='grey'/>
        </TouchableOpacity>
        <View style={styles.separetor}></View>
    
    </>
  )
}

const styles = StyleSheet.create({
    currentLocationContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 30
    },
    selectLocation:{
        flexDirection: 'row',
    
    },
    locationText: {
        fontSize: 18,
        fontWeight: '700',
        paddingLeft: 15
    },
    separetor: {
        borderBottomWidth: 1.5,
        marginHorizontal: 20,
        marginTop: 10,
        borderColor: 'grey'
    }
})

export default CurrentLocation
