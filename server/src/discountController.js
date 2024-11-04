import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Inicializar Firebase Admin SDK con mejor manejo de errores
if (!admin.apps.length) {
  try {
    const firebaseConfig = process.env.FIREBASE_ADMIN_SDK;
    
    if (!firebaseConfig) {
      throw new Error('FIREBASE_ADMIN_SDK no está configurado en las variables de entorno');
    }

    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(firebaseConfig)),
    });
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
    throw error;
  }
}

const db = getFirestore();

// Función para generar un código de descuento
export const generateDiscountCode = async (code, discountValue, expirationDate) => {
  try {
    // Validaciones de entrada
    if (!code || typeof code !== 'string') {
      throw new Error('El código de descuento debe ser una cadena válida');
    }

    if (!discountValue || isNaN(discountValue) || discountValue <= 0) {
      throw new Error('El valor del descuento debe ser un número positivo');
    }

    if (!(expirationDate instanceof Date) || isNaN(expirationDate)) {
      throw new Error('La fecha de expiración debe ser una fecha válida');
    }

    // Verificar si el código ya existe
    const existingCode = await db.collection('discountCodes').doc(code).get();
    if (existingCode.exists) {
      throw new Error('El código de descuento ya existe');
    }

    const discountRef = db.collection('discountCodes').doc(code);
    await discountRef.set({
      discountValue,
      expirationDate: expirationDate.toISOString(),
      isActive: true,
      usageLimit: 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Código de descuento ${code} generado con éxito`);
    return { code, discountValue, expirationDate };
  } catch (error) {
    console.error("Error generando el código de descuento:", error.message);
    throw error; // Propagar el error original en lugar de crear uno nuevo
  }
};

// Función para validar un código de descuento
export const validateDiscountCode = async (code) => {
  try {
    // Validación de entrada
    if (!code || typeof code !== 'string') {
      throw new Error('El código de descuento debe ser una cadena válida');
    }

    const discountRef = db.collection('discountCodes').doc(code);
    const discountSnap = await discountRef.get();

    if (!discountSnap.exists) {
      throw new Error('Código de descuento inválido.');
    }

    const discountData = discountSnap.data();

    const expirationDate = new Date(discountData.expirationDate);
    const currentDate = new Date();

    // Verificar si el código ha expirado
    if (expirationDate < currentDate) {
      // Desactivar automáticamente el código expirado
      await discountRef.update({
        isActive: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      throw new Error('El código de descuento ha expirado.');
    }

    // Verificar si el código sigue activo
    if (!discountData.isActive) {
      throw new Error('El código de descuento no está activo.');
    }

    // Verificar el límite de uso (si existe)
    if (discountData.usageCount >= discountData.usageLimit) {
      await discountRef.update({
        isActive: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      throw new Error('El código de descuento ha alcanzado su límite de uso.');
    }

    return {
      discountValue: discountData.discountValue,
      expirationDate: expirationDate,
      usageLimit: discountData.usageLimit,
      currentUsage: discountData.usageCount || 0
    };
  } catch (error) {
    console.error('Error validando el código de descuento:', error.message);
    throw error;
  }
};

// Nueva función para usar un código de descuento
export const useDiscountCode = async (code) => {
  try {
    const discountRef = db.collection('discountCodes').doc(code);
    
    // Primero validamos el código
    const discountData = await validateDiscountCode(code);
    
    // Incrementar el contador de uso
    await discountRef.update({
      usageCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return discountData;
  } catch (error) {
    console.error('Error al usar el código de descuento:', error.message);
    throw error;
  }
};