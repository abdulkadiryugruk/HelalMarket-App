import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';

const QuantitySelector = ({
  product,
  quantity,
  setQuantity,
  unitType,
  setUnitType,
}) => {
  const validateAndSetQuantity = (value, type) => {
    // Virgülü noktaya çevirerek sayı parse etme
    const numValue = parseFloat(value.replace(',', '.'));
  
    if (product['satis-sekli'] === 'adet') {
      // Kullanıcı yanlış yazsa bile değeri değiştirmeye izin ver
      setQuantity(value);
  
      // Tamsayı değilse, uyarı göster
      if (!isNaN(numValue) && numValue >= 0 && !Number.isInteger(numValue)) {
        Alert.alert("Geçersiz Miktar", "Lütfen tam sayı girin.");
      }
    } 
    else if (product['satis-sekli'] === 'gram') {
      const currentUnitType = type || unitType;
      const maxValue = currentUnitType === 'gram' ? 1000 : 10;
      const minValue = currentUnitType === 'gram' ? 10 : 0.1;
  
      // Switch değiştiğinde başlangıç değerini ayarla
      if (type) {
        setQuantity(type === 'gram' ? '100' : '1');
        return;
      }
  
      // Kullanıcı yanlış yazsa bile değeri değiştirmeye izin ver
      setQuantity(value);
    }
  };

  if (product['satis-sekli'] === 'adet') {
    return (
      <View style={styles.quantitySelectorContainer}>
        <TouchableOpacity
          onPress={() =>
            validateAndSetQuantity((parseInt(quantity) - 1).toString(), 'adet')
          }
          style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantity}
          onChangeText={value => validateAndSetQuantity(value, 'adet')}
        />
        <TouchableOpacity
          onPress={() =>
            validateAndSetQuantity((parseInt(quantity) + 1).toString(), 'adet')
          }
          style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (product['satis-sekli'] === 'gram') {
    return (
      <View style={styles.gramSelectorContainer}>
        <View style={styles.unitToggleContainer}>
          <Text style={{color: 'black', fontSize: 18}}>Gram</Text>
          <Switch
            trackColor={{false: 'green', true: 'green'}}
            thumbColor={unitType === 'kilo' ? '#f5dd4b' : 'orange'}
            onValueChange={() => {
              const newUnitType = unitType === 'gram' ? 'kilo' : 'gram';

              // Önce unitType'ı güncelle
              setUnitType(newUnitType);

              // Sonra miktarı kontrol et ve güncelle
              setTimeout(
                () => validateAndSetQuantity(quantity, newUnitType),
                0,
              );
            }}
            value={unitType === 'kilo'}
          />

          <Text style={{color: 'black', fontSize: 18}}>Kilo</Text>
        </View>

        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantity}
          onChangeText={value => validateAndSetQuantity(value)}
        />
        <Text style={styles.unitLabel}>
          {unitType === 'gram' ? 'Gram' : 'Kg'}
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  quantitySelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#e86924',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 15,
    width: 70,
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  gramSelectorContainer: {
    alignItems: 'center',
  },
  unitToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  unitLabel: {
    marginTop: 5,
    color: '#666',
    fontSize: 25, // Daha büyük yazı
    fontWeight: 'bold',
  },
});

export default QuantitySelector;