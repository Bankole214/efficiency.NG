import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

const categoriesCollection = collection(db, 'categories');

export const getCategoriesFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(categoriesCollection);
    const categoriesMap = new Map();
    querySnapshot.forEach((docSnapshot) => {
      const name = docSnapshot.data().name.trim();
      const nameLower = name.toLowerCase();
      if (!categoriesMap.has(nameLower)) {
        categoriesMap.set(nameLower, { id: docSnapshot.id, name });
      }
    });

    const categories = Array.from(categoriesMap.values());

    // Add "Other" if it doesn't exist (case-insensitive check)
    if (!categories.find(c => c.name.toLowerCase() === "other")) {
        categories.push({ id: "other-id", name: "Other" });
    }
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [{ id: "other-id", name: "Other" }];
  }
};

export const addCategoryToFirestore = async (name) => {
  try {
    const docRef = await addDoc(categoriesCollection, { name });
    return { id: docRef.id, name };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const deleteCategoryFromFirestore = async (id, name, products, updateProducts) => {
  try {
    const batch = writeBatch(db);
    const affectedProducts = products.filter(p => p.category === name);
    
    affectedProducts.forEach(p => {
      const productRef = doc(db, 'products', p.id);
      batch.update(productRef, { category: "Other" });
    });

    // 2. Delete the category doc
    const categoryRef = doc(db, 'categories', id);
    batch.delete(categoryRef);

    await batch.commit();

    // 3. Update local state
    const nextProducts = products.map(p => 
      p.category === name ? { ...p, category: "Other" } : p
    );
    updateProducts(nextProducts);
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const initializeCategoriesInFirestore = async (initialCategories) => {
  try {
    const querySnapshot = await getDocs(categoriesCollection);
    if (!querySnapshot.empty) {
      console.log('Categories already initialized');
      return;
    }

    const batch = writeBatch(db);
    initialCategories.forEach((catName) => {
      const catRef = doc(categoriesCollection);
      batch.set(catRef, { name: catName });
    });
    await batch.commit();
    console.log('Initial categories added to Firestore');
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};
