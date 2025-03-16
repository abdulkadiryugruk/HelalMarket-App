import { NativeModules, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SendWhatsApp = async (cartItems) => {
  try {
    // Kullanıcı bilgilerini al
    const name = await AsyncStorage.getItem('name') || 'Belirtilmemiş';
    const number = await AsyncStorage.getItem('number') || 'Belirtilmemiş';
    const address = await AsyncStorage.getItem('address') || 'Belirtilmemiş';

    // Sipariş detaylarını al
    const orderDetails = cartItems.map(item =>
      `•  ${item.name}: ${item.quantity} adet`
    ).join('\n');

    const phoneNumber = '905516042200'
    
    const city = "Denizli"; 
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
    
    console.log("WhatsApp mesajı gönderilmeye çalışılıyor...");
    
    // WhatsApp URL şeması için mesajı hazırla
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    // WhatsApp'ın yüklü olup olmadığını kontrol et
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      console.log("WhatsApp açılıyor...");
      await Linking.openURL(whatsappUrl);
      return true;
    } else {
      console.log("WhatsApp yüklü değil veya açılamıyor");
      
      // Alternatif olarak web WhatsApp'ı deneyebiliriz
      const webWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      console.log("Web WhatsApp deneniyor:", webWhatsappUrl);
      
      const webSupported = await Linking.canOpenURL(webWhatsappUrl);
      if (webSupported) {
        await Linking.openURL(webWhatsappUrl);
        return true;
      } else {
        console.log("Web WhatsApp URL desteklenmiyor");
        return false;
      }
    }
  } catch (err) {
    console.error('WhatsApp mesajı gönderilirken hata oluştu:', err);
    return false;
  }
};

// SMS seçeneğini de korumak isterseniz, bu fonksiyonu da tutabilirsiniz
export const SendSMS = async (cartItems) => {
  try {
    // Kullanıcı bilgilerini al
    const name = await AsyncStorage.getItem('name') || 'Belirtilmemiş';
    const number = await AsyncStorage.getItem('number') || 'Belirtilmemiş';
    const address = await AsyncStorage.getItem('address') || 'Belirtilmemiş';

    // Sipariş detaylarını al
    const orderDetails = cartItems.map(item =>
      `•  ${item.name}: ${item.quantity} adet`
    ).join('\n');

    const phoneNumber = '+905516042200'
    
    const city = "Denizli"; 
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
    
    console.log("SMS gönderilmeye çalışılıyor...");
    
    if (Platform.OS === 'android') {
      // Native modülü kullan
      const { XiaomiSms } = NativeModules;
      if (XiaomiSms) {
        console.log("Native SMS modülü bulundu, açılıyor...");
        const result = await XiaomiSms.openSmsApp(phoneNumber, message);
        console.log("Native SMS sonucu:", result);
        return result;
      } else {
        console.log("Native SMS modülü bulunamadı");
      }
    }
    
    // Platform iOS ise veya native modül yoksa
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    
    console.log("Varsayılan yöntem deneniyor:", url);
    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
      return true;
    } else {
      console.log("SMS URL desteklenmiyor");
      return false;
    }
  } catch (err) {
    console.error('SMS gönderilirken hata oluştu:', err);
    return false;
  }
};