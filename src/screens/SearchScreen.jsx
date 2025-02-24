import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import productData from '../data/products.json';
import ProductItem from '../components/ProductItem';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productData.products);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredProducts(productData.products);
    } else {
      const filteredData = productData.products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filteredData);
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
        keyExtractor={item => item.name}
        numColumns={2}
        renderItem={({ item }) => <ProductItem item={item} />}
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
});

export default SearchScreen;
