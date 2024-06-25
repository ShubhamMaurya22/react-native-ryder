import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleRight, faClock} from '@fortawesome/free-solid-svg-icons';


const SchedulePools = () => {
  return (
    <>
        <TouchableOpacity style={styles.currentLocationContainer}>
            <View style={styles.selectLocation}>
                <FontAwesomeIcon icon={faClock} color='grey' size={22}/>
                <Text style={styles.locationText}>Ratnagiri ram mandir</Text>
            </View>
            <FontAwesomeIcon icon={faAngleRight} size={22} color='grey'/>
        </TouchableOpacity>
        <View style={styles.separetor}/>
        <TouchableOpacity style={styles.currentLocationContainer}>
            <View style={styles.selectLocation}>
                <FontAwesomeIcon icon={faClock} color='grey' size={22}/>
                <Text style={styles.locationText}>Ratnagiri ram mandir</Text>
            </View>
            <FontAwesomeIcon icon={faAngleRight} size={22} color='grey'/>
        </TouchableOpacity>
    
    </>
  )
}

const styles = StyleSheet.create({
    currentLocationContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginVertical: 20
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
        borderBottomWidth: 1,
        marginHorizontal: 20,
        marginTop: 10,
        borderColor: 'grey'
    }
})

export default SchedulePools
