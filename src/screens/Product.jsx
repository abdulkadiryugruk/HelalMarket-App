import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useCart } from '../context/CartContext'; // 🚀 Sepet fonksiyonlarını al

const Product = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState('1');
  const { addToCart } = useCart(); // ✅ Sepete ekleme fonksiyonunu al

  const handleAddToCart = () => {
    addToCart(product, quantity); // 🚀 Ürünü sepete ekle
    alert(`${quantity} adet ${product.name} sepete eklendi!`);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{product.name}</Text>
      {/* <Text style={styles.productPrice}>{product.price} TL</Text> */}

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
  productPrice: {
    fontSize: 18,
    color: '#e86924',
    marginBottom: 20,
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
