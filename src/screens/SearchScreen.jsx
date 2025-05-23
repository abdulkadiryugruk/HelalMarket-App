import React, {useState} from 'react';
import {View, TextInput, FlatList, StyleSheet} from 'react-native';
import productData from '../data/urunler.json';
import ProductItem from '../components/ProductItem';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productData);

  const handleSearch = text => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredProducts(productData);
    } else {
      const filteredData = productData.filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filteredData);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Ürün Ara..."
        placeholderTextColor="gray"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        renderItem={({item}) => <ProductItem item={item} />}
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
    color: 'black',
  },
});

export default SearchScreen;
