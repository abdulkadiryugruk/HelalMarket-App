import { StyleSheet, TextInput, View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOrder } from '../context/OrderContext';

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(true);
  const [orders, setOrders] = useState([]);
  const { orderRefresh } = useOrder();

  const handleNumberChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, number: cleanedText }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.number || !formData.address) {
      Alert.alert('Hata', 'Tüm alanları doldurun.');
      return false;
    }

    if (formData.number.length !== 10) {
      Alert.alert('Hata', 'Telefon numarası 10 haneli olmalı.');
      return false;
    }

    if (formData.number[0] === '0') {
      Alert.alert('Hata', 'Telefon numarası 0 ile başlamamalıdır.');
      return false;
    }

    return true;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('name');
        const savedNumber = await AsyncStorage.getItem('number');
        const savedAddress = await AsyncStorage.getItem('address');

        if (savedName && savedNumber && savedAddress) {
          setSavedData({ name: savedName, number: savedNumber, address: savedAddress });
        }
      } catch (error) {
        console.log('Error loading data from storage:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem('orders');
        const parsedOrders = JSON.parse(savedOrders) || [];
        setOrders(parsedOrders);
      } catch (error) {
        console.log('Siparişler yüklenirken hata oluştu:', error);
      }
    };

    loadOrders();
  }, [orderRefresh]);

  const handleOrderPress = (order) => {
    if (!order || !order.item || !Array.isArray(order.item)) {
      Alert.alert('Hata', 'Sipariş detayları bulunamadı');
      return;
    }
  
    const orderDetails = order.item.map((item) => (
      `${item.name} - Adet: ${item.quantity}`
    )).join("\n");
  
    Alert.alert('Sipariş Detayları', `Sipariş Tarihi: ${order.date}\n\n${orderDetails}`);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await AsyncStorage.setItem('name', formData.name);
      await AsyncStorage.setItem('number', formData.number);
      await AsyncStorage.setItem('address', formData.address);
      setSavedData(formData); // Kaydedilen veriyi güncelle
      setIsEditing(false);
      setIsInputVisible(false);
      setIsAddButtonVisible(true); // Kaydet butonunu gizle
      Alert.alert('Başarıyla Kaydedildi', 'Bilgiler başarıyla kaydedildi.');
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const handleEdit = () => {
    setFormData(savedData); // Mevcut verileri form alanlarına yükle
    setIsEditing(true);
    setIsInputVisible(true);
    setIsAddButtonVisible(false); // Düzenle butonuna geçince, ekleme butonunu gizle
  };

  const handleAddInfo = () => {
    setIsAddButtonVisible(false);
    setIsInputVisible(true);
  };

  const renderInputFields = () => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Ad Soyad"
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Telefon Numarası"
        maxLength={10}
        value={formData.number}
        onChangeText={handleNumberChange}
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.addressInput}
        placeholder="Adresinizi girin"
        multiline={true}
        numberOfLines={6}
        value={formData.address}
        onChangeText={(text) => handleInputChange('address', text)}
        placeholderTextColor="#666"
      />

      <TouchableOpacity
        style={[styles.button, formData.name && formData.number && formData.address ? styles.activeButton : styles.inactiveButton]}
        onPress={handleSave}
        disabled={!formData.name || !formData.number || !formData.address}
      >
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSavedData = () => (
    <View>
    <View style={styles.savedDataContainer}>
      <View style={styles.dataField}>
        <Text style={styles.fieldLabel}>Ad Soyad:</Text>
        <Text style={styles.fieldValue}>{savedData.name}</Text>
      </View>
      <View style={styles.dataField}>
        <Text style={styles.fieldLabel}>Telefon:</Text>
        <Text style={styles.fieldValue}>{savedData.number}</Text>
      </View>
      <View style={styles.dataField}>
        <Text style={styles.fieldLabel}>Adres:</Text>
        <Text style={styles.fieldValue}>{savedData.address}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>Düzenle</Text>
      </TouchableOpacity>
    </View>
    <View style={[styles.savedDataContainer,{marginTop:'10%'}]}>
    <Text style={styles.title}>📜 Sipariş Geçmişi</Text>
      {orders.length === 0 ? (
        <Text>Henüz siparişiniz bulunmamaktadır.</Text>
      ) : (
        orders.map((order, index) => (
          <TouchableOpacity key={index} style={styles.orderItem} onPress={() => handleOrderPress(order)}>
            <Text style={styles.orderText}>📅   {order.date}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {savedData && !isEditing ? (
        renderSavedData()
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Kullanıcı ve adres bilgilerinizi giriniz</Text>
          {isAddButtonVisible && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddInfo}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
          {isInputVisible && renderInputFields()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  addressInput: {
    height: 120,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  activeButton: {
    backgroundColor: '#008242',
  },
  inactiveButton: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  savedDataContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  dataField: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  orderItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
