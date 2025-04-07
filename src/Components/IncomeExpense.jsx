import { useState, useMemo } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

const IncomeExpense = ({
  transactions = [],
  categories = [],
  addTransaction,
  addCategory,
  deleteCategory
}) => {
  const [transaction, setTransaction] = useState({ type: "expense", category: "", amount: "" });
  const [newCategory, setNewCategory] = useState({ name: "", type: "expense" });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  // Derived state using useMemo for optimization
  const incomeCategories = useMemo(() => categories.filter(cat => cat?.type === "income"), [categories]);
  const expenseCategories = useMemo(() => categories.filter(cat => cat?.type === "expense"), [categories]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        const amount = parseFloat(t?.amount) || 0;
        if (t?.type === "income") acc.income += amount;
        if (t?.type === "expense") acc.expense += amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const balance = useMemo(() => totals.income - totals.expense, [totals]);

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transaction.category || !transaction.amount) return;

    addTransaction(transaction);
    setTransaction({ type: "expense", category: "", amount: "" });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const name = newCategory.name.trim();

    if (!name) return setCategoryError("Category name cannot be empty!");
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      return setCategoryError("This category already exists!");
    }

    addCategory(newCategory);
    setNewCategory({ name: "", type: "expense" });
    setShowCategoryForm(false);
    setCategoryError("");
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    const categoryInUse = transactions.some(
      t => t.categoryId === categoryId || t.category === category?.name
    );

    if (categoryInUse) {
      alert("Cannot delete - this category is used in existing transactions");
      return;
    }

    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(categoryId);
      if (transaction.category === category?.name) {
        setTransaction(prev => ({ ...prev, category: "" }));
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Income & Expense</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Income" amount={totals.income} className="bg-green-100 text-green-800" />
        <SummaryCard label="Expense" amount={totals.expense} className="bg-red-100 text-red-800" />
        <SummaryCard label="Balance" amount={balance} className={balance >= 0 ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"} />
      </div>

      {/* Transaction Form */}
      <TransactionForm
        transaction={transaction}
        setTransaction={setTransaction}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        onSubmit={handleSubmit}
        onShowCategoryForm={() => setShowCategoryForm(true)}
      />

      {/* Category Management */}
      {showCategoryForm && (
        <CategoryForm
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          categories={categories}
          error={categoryError}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onClose={() => {
            setShowCategoryForm(false);
            setCategoryError("");
          }}
        />
      )}
    </div>
  );
};

const SummaryCard = ({ label, amount, className }) => (
  <div className={`p-4 rounded-lg ${className}`}>
    <h3 className="text-sm">{label}</h3>
    <p className="text-xl font-bold">
      <FaRupeeSign className="inline mr-1" />
      {amount.toFixed(2)}
    </p>
  </div>
);

const TransactionForm = ({
  transaction,
  setTransaction,
  incomeCategories,
  expenseCategories,
  onSubmit,
  onShowCategoryForm
}) => {
  const currentCategories = transaction.type === "income" ? incomeCategories : expenseCategories;

  return (
    <form onSubmit={onSubmit} className="mb-6">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={transaction.type}
          onChange={(e) => setTransaction({ ...transaction, type: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <div className="flex gap-2">
          <select
            value={transaction.category}
            onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
            className="flex-1 p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {currentCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={onShowCategoryForm}
            className="bg-gray-200 hover:bg-gray-300 px-3 rounded"
          >
            +
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">
            <FaRupeeSign />
          </span>
          <input
            type="number"
            value={transaction.amount}
            onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
            className="w-full pl-8 p-2 border rounded"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
        Add Transaction
      </button>
    </form>
  );
};

const CategoryForm = ({
  newCategory,
  setNewCategory,
  categories,
  error,
  onAddCategory,
  onDeleteCategory,
  onClose
}) => (
  <div className="mb-4 p-3 bg-gray-50 rounded">
    <h4 className="text-sm font-medium mb-2">Add New Category</h4>
    {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

    <div className="mb-4">
      <h5 className="text-xs font-medium mb-1">Existing Categories:</h5>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-2 bg-white rounded border">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-2 ${category.type === "income" ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">{category.name}</span>
            </div>
            <button
              onClick={() => onDeleteCategory(category.id)}
              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
              title="Delete category"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>

    <div className="flex gap-2 mb-2">
      <input
        type="text"
        placeholder="Category Name"
        value={newCategory.name}
        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        className="flex-1 p-2 border rounded text-sm"
        required
      />
      <select
        value={newCategory.type}
        onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
        className="p-2 border rounded text-sm"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>

    <div className="flex justify-end gap-2">
      <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 transition-colors">
        Cancel
      </button>
      <button onClick={onAddCategory} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
        Add Category
      </button>
    </div>
  </div>
);

export default IncomeExpense;
