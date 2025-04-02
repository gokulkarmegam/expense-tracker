import { useState } from "react";
import { FaRupeeSign } from "react-icons/fa";

const IncomeExpense = ({
  transactions,
  categories,
  addTransaction,
  addCategory,
}) => {
  const [transaction, setTransaction] = useState({
    type: "expense",
    category: "",
    amount: "",
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "expense",
  });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpense;



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transaction.category || !transaction.amount) return;
    addTransaction(transaction);
    setTransaction({
      type: "expense",
      category: "",
      amount: "",
    });
  };
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name) return;

    // Reset error
    setCategoryError("");

    // Check for duplicate category
    const categoryName = newCategory.name.trim();
    if (!categoryName) {
      setCategoryError('Category name cannot be empty!');
      return;
    }
    const categoryExists = categories.some(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (categoryExists) {
      setCategoryError("This category already exists!");
      return;
    }
    

    addCategory(newCategory);
    setNewCategory({
      name: "",
      type: "expense",
    });
    setShowCategoryForm(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Income & Expense</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-sm text-green-800">Income</h3>
          <p className="text-xl font-bold text-green-800">
            <FaRupeeSign className="inline mr-1" />
            {totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-sm text-red-800">Expense</h3>
          <p className="text-xl font-bold text-red-800">
            <FaRupeeSign className="inline mr-1" />
            {totalExpense.toFixed(2)}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg ${
            balance >= 0
              ? "bg-blue-100 text-blue-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          <h3 className="text-sm">Balance</h3>
          <p className="text-xl font-bold">
            <FaRupeeSign className="inline mr-1" />
            {balance.toFixed(2)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={transaction.type}
            onChange={(e) =>
              setTransaction({ ...transaction, type: e.target.value })
            }
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
              onChange={(e) =>
                setTransaction({ ...transaction, category: e.target.value })
              }
              className="flex-1 p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {(transaction.type === "income"
                ? incomeCategories
                : expenseCategories
              ).map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="bg-gray-200 hover:bg-gray-300 px-3 rounded"
            >
              +
            </button>
          </div>
        </div>

        {showCategoryForm && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="text-sm font-medium mb-2">Add New Category</h4>
            {categoryError && (
              <p className="text-red-500 text-xs mb-2">{categoryError}</p>
            )}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="flex-1 p-2 border rounded"
                required
              />
              <select
                value={newCategory.type}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, type: e.target.value })
                }
                className="p-2 border rounded"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">
              <FaRupeeSign />
            </span>
            <input
              type="number"
              value={transaction.amount}
              onChange={(e) =>
                setTransaction({ ...transaction, amount: e.target.value })
              }
              className="w-full pl-8 p-2 border rounded"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default IncomeExpense;
