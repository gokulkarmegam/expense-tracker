import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Color variations for income (green) and expense (red)
const INCOME_COLORS = ['#83f28f', '#5cd86c', '#3bbf4a', '#1da62e', '#0c8c1c'];
const EXPENSE_COLORS = ['#ff6961', '#e8534b', '#d13d36', '#b82620', '#9e0f0b'];

const Chart = ({ transactions = [], categories = [] }) => {
  const [chartType, setChartType] = useState('type');

  // Safe calculations with null checks
  const totalIncome = (transactions || [])
    .filter(t => t?.type === 'income')
    .reduce((sum, t) => sum + (parseFloat(t?.amount) || 0), 0);
  
  const totalExpense = (transactions || [])
    .filter(t => t?.type === 'expense')
    .reduce((sum, t) => sum + (parseFloat(t?.amount) || 0), 0);
  
  const balance = totalIncome - totalExpense;

  // Prepare data for bar chart
  const typeData = [
    { name: 'Income', amount: totalIncome },
    { name: 'Expense', amount: totalExpense },
    { name: 'Balance', amount: balance }
  ];

  // Safe category data preparation
  const getCategoryData = (type) => {
    const filteredCategories = (categories || []).filter(cat => cat?.type === type);
    
    return filteredCategories.map(cat => {
      const total = (transactions || [])
        .filter(t => t?.type === type && t?.category === cat?.name)
        .reduce((sum, t) => sum + (parseFloat(t?.amount) || 0), 0);
      
      return { name: cat?.name, value: total };
    }).filter(item => item.value > 0);
  };

  const incomeCategoryData = getCategoryData('income');
  const expenseCategoryData = getCategoryData('expense');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Charts</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Chart View</label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="type">Income vs Expense</option>
          <option value="income">Income by Category</option>
          <option value="expense">Expense by Category</option>
        </select>
      </div>

      <div className="h-64">
        {chartType === 'type' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(2)}`, 'Amount']} />
              <Legend />
              <Bar 
                dataKey="amount" 
                name="Amount"
                shape={({ x, y, width, height, name }) => {
                  const fillColor = name === 'Income' ? '#1fd655' : 
                                 name === 'Expense' ? '#ff2c2c' : '#3b82f6';
                  return <rect x={x} y={y} width={width} height={height} fill={fillColor} rx={2} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : chartType === 'income' && incomeCategoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incomeCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {incomeCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value.toFixed(2)}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        ) : chartType === 'expense' && expenseCategoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value.toFixed(2)}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No data available for this view</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;