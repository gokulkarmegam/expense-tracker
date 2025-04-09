import useLocalStorage from "./useLocalStorage";
import IncomeExpense from "./Components/IncomeExpense";
import ChartSection from "./Components/Charts";
import Transactions from "./Components/Transactions";

const DEFAULT_CATEGORIES = [
  { id: 1, name: "Salary", type: "income" },
  { id: 2, name: "Freelance", type: "income" },
  { id: 3, name: "Food", type: "expense" },
  { id: 4, name: "Transport", type: "expense" },
];

function App() {
  const [transactions, setTransactions] = useLocalStorage("transactions", []);
  const [categories, setCategories] = useLocalStorage("categories", DEFAULT_CATEGORIES);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      ...prev,
      {
        ...transaction,
        id: Date.now(),
        date: new Date().toLocaleString(),
      },
    ]);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  const addCategory = (category) => {
    setCategories((prev) => [
      ...prev,
      {
        ...category,
        id: Date.now(),
      },
    ]);
  };

  const deleteCategory = (id) => {
    const deletedCategory = categories.find((c) => c.id === id);
    if (deletedCategory) {
      setCategories((prev) => prev.filter((category) => category.id !== id));
      setTransactions((prev) =>
        prev.map((t) =>
          t.category === deletedCategory.name ? { ...t, category: "" } : t
        )
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <IncomeExpense
          transactions={transactions}
          categories={categories}
          addTransaction={addTransaction}
          addCategory={addCategory}
          deleteCategory={deleteCategory}
        />
        <ChartSection transactions={transactions} categories={categories} />
      </div>

      <Transactions
        transactions={transactions}
        deleteTransaction={deleteTransaction}
        updateTransaction={updateTransaction}
        categories={categories}
      />
    </div>
  );
}

export default App;
