import { db } from "../firebase";
import { collection, addDoc, updateDoc, doc, getDocs, query, orderBy, where } from "firebase/firestore";

// Constants for Order Schema
export const PaymentPlan = {
  FULL: "FULL_PAYMENT",
  DEPOSIT: "DEPOSIT_80",
};

export const OrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  BALANCE_DUE: "BALANCE_DUE",
  COMPLETED: "COMPLETED",
};

export const PaymentStatus = {
  PAID: "PAID", // All paid
  PARTIAL: "PARTIAL", // Deposit paid
};

const ORDERS_COLLECTION = "orders";

export const initiatePayment = (cartTotal, plan) => {
  if (plan === PaymentPlan.DEPOSIT) {
    return cartTotal * 0.8;
  }
  return cartTotal;
};

export const createOrder = async (orderDetails) => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderDetails,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...orderDetails };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrdersWithOutstandingBalance = async () => {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), where("paymentStatus", "==", PaymentStatus.PARTIAL));
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Sort in memory since we are filtering by paymentStatus and orderBy createdAt might require an index
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error("Error fetching outstanding orders:", error);
      throw error;
    }
  };

export const markBalanceCollected = async (orderId, orderDetails) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      amountPaid: orderDetails.total,
      balanceDue: 0,
      paymentStatus: PaymentStatus.PAID,
      paymentPlan: PaymentPlan.FULL, // they've now paid in full
    });
  } catch (error) {
    console.error("Error marking balance as collected:", error);
    throw error;
  }
};
