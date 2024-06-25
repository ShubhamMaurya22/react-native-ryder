import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleLeft,
  faPhone,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import {GiftedChat} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import imagePath from '../constant/imagePath';

const ChatScreen = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [newMsgCount, setNewMesgCount] = useState(0);
  const route = useRoute();
  // console.log('route', route.params)
  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(route.params.id + route.params.data.userId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const allMessages = querySnapshot.docs.map(doc => doc.data());
        setMessages(allMessages);
        //no of msg
        // console.log(querySnapshot)
        const newMessage = allMessages.filter(msg => msg != msg.read);
        setNewMesgCount(newMessage.length);
      });

    return () => subscriber(); // Unsubscribe from the snapshot listener
  }, []);

  // console.log('mazi',route.params.id)
  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sentTo: route.params.data.userId,
      createdAt: Date.parse(msg.createdAt),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .add(myMsg);
    firestore()
      .collection('chats')
      .doc('' + route.params.data.userId + route.params.id)
      .collection('messages')
      .add(myMsg);
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={styles.chatHeader}>
        <View style={styles.chatHeaderContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faAngleLeft} color="#3c3c3c" size={25} />
          </TouchableOpacity>
          <Text style={styles.chatName}>
            {route.params.data.userName.toUpperCase()}
          </Text>
        </View>
        {/* <TouchableOpacity style={styles.chatCall}>
          <FontAwesomeIcon icon={faPhone} color="#3c3c3c" size={20} />
        </TouchableOpacity> */}
      </View>
      {/* <View style={styles.notificationContainer}>
        {newMsgCount > 0 && <Text style={styles.notification}>{newMsgCount} new message(s)</Text>}
      </View> */}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.id,
          // avatar: imagePath.driverImage
        }}
        textInputProps={{
          style: {color: 'black'}, // Specify black color for the input text
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#2eb17f',
  },
  chatHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#3c3c3c',
  },
  chatCall: {},
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  sendText: {
    borderWidth: 1.5,
    width: '85%',
    height: 54,
    borderRadius: 10,
    borderColor: '#3c3c3c',
    paddingLeft: 14,
    fontSize: 16,
    color: '#3c3c3c',
  },
  sendBtn: {
    borderWidth: 1.5,
    width: '14%',
    height: 54,
    borderRadius: 12,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#3c3c3c',
  },
  notificationContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  notification: {
    color: 'blue',
  },
});

export default ChatScreen;
