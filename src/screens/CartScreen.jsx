import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useCart} from '../context/CartContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CartScreen = () => {
  const {cartItems} = useCart();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sepetim</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Sepetiniz boş</Text>
      ) : (
        <View>
          <View style={styles.Info}>
            <Text style={styles.InfoText}>urunler</Text>
            <Text style={styles.InfoText}>miktar</Text>
            <Text style={styles.InfoText}>islemler</Text>
          </View>

          <FlatList
            data={cartItems}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.product}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.quantity} adet</Text>
                <TouchableOpacity>
                <Icon name="delete" size={25} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
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
    marginLeft: '5%',
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
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#e86924',
  },
  delete: {
    fontSize: 16,
    color: '#e86924',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
});

export default CartScreen;
