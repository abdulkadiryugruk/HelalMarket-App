import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useCart} from '../context/CartContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useOrder} from '../context/OrderContext';
import {getImageSource} from '../utils/getImageSource';
import {ConfirmCard} from '../utils/ConfirmCard';
import {useNavigation} from '@react-navigation/native';

const CartScreen = () => {
  const {cartItems, removeFromCart, clearCart} = useCart();
  const [hasProfileInfo, setHasProfileInfo] = useState(false);
  const {refreshOrders} = useOrder();
  const navigation = useNavigation();
  const Confirm = () => ConfirmCard(cartItems, clearCart, refreshOrders);

  // Profil bilgilerini kontrol et
  useEffect(() => {
    const checkProfileInfo = async () => {
      try {
        const name = await AsyncStorage.getItem('name');
        const number = await AsyncStorage.getItem('number');
        const address = await AsyncStorage.getItem('address');

        setHasProfileInfo(!!name && !!number && !!address);
      } catch (error) {
        console.error('Profil bilgileri kontrol edilirken hata oluştu:', error);
      }
    };

    checkProfileInfo();
  }, []);

  const confirmDelete = (productId, productName) => {
    Alert.alert(
      'Ürünü Sil',
      `"${productName}" adlı ürünü silmek istediğinize emin misiniz?`,
      [
        {text: 'İptal', style: 'cancel'},
        {text: 'Evet', onPress: () => removeFromCart(productId)},
      ],
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛒 Sepetim</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Sepetiniz boş</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Product', {product: item})}>
                <Image
                  source={getImageSource(item.image)}
                  style={styles.productImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.productInfo}
                onPress={() => navigation.navigate('Product', {product: item})}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQuantity}>{item.quantity} adet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDelete(item.id, item.name)}>
                <Icon name="delete" size={28} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {!hasProfileInfo && cartItems.length === 0 && (
        <Text style={styles.warningText}>
          ⚠️ Sipariş vermek için profil bilgilerinizi tamamlamalısınız.
        </Text>
      )}

      {cartItems.length > 0 && hasProfileInfo && (
        <TouchableOpacity style={styles.orderButton} onPress={Confirm}>
          <Text style={styles.orderButtonText}>📦 Sipariş Ver</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5', padding: 20},
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  emptyCart: {fontSize: 18, color: '#888', textAlign: 'center', marginTop: 20},
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  productImage: {width: 60, height: 60, borderRadius: 8, marginRight: 10},
  productInfo: {flex: 1},
  productName: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  productQuantity: {fontSize: 14, color: '#555'},
  warningText: {
    color: '#F44336',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  orderButtonText: {fontSize: 18, color: 'white', fontWeight: 'bold'},
});

export default CartScreen;
