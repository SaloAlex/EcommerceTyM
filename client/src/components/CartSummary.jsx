import PropTypes from 'prop-types';
import DiscountCodeInput from './DiscountCodeInput';
import { useState, useEffect } from 'react';

const CartSummary = ({
  total,
  onCheckout,
  loading,
  navigate,
  onShippingButtonClick,
  shippingCost,
  onDiscountChange,
}) => {
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(
    JSON.parse(localStorage.getItem('discountApplied')) || false
  );

  const applyDiscount = (discountValue) => {
    if (typeof discountValue === 'number') {
      setDiscount(discountValue);
      onDiscountChange(discountValue);
      setDiscountApplied(true);
      localStorage.setItem('discountApplied', true);
    }
  };

  const discountAmount = (total * discount) / 100;
  const finalTotal = total - discountAmount + shippingCost;

  useEffect(() => {
    if (discountApplied) {
      localStorage.setItem('discountApplied', true);
    }
  }, [discountApplied]);

  return (
    <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <p className="text-lg font-bold text-black mb-4 text-center md:text-left">Resumen</p>

      <div className="text-lg flex justify-between mb-2">
        <span className="text-gray-600">Subtotal:</span>
        <span className="text-xl font-semibold text-black">
          ${total.toFixed(2)}
        </span>
      </div>

      <div className="text-lg flex justify-between mb-2">
        <span className="text-gray-600">Costo de envío:</span>
        <span className="text-xl font-semibold text-black">
          ${shippingCost > 0 ? shippingCost.toFixed(2) : '0.00'}
        </span>
      </div>

      {!discountApplied && (
        <div className="mb-4">
          <DiscountCodeInput applyDiscount={applyDiscount} />
        </div>
      )}

      {discountAmount > 0 && (
        <div className="text-lg flex justify-between mb-2">
          <span className="text-gray-600">Descuento:</span>
          <span className="text-xl font-semibold text-black">
            -${discountAmount.toFixed(2)}
          </span>
        </div>
      )}

      <div className="text-lg flex justify-between mt-4 mb-4">
        <span className="text-gray-600 font-bold">Total:</span>
        <span className="text-xl font-semibold text-black">
          ${finalTotal.toFixed(2)}
        </span>
      </div>

      <div className="mt-4">
        <button
          onClick={onShippingButtonClick}
          className="w-full py-2 md:py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Calcular envío
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={onCheckout}
          className={`w-full py-2 md:py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Finalizar compra'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full mt-2 py-2 md:py-3 border border-black bg-gray-200 text-black font-bold rounded-lg shadow-md hover:bg-gray-300 transition-colors"
        >
          Continuar comprando
        </button>
      </div>
    </div>
  );
};

CartSummary.propTypes = {
  total: PropTypes.number.isRequired,
  onCheckout: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
  onShippingButtonClick: PropTypes.func.isRequired,
  shippingCost: PropTypes.number.isRequired,
  onDiscountChange: PropTypes.func.isRequired,
};

export default CartSummary;
