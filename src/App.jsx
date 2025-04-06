import { useState, useEffect } from "react";
import IncomeExpense from "./Components/IncomeExpense";
import ChartSection from "./Components/Charts";
import Transactions from "./Components/Transactions";
import Categories from "./Components/Categories";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: "Salary", type: "income" },
    { id: 2, name: "Freelance", type: "income" },
    { id: 3, name: "Food", type: "expense" },
    { id: 4, name: "Transport", type: "expense" },
  ]);

  // Load data from localStorage
  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const savedCategories = JSON.parse(localStorage.getItem("categories")) || categories;
    setTransactions(savedTransactions);
    setCategories(savedCategories);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toLocaleString(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now(),
    };
    setCategories([...categories, newCategory]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <IncomeExpense
          transactions={transactions}
          categories={categories}
          addTransaction={addTransaction}
          addCategory={addCategory}
        />
        <ChartSection transactions={transactions} categories={categories} />
      </div>
      
      <Transactions
        transactions={transactions}
        deleteTransaction={deleteTransaction}
        updateTransaction={updateTransaction}
        categories={categories}
      />
      
      <Categories
        categories={categories}
        deleteCategory={deleteCategory}
      />
    </div>
  );
}

export default App;