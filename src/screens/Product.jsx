import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { useCart } from '../context/CartContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Product = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState('1');
  const { cartItems, addToCart, updateQuantity } = useCart(); 

  const handleAddToCart = async () => {
    const existingProduct = cartItems.find(item => item.id === product.id);
    
    if (existingProduct) {
      const newQuantity = parseInt(existingProduct.quantity) + parseInt(quantity);
      updateQuantity(product.id, newQuantity.toString());
    } else {
      addToCart(product, quantity);
    }

    // Yeni siparişi kaydetmek
    const currentDate = new Date().toLocaleString();
    const newOrder = {
      date: currentDate,
      products: cartItems.map(item => ({ name: item.name, quantity: item.quantity })),
    };
    
    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      orders.push(newOrder);

      if (orders.length > 5) {
        orders.shift();  // Son 5 siparişi tutmak için ilkini sil
      }

      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      Alert.alert('Sipariş Başarıyla Kaydedildi!', `${quantity} adet ${product.name} sepete eklendi.`);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{product.name}</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <Button title="Sepete Ekle" onPress={handleAddToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '50%',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Product;
