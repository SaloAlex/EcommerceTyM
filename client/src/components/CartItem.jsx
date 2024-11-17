import PropTypes from "prop-types";
import QuantitySelector from "./QuantitySelector";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const totalItemPrice = item.price * item.quantity;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-300 py-4">
      <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
        <img
          src={item.imageUrls ? item.imageUrls[0] : ""}
          alt={`Imagen de ${item.name}`}
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md mr-4"
        />
        <div className="flex flex-col">
          <p className="text-lg md:text-xl font-semibold text-black">{item.name}</p>
          <button
            onClick={() => onRemove(item.id)}
            className="text-sm text-blue-500 hover:underline"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center md:flex-row md:space-x-6 w-full md:w-auto mb-4 md:mb-0">
        <QuantitySelector
          productId={item.id}
          initialQuantity={item.quantity}
          onQuantityChange={(newQuantity) => onQuantityChange(item.id, newQuantity)}
        />
        <div className="text-lg text-black font-bold mt-2 md:mt-0">
          ${totalItemPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
