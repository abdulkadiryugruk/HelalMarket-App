import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; 
import { getImageSource } from '../utils/getImageSource';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import QuantitySelector from '../components/salesTypeConfig';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  
  const [unitType, setUnitType] = useState('gram');
  const [quantity, setQuantity] = useState(
    product['satis-sekli'] === 'adet' ? '1' : '10'
  );

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    let finalQuantity;
    
    if (product['satis-sekli'] === 'adet') {
      finalQuantity = parseInt(quantity, 10); // Explicitly parse as base 10
      if (isNaN(finalQuantity) || finalQuantity < 1) {
        Alert.alert('Hata', 'Lütfen geçerli bir adet miktarı girin.');
        return;
      }
    } else if (product['satis-sekli'] === 'gram') {
      const numValue = parseFloat(quantity.replace(',', '.')); // Remove comma, parse as float
      const maxValue = unitType === 'gram' ? 1000 : 1;
      const minValue = unitType === 'gram' ? 10 : 0.1;
  
      if (isNaN(numValue) || numValue < minValue || numValue > maxValue) {
        Alert.alert(
          'Geçersiz Miktar', 
          unitType === 'gram' 
            ? `Lütfen 10 gram ile 1000 gram arasında bir değer girin.` 
            : `Lütfen 0.1 kg ile 10 kg arasında bir değer girin.`
        );
        return;
      }
  
      finalQuantity = unitType === 'kilo' ? Math.round(numValue * 1000) : Math.round(numValue);
    }
  
    addToCart({
      ...product,
      quantity: finalQuantity  // Use the calculated finalQuantity directly
    });

    Toast.show({
      type: 'success',
      text1: 'Sepete Eklendi',
      text2: `${product.name} sepetinize eklendi 👋`,
      visibilityTime: 2000,
      autoHide: true,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.productTitle}>Ürün Detay</Text>
        
        <View style={styles.headerButton} />
      </View>

      {/* Ürün Görseli */}
      <Image source={getImageSource(product.image)} style={styles.productImage} />

      {/* Ürün İsmi */}
      <Text style={styles.productName}>{product.name}</Text>

      {/* Miktar Seçici */}
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityTitle}>Miktar Seç</Text>
        <QuantitySelector 
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          unitType={unitType}
          setUnitType={setUnitType}
        />
      </View>

      {/* Sepete Ekle Butonu */}
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Icon name="shopping-cart" size={24} color="#fff" />
        <Text style={styles.addToCartButtonText}>Sepete Ekle</Text>
      </TouchableOpacity>

      {/* Toast Bildirimi */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e86924',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerButton: {
    padding: 5,
  },
  productTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  productImage: {
    width: '90%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  quantityContainer: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#e86924',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProductDetail;
