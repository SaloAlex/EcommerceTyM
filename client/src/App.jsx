import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import GenerateDiscountCode from './components/GenerateDiscountCode';
import OrderConfirmation from './components/OrderConfirmation';
import ProtectedRoute from './components/ProtectedRoute'; // Asegúrate de que la ruta sea correcta

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Router>
            <Header />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<ProtectedRoute element={Cart} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/generate-discount" element={<ProtectedRoute element={GenerateDiscountCode} />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
              </Routes>
            </div>
            <Footer />
          </Router>
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
