import React, { useEffect, useState } from 'react';
import { View, Button, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const Whatsapp = () => {
  // const [location, setLocation] = useState(null);
  // const [location, setLocation] = useState([73.439031366401, 17.0471870781106]);

  // useEffect(() => {
  //   // Fetch the user's current location when the component mounts
  //   getCurrentLocation();
  // }, []);

  let location = {latitude:73.439031366401, longitude:17.0471870781106}

  const getCurrentLocation = () => {
    try {
        Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
            },
            (error) => {
              console.log('Error getting location:', error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
    } catch (error) {
        console.log('whatsapp error', error)
    }
  };

  const shareLocationOnWhatsApp = async () => {
    if (location) {
      const whatsappMessage = `Check out my current location: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
      const whatsappURL = `whatsapp://send?text=${whatsappMessage}`;
  
      try {
        // Open WhatsApp
        await Linking.openURL(whatsappURL);
      } catch (error) {
        // Handle error
        console.error('Error opening WhatsApp:', error);
        // Display error message to the user or implement fallback option
      }
    } else {
      // Handle case where location is not available
      console.log('Location not available');
      // Provide a fallback option (e.g., display a message to the user)
    }
  };

  function sendMessageWithoutSavingNumber(senderNumber, receiverNumber, message) {
  try {
    const url = `https://wa.me/${receiverNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

  // Example usage
  const senderNumber = '7208281963';
  const receiverNumber = '9325572498';
  const whatsappMessage = `Check out my current location: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  const whatsappURL = `whatsapp://send?text=${whatsappMessage}`;
  // const message = 'Hello! This is a test message.';
  
  // Call the function to send the message
  sendMessageWithoutSavingNumber(senderNumber, receiverNumber, whatsappURL);
  

  return (
    <View>
      <Button title="Share Location on WhatsApp" onPress={shareLocationOnWhatsApp} />
    </View>
  );
};

export default Whatsapp;

