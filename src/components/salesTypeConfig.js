import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, StyleSheet, Alert } from 'react-native';

const QuantitySelector = ({ product, quantity, setQuantity, unitType, setUnitType }) => {
  const validateAndSetQuantity = (value, type) => {
    const numValue = parseFloat(value.replace(',', '.'));

    if (product['satis-sekli'] === 'adet') {
      // Adet ürünler için tamsayı kontrolü
      if (!isNaN(numValue) && numValue >= 0 && Number.isInteger(numValue)) {
        setQuantity(value);
      }
    } else if (product['satis-sekli'] === 'gram') {
      const currentUnitType = type || unitType;
      const maxValue = currentUnitType === 'gram' ? 1000 : 0;
      const minValue = currentUnitType === 'gram' ? 10 : 0;

      if (!isNaN(numValue) && numValue >= minValue && numValue <= maxValue) {
        setQuantity(value);
      } else {
        Alert.alert(
          'Geçersiz Miktar', 
          currentUnitType === 'gram' 
            ? `Lütfen 10 gram ile 1000 gram arasında bir değer girin.` 
            : `Lütfen 0.1 kg ile 10 kg arasında bir değer girin.`
        );
      }
    }
  };

  if (product['satis-sekli'] === 'adet') {
    return (
      <View style={styles.quantitySelectorContainer}>
        <TouchableOpacity 
          onPress={() => validateAndSetQuantity((parseInt(quantity) - 1).toString(), 'adet')}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantity}
          onChangeText={(value) => validateAndSetQuantity(value, 'adet')}
        />
        <TouchableOpacity 
          onPress={() => validateAndSetQuantity((parseInt(quantity) + 1).toString(), 'adet')}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (product['satis-sekli'] === 'gram') {
    return (
      <View style={styles.gramSelectorContainer}>
        <View style={styles.unitToggleContainer}>
          <Text>Gram</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={unitType === 'kilo' ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={() => {
              const newUnitType = unitType === 'gram' ? 'kilo' : 'gram';
              setUnitType(newUnitType);
              // Birim değiştiğinde miktarı güncelle
              validateAndSetQuantity(quantity, newUnitType);
            }}
            value={unitType === 'kilo'}
          />
          <Text>Kilo</Text>
        </View>
        
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantity}
          onChangeText={(value) => validateAndSetQuantity(value)}
        />
        <Text style={styles.unitLabel}>
          {unitType === 'gram' ? 'gram' : 'kg'}
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 10,
    width: 50,
    textAlign: 'center',
    padding: 5,
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
  },
});

export default QuantitySelector;