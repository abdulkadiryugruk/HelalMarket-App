import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import productData from '../data/urunler.json';



const HomeScreen = () => {
  const navigation = useNavigation();
  const alertShown = useRef(false); // 📌 Alert'in tekrar çıkmasını engellemek için

const Kategori = [...new Set(productData.map(item => item.kategori))];


  useEffect(() => {
    const checkCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          if (cartItems.length > 0 && !alertShown.current) {
            alertShown.current = true; // ✅ Tekrar çıkmasını engelliyoruz
            Alert.alert(
              "Hatırlatma",
              "Sepetinizde ürünler var, alışverişe devam etmek ister misiniz?",
              [
                { text: "Hayır", style: "cancel" },
                { text: "Tamam", onPress: () => navigation.navigate("Sepetim") } // ✅ Doğru yönlendirme
              ]
            );
            
          }
        }
      } catch (error) {
        console.error("Sepet kontrol edilirken hata oluştu:", error);
      }
    };

    checkCart();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#e86924" barStyle="light-content" />
      <View style={styles.TopBar}>
        <Text style={styles.TopBarTitle}>HELAL MARKET</Text>
      </View>

      <Text style={styles.categoryTitle}>KATEGORİLER</Text>

      <FlatList
        data={Kategori}
        keyExtractor={item => item}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => navigation.navigate('CategoryDetailScreen', {category: item})}>
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  TopBar: {
    height: '7%',
    width: '100%',
    backgroundColor: '#e86924',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  TopBarTitle: {
    fontSize: 40,
    color: 'white',
    fontWeight: '900',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: '#008242',
    paddingVertical: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
