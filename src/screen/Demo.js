import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import mapTemplate from '../../map-template';

export default function Demo() {
  let webRef = undefined;
  let [mapCenter, setMapCenter] = useState('17.051760921778023, 73.57625606880929');

  const onButtonPress = () => {
    const [lng, lat] = mapCenter.split(",");
    webRef.injectJavaScript(`map.setCenter([${parseFloat(lng)}, ${parseFloat(lat)}])`);
  }

  const handleMapEvent = (event) => {
    setMapCenter(event.nativeEvent.data)
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TextInput 
        style={styles.textInput}
        onChangeText={setMapCenter}
        value={mapCenter}></TextInput>
        <Button title="Set Center" onPress={onButtonPress}></Button>
      </View>
      <WebView
        ref={(r) => (webRef = r)}
        onMessage={handleMapEvent}
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: mapTemplate }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        // ...StyleSheet.absoluteFillObject,
        flex:1,
        // height: '55%',
        // justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
})