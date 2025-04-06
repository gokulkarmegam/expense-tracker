import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Color variations for income (green) and expense (red)
const INCOME_COLORS = ['#83f28f', '#5cd86c', '#3bbf4a', '#1da62e', '#0c8c1c'];
const EXPENSE_COLORS = ['#ff6961', '#e8534b', '#d13d36', '#b82620', '#9e0f0b'];

const Chart = ({ transactions, categories }) => {
  const [chartType, setChartType] = useState('type');

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const balance = totalIncome - totalExpense;

  // Prepare data for bar chart (income vs expense vs balance)
  const typeData = [
    {
      name: 'Income',
      amount: totalIncome,
    },
    {
      name: 'Expense',
      amount: totalExpense,
    },
    {
      name: 'Balance',
      amount: balance,
    },
  ];

  // Prepare data for pie chart (by category)
  const getCategoryData = (type) => {
    const filteredCategories = categories.filter(cat => cat.type === type);
    
    return filteredCategories.map(cat => {
      const total = transactions
        .filter(t => t.type === type && t.category === cat.name)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      return {
        name: cat.name,
        value: total,
      };
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
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}`, 'Amount']}
              />
              <Legend />
              <Bar 
                dataKey="amount" 
                name="Amount"
                shape={({ x, y, width, height, name }) => {
                  let fillColor;
                  if (name === 'Income') fillColor = '#1fd655'; // Green for income
                  else if (name === 'Expense') fillColor = '#ff2c2c'; // Red for expense
                  else fillColor = '#3b82f6'; // Blue for balance
                  
                  return <rect x={x} y={y} width={width} height={height} fill={fillColor} rx={2} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : chartType === 'income' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incomeCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#83f28f"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {incomeCategoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={INCOME_COLORS[index % INCOME_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#ff6961"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Chart;