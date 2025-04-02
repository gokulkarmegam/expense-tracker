import { useState } from 'react';
import { FaRupeeSign } from 'react-icons/fa';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

const Transaction = ({ transactions, deleteTransaction, updateTransaction, categories }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    type: '',
    category: '',
    amount: ''
  });

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTransaction(editingId, editData);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  {editingId === transaction.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={editData.type}
                          onChange={(e) => setEditData({...editData, type: e.target.value})}
                          className="p-2 border rounded"
                        >
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={editData.category}
                          onChange={(e) => setEditData({...editData, category: e.target.value})}
                          className="p-2 border rounded"
                        >
                          <option value="">Select Category</option>
                          {(editData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-600">
                            <FaRupeeSign />
                          </span>
                          <input
                            type="number"
                            value={editData.amount}
                            onChange={(e) => setEditData({...editData, amount: e.target.value})}
                            className="pl-8 p-2 border rounded"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUpdate}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }">
                        <FaRupeeSign className="inline mr-1" />
                        {parseFloat(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transaction;