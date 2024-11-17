import { useState } from 'react';
import axios from 'axios';

const GenerateDiscountCode = () => {
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleGenerateDiscount = async () => {
    try {
      const isoExpirationDate = new Date(expirationDate).toISOString(); // Asegurarse de que sea un string ISO
      const response = await axios.post('http://localhost:3000/generate_discount', {
        code,
        discountValue: Number(discountValue),
        expirationDate: isoExpirationDate,
      });
      setMessage(response.data.message);
      setError(''); // Reinicia el error
    } catch (error) {
      setError(`Error al generar el código de descuento: ${error.response?.data?.error || error.message}`); // Usa el mensaje del error del backend si existe
      setMessage(''); // Reinicia el mensaje
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Generar Código de Descuento</h2>
      {/* Campos de Formulario */}
      <div className="mb-4">
        <label className="block text-gray-700">Código:</label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Valor de descuento (%):</label>
        <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full border px-3 py-2 rounded" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Fecha de expiración:</label>
        <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="w-full border px-3 py-2 rounded" />
      </div>
      {/* Botón */}
      <button onClick={handleGenerateDiscount} className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition">Generar Código</button>
      {/* Mensajes */}
      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default GenerateDiscountCode;
