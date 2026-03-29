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

// Products collection reference
const productsCollection = collection(db, 'products');
const settingsDocRef = doc(db, 'metadata', 'productsInitialized');

// Get all products from Firestore
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

// Add a new product to Firestore
export const addProductToFirestore = async (product) => {
  try {
    const docRef = await addDoc(productsCollection, product);
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update a product in Firestore
export const updateProductInFirestore = async (id, updates) => {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, updates);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product from Firestore
export const deleteProductFromFirestore = async (id) => {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Initialize products in Firestore (run once to set up initial data)
export const initializeProductsInFirestore = async (initialProducts) => {
  try {
    await runTransaction(db, async (tx) => {
      const settingsSnap = await tx.get(settingsDocRef);
      if (settingsSnap.exists()) {
        console.log('Products already initialized in Firestore');
        return;
      }

      // Write initial products in a batch
      const batch = writeBatch(db);
      initialProducts.forEach((product) => {
        const prodRef = doc(productsCollection);
        batch.set(prodRef, product);
      });

      // mark initialization complete
      batch.set(settingsDocRef, { initializedAt: new Date().toISOString() });
      await batch.commit();
      console.log('Initial products added to Firestore');
    });
  } catch (error) {
    if (error.name === 'FirebaseError' && error.code === 'aborted') {
      // Transaction aborted; maybe another process already initialized
      console.log('Initialization transaction aborted, likely already initialized.');
      return;
    }
    console.error('Error initializing products:', error);
  }
};