import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // Importa AuthContext
import axios from "axios";
import Swal from "sweetalert2";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import ShippingModal from "./ShippingModal";
import ShippingCalculator from "./ShippingCalculator";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext); // Accede al estado de autenticación
  const [loading, setLoading] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const navigate = useNavigate();

  const handleOpenShippingModal = () => {
    setShowShippingModal(true);
  };

  const handleCloseShippingModal = () => {
    setShowShippingModal(false);
  };


  const handleShippingAccepted = (cost) => {
    setShippingCost(cost);
    setShowShippingModal(false);
  };

  const handleDiscountChange = (discountValue) => {
    setDiscount(discountValue);
    setDiscountApplied(true); // Descuento aplicado, el formulario desaparecerá
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const applyDiscount = (items, totalProductsPrice) => {
    const discountAmount = (totalProductsPrice * discount) / 100;
    if (discountAmount > 0 && items.length > 0) {
      const discountRatio = discountAmount / totalProductsPrice;

      return items.map((item) => {
        const itemTotalPrice = item.unit_price * item.quantity;
        const itemDiscount = itemTotalPrice * discountRatio;
        const adjustedUnitPrice =
          (itemTotalPrice - itemDiscount) / item.quantity;
        return {
          ...item,
          unit_price: parseFloat(adjustedUnitPrice.toFixed(2)),
        };
      });
    }
    return items;
  };

  const handleCheckout = async () => {
    // Verifica si el usuario está autenticado
    if (!isAuthenticated) {
      Swal.fire({
        icon: "info",
        title: "Inicia sesión",
        text: "Por favor, inicia sesión para completar la compra.",
      });
      navigate("/login"); // Redirige a la página de inicio de sesión si no está autenticado
      return;
    }

    // Verifica si el carrito tiene productos
    if (!cartItems || cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Por favor, asegúrate de que el carrito tenga productos.",
      });
      return;
    }

    // Verifica si el costo de envío está calculado
    if (shippingCost === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Por favor, asegúrate de que el costo de envío esté calculado.",
      });
      return;
    }

    setLoading(true);
    try {
      for (const item of cartItems) {
        if (!item.id) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `El producto ${item.name} no tiene un identificador válido.`,
          });
          setLoading(false);
          return;
        }
      }

      let items = cartItems.map((item) => ({
        title: item.name,
        quantity: Number(item.quantity),
        currency_id: "ARS",
        unit_price: item.price,
      }));

      const totalProductsPrice = items.reduce(
        (acc, item) => acc + item.unit_price * item.quantity,
        0
      );

      items = applyDiscount(items, totalProductsPrice);

      if (shippingCost > 0) {
        items.push({
          title: "Costo de envío",
          quantity: 1,
          currency_id: "ARS",
          unit_price: shippingCost,
        });
      }

      const preference = {
        items: items,
      };

      const response = await axios.post(
        "https://www.tecnoymas.shop/api/create_preference",
        { preference }
    );

      const { id } = response.data;
      Swal.fire({
        icon: "success",
        title: "Redirigiendo a pago",
        text: "Serás redirigido a Mercado Pago.",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${id}`;
      }, 2000);
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar la compra. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full">
        <h2 className="text-3xl font-bold text-black mb-6">Mi carrito</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-700 text-xl">
            No hay productos en el carrito.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <CartSummary
              total={subtotal}
              shippingCost={shippingCost}
              onCheckout={handleCheckout} // Usa handleCheckout para el botón de compra
              loading={loading}
              navigate={navigate}
              onShippingButtonClick={handleOpenShippingModal}
              onDiscountChange={handleDiscountChange}
              discountApplied={discountApplied}
              discount={discount}
            />
          </div>
        )}
      </div>

      {showShippingModal && (
        <ShippingModal onClose={handleCloseShippingModal}>
          <ShippingCalculator onShippingAccepted={handleShippingAccepted} />
        </ShippingModal>
      )}
    </div>
  );
};

export default Cart;
