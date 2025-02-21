import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import SearchScreen from './src/screens/SearchScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: '7%',
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
          }}
          listeners={({navigation}) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('AnaSayfa', {
                screen: 'Home',
              });
            },
          })}
        />
        <Tab.Screen
          name="Arama"
          component={SearchScreen}
          options={{
            tabBarLabel: 'Arama',
          }}
        />
        <Tab.Screen
          name="Sepetim"
          component={CartScreen}
          options={{
            tabBarLabel: 'Sepetim',
          }}
        />
        <Tab.Screen
          name="Profilim"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profilim',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;