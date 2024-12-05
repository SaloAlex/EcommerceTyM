const config = {
  mercadopago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TU_TOKEN_DE_PRODUCCION',
  },
  cors: {
    origins: ['https://www.tecnoymas.shop'], // Permitir origen de tu dominio
  },
  server: {
    port: process.env.PORT || 3000,
    baseUrl: 'https://www.tecnoymas.shop', // Base URL de producción
  },
  urls: {
    success: 'https://www.tecnoymas.shop/success', // URL de éxito en producción
    failure: 'https://www.tecnoymas.shop/failure', // URL de fallo en producción
    pending: 'https://www.tecnoymas.shop/pending',  // URL de pendiente en producción
  }
};

export default config;
