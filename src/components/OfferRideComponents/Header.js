import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons'

const Header = ({navigation}) => {
  return (
    <View style={styles.headComponent}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faAngleLeft} color='#3c3c3c' size={25}/>
        </TouchableOpacity>
      <View style={styles.textComponent}>
        <Text style={styles.headText}>Vehicle Details</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    headComponent:{
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
        
    },
    textComponent:{
        position: 'absolute',
        left: '50%', 
        transform: [{ translateX: -60 }], 
    },
    headText:{
        fontSize: 18,
        fontWeight: 'bold',
        color: 'grey'
    },
})

export default Header
