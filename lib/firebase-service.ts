// lib/firebase-service.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
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

export const updatePeriodDailyLimit = async (periodId: string, daily_limit: number) => {
  const periodRef = doc(db, 'periods', periodId);
  await updateDoc(periodRef, { daily_limit });
};

export const deletePeriod = async (periodId: string, userId: string) => {
  const batch = writeBatch(db);

  const collectionsToDelete = ['incomes', 'budgets', 'daily_costs', 'miscellaneous_costs'];
  for (const coll of collectionsToDelete) {
    const q = query(
      collection(db, coll),
      where('userId', '==', userId),
      where('periodId', '==', periodId)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => batch.delete(doc.ref));
  }

  batch.delete(doc(db, 'periods', periodId));

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

// --- Daily Costs ---
export const addDailyCost = async (costData: {
  periodId: string;
  date: string;
  spent: number;
  userId: string;
}) => {
  const docRef = await addDoc(collection(db, 'daily_costs'), costData);
  return { id: docRef.id, ...costData };
};

export const getDailyCostsForPeriod = async (userId: string, periodId: string) => {
  const q = query(
    collection(db, 'daily_costs'),
    where('userId', '==', userId),
    where('periodId', '==', periodId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteDailyCost = async (costId: string) => {
  await deleteDoc(doc(db, 'daily_costs', costId));
};

// --- Miscellaneous Costs ---
export const addMiscellaneousCost = async (costData: {
  periodId: string;
  title: string;
  amount: number;
  userId: string;
}) => {
  const docRef = await addDoc(collection(db, 'miscellaneous_costs'), costData);
  return { id: docRef.id, ...costData };
};

export const getMiscellaneousCostsForPeriod = async (userId: string, periodId: string) => {
  const q = query(
    collection(db, 'miscellaneous_costs'),
    where('userId', '==', userId),
    where('periodId', '==', periodId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteMiscellaneousCost = async (costId: string) => {
  await deleteDoc(doc(db, 'miscellaneous_costs', costId));
};