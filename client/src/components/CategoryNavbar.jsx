import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const CategoryNavbar = ({ categories, selectedCategory, onCategorySelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="p-4 shadow-lg bg-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        {/* Texto a la izquierda */}
        <h2 className="text-2xl lg:text-4xl font-bold text-blue-300">
          ¡Nuestros{' '}
          <span className="text-white bg-gray-800 px-2 py-1 rounded">
            productos!
          </span>
        </h2>

        {/* Menú de categorías - visible en pantallas grandes */}
        <div className="hidden lg:flex space-x-4 items-center">
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={() => onCategorySelect('')}
                className={`px-4 py-2 rounded-lg transition duration-300 ${
                  selectedCategory === ''
                    ? 'text-white bg-blue-600'
                    : 'text-white bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Todos los productos
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => onCategorySelect(category)}
                  className={`px-4 py-2 rounded-lg transition duration-300 ${
                    selectedCategory === category
                      ? 'text-white bg-blue-600'
                      : 'text-white bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón de menú hamburguesa para pantallas medianas y pequeñas */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white text-2xl focus:outline-none"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Modal del menú en pantallas pequeñas y medianas */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 lg:hidden p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl focus:outline-none"
          >
            <FaTimes />
          </button>

          {/* Opciones de Categorías */}
          <ul className="flex flex-col items-center space-y-6 text-white text-2xl">
            <li>
              <button
                onClick={() => {
                  onCategorySelect('');
                  setIsMenuOpen(false);
                }}
                className={`transition duration-300 ${
                  selectedCategory === ''
                    ? 'text-pink-500'
                    : 'hover:text-pink-500'
                }`}
              >
                Todos los productos
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => {
                    onCategorySelect(category);
                    setIsMenuOpen(false);
                  }}
                  className={`transition duration-300 ${
                    selectedCategory === category
                      ? 'text-pink-500'
                      : 'hover:text-pink-500'
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

// Validación de los tipos de las props
CategoryNavbar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
};

export default CategoryNavbar;
