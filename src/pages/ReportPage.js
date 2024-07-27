import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ReportComponent from '../components/Report/ReportComponent';
import Header from '../components/Header';

function ReportPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  async function fetchTransactions() {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, `users/${user.uid}/transactions`));
    const querySnapshot = await getDocs(q);
    let transactionsArray = [];
    querySnapshot.forEach((doc) => {
      transactionsArray.push(doc.data());
    });
    setTransactions(transactionsArray);
    setLoading(false);
  }

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReportComponent transactions={transactions} />
      )}
    </div>
  );
}

export default ReportPage;
