import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Input, Button, ListItem } from '@rneui/themed';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

ref(database,'places/')

export default function Places({ navigation, route }) {
  const [address, setAddress] = useState('');
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'places/');
    onValue(itemsRef, snapshot => {
    const data = snapshot.val();
    const addresses = data ? Object.keys(data).map(key => ({ key, ...data[key]}))
    : [];
    setPlaces(addresses);
    })
  }, []);

  useEffect(() => {
    const { foundAddress } = route.params || false;
    if (foundAddress) {
      savePlace(foundAddress);
    }
  }, [route.params?.foundAddress]);

  const savePlace = (address) => {
    push(
    ref(database, 'places/'),
    { 'address': address });
    setAddress('');
  }

  const deletePlace = (key) => {
    remove(ref(database, 'places/' + key)).then(() => {
      console.log('Successfully removed item with id ' + key);
    });
  }
    
  return (
  <View style={styles.container}>
    <Input
      placeholder='Type address' label='PLACEFINDER'
      onChangeText={text => setAddress(text)} value={address} />
    <Button raised
        title="SHOW ON MAP"
        onPress={() => navigation.navigate('Map', {address: address})} 
    />
    <View style={styles.list}>
      <FlatList 
        ListHeaderComponent={() => <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 5}}>Locations</Text>}
        data={places} 
        keyExtractor={(item, index) => index}
        renderItem={ ({ item }) =>
          <ListItem.Swipeable bottomDivider
          key={item.id}
          rightContent={ 
            <Button
              title="Delete"
              onPress={() => deletePlace(item.key)}
              icon={{ name: 'delete', color: 'white' }}
              buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
            />
          }>
            <ListItem.Content>
              <ListItem.Title>{item.address}</ListItem.Title>
              <ListItem.Subtitle style={{fontSize: 14, color: '#0000ff'}} onPress={() => navigation.navigate('Map', {address: item.address})}> Show on map</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem.Swipeable>
        }
      />  
    </View>   
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'flex-start',
   marginTop: 20
  },
  inputs: {
    width: '90%',
    marginTop: 20
  },
  list: {
    marginTop: 5,
    width: '90%'
  }
});