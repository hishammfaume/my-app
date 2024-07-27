import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { Button, notification } from "antd";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import BudgetModal from "../components/Modals/BudgetModal";
import ReportModal from "../components/Modals/ReportModal"; // Import the ReportModal component
import TransactionsTable from "../components/TransactionsTable";
import { addDoc, collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions/NoTransactions";
//import './styles.css'; // Import the CSS file for the styles

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false); // State for report modal
  const [income, setIncome] = useState(0);
  const [expense, setExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [budgets, setBudgets] = useState({});

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const showBudgetModal = () => {
    setIsBudgetModalVisible(true);
  };
  const showReportModal = () => {
    setIsReportModalVisible(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };
  const handleBudgetCancel = () => {
    setIsBudgetModalVisible(false);
  };
  const handleReportCancel = () => {
    setIsReportModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  const saveBudget = async (values) => {
    const { expenseType, budget } = values;
    if (!user) return;
    try {
      await setDoc(doc(db, `users/${user.uid}/budgets/${expenseType}`), { budget: parseFloat(budget) });
      setBudgets((prev) => ({ ...prev, [expenseType]: parseFloat(budget) }));
      notification.success({
        message: 'Budget Set',
        description: `Budget for ${expenseType} set to ${budget}`,
      });
    } catch (e) {
      console.error('Error setting budget: ', e);
      toast.error("Couldn't set budget");
    }
    setIsBudgetModalVisible(false);
  };

  async function addTransaction(transaction, many) {
    if (!user) return;
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
      let newArr = [...transactions, transaction];
      setTransactions(newArr);
      calculateBalance();
      if (transaction.type === 'expense') {
        checkBudgetExceedance(transaction.tag, newArr);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  const checkBudgetExceedance = (tag, updatedTransactions) => {
    const totalForTag = updatedTransactions.filter(t => t.tag === tag && t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    if (totalForTag > budgets[tag] && budgets[tag] > 0) {
      notification.warning({
        message: 'Budget Alert',
        description: `You have exceeded your budget for ${tag}!`,
      });
    }
  };

  const resetBalance = () => {
    setIncome(0);
    setExpenses(0);
    setTotalBalance(0);
    toast.success("Balance Reset!");
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchBudgets();
    }
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  const fetchBudgets = async () => {
    if (!user) return;
    const budgetsCollection = collection(db, `users/${user.uid}/budgets`);
    const querySnapshot = await getDocs(budgetsCollection);
    let budgetsData = {};
    querySnapshot.forEach((doc) => {
      budgetsData[doc.id] = doc.data().budget;
    });
    setBudgets(budgetsData);
  };

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
    console.log(transactionsArray);
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            resetBalance={resetBalance}
          />
          <div className="chart-budget-container">
            <Button type="primary" className="budget-button" onClick={showBudgetModal}>
              Set Budget
            </Button>
            <Button type="primary" className="report-button" onClick={showReportModal}>
              View Report
            </Button>
          </div>
          <div className="current-budgets">
            <h2>Current Budgets</h2>
            <ul>
              {Object.keys(budgets).map((tag) => (
                <li key={tag}>
                  {tag}: ${budgets[tag].toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          {transactions.length !== 0 ? <ChartComponent sortedTransactions={sortedTransactions}/> : <NoTransactions /> }
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={(values) => onFinish(values, 'expense')}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={(values) => onFinish(values, 'income')}
          />
          <BudgetModal
            isVisible={isBudgetModalVisible}
            handleCancel={handleBudgetCancel}
            onFinish={saveBudget}
          />
          <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
          <ReportModal
            isVisible={isReportModalVisible}
            handleCancel={handleReportCancel}
            transactions={transactions}
            budgets={budgets}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
