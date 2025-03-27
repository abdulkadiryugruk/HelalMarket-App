import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {SendSMS} from './ForwardSMS';
import {SendWhatsApp} from './ForwardSMS';


export const ConfirmCard = async (cartItems, clearCart, refreshOrders) => {

    try {
      if (!cartItems || cartItems.length === 0) {
        Alert.alert('Hata', 'Sepetiniz boş');
        return;
      }
      // Profil bilgilerini tekrar kontrol et (güncel durumu almak için)
      const name = await AsyncStorage.getItem('name');
      const number = await AsyncStorage.getItem('number');
      const address = await AsyncStorage.getItem('address');

      if (!name || !number || !address) {
        Alert.alert(
          'Profil Bilgileri Eksik',
          'Sipariş vermek için profil bilgilerinizi tamamlamanız gerekiyor.',
          [
            {text: 'İptal'},
            {
              text: 'Profile Git',
              onPress: () => {
                // Burada profil sayfasına yönlendirme yapılabilir (react-navigation ile)
                // navigation.navigate('Profile');
                Alert.alert(
                  'Yönlendirme',
                  'Bu özellik için navigation entegrasyonu gerekiyor.',
                );
              },
            },
          ],
        );
        return;
      }

      // Yeni sipariş detaylarını oluştur
      const orderDate = new Date().toLocaleString('tr-TR');
      const orderDetails = {
        date: orderDate,
        item: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          id: item.id,
        })),
      };

      // Mevcut siparişleri getir
      const existingOrdersJson = await AsyncStorage.getItem('orders');
      let existingOrders = existingOrdersJson
        ? JSON.parse(existingOrdersJson)
        : [];

      // Yeni siparişi başa ekle
      existingOrders.unshift(orderDetails);

      // son 4 siparis
      if (existingOrders.length > 4) {
        existingOrders = existingOrders.slice(0, 4);
      }

      // Güncellenmiş sipariş listesini kaydet
      await AsyncStorage.setItem('orders', JSON.stringify(existingOrders));

      await AsyncStorage.setItem('orders', JSON.stringify(existingOrders));

      const savedOrders = await AsyncStorage.getItem('orders');
      refreshOrders();
      console.log('Kaydedilen siparişler:', savedOrders);

      Alert.alert(
        'Sipariş Kaydedildi',
        'Siparişiniz başarıyla kaydedildi. WhatsApp ekranına yönlendiriliyorsunuz!',
        [
          {
            text: 'Tamam',
            onPress: async () => {
              // SMS gönder
              const smsSent = await SendWhatsApp(cartItems);

              if (smsSent) {
                // Sepeti temizle
                await clearCart();
              } else {
                Alert.alert(
                  'Uyarı',
                  'WhatsApp ekranı açılamadı. Lütfen daha sonra tekrar deneyin.',
                );
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Sipariş kaydedilirken hata oluştu:', error);
      Alert.alert('Hata', 'Sipariş kaydedilirken bir hata oluştu');
    }
  };


