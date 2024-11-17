import { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar visibilidad del password
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      login();
      navigate('/');
    } catch (error) {
      setError("Error al iniciar sesión. Por favor, revisa tus credenciales.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gray-100 p-6 md:p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">
        Iniciar Sesión
      </h2>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-lg">
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
            Contraseña
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
