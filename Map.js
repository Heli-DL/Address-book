import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { MAP_API_KEY } from '@env';

const apikey = MAP_API_KEY;

export default function SettingsScreen({ route, navigation }) {
  const { address } = route.params;
  const [markerText, setMarkerText] = useState('');
  const [region, setRegion] = useState({
    latitude: 60.1699,
    longitude: 24.9384,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [foundAddress, setFoundAddress] = useState('');


  useEffect(() => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${apikey}&location=${address}`, {
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.results[0].locations[0].latLng);
      setRegion({
        ...region,
        latitude: data.results[0].locations[0].latLng.lat,
        longitude: data.results[0].locations[0].latLng.lng
      });
      setMarkerText(address);
      setFoundAddress(`${data.results[0].locations[0].street}, ${data.results[0].locations[0].adminArea6}, ${data.results[0].locations[0].adminArea5}`);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);
  
  return(
    <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          >
          <Marker
          coordinate={{
            latitude: region.latitude, 
            longitude: region.longitude }}
            title= {markerText} />
        </MapView>
      <View style={styles.input}>
      <Button title="Save location" onPress={() => navigation.navigate('Places', {foundAddress: foundAddress})} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  input: {
    width: '70%',
    height: 40,
    marginTop: 20,
    paddingHorizontal: 10,
  },
});