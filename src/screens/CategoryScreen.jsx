import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import productData from '../data/products.json';
import ProductItem from '../components/ProductItem';

const CategoryScreen = ({ route }) => {
  const { category } = route.params;

  const filteredProducts = productData.products.filter(
    product => product.category === category
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Ürünleri</Text>
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductItem item={item} />}
        keyExtractor={item => item.name}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default CategoryScreen;
