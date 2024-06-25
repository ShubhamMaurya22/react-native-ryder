import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons'

const Header = ({navigation}) => {
  return (
    <View style={styles.headComponent}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faAngleLeft} color='#3c3c3c' size={25}/>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    headComponent:{
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1
        
    },
})

export default Header
