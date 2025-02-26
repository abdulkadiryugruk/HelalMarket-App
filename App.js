import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useCart} from './src/context/CartContext';

import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import SearchScreen from './src/screens/SearchScreen';
import CartScreen from './src/screens/CartScreen';
import {CartProvider} from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import ProfileScreen from './src/screens/ProfileScreen';
import Product from './src/screens/Product';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// SADECE Ana sayfa ve kategori sayfası için Stack Navigator
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="Product" component={Product} />
    </Stack.Navigator>
  );
};

const HomeTabs = () => {
  const {cartItems} = useCart();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: '8%',
          backgroundColor: '#e86924',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        },
        tabBarActiveTintColor: '#008242',
        tabBarInactiveTintColor: 'white',
      }}>
      <Tab.Screen
        name="AnaSayfa"
        component={HomeStack}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('AnaSayfa', {screen: 'Home'});
          },
        })}
      />
      <Tab.Screen
        name="Arama"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Arama',
          tabBarIcon: ({color, size}) => (
            <Icon name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Sepetim"
        component={CartScreen}
        options={{
          tabBarLabel: 'Sepetim',
          tabBarIcon: ({color, size}) => (
            <Icon name="shopping-cart" size={size} color={color} />
          ),
          tabBarBadge: cartItems.length > 0 ? cartItems.length : null,
          tabBarBadgeStyle: {
            backgroundColor: 'white',
            color: '#e86924',
          },
        }}
      />
      <Tab.Screen
        name="Profilim"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profilim',
          tabBarIcon: ({color, size}) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <OrderProvider>
    <CartProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </CartProvider>
    </OrderProvider>
  );
};

export default App;
