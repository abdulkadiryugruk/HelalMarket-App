import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SendSMS = async (cartItems) => {
  try {
    // Kullanıcı bilgilerini al
    const name = await AsyncStorage.getItem('name') || 'Belirtilmemiş';
    const number = await AsyncStorage.getItem('number') || 'Belirtilmemiş';
    const address = await AsyncStorage.getItem('address') || 'Belirtilmemiş';

    // Sipariş detaylarını al
    const orderDetails = cartItems.map(item =>
      `- ${item.name}: ${item.quantity} adet`
    ).join('\n');

    const phoneNumber = '1234567890'; // TEL NO
    
    const city = "Denizli"; // Bu bilgiyi başka bir alandan alabilirsiniz
    const formattedAddress = `${address.trim().replace(/\s+/g, ',')},${city},Türkiye`;
    
    // Google Maps linkini oluştur
    const mapsLink = `https://maps.google.com/maps?q=${encodeURIComponent(formattedAddress)}`;
    
    const message = 
      `YENİ SİPARİŞ\n` +
      `${new Date().toLocaleString('tr-TR')}\n\n` +
      `MÜŞTERİ BİLGİLERİ:\n` +
      `Ad Soyad: ${name}\n` +
      `Telefon: ${number}\n` +
      `Adres: ${address}\n\n` +
      `Haritada görmek için:\n${mapsLink}\n\n` +
      `SİPARİŞ DETAYLARI:\n` +
      `${orderDetails}\n`;
    
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;

    const supported = await Linking.canOpenURL(url);
    
    if (!supported) {
      console.log('SMS desteklenmiyor');
      return false;
    } else {
      await Linking.openURL(url);
      return true;
    }
  } catch (err) {
    console.error('SMS gönderilirken hata oluştu:', err);
    return false;
  }
};