import { View, Text ,StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faCircle, faCommentDots} from '@fortawesome/free-solid-svg-icons'

const Header = ({navigation}) => {
  const handleInboxPress = () => {
    navigation.navigate('InboxScreen', {navigation: {navigation}})
  }
  return (
    <>
    <View style={styles.headContainer}>
      <Text style={styles.headTitle}>Hello Ryder</Text>
      <TouchableOpacity onPress={() => handleInboxPress()}>
         <FontAwesomeIcon icon={faCommentDots} color='green' size={30}/>
         <FontAwesomeIcon  icon={faCircle} color='#ee6363' size={12} style={styles.headNotification}/>
      </TouchableOpacity>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  headContainer:{
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between'
  },
  headTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3c3c3c'
  },
  headNotification: {
    position: 'absolute',
    right: 0,
    top: -2
    
  
  }
})

export default Header