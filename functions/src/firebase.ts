import { initializeApp } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
initializeApp();
export const firestore = getFirestore();
