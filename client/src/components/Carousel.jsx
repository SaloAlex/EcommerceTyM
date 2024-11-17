import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const Carousel = ({ images, autoPlay = true, interval = 1000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para ir a la siguiente imagen
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Función para ir a la imagen anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Efecto para cambiar la imagen automáticamente cada 'interval' tiempo
  useEffect(() => {
    if (autoPlay) {
      const slideInterval = setInterval(nextSlide, interval);
      return () => clearInterval(slideInterval); // Limpia el intervalo cuando se desmonta el componente
    }
  }, [nextSlide, autoPlay, interval]);

  return (
    <div className="relative w-full max-w-[95vw] mx-auto mt-6">
      {/* Botón para la imagen anterior */}
      <button 
        className="absolute left-2 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 md:p-3 rounded-full"
        onClick={prevSlide}
      >
        &#10094;
      </button>

      {/* Imagen actual */}
      <div className="w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gray-200 rounded-lg overflow-hidden">
        <img 
          src={images[currentIndex]} 
          alt={`Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Botón para la siguiente imagen */}
      <button 
        className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 md:p-3 rounded-full"
        onClick={nextSlide}
      >
        &#10095;
      </button>

      {/* Indicadores debajo del carrusel */}
      <div className="flex justify-center mt-4 space-x-1 sm:space-x-2">
        {images.map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Validación de PropTypes para garantizar que se proporcionen las imágenes
Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  autoPlay: PropTypes.bool,
  interval: PropTypes.number
};

export default Carousel;
