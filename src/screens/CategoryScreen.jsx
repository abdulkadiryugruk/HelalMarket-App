import React from 'react'; // useEffect'i kaldırdık çünkü şu an kullanmıyoruz
import {View, Text, FlatList, StyleSheet} from 'react-native';
import productData from '../data/products.json';

const CategoryScreen = ({route, navigation}) => {
  const {category} = route.params;

  const filteredProducts = productData.products.filter(
    product => product.category === category,
  );

  // FlatList'i optimize edelim
  const renderItem = ({item}) => (
    <View style={styles.productContainer}>
      <View style={styles.products}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price} TL</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Ürünleri</Text>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        initialNumToRender={4}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={false} // Bu özelliği false yapıyoruz
        extraData={category} // Category değiştiğinde yeniden render edilmesini sağlar
        contentContainerStyle={styles.listContainer}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
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
    minHeight: 100, // Minimum yükseklik ekledik
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

export default CategoryScreen;
