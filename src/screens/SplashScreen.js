import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const SplashScreen = () => {
  const videoRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Belirli bir süre sonra ana sayfaya geçiş yap
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2000); // 3 saniye (veya ihtiyacınıza göre ayarlayın)

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../../assets/productsImages/loading.mp4')}
        style={styles.video}
        resizeMode="contain"
        repeat={false} // Video dongusu
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#de5f29',
  },
  video: {
    width: width * 1,
    height: height * 1,
  },
});

export default SplashScreen;
