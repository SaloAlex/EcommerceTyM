import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; 
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    address: '',
    betweenStreets: '',
    phone: '',
    postalCode: '',
    locality: '',   // Nuevo campo de "Localidad"
    province: ''    // Nuevo campo de "Provincia"
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const { email, password, confirmPassword, name, address, betweenStreets, phone, postalCode, locality, province } = formData;
  
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Actualiza el `displayName` del usuario en Firebase Auth
      await updateProfile(user, { displayName: name });
  
      // Guarda los datos del usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        address,
        betweenStreets,
        phone,
        postalCode,
        locality,
        province,
        createdAt: new Date()
      });

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Te has registrado correctamente',
        showConfirmButton: false,
        timer: 2000
      });
  
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Registrarse</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          {/* Campo para el nombre completo */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Nombre completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo para el correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo para la contraseña */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo para confirmar la contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo para la dirección */}
          <div>
            <label htmlFor="address" className="block text-gray-700 font-medium mb-1">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo para "Entre calles" */}
          <div>
            <label htmlFor="betweenStreets" className="block text-gray-700 font-medium mb-1">Entre calles</label>
            <input
              type="text"
              id="betweenStreets"
              name="betweenStreets"
              value={formData.betweenStreets}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Campo para la localidad */}
          <div>
            <label htmlFor="locality" className="block text-gray-700 font-medium mb-1">Localidad</label>
            <input
              type="text"
              id="locality"
              name="locality"
              value={formData.locality}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo para la provincia */}
          <div>
            <label htmlFor="province" className="block text-gray-700 font-medium mb-1">Provincia</label>
            <input
              type="text"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo para el teléfono */}
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo para el código postal */}
          <div>
            <label htmlFor="postalCode" className="block text-gray-700 font-medium mb-1">Código Postal</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Aceptación de términos y condiciones */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-500"
            />
            <span className="ml-2 text-gray-600">Acepto los <a href="#" className="underline text-blue-600">términos y condiciones</a></span>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded-md shadow-md hover:bg-blue-600 transition-colors"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
