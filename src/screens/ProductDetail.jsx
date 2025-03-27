import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, ScrollView, Platform, ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QuantitySelector from '../components/salesTypeConfig';
import { useCart } from '../context/CartContext'; 
import { getImageSource } from '../utils/getImageSource';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  
  const [unitType, setUnitType] = useState('gram');
  const [quantity, setQuantity] = useState(
    product['satis-sekli'] === 'adet' ? '1' : '100'
  );

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    let finalQuantity;
    
    if (product['satis-sekli'] === 'adet') {
      finalQuantity = parseInt(quantity, 10);
      if (isNaN(finalQuantity) || finalQuantity < 1) {
        Alert.alert('Hata', 'Lütfen geçerli bir adet miktarı girin.');
        return;
      }
    } else if (product['satis-sekli'] === 'gram') {
      const numValue = parseFloat(quantity.replace(',', '.'));
      const maxValue = unitType === 'gram' ? 1000 : 10; // Kilo için max 10 kg
      const minValue = unitType === 'gram' ? 100 : 0.1;
  
      if (isNaN(numValue) || numValue < minValue || numValue > maxValue) {
        Alert.alert(
          'Geçersiz Miktar', 
          unitType === 'gram' 
            ? `Lütfen 100 gram ile 1000 gram arasında bir değer girin.` 
            : `Lütfen 0.1 kg ile 10 kg arasında bir değer girin.`
        );
        return;
      }
  
      finalQuantity = unitType === 'kilo' ? Math.round(numValue * 1000) : Math.round(numValue);
    }
  
    addToCart({
      ...product,
      quantity: finalQuantity
    });
    ToastAndroid.showWithGravityAndOffset(
                    `${product.name} sepetinize eklendi 👋`,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                  );

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

      {/* Ürün Görseli (Sabit Kalacak) */}
      <Image source={getImageSource(product.image)} style={styles.productImage} />

      {/* Klavye Açıldığında Kayacak Alanlar */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.bottomContainer}>
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

            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Icon name="shopping-cart" size={24} color="#fff" />
              <Text style={styles.addToCartButtonText}>Sepete Ekle</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    marginVertical: 10,
    marginTop: '10%',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
  },
  quantityContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
    backgroundColor: 'white',
    width: '100%',
    textAlign: 'center',
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
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default ProductDetail;
