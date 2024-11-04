import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PrevArrow = ({ onClick }) => (
  <button
    type="button"
    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full focus:outline-none z-10 hover:bg-opacity-80"
    onClick={onClick}
  >
    <FaChevronLeft className="h-4 w-4" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    type="button"
    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-3 rounded-full focus:outline-none z-10 hover:bg-opacity-80"
    onClick={onClick}
  >
    <FaChevronRight className="h-4 w-4" />
  </button>
);

const ProductCarousel = ({ products }) => {
  const showArrows = products.length > 1;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500, // Default speed
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: showArrows,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          speed: 500, // Speed on large screens
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          speed: 400, // Faster on medium screens
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 300, // Fastest on small screens
        },
      },
    ],
  };

  return (
    <div className="relative max-w-7xl mx-auto">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="p-1 sm:p-2 md:p-3 lg:p-3.5">
            <Link to={`/products/${product.id}`}>
              <div className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-[200px] sm:max-w-[220px] md:max-w-[250px] lg:max-w-[290px] mx-auto">
                <div className="relative w-full h-36 sm:h-44 md:h-52 lg:h-64">
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={`Imagen del producto ${product.name}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="p-1 sm:p-2 md:p-3">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1 text-center">
                    {product.name}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-black font-bold text-center">
                    ${product.price}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
