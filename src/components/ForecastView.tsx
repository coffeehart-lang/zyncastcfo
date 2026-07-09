import { useState } from 'react';
import { Transaction } from '../types';
import { TrendingUp, Sliders, ArrowUpRight, ArrowDownRight, Sparkles, Lock } from 'lucide-react';

interface ForecastViewProps {
  transactions: Transaction[];
  isPrivacyMode?: boolean;
  userTier?: 'free' | 'pro';
  onOpenCheckout?: () => void;
}

export default function ForecastView({ 
  transactions, 
  isPrivacyMode = false,
  userTier = 'free',
  onOpenCheckout
}: ForecastViewProps) {
  // Simulator state: adjustment multipliers for projections
  const [revenueChange, setRevenueChange] = useState(0); // -50% to +100%
  const [expenseChange, setExpenseChange] = useState(0); // -50% to +100%

  // 1. Calculate historical metrics
  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  const totalRevenue = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Group by months to find average monthly values
  const monthsSet = new Set<string>();
  transactions.forEach(t => {
    monthsSet.add(t.date.substring(0, 7));
  });
  const numMonths = Math.max(1, monthsSet.size);

  const avgHistoricalRevenue = totalRevenue / numMonths;
  const avgHistoricalExpenses = totalExpenses / numMonths;

  // 2. Compute projections based on simulation sliders
  const projectedAvgRevenue = avgHistoricalRevenue * (1 + revenueChange / 100);
  const projectedAvgExpenses = avgHistoricalExpenses * (1 + expenseChange / 100);
  const projectedNetPerMonth = projectedAvgRevenue - projectedAvgExpenses;

  // Cumulative projection over 6 months
  const endOfPeriodNet = projectedNetPerMonth * 6;

  // 3. Generate projection chart coordinate data points
  const projectionMonths = [
    'Month 1',
    'Month 2',
    'Month 3',
    'Month 4',
    'Month 5',
    'Month 6',
  ];

  const projectionsData = projectionMonths.map((m, idx) => {
    const factor = idx + 1;
    return {
      month: m,
      revenue: projectedAvgRevenue * factor,
      expenses: projectedAvgExpenses * factor,
      netProfit: (projectedAvgRevenue - projectedAvgExpenses) * factor,
    };
  });

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Math coordinates helper for drawing SVG lines
  // Max value in projection series
  const maxSeriesVal = Math.max(...projectionsData.map(d => Math.max(d.revenue, d.expenses, d.netProfit, 0))) || 10000;
  
  const getCoordinates = (index: number, val: number) => {
    const width = 600;
    const height = 180;
    const x = (index / (projectionMonths.length - 1)) * width;
    const y = height - (Math.max(0, val) / maxSeriesVal) * height;
    return `${x},${y}`;
  };

  const revenuePoints = projectionsData.map((d, i) => getCoordinates(i, d.revenue)).join(' ');
  const expensePoints = projectionsData.map((d, i) => getCoordinates(i, d.expenses)).join(' ');
  const netPoints = projectionsData.map((d, i) => getCoordinates(i, d.netProfit)).join(' ');

  return (
    <div id="forecast-view" className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div id="forecast-header">
        <h2 id="forecast-title" className="text-2xl font-sans font-bold tracking-tight text-slate-900">
          Financial Forecast
        </h2>
        <p id="forecast-subtitle" className="text-sm text-slate-500 font-sans mt-1">
          6-month revenue and expense projections based on current ledger averages.
        </p>
      </div>

      {/* Metrics Cards */}
      <div id="forecast-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projected Revenue */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Projected Avg Revenue</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-sans font-bold text-slate-900 tracking-tight">
              {isPrivacyMode ? '$••••' : `$${Math.round(projectedAvgRevenue).toLocaleString()}`}
            </h3>
            <span className="text-xs text-slate-500 font-sans">/mo</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 w-fit px-2 py-0.5 rounded">
            <ArrowUpRight className="w-3.5 h-3.5" /> 
            {revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%`} simulated adjustment
          </div>
        </div>

        {/* Projected Expenses */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Projected Avg Expenses</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-sans font-bold text-slate-900 tracking-tight">
              {isPrivacyMode ? '$••••' : `$${Math.round(projectedAvgExpenses).toLocaleString()}`}
            </h3>
            <span className="text-xs text-slate-500 font-sans">/mo</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-mono text-rose-600 font-semibold bg-rose-50 w-fit px-2 py-0.5 rounded">
            <ArrowDownRight className="w-3.5 h-3.5" /> 
            {expenseChange >= 0 ? `+${expenseChange}%` : `${expenseChange}%`} simulated adjustment
          </div>
        </div>

        {/* End of Period Net */}
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 font-mono">End of Period Net (Month-6)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-sans font-bold tracking-tight">
              {isPrivacyMode ? '$••••' : `$${Math.round(endOfPeriodNet).toLocaleString()}`}
            </h3>
            <span className="text-xs text-blue-200 font-sans">/month-6</span>
          </div>
          <p className="text-[11px] text-blue-100/90 font-sans mt-3">
            Accumulated profit generated across the entire 6-month projected period.
          </p>
        </div>
      </div>

      {/* Simulator Inputs & Projections Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simulator Parameters */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
          {userTier !== 'pro' && (
            <div id="forecast-simulator-lock" className="absolute inset-0 bg-white/70 backdrop-blur-[3.5px] rounded-xl flex flex-col items-center justify-center text-center p-6 z-20 border border-slate-100/60 shadow-xs animate-fade-in">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-sans font-bold text-slate-800">Forecast Simulator Locked</h4>
              <p className="text-[11px] text-slate-500 max-w-[200px] mt-1 leading-snug">
                Unlock custom multipliers and 6-month scenario simulations with a Pro account.
              </p>
              <button
                onClick={onOpenCheckout}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                Upgrade to Unlock
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
            <Sliders className="w-5 h-5 text-blue-500" />
            <h3 className="font-sans font-bold text-slate-900 text-base">Growth Simulator</h3>
          </div>

          {/* Revenue growth adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600 font-sans">Revenue Growth</span>
              <span className={`font-mono font-bold ${revenueChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {revenueChange >= 0 ? `+${revenueChange}` : revenueChange}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              value={revenueChange}
              onChange={(e) => setRevenueChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[10px] text-slate-400 font-sans block">
              Adjust forward billing & invoice forecasts.
            </span>
          </div>

          {/* Expense reduction adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-600 font-sans">Expenses Adjustment</span>
              <span className={`font-mono font-bold ${expenseChange >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {expenseChange >= 0 ? `+${expenseChange}` : expenseChange}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              value={expenseChange}
              onChange={(e) => setExpenseChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-[10px] text-slate-400 font-sans block">
              Simulate overhead cuts or operational expansions.
            </span>
          </div>

          {/* Analysis Note */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-slate-700 font-sans">Strategic Insight</span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed mt-1.5">
              {projectedNetPerMonth > 0 ? (
                `At this rate, your business generates ${isPrivacyMode ? '$••••' : `$${Math.round(projectedNetPerMonth).toLocaleString()}`} in positive net cash flow every single month. Your cash runway is highly healthy and extends indefinitely.`
              ) : (
                `Warning: Under this scenario, your business burns ${isPrivacyMode ? '$••••' : `$${Math.round(Math.abs(projectedNetPerMonth)).toLocaleString()}`} in net cash monthly. Identify ways to either increase client invoicing or downsize recurring subscriptions.`
              )}
            </p>
          </div>
        </div>

        {/* Projection Chart Container */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-slate-900 text-base">Cash Flow Projection</h3>
            <p className="text-xs text-slate-500 mt-1 font-sans">Estimated cumulative revenue, expenses, and net profit with bounds</p>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-64 flex flex-col justify-end mt-6">
            {/* Legend inside chart */}
            <div className="absolute top-0 right-0 flex items-center gap-4 text-xs font-sans font-medium z-10 bg-white/80 p-1.5 rounded">
              <div className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-emerald-500 block"></span> Revenue
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-rose-500 block"></span> Expenses
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-blue-500 block"></span> Net Profit
              </div>
            </div>

            {/* Main Interactive Chart Grid */}
            <div className="relative h-44 border-b border-slate-200">
              <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                {[0.25, 0.5, 0.75, 1].map((p, idx) => (
                  <line 
                    key={idx}
                    x1="0" 
                    y1={180 - p * 180} 
                    x2="600" 
                    y2={180 - p * 180} 
                    stroke="#f1f5f9" 
                    strokeWidth="1" 
                  />
                ))}

                {/* Lines */}
                <polyline fill="none" stroke="#10b981" strokeWidth="3" points={revenuePoints} />
                <polyline fill="none" stroke="#f43f5e" strokeWidth="3" points={expensePoints} />
                <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5,5" points={netPoints} />

                {/* Interactive circles & hovering vertical line */}
                {hoveredPoint !== null && (
                  <line 
                    x1={(hoveredPoint / (projectionMonths.length - 1)) * 600}
                    y1="0"
                    x2={(hoveredPoint / (projectionMonths.length - 1)) * 600}
                    y2="180"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                )}

                {/* Circle markers */}
                {projectionsData.map((d, i) => {
                  const cx = (i / (projectionMonths.length - 1)) * 600;
                  const cyRev = 180 - (d.revenue / maxSeriesVal) * 180;
                  const cyExp = 180 - (d.expenses / maxSeriesVal) * 180;
                  const cyNet = 180 - (d.netProfit / maxSeriesVal) * 180;

                  return (
                    <g key={i} className="cursor-pointer">
                      {/* Interactive trigger column */}
                      <rect
                        x={cx - 15}
                        y="0"
                        width="30"
                        height="180"
                        fill="transparent"
                        onMouseEnter={() => setHoveredPoint(i)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />

                      {/* Actual markers */}
                      <circle cx={cx} cy={cyRev} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx={cx} cy={cyExp} r="4" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx={cx} cy={cyNet} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hoveredPoint !== null && (
                <div 
                  style={{ 
                    left: `${(hoveredPoint / (projectionMonths.length - 1)) * 85 + 5}%`,
                    transform: hoveredPoint > 3 ? 'translateX(-100%)' : 'none'
                  }} 
                  className="absolute top-4 bg-slate-950 text-white rounded-lg p-2.5 shadow-lg text-xs font-mono z-50 pointer-events-none min-w-[150px] border border-slate-800"
                >
                  <div className="font-sans font-semibold text-slate-400 mb-1">{projectionMonths[hoveredPoint]} Projection</div>
                  <div className="text-emerald-400 flex justify-between">
                    <span>Revenue:</span> 
                    <span>{isPrivacyMode ? '$••••' : `$${Math.round(projectionsData[hoveredPoint].revenue).toLocaleString()}`}</span>
                  </div>
                  <div className="text-rose-400 flex justify-between">
                    <span>Expenses:</span> 
                    <span>{isPrivacyMode ? '$••••' : `$${Math.round(projectionsData[hoveredPoint].expenses).toLocaleString()}`}</span>
                  </div>
                  <div className="border-t border-slate-800 my-1 pt-1 text-blue-300 font-semibold flex justify-between">
                    <span>Net Profit:</span> 
                    <span>{isPrivacyMode ? '$••••' : `$${Math.round(projectionsData[hoveredPoint].netProfit).toLocaleString()}`}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-3 font-mono text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-2">
              {projectionMonths.map((m, idx) => (
                <div key={idx} className="flex-1 text-center">
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
