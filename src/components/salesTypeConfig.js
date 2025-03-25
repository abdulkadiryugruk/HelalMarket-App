import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, StyleSheet } from 'react-native';

const QuantitySelector = ({ product, quantity, setQuantity, unitType, setUnitType }) => {
  if (product['satis-sekli'] === 'adet') {
    return (
      <View style={styles.quantitySelectorContainer}>
        <TouchableOpacity 
          onPress={() => setQuantity(Math.max(1, parseInt(quantity) - 1).toString())}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantity}
          onChangeText={(value) => {
            const numValue = parseInt(value);
            if (numValue >= 1) setQuantity(value);
          }}
        />
        <TouchableOpacity 
          onPress={() => setQuantity((parseInt(quantity) + 1).toString())}
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
            onValueChange={() => setUnitType(unitType === 'gram' ? 'kilo' : 'gram')}
            value={unitType === 'kilo'}
          />
          <Text>Kilo</Text>
        </View>
        
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={quantity}
          onChangeText={(value) => {
            const numValue = parseFloat(value);
            const maxValue = unitType === 'gram' ? 1000 : 10;
            const minValue = unitType === 'gram' ? 100 : 0.1;
            
            if (numValue >= minValue && numValue <= maxValue) {
              setQuantity(value);
            }
          }}
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
