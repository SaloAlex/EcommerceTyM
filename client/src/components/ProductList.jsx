import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import CategoryNavbar from './CategoryNavbar';
import ProductCarousel from './ProductCarousel';

const ProductList = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');

  // Orden de categorías y títulos personalizados
  const desiredCategoryOrder = [
    'Consolas - Gaming - Computacion',
    'Audio - Video',
    'Celulares - Accesorios',
    'Electrodomesticos',
    'Mas',
  ];

  const categoryTitles = {
    'Consolas - Gaming - Computacion': 'Productos para Gamers y Computación',
    'Audio - Video': 'Lo Mejor en Audio y Video',
    'Celulares - Accesorios': 'Celulares y sus Mejores Accesorios',
    'Electrodomesticos': 'Electrodomésticos Imprescindibles',
    'Mas': 'Otros Productos Destacados',
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((product) => !product.paused);

      // Agrupar productos por categoría
      const groupedProducts = {};
      productsData.forEach((product) => {
        const category = product.category || 'Sin Categoría';
        if (!groupedProducts[category]) {
          groupedProducts[category] = [];
        }
        groupedProducts[category].push(product);
      });

      setProductsByCategory(groupedProducts);
    };

    fetchProducts();
  }, []);

  // Manejar la selección de categoría desde CategoryNavbar
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Obtener la lista de categorías disponibles que tienen productos
  const availableCategories = desiredCategoryOrder.filter(
    (category) => productsByCategory[category]
  );

  // Determinar las categorías a mostrar según la selección
  const categoriesToShow =
    selectedCategory === ''
      ? availableCategories
      : availableCategories.filter((category) => category === selectedCategory);

  return (
    <div className="container mx-auto p-4">
      {/* Navbar de categorías */}
      <CategoryNavbar
        categories={availableCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Carruseles por categoría */}
      {categoriesToShow.map((category) => (
        <div key={category} className="category-section my-8 px-4">
          {/* Título personalizado de la categoría */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 text-center">
            {categoryTitles[category]}
          </h2>
          <ProductCarousel products={productsByCategory[category]} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
