import express from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { generateDiscountCode, validateDiscountCode } from './src/discountController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar correos
const enviarCorreoCompra = async (clienteEmail, clienteNombre, direccionCliente, localidad, provincia, codigoPostal, productos, total) => {
  const detallesProductos = productos.map(p => `Producto: ${p.title}, Cantidad: ${p.quantity}, Precio: $${p.unit_price}`).join('\n');

  // Correo para el cliente
  const correoCliente = {
    from: process.env.EMAIL_USER,
    to: clienteEmail,
    subject: 'Resumen de tu compra',
    text: `Gracias por tu compra, ${clienteNombre}!\n\nResumen de productos:\n${detallesProductos}\nTotal: $${total}`,
  };

  // Correo para el dueño del e-commerce, incluyendo localidad, provincia y código postal
  const correoDueno = {
    from: process.env.EMAIL_USER,
    to: 'tu_email_del_ecommerce@gmail.com', // Reemplaza con tu email de dueño
    subject: 'Nueva compra realizada',
    text: `Nueva compra de ${clienteNombre}\nDirección: ${direccionCliente}\nLocalidad: ${localidad}\nProvincia: ${provincia}\nCódigo Postal: ${codigoPostal}\n\nResumen de productos:\n${detallesProductos}\nTotal: $${total}`,
  };

  // Enviar ambos correos
  await transporter.sendMail(correoCliente);
  await transporter.sendMail(correoDueno);
};

// Endpoint para crear la preferencia de pago
app.post('/create_preference', async (req, res) => {
  try {
    const { preference } = req.body;

    if (!preference || !preference.items || !Array.isArray(preference.items) || preference.items.length === 0) {
      return res.status(400).json({ error: 'Objeto preference inválido' });
    }

    const items = preference.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    }));

    const preferenceData = {
      items,
      back_urls: {
        success: 'http://localhost:5173/success',
        failure: 'http://localhost:5173/failure',
        pending: 'http://localhost:5173/pending',
      },
      auto_return: 'approved',
    };

    if (preference.shippingCost && Number(preference.shippingCost) > 0) {
      preferenceData.shipments = {
        cost: Number(preference.shippingCost),
        mode: 'not_specified',
      };
    }

    const preferenceInstance = new Preference(client);
    const result = await preferenceInstance.create({ body: preferenceData });

    res.json({ id: result.id });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear la preferencia',
      details: error.message,
    });
  }
});

// Webhook para confirmar el pago y enviar el correo
app.post('/webhook', async (req, res) => {
  const paymentData = req.body;
  
  if (paymentData.type === 'payment' && paymentData.data.id) {
    try {
      const { data } = await client.get(`/v1/payments/${paymentData.data.id}`);
      const { email, payer, items, transaction_amount } = data;

      // Extraer datos necesarios del comprador y la dirección
      const clienteNombre = payer.first_name;
      const direccionCliente = payer.address.street_name || 'Dirección no especificada';
      const localidad = payer.address.city_name || 'Localidad no especificada';
      const provincia = payer.address.state_name || 'Provincia no especificada';
      const codigoPostal = payer.address.zip_code || 'Código postal no especificado';

      // Llamada a enviarCorreoCompra con los datos
      await enviarCorreoCompra(email, clienteNombre, direccionCliente, localidad, provincia, codigoPostal, items, transaction_amount);

      res.sendStatus(200);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
