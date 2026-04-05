import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  getDoc,
  setDoc,
  runTransaction,
  collection as collectionFn,
} from 'firebase/firestore';
import { db } from '../firebase';

const productsCollection = collection(db, 'products');
const settingsDocRef = doc(db, 'metadata', 'productsInitialized');

export const getProductsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(productsCollection);
    const products = [];
    querySnapshot.forEach((docSnapshot) => {
      products.push({ id: docSnapshot.id, ...docSnapshot.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

export const addProductToFirestore = async (product) => {
  try {
    const docRef = await addDoc(productsCollection, product);
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProductInFirestore = async (id, updates) => {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, updates);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProductFromFirestore = async (id) => {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const initializeProductsInFirestore = async (initialProducts) => {
  try {
    await runTransaction(db, async (tx) => {
      const settingsSnap = await tx.get(settingsDocRef);
      if (settingsSnap.exists()) {
        console.log('Products already initialized in Firestore');
        return;
      }

      const batch = writeBatch(db);
      initialProducts.forEach((product) => {
        const prodRef = doc(productsCollection);
        batch.set(prodRef, product);
      });

      batch.set(settingsDocRef, { initializedAt: new Date().toISOString() });
      await batch.commit();
      console.log('Initial products added to Firestore');
    });
  } catch (error) {
    if (error.name === 'FirebaseError' && error.code === 'aborted') {
      console.log('Initialization transaction aborted, likely already initialized.');
      return;
    }
    console.error('Error initializing products:', error);
  }
};