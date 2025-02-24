import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const confirmDelete = (productId, productName) => {
    Alert.alert(
      "Ürünü Sil",
      `"${productName}" adlı ürünü silmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        { text: "Evet", onPress: () => removeFromCart(productId) },
      ]
    );
  };

  const handleOrder = async () => {
    try {
      if (!cartItems || cartItems.length === 0) {
        Alert.alert('Hata', 'Sepetiniz boş');
        return;
      }
  
      // Yeni sipariş detaylarını oluştur
      const orderDate = new Date().toLocaleString('tr-TR');
      const orderDetails = {
        date: orderDate,
        item: cartItems.map(item => ({    // 'items' yerine 'item' kullanıyoruz
          name: item.name,
          quantity: item.quantity,
          id: item.id
        }))
      };
  
      // Mevcut siparişleri getir
      const existingOrdersJson = await AsyncStorage.getItem('orders');
      let existingOrders = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];
  
      // Yeni siparişi başa ekle
      existingOrders.unshift(orderDetails);
  
      // Sadece son 5 siparişi tut
      if (existingOrders.length > 5) {
        existingOrders = existingOrders.slice(0, 5);
      }
  
      // Güncellenmiş sipariş listesini kaydet
      await AsyncStorage.setItem('orders', JSON.stringify(existingOrders));

      const savedOrders = await AsyncStorage.getItem('orders');
console.log('Kaydedilen siparişler:', savedOrders); // Kontrol 1
      
      // Sepeti temizle
      await clearCart();
  
      Alert.alert('Başarılı', 'Siparişiniz başarıyla kaydedildi');
  
    } catch (error) {
      console.error('Sipariş kaydedilirken hata oluştu:', error);
      Alert.alert('Hata', 'Sipariş kaydedilirken bir hata oluştu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sepetim</Text>

      {!cartItems || cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Sepetiniz boş</Text>
      ) : (
        <View>
          <View style={styles.Info}>
            <Text style={styles.InfoText}>Ürünler</Text>
            <Text style={styles.InfoText}>Miktar</Text>
            <Text style={styles.InfoText}>İşlemler</Text>
          </View>

          <FlatList
            data={cartItems}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.product}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.quantity} adet</Text>

                <TouchableOpacity style={styles.DeleteIcon} onPress={() => confirmDelete(item.id, item.name)}>
                  <Icon name="delete" size={25} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
          
          <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
            <Text style={styles.orderButtonText}>Sipariş Ver</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyCart: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  Info: {
    width: '95%',
    color: '#888',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '5%',
  },
  InfoText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 18,
  },
  product: {
    width: '100%',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center', // Buton ve metinleri hizalamak için
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '45%',
  },
  productPrice: {
    fontSize: 16,
    color: '#e86924',
    width: '45%',
  },
  DeleteIcon: {
    width: '10%',
  },
  orderButton: {
    marginTop: 20,
    marginBottom: 20, // Tab bar'dan uzaklaştırmak için marginBottom ekledim
    padding: 15,
    backgroundColor: '#4CAF50', // Yeşil renk
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  orderButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  }
});

export default CartScreen;
