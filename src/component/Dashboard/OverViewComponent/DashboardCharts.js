import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#581aae', '#22c55e', '#ffbb28', '#ff8042', '#0088FE', '#00C49F'];

const ChartCard = ({ title, children, height = 250, dataLength = 0 }) => (
  <div style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    width: "100%"
  }}>
    <h4 style={{ fontWeight: '600', color: "#581aae", marginBottom: '20px', fontSize: '0.9rem' }}>
      {title}
    </h4>
    <div style={{ width: '100%', height }}>
      {dataLength > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      ) : (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px' }}>
          No records found for this period
        </div>
      )}
    </div>
  </div>
);

const DashboardCharts = ({hideProfit, chartData, pieData, sourceNationPie, supplierPie, formatCurrency }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* 1. Debt Trend */}
      <ChartCard title="Debt vs Recovery Trend" dataLength={chartData.length}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff4d4f" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ff4d4f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} dy={10} />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            formatter={(value) => formatCurrency(value)} 
          />
          <Area type="monotone" dataKey="Debt" stroke="#ff4d4f" strokeWidth={3} fillOpacity={1} fill="url(#colorDebt)" />
          <Area type="monotone" dataKey="recovered" stroke="#22c55e" strokeWidth={3} fill="transparent" />
        </AreaChart>
      </ChartCard>

      {/* 2. Sales & Sale Method */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <ChartCard title="Monthly Sales Activity" height={220} dataLength={chartData.length}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
            <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: '#f8f9fa' }} />
            <Bar dataKey="Sales" fill="#581aae" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Sale Method Ratio" height={220} dataLength={pieData?.length}>
          <PieChart>
            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {pieData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '600' }} />
          </PieChart>
        </ChartCard>
      </div>

      {/* 3. Profit Analysis */}
 {!hideProfit && (
        <ChartCard title="Expected vs Actual Profit Analysis" dataLength={chartData.length}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#581aae" stopOpacity={0.1} /><stop offset="95%" stopColor="#581aae" stopOpacity={0} /></linearGradient>
              <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend verticalAlign="top" align="right" height={36} iconType="rect" />
            <Area name="Expected Profit" type="monotone" dataKey="ExpProfit" stroke="#581aae" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
            <Area name="Actual Profit" type="monotone" dataKey="ActProfit" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorAct)" />
          </AreaChart>
        </ChartCard>
      )}

 

    </div>
  );
};

export default DashboardCharts;