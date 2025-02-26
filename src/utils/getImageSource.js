export const getImageSource = (imagePath) => {
	if (imagePath && imagePath.includes('assets/images/products/')) {

		const fileName = imagePath.split('/').pop();
	  
	  const imageMappings = {
		'bakliyat-duru-1-kg-bulgur.webp': require('../../assets/productsImages/bakliyat-duru-1-kg-bulgur.webp'),
		'bakliyat-Duru-1-kg-pirinc.webp': require('../../assets/productsImages/bakliyat-Duru-1-kg-pirinc.webp'),
		'kozmatik-dis-macunu.webp': require('../../assets/productsImages/kozmatik-dis-macunu.webp'),
		'kozmatik-sac-kremi.webp': require('../../assets/productsImages/kozmatik-sac-kremi.webp'),
		'manav-elma.webp': require('../../assets/productsImages/manav-elma.webp'),
		'manav-muz.webp': require('../../assets/productsImages/manav-muz.webp'),
		'manav-portakal.webp': require('../../assets/productsImages/manav-portakal.webp'),
		'sarkuteri-acik-beyaz-peynir.webp': require('../../assets/productsImages/sarkuteri-acik-beyaz-peynir.webp'),
		'sarkuteri-acik-zeytin.webp': require('../../assets/productsImages/sarkuteri-acik-zeytin.webp'),
		'sarkuteri-balkan-1kg-beyaz-peynir.webp': require('../../assets/productsImages/sarkuteri-balkan-1kg-beyaz-peynir.webp'),
		'sarkuteri-sucuk.webp': require('../../assets/productsImages/sarkuteri-sucuk.webp'),
	  };
	  
	  return imageMappings[fileName] || require('../../assets/productsImages/placeholder.webp');
	}
	
	return { uri: imagePath };
  };