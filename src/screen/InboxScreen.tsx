import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import InboxChatDisplay from '../components/Inbox/InboxChatDisplay';

const InboxScreen = ({navigation}: any) => {
  return (
    <>
      <View style={styles.inboxContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faAngleLeft} color="#3c3c3c" size={25} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.inboxText}>Inbox</Text>
        </View>
      </View>
      <InboxChatDisplay navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  inboxContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#2eb17f',
  },
  textContainer: {
    position: 'absolute',
    left: '50%',
    // transform:[{translateX: -5}],
  },
  inboxText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InboxScreen;
