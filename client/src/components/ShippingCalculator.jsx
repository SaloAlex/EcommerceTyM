import { useState } from "react";
import PropTypes from "prop-types";
import { FaInfoCircle } from "react-icons/fa"; // Importa un icono de información
import ShippingModal from "./ShippingModal"; // Asegúrate de tener el componente ShippingModal

const ShippingCalculator = ({ onShippingAccepted }) => {
  const [selectedZone, setSelectedZone] = useState("");
  const [shippingCost, setShippingCost] = useState(null);
  const [error, setError] = useState("");
  const [shippingAccepted, setShippingAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false); // Estado para mostrar la ayuda

  // Definir los costos de envío para cada zona
  const shippingRates = {
    CABA: 3785,
    GBA1: 6024,
    GBA2: 8300,
    GBA3: 8507,
  };

  // Función para manejar el cálculo del envío
  const handleCalculate = () => {
    if (!selectedZone) {
      setError("Por favor, selecciona una zona válida.");
      setShippingCost(null);
      return;
    }

    setError("");
    const cost = shippingRates[selectedZone];
    setShippingCost(cost);
    setShippingAccepted(false); // Resetear el estado si vuelve a calcular
    setLoading(false);
  };

  // Función para aceptar el costo de envío
  const handleAcceptShipping = () => {
    setShippingAccepted(true);
    onShippingAccepted(shippingCost); // Llamar la función del componente padre
  };

  // Función para cancelar el envío
  const handleCancelShipping = () => {
    setShippingCost(null);
    setShippingAccepted(false);
    onShippingAccepted(0); // Enviar 0 si cancela el envío
  };

  // Función para abrir y cerrar el modal de ayuda
  const handleOpenHelpModal = () => setShowHelpModal(true);
  const handleCloseHelpModal = () => setShowHelpModal(false);

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-lg text-gray-800 max-w-xl mx-auto">
      <h3 className="text-xl font-bold text-black mb-4 text-center">
        Calculadora de Envío
      </h3>

      <div className="mb-6">
        <label
          className="block text-gray-700 font-semibold mb-2"
          htmlFor="zone"
        >
          Selecciona tu zona:
        </label>
        <select
          id="zone"
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <option value="">Selecciona una zona</option>
          <option value="CABA">CABA</option>
          <option value="GBA1">GBA1</option>
          <option value="GBA2">GBA2</option>
          <option value="GBA2">GBA3</option>
        </select>
      </div>

      {/* Botón de ayuda con tamaño reducido */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleOpenHelpModal}
          className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 w-auto"
        >
          <FaInfoCircle className="mr-2" /> Cual es mi Zona?
        </button>
      </div>

      <button
        onClick={handleCalculate}
        className={`w-full px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${
          loading || !selectedZone
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-purple-700"
        }`}
        disabled={loading || !selectedZone}
      >
        {loading ? "Calculando..." : "Calcular"}
      </button>

      {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}

      {shippingCost !== null && !shippingAccepted && (
        <div className="mt-6">
          <p className="text-lg text-black font-semibold">
            El costo de envío es: ${shippingCost}
          </p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleAcceptShipping}
              className="w-full px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Aceptar
            </button>
            <button
              onClick={handleCancelShipping}
              className="w-full px-6 py-2 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {shippingAccepted && (
        <p className="text-lg text-black font-semibold mt-4">
          El costo de envío ha sido añadido al total.
        </p>
      )}

      {/* Modal de ayuda */}
      {showHelpModal && (
        <ShippingModal onClose={handleCloseHelpModal}>
          <div className="p-6 text-black">
            <h3 className="text-xl font-bold mb-4">
              ¿Cómo saber de qué zona sos?
            </h3>
            <p className="mb-2">
              <strong>CABA:</strong> Si resides en la Ciudad Autónoma de Buenos
              Aires.
            </p>
            <p className="mb-2">
              <strong>GBA1:</strong> Localidades cercanas a la capital, como San
              Isidro, Vicente López, San Martín, Morón, Lanús, Lomas de Zamora,
              entre otros.
            </p>
            <p className="mb-2">
              <strong>GBA2:</strong> Localidades más alejadas como Tigre,
              Escobar, Merlo, Moreno, Quilmes, Berazategui, Florencio Varela,
              entre otros.
            </p>
            <p className="mb-2">
              <strong>GBA3:</strong> Localidades más alejadas que incluyen:
              Marcos Paz, Campana, San Vicente, Berisso, Ensenada, La Plata
              Norte, La Plata Centro, Nordelta, Pilar, Derqui, Guernica,
              Cañuelas, Del Viso, Escobar, Villa Rosa, Garín, Ingeniero
              Maschwitz, General Rodríguez y Luján.
            </p>
          </div>
        </ShippingModal>
      )}
    </div>
  );
};

ShippingCalculator.propTypes = {
  onShippingAccepted: PropTypes.func.isRequired, // Función para manejar cuando el envío es aceptado
};

export default ShippingCalculator;
