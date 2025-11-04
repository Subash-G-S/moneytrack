import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TransactionChartProps {
  totalIncome: number;
  totalExpenses: number;
}

export const TransactionChart = ({ totalIncome, totalExpenses }: TransactionChartProps) => {
  const data = [
    {
      name: 'Income',
      value: totalIncome,
      color: 'hsl(var(--income))',
    },
    {
      name: 'Expenses',
      value: totalExpenses,
      color: 'hsl(var(--expense))',
    },
  ];

  const COLORS = ['hsl(var(--income))', 'hsl(var(--expense))'];

  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              color: 'hsl(var(--foreground))',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};