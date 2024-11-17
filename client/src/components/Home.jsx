import React from 'react';
import ProductList from '../components/ProductList'; // Importa el componente ProductList
import Carousel from '../components/Carousel'; // Importa el componente Carousel
import image1 from '../assets/banner1.jpg';
import image2 from '../assets/banner2.jpg';
import image3 from '../assets/banner3.jpg';

const Home = () => {
  // Array de imágenes para el carrusel de banners
  const images = [image1, image2, image3];

  return (
    <div className="mt-6 px-2 sm:px-4 md:px-8 lg:px-12">
      {/* Carrusel de banners */}
      <Carousel images={images} autoPlay={true} interval={5000} />
      
      {/* Lista de productos con categorías */}
      <ProductList />
    </div>
  );
};

export default Home;
