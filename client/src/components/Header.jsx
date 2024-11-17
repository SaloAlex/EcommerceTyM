import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { getAuth, signOut } from "firebase/auth";
import logoImage from "../assets/logo.png";

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCartClick = (e) => {
    if (totalItems === 0) {
      e.preventDefault();
      Swal.fire({
        icon: "info",
        title: "Carrito vacío",
        text: "No tienes productos en tu carrito. ¡Agrega algunos para continuar!",
      });
    } else {
      navigate("/cart");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Cierre de sesión exitoso",
          timer: 2000,
          showConfirmButton: false,
        });
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <header className="bg-gray-900 p-4 shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logoImage} alt="Logo" className="w-[150px] h-auto object-contain" />
          {!logoImage && <span className="text-pink-500 text-3xl font-bold neon-effect">TECNO&+</span>}
        </Link>

        <nav className="hidden md:flex space-x-6 items-center">
          {user ? (
            <>
              <div className="flex items-center space-x-2 text-white">
                <FaUser className="text-xl" />
                <span>{user.displayName || user.email}</span>
              </div>
              <button onClick={handleLogout} className="text-white hover:text-pink-500 transition duration-300">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-pink-500 transition duration-300">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="text-white hover:text-pink-500 transition duration-300">
                Registrarse
              </Link>
            </>
          )}

          <button onClick={handleCartClick} className="text-white hover:text-pink-500 transition duration-300 flex items-center">
            <FaShoppingCart className="text-2xl" />
            {totalItems > 0 && (
              <span className="bg-pink-500 text-white rounded-full px-2 py-1 text-xs ml-2">
                {totalItems}
              </span>
            )}
          </button>
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white text-2xl md:hidden focus:outline-none"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 md:hidden">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-white text-3xl focus:outline-none">
            <FaTimes />
          </button>

          <nav className="flex flex-col items-center space-y-6 text-white text-xl">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <FaUser className="text-2xl" />
                  <span>{user.displayName || user.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-pink-500 transition duration-300"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-pink-500 transition duration-300" onClick={() => setIsMenuOpen(false)}>
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="hover:text-pink-500 transition duration-300" onClick={() => setIsMenuOpen(false)}>
                  Registrarse
                </Link>
              </>
            )}

            <button onClick={(e) => { handleCartClick(e); setIsMenuOpen(false); }} className="hover:text-pink-500 transition duration-300 flex items-center">
              <FaShoppingCart className="text-2xl" />
              {totalItems > 0 && (
                <span className="bg-pink-500 text-white rounded-full px-2 py-1 text-xs ml-2">
                  {totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
