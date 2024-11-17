import { useEffect } from 'react';

const OrderConfirmation = () => {
  useEffect(() => {
    // Elimina el estado de descuento aplicado al confirmar el pedido
    localStorage.removeItem('discountApplied');
  }, []);

  return (
    <div className="confirmation-page">
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido confirmado.</p>
    </div>
  );
};

export default OrderConfirmation;
