import { useState } from 'react';
import { Transaction } from '../types';
import { generateLocalInsights } from '../data';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  transactions: Transaction[];
  setActiveTab: (tab: string) => void;
  setTaxEstimatorNetIncome: (income: number) => void;
  isPrivacyMode?: boolean;
}

export default function DashboardView({ 
  transactions, 
  setActiveTab,
  setTaxEstimatorNetIncome,
  isPrivacyMode = false
}: DashboardViewProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // 1. Calculate Core Financial Metrics
  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  const totalRevenue = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Assume starting cash reserves of $150,000
  const STARTING_CASH = 150000;
  const currentCash = STARTING_CASH + netProfit;
  
  // Calculate Average Monthly Expenses (Burn Rate)
  // Let's list the distinct months in the dataset
  const monthsSet = new Set<string>();
  transactions.forEach(t => {
    const m = t.date.substring(0, 7); // YYYY-MM
    monthsSet.add(m);
  });
  const numMonths = Math.max(1, monthsSet.size);
  const avgMonthlyExpenses = totalExpenses / numMonths;
  const cashRunwayMonths = avgMonthlyExpenses > 0 ? (currentCash / avgMonthlyExpenses) : 99;

  // 2. Aggregate Data for Cash Flow Trends (6-month Bar Chart)
  // Let's group transactions by month
  const monthlyDataMap: Record<string, { month: string; monthLabel: string; revenue: number; expenses: number }> = {};
  
  // Initialize standard 6 months (Feb 2026 to Jul 2026) to match mockup exactly
  const standardMonths = [
    { key: '2026-02', label: 'Feb 2026' },
    { key: '2026-03', label: 'Mar 2026' },
    { key: '2026-04', label: 'Apr 2026' },
    { key: '2026-05', label: 'May 2026' },
    { key: '2026-06', label: 'Jun 2026' },
    { key: '2026-07', label: 'Jul 2026' },
  ];

  standardMonths.forEach(m => {
    monthlyDataMap[m.key] = {
      month: m.key,
      monthLabel: m.label,
      revenue: 0,
      expenses: 0,
    };
  });

  // Populate from transactions
  transactions.forEach(t => {
    const monthKey = t.date.substring(0, 7);
    if (monthlyDataMap[monthKey]) {
      if (t.type === 'income') {
        monthlyDataMap[monthKey].revenue += t.amount;
      } else {
        monthlyDataMap[monthKey].expenses += t.amount;
      }
    } else {
      // Dynamic month if outside standard 6
      const dateObj = new Date(t.date + 'T00:00:00');
      const label = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyDataMap[monthKey] = {
        month: monthKey,
        monthLabel: label,
        revenue: t.type === 'income' ? t.amount : 0,
        expenses: t.type === 'expense' ? t.amount : 0,
      };
    }
  });

  const chartData = Object.values(monthlyDataMap).sort((a, b) => a.month.localeCompare(b.month));

  // 3. Aggregate Expense Breakdown by Category for Donut Chart
  const categoryDataMap: Record<string, number> = {};
  expenses.forEach(t => {
    categoryDataMap[t.category] = (categoryDataMap[t.category] || 0) + t.amount;
  });

  const categoryColors: Record<string, string> = {
    'Rent & Utilities': '#3b82f6', // blue
    'Professional Services': '#10b981', // green
    'Marketing & Advertising': '#f59e0b', // amber
    'Insurance': '#ec4899', // pink
    'Software & Tools': '#8b5cf6', // purple
    'Equipment': '#f97316', // orange
    'Supplies & Materials': '#64748b', // slate
    'Consulting': '#06b6d4', // cyan
    'Service Revenue': '#14b8a6', // teal
  };

  const defaultColor = '#94a3b8';

  const rawExpenseCategories = Object.entries(categoryDataMap).map(([category, amount]) => ({
    category,
    amount,
    color: categoryColors[category] || defaultColor,
  })).sort((a, b) => b.amount - a.amount);

  const totalCategorizedExpenses = rawExpenseCategories.reduce((sum, c) => sum + c.amount, 0);

  // Generate smart live insights based on current state
  const liveInsights = generateLocalInsights(transactions).slice(0, 3); // Take top 3 for the dashboard

  // Donut chart calculations
  let accumulatedAngle = 0;
  const donutSlices = rawExpenseCategories.map(cat => {
    const percentage = totalCategorizedExpenses > 0 ? (cat.amount / totalCategorizedExpenses) : 0;
    const angle = percentage * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;
    return {
      ...cat,
      percentage,
      startAngle,
      endAngle: accumulatedAngle,
    };
  });

  // Calculate coordinates for SVG path
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div id="dashboard-view" className="space-y-8 animate-fade-in">
      {/* View Header */}
      <div id="dashboard-header">
        <h2 id="dashboard-title" className="text-2xl font-sans font-bold tracking-tight text-slate-900">
          Command Center
        </h2>
        <p id="dashboard-subtitle" className="text-sm text-slate-500 font-sans mt-1">
          Welcome back. Here's what's happening with your business capital today.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div id="metric-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Profit */}
        <div id="card-net-profit" className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Net Profit</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-sans font-bold text-slate-900 tracking-tight">
              {isPrivacyMode ? '$••••' : `$${netProfit.toLocaleString()}`}
            </h3>
            <span className="text-xs font-mono text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Cumulative Net Income
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div id="card-revenue" className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Total Revenue</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-sans font-bold text-slate-900 tracking-tight">
              {isPrivacyMode ? '$••••' : `$${totalRevenue.toLocaleString()}`}
            </h3>
            <span className="text-xs text-slate-500 font-sans flex items-center gap-1 mt-1">
              Active cash inflows
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div id="card-expenses" className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Total Expenses</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-sans font-bold text-slate-900 tracking-tight">
              {isPrivacyMode ? '$••••' : `$${totalExpenses.toLocaleString()}`}
            </h3>
            <span className="text-xs text-slate-500 font-sans flex items-center gap-1 mt-1">
              Operating & overhead spend
            </span>
          </div>
        </div>

        {/* Cash Runway */}
        <div id="card-runway" className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Cash Runway</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-sans font-bold text-slate-900 tracking-tight">
              {isPrivacyMode ? '••••' : (cashRunwayMonths >= 90 ? '99+' : cashRunwayMonths.toFixed(1) + ' months')}
            </h3>
            <span className="text-xs font-mono text-slate-500 font-medium flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-1 leading-tight">
              <span className="text-emerald-600">Avg Inflow: {isPrivacyMode ? '$••••' : `$${(totalRevenue / numMonths).toFixed(0)}`}/mo</span>
              <span className="text-slate-300">|</span>
              <span className="text-rose-600">Outflow: {isPrivacyMode ? '$••••' : `$${avgMonthlyExpenses.toFixed(0)}`}/mo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div id="charts-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cash Flow Trends Bar Chart */}
        <div id="trend-chart-container" className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-sans font-bold text-slate-900 text-base leading-tight">Cash Flow Trends</h3>
              <p className="text-xs text-slate-500 mt-1 font-sans">Revenue vs operating expenses across past periods</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-sans font-medium">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Revenue
              </div>
              <div className="flex items-center gap-1.5 text-rose-500">
                <span className="w-3 h-3 bg-rose-500 rounded-sm"></span> Expenses
              </div>
            </div>
          </div>

          {/* Custom Interactive SVG Bar Chart */}
          <div className="relative h-64 flex flex-col justify-end">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {/* grid lines */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full border-t border-slate-100 h-0"></div>
              ))}
              <div className="w-full border-t-2 border-slate-200 h-0 mt-auto"></div>
            </div>

            {/* Bars container */}
            <div className="relative flex justify-between items-end h-52 px-2 z-10">
              {chartData.map((data, idx) => {
                const maxVal = Math.max(...chartData.map(d => Math.max(d.revenue, d.expenses))) || 10000;
                const revHeight = `${(data.revenue / maxVal) * 100}%`;
                const expHeight = `${(data.expenses / maxVal) * 100}%`;
                const isHovered = hoveredBar === idx;

                return (
                  <div 
                    key={data.month} 
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-20 bg-slate-950 text-white rounded-lg p-2.5 shadow-lg text-xs font-mono z-50 pointer-events-none min-w-[140px] text-left transition-all duration-150 animate-scale-up border border-slate-800">
                        <div className="font-sans font-semibold text-slate-400 mb-1">{data.monthLabel}</div>
                        <div className="text-emerald-400 flex justify-between">
                          <span>Revenue:</span> 
                          <span>{isPrivacyMode ? '$••••' : `$${data.revenue.toLocaleString()}`}</span>
                        </div>
                        <div className="text-rose-400 flex justify-between">
                          <span>Expenses:</span> 
                          <span>{isPrivacyMode ? '$••••' : `$${data.expenses.toLocaleString()}`}</span>
                        </div>
                        <div className="border-t border-slate-800 my-1 pt-1 text-white font-semibold flex justify-between">
                          <span>Net Profit:</span> 
                          <span>{isPrivacyMode ? '$••••' : `$${(data.revenue - data.expenses).toLocaleString()}`}</span>
                        </div>
                      </div>
                    )}

                    {/* Bars grouping */}
                    <div className="flex gap-1.5 items-end h-full w-full justify-center max-w-[80px]">
                      {/* Revenue Bar */}
                      <div 
                        style={{ height: revHeight }} 
                        className={`w-4 bg-emerald-500 rounded-t-sm transition-all duration-300 ${
                          isHovered ? 'brightness-110 shadow-lg shadow-emerald-500/20' : 'group-hover:bg-emerald-400'
                        }`}
                      ></div>
                      {/* Expenses Bar */}
                      <div 
                        style={{ height: expHeight }} 
                        className={`w-4 bg-rose-500 rounded-t-sm transition-all duration-300 ${
                          isHovered ? 'brightness-110 shadow-lg shadow-rose-500/20' : 'group-hover:bg-rose-400'
                        }`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between mt-3 px-2 font-mono text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-2 z-10">
              {chartData.map((data) => (
                <div key={data.month} className="flex-1 text-center truncate">
                  {data.monthLabel.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expense Breakdown Donut Chart */}
        <div id="expense-pie-container" className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div>
            <h3 className="font-sans font-bold text-slate-900 text-base leading-tight">Expense Breakdown</h3>
            <p className="text-xs text-slate-500 mt-1 font-sans">Cumulative spending split across categories</p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center my-6 relative min-h-[180px]">
            {totalCategorizedExpenses === 0 ? (
              <p className="text-slate-400 text-sm font-sans">No expenses recorded yet.</p>
            ) : (
              <>
                {/* Custom SVG Donut Chart */}
                <svg width="180" height="180" viewBox="-90 -90 180 180" className="transform -rotate-90">
                  <circle cx="0" cy="0" r="70" fill="transparent" stroke="#f1f5f9" strokeWidth="24" />
                  {donutSlices.map((slice, i) => {
                    // SVG dash array calculation
                    const radius = 70;
                    const circumference = 2 * Math.PI * radius;
                    const strokeLength = slice.percentage * circumference;
                    const strokeOffset = circumference - (slice.startAngle / 360) * circumference;
                    const isHovered = hoveredSlice === slice.category;

                    return (
                      <circle
                        key={slice.category}
                        cx="0"
                        cy="0"
                        r={radius}
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth={isHovered ? 28 : 24}
                        strokeDasharray={`${strokeLength} ${circumference}`}
                        strokeDashoffset={-((slice.startAngle / 360) * circumference)}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredSlice(slice.category)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                    );
                  })}
                  {/* Center cutout */}
                  <circle cx="0" cy="0" r="50" fill="#ffffff" />
                </svg>

                {/* Center Text displaying active category */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                  {hoveredSlice ? (
                    <>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                        {hoveredSlice}
                      </span>
                      <span className="text-lg font-sans font-bold text-slate-900 leading-tight">
                        {isPrivacyMode ? '$••••' : `$${categoryDataMap[hoveredSlice]?.toLocaleString()}`}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-0.5">
                        {((categoryDataMap[hoveredSlice] / totalCategorizedExpenses) * 100).toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                        Total Spent
                      </span>
                      <span className="text-xl font-sans font-bold text-slate-900 leading-tight">
                        {isPrivacyMode ? '$••••' : `$${totalCategorizedExpenses.toLocaleString()}`}
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Donut Legend */}
          <div className="space-y-1.5 text-xs max-h-[140px] overflow-y-auto pr-1">
            {rawExpenseCategories.slice(0, 5).map((slice) => {
              const isHovered = hoveredSlice === slice.category;
              return (
                <div 
                  key={slice.category} 
                  className={`flex items-center justify-between py-1 px-1.5 rounded transition-all ${
                    isHovered ? 'bg-slate-50 font-semibold' : ''
                  }`}
                  onMouseEnter={() => setHoveredSlice(slice.category)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span style={{ backgroundColor: slice.color }} className="w-2.5 h-2.5 rounded-full shrink-0"></span>
                    <span className="text-slate-600 truncate font-sans">{slice.category}</span>
                  </div>
                  <span className="font-mono text-slate-900 ml-2">
                    {isPrivacyMode ? '$••••' : `$${slice.amount.toLocaleString()}`}
                  </span>
                </div>
              );
            })}
            {rawExpenseCategories.length > 5 && (
              <div className="text-[10px] font-mono text-slate-400 pl-4 pt-1">
                + {rawExpenseCategories.length - 5} other categories
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights and Quick Actions section */}
      <div id="ai-insights-section" className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono">AI INSIGHT</span>
            <h4 className="font-sans font-bold text-slate-900 text-sm">Real-time CFO Advisory Warnings</h4>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-1.5 max-w-2xl">
            Our diagnostic suite analyzed your ledger and identified critical trends regarding margins and tax allocations.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('ai-advisor')}
          className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-blue-100 shadow-sm px-4 py-2.5 rounded-lg font-sans transition-all shrink-0 hover:border-blue-200 cursor-pointer"
        >
          Open Advisor Board <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Smart Alerts list */}
      <div id="dashboard-alerts" className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 font-mono">Suggested CFO Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liveInsights.map((insight) => (
            <div 
              key={insight.id}
              className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                    insight.status === 'positive' ? 'bg-emerald-50 text-emerald-600' :
                    insight.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {insight.statusLabel}
                  </span>
                </div>
                <h4 className="font-sans font-bold text-slate-900 text-sm leading-snug">{insight.title}</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-sans">{insight.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-slate-400">{insight.metric}</span>
                <button
                  onClick={() => {
                    if (insight.type === 'tax') {
                      setTaxEstimatorNetIncome(netProfit);
                      setActiveTab('tax-estimator');
                    } else {
                      setActiveTab('ai-advisor');
                    }
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                >
                  {insight.actionLabel} &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
