// lib/firebase-service.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// --- Periods ---
export const addPeriod = async (periodData: {
  name: string;
  start_date: string;
  end_date: string;
  userId: string;
}) => {
  const docRef = await addDoc(collection(db, 'periods'), periodData);
  return { id: docRef.id, ...periodData };
};

export const getPeriods = async (userId: string) => {
  const q = query(collection(db, 'periods'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deletePeriod = async (periodId: string, userId: string) => {
  // Firestore security rules for batched writes can be tricky.
  // A more reliable pattern is to fetch the documents to be deleted first,
  // then add them to a batch.

  // 1. Find associated incomes
  const incomesQuery = query(
    collection(db, 'incomes'),
    where('userId', '==', userId),
    where('periodId', '==', periodId)
  );
  const incomesSnapshot = await getDocs(incomesQuery);

  // 2. Find associated budgets
  const budgetsQuery = query(
    collection(db, 'budgets'),
    where('userId', '==', userId),
    where('periodId', '==', periodId)
  );
  const budgetsSnapshot = await getDocs(budgetsQuery);

  // 3. Create a batch and add all delete operations
  const batch = writeBatch(db);
  incomesSnapshot.forEach((doc) => batch.delete(doc.ref));
  budgetsSnapshot.forEach((doc) => batch.delete(doc.ref));
  batch.delete(doc(db, 'periods', periodId));

  // 4. Commit the batch
  await batch.commit();
};


// --- Incomes ---
export const addIncome = async (incomeData: {
  periodId: string;
  source: string;
  amount: number;
  userId: string;
}) => {
  const docRef = await addDoc(collection(db, 'incomes'), incomeData);
  return { id: docRef.id, ...incomeData };
};

export const getIncomesForPeriod = async (userId: string, periodId: string) => {
  const q = query(
    collection(db, 'incomes'),
    where('userId', '==', userId),
    where('periodId', '==', periodId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteIncome = async (incomeId: string) => {
  await deleteDoc(doc(db, 'incomes', incomeId));
};

// --- Budgets ---
export const addBudget = async (budgetData: {
  periodId: string;
  name: string;
  amount_allocated: number;
  status: 'paid' | 'not_paid';
  userId: string;
}) => {
  const docRef = await addDoc(collection(db, 'budgets'), budgetData);
  return { id: docRef.id, ...budgetData };
};

export const getBudgetsForPeriod = async (userId: string, periodId: string) => {
  const q = query(
    collection(db, 'budgets'),
    where('userId', '==', userId),
    where('periodId', '==', periodId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteBudget = async (budgetId: string) => {
  await deleteDoc(doc(db, 'budgets', budgetId));
};