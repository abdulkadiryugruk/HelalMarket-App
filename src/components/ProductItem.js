import React, {memo} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getImageSource } from '../utils/getImageSource';


const ProductItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={getImageSource(item.image)} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
});

export default memo(ProductItem);