import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

// Products collection reference
const productsCollection = collection(db, 'products');

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
    // Check if products already exist
    const existingProducts = await getProductsFromFirestore();
    if (existingProducts.length > 0) {
      console.log('Products already initialized in Firestore');
      return;
    }

    // Add initial products
    const promises = initialProducts.map(product => addDoc(productsCollection, product));
    await Promise.all(promises);
    console.log('Initial products added to Firestore');
  } catch (error) {
    console.error('Error initializing products:', error);
  }
};