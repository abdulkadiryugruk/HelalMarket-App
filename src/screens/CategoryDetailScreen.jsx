import React, {useState, useRef, useEffect, useMemo} from 'react';
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

  // JSON verilerinden ana kategorileri çıkarma
  const mainCategories = useMemo(() => {
    const allCategories = [];
    productData.forEach(item => {
      if (Array.isArray(item.kategori)) {
        // Array formatlı kategoriler için
        item.kategori.forEach(cat => allCategories.push(cat));
      } else {
        // String formatlı kategoriler için
        allCategories.push(item.kategori);
      }
    });
    return [...new Set(allCategories)]; // Tekrarlanan kategorileri kaldır
  }, []);

  // Seçili ana kategoriye ait olan ürünleri bulma
  const productsInSelectedCategory = useMemo(() => {
    return productData.filter(product => {
      if (Array.isArray(product.kategori)) {
        return product.kategori.includes(selectedMainCategory);
      }
      return product.kategori === selectedMainCategory;
    });
  }, [selectedMainCategory]);

  // Seçili ana kategorinin alt kategorilerini bulma
  const subCategories = useMemo(() => {
    const subCats = productsInSelectedCategory
      .map(product => product['alt-kategori'])
      .filter(subCat => subCat !== ''); // Boş alt kategorileri filtrele
    
    return [...new Set(subCats)]; // Tekrarlanan alt kategorileri kaldır
  }, [productsInSelectedCategory]);

  // Seçili alt kategori
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    subCategories.length > 0 ? subCategories[0] : ''
  );

  // Seçili alt kategorinin ürünlerini bulma
  const filteredProducts = useMemo(() => {
    return productsInSelectedCategory.filter(
      product =>
        selectedSubCategory === '' ||
        product['alt-kategori'] === selectedSubCategory
    );
  }, [productsInSelectedCategory, selectedSubCategory]);

  // Ana kategori değiştiğinde alt kategori seçimini güncelle
  useEffect(() => {
    if (subCategories.length > 0) {
      setSelectedSubCategory(subCategories[0]);
    } else {
      setSelectedSubCategory('');
    }
  }, [subCategories, selectedMainCategory]);

  // FlatList referansları
  const mainCategoryListRef = useRef(null);
  const subCategoryListRef = useRef(null);

  // Sayfa yüklendiğinde seçilen kategoriyi ortala
  useEffect(() => {
    if (mainCategoryListRef.current && mainCategories.length > 0) {
      const selectedIndex = mainCategories.findIndex(
        item => item === selectedMainCategory,
      );

      mainCategoryListRef.current.scrollToIndex({
        index: selectedIndex,
        animated: true,
        viewPosition: 0.5, // 0.5 ortada gösterir
      });
    }
  }, [mainCategories, selectedMainCategory]);

  // Alt kategori seçildiğinde ortala 
  useEffect(() => {
    if (
      subCategoryListRef.current &&
      subCategories.length > 0 &&
      selectedSubCategory
    ) {
      const selectedIndex = subCategories.findIndex(
        item => item === selectedSubCategory,
      );
      if (selectedIndex !== -1) {
        subCategoryListRef.current.scrollToIndex({
          index: selectedIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [selectedSubCategory, subCategories]);

  // scrollToIndex hata yönetimi
  const handleScrollToIndexFailed = info => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      if (mainCategoryListRef.current) {
        mainCategoryListRef.current.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.productTitle}>Ürünler</Text>

        <View style={styles.headerButton} />
      </View>
      <View style={{height: subCategories.length > 0 ? 100 : 50}}>
        {/* Ana Kategori Seçici */}
        <FlatList
          ref={mainCategoryListRef}
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
              }}>
              <Text style={styles.mainCategoryText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mainCategoryList}
          onScrollToIndexFailed={handleScrollToIndexFailed}
        />

        {/* Alt Kategori Seçici - Sadece alt kategoriler varsa göster */}
        {subCategories.length > 0 && (
          <FlatList
            key={selectedMainCategory} // Ana kategori değiştiğinde FlatList yenilenir
            ref={subCategoryListRef}
            horizontal
            data={subCategories}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.subCategoryItem,
                  selectedSubCategory === item && {},
                ]}
                onPress={() => {
                  setSelectedSubCategory(item);

                  // Seçilen alt kategoriye scroll et
                  const selectedIndex = subCategories.findIndex(
                    cat => cat === item,
                  );
                  if (selectedIndex !== -1) {
                    subCategoryListRef.current?.scrollToIndex({
                      index: selectedIndex,
                      animated: true,
                      viewPosition: 0.5, // 0.5 ortada gösterir
                    });
                  }
                }}>
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
            onScrollToIndexFailed={handleScrollToIndexFailed}
          />
        )}
      </View>

      {/* Ürünler */}
      <FlatList
        data={filteredProducts}
        renderItem={({item}) => <ProductItem item={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
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
    height: 50,
    backgroundColor: 'white',
    paddingVertical: 5,
  },
  subCategoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 0.2,
  },
  subCategoryText: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
  },
  productList: {
    paddingHorizontal: 10,
  },
});

export default CategoryDetailScreen;