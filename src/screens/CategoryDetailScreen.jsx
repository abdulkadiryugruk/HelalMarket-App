import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import productData from '../data/urunler.json';
import ProductItem from '../components/ProductItem';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';



const {width} = Dimensions.get('window');

const CategoryDetailScreen = () => {
  const route = useRoute();
  const {category} = route.params;
  const navigation = useNavigation();

  // Ana kategori
  const [selectedMainCategory, setSelectedMainCategory] = useState(category);

  // Seçili alt kategori
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    productData.find(item => item.kategori === category)?.['alt-kategori'] ||
      '',
  );

  // JSON verilerinden ana kategorileri çıkarma
  const mainCategories = [...new Set(productData.map(item => item.kategori))];

  // Seçili ana kategorinin alt kategorilerini bulma
  const subCategories = [
    ...new Set(
      productData
        .filter(item => item.kategori === selectedMainCategory)
        .map(item => item['alt-kategori']),
    ),
  ];

  // Seçili alt kategorinin ürünlerini bulma
  const filteredProducts = productData.filter(
    product =>
      product.kategori === selectedMainCategory &&
      product['alt-kategori'] === selectedSubCategory,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              
              <Text style={styles.productTitle}>Ürünler</Text>
              
              <View style={styles.headerButton} />
            </View>
      <View style={{height:100}}>
      {/* Ana Kategori Seçici */}
      <FlatList
  horizontal
  data={mainCategories}
  renderItem={({item}) => (
    <TouchableOpacity
    activeOpacity={0.8}
      style={[
        styles.mainCategoryItem,
        selectedMainCategory === item && styles.selectedMainCategory,
      ]}
      onPress={() => {
        setSelectedMainCategory(item);
        setSelectedSubCategory(
          productData.find(p => p.kategori === item)?.['alt-kategori'] || ''
        );
      }}>
      <Text style={styles.mainCategoryText}>{item}</Text>
    </TouchableOpacity>
  )}
  keyExtractor={item => item}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.mainCategoryList}
/>
  
      {/* Alt Kategori Seçici */}
      <FlatList
        horizontal
        data={subCategories}
        renderItem={({item}) => (
          <TouchableOpacity
    activeOpacity={0.8}

            style={[
              styles.subCategoryItem,
              selectedSubCategory === item && {},
            ]}
            onPress={() => setSelectedSubCategory(item)}>
            <Text
              style={[
                styles.subCategoryText,
                selectedSubCategory === item && {color: '#e86924'},
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subCategoryList}
      />
      </View>
  
      {/* Ürünler */}
      <FlatList
        data={filteredProducts}
        renderItem={({item}) => <ProductItem item={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        initialNumToRender={10} // İlk başta sadece 10 öğe render edilsin
        maxToRenderPerBatch={10} // Her defasında maksimum 10 öğe render edilsin
        windowSize={5} // Performansı artırmak için pencere boyutunu belirle
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e86924',
    paddingVertical: 5,
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
  mainCategoryList: {
    height: 50,
    backgroundColor: '#008242',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCategoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMainCategory: {
    backgroundColor: '#e86924',
  },
  mainCategoryText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  subCategoryList: {
    height: 50, // Sabit yükseklik
    backgroundColor: 'white',
    paddingVertical: 5,
  },
  subCategoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: .2,
  },
  subCategoryText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    color: 'black',

  },
  productList: {
    paddingHorizontal: 10,
  }
});

export default CategoryDetailScreen;
