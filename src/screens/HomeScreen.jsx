import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const categories = ['Şarküteri', 'Manav', 'Bakliyat', 'Yağ'];

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#e86924" barStyle="light-content" />
      <View style={styles.TopBar}>
        <Text style={styles.TopBarTitle}>HELAL MARKET</Text>
      </View>

      <Text style={styles.categoryTitle}>KATEGORİLER</Text>

      <FlatList
        data={categories}
        keyExtractor={item => item}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => navigation.navigate('CategoryScreen', {category: item})}>
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  TopBar: {
    height: '7%',
    width: '100%',
    backgroundColor: '#e86924',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  TopBarTitle: {
    fontSize: 35,
    color: '#008242',
    fontWeight: 'bold',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: '#008242',
    paddingVertical: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  BottomBar: {
    height: '7%',
    width: '100%',
    backgroundColor: '#e86924',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});

export default HomeScreen;