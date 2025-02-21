import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import productData from '../data/products.json'; // JSON dosyasını dahil edin

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');  // Arama terimi için state
  const [filteredProducts, setFilteredProducts] = useState(productData.products); // Filtrelenmiş ürünler

  // Arama sorgusunu her değiştirdiğinde ürünleri filtrele
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredProducts(productData.products);  // Arama boşsa tüm ürünleri göster
    } else {
      const filteredData = productData.products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filteredData);  // Arama sonucuna göre ürünleri filtrele
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Ürün ara..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
    <View style={styles.productContainer}>
      <View style={styles.products}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price} TL</Text>
      </View>
    </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
  },
  productContainer: {
    flex: 1,
    margin: 5,
  },
  products: {
    padding: 15,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    color: '#e86924',
    marginTop: 5,
  },
});

export default SearchScreen;
