import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  AppState,
} from 'react-native';
import {useCart} from '../context/CartContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useOrder} from '../context/OrderContext';
import {getImageSource} from '../utils/getImageSource';
import {ConfirmCard} from '../utils/ConfirmCard';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const CartScreen = () => {
  const {cartItems, removeFromCart, clearCart} = useCart();
  const [hasProfileInfo, setHasProfileInfo] = useState(false);
  const {refreshOrders} = useOrder();
  const navigation = useNavigation();
  const Confirm = () => ConfirmCard(cartItems, clearCart, refreshOrders);
  const [appState, setAppState] = useState(AppState.currentState);

  // Profil bilgilerini kontrol et
  const checkProfileInfo = async () => {
    try {
      const name = await AsyncStorage.getItem('name');
      const number = await AsyncStorage.getItem('number');
      const address = await AsyncStorage.getItem('address');

      const profileComplete = !!name && !!number && !!address;
      setHasProfileInfo(profileComplete);
      return profileComplete;
    } catch (error) {
      console.error('Profil bilgileri kontrol edilirken hata oluştu:', error);
      return false;
    }
  };

  // İlk yükleme sırasında profil bilgilerini kontrol et
  useEffect(() => {
    checkProfileInfo();
  }, []);

  // Ekran her odaklandığında profil bilgilerini kontrol et
  useFocusEffect(
    React.useCallback(() => {
      checkProfileInfo();
    }, [])
  );

  // AppState değişikliklerini dinle (arka plan/ön plan geçişleri)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // Uygulama ön plana geçtiğinde profil bilgilerini kontrol et
        checkProfileInfo();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const formatQuantity = (item) => {
    const quantity = Number(item.quantity);
  
    switch(item['satis-sekli']) {
      case 'adet':
        return `${quantity} adet`;
      case 'gram':
        return quantity >= 1000 
          ? `${(quantity / 1000).toFixed(2)} kg` 
          : `${quantity} gram`;
      default:
        return `${quantity} birim`;
    }
  };

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
                onPress={() => navigation.navigate('ProductDetail', {product: item})}>
                <Image
                  source={getImageSource(item.image)}
                  style={styles.productImage}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.productInfo}
                onPress={() => navigation.navigate('ProductDetail', {product: item})}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQuantity}>{formatQuantity(item)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDelete(item.id, item.name)}>
                <Icon name="delete" size={28} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {!hasProfileInfo && cartItems.length > 0 && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ Sipariş vermek için profil bilgilerinizi tamamlamalısınız.
          </Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profilim')}>
            <Text style={styles.profileButtonText}>Profil Bilgilerini Düzenle</Text>
          </TouchableOpacity>
        </View>
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
  warningContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  warningText: {
    color: '#F44336',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  profileButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  profileButtonText: {
    color: 'white',
    fontWeight: 'bold',
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