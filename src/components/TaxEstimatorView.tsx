import { useState, useEffect } from 'react';
import { FilingStatus, TaxEstimateResult } from '../types';
import { calculateTaxes } from '../data';
import { Calculator, DollarSign, ArrowDownRight, Scale, ShieldCheck, ChevronRight } from 'lucide-react';

interface TaxEstimatorViewProps {
  initialNetIncome: number;
  isPrivacyMode?: boolean;
}

export default function TaxEstimatorView({ initialNetIncome, isPrivacyMode = false }: TaxEstimatorViewProps) {
  const [netIncome, setNetIncome] = useState<string>(initialNetIncome.toString());
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('Single');
  const [taxYear, setTaxYear] = useState<string>('2026');
  const [estimate, setEstimate] = useState<TaxEstimateResult | null>(null);

  // Auto calculate on load/initialNetIncome updates
  useEffect(() => {
    handleCalculate();
  }, [initialNetIncome]);

  const handleCalculate = () => {
    const parsed = parseFloat(netIncome);
    if (!isNaN(parsed)) {
      const result = calculateTaxes(parsed, filingStatus, taxYear);
      setEstimate(result);
    }
  };

  return (
    <div id="tax-estimator-view" className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div id="tax-header">
        <h2 id="tax-title" className="text-2xl font-sans font-bold tracking-tight text-slate-900">
          Tax Estimator
        </h2>
        <p id="tax-subtitle" className="text-sm text-slate-500 font-sans mt-1">
          Calculate your estimated self-employment tax, federal liability, and take-home business pay.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Parameter Panel */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6 h-fit">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
            <Calculator className="w-5 h-5 text-blue-500" />
            <h3 className="font-sans font-bold text-slate-900 text-base">Tax Parameters</h3>
          </div>

          {/* Net Income input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Projected Annual Net Income ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-medium text-sm">$</span>
              <input
                type="number"
                value={netIncome}
                onChange={(e) => setNetIncome(e.target.value)}
                placeholder="e.g. 100000"
                className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:border-blue-500 font-mono text-slate-800"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-sans block mt-1">
              You can override this. Preloaded from active ledger annual projection.
            </span>
          </div>

          {/* Filing Status dropdown */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Filing Status
            </label>
            <select
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer bg-white font-medium"
            >
              <option value="Single">Single</option>
              <option value="Married Jointly">Married Filing Jointly</option>
              <option value="Head of Household">Head of Household</option>
            </select>
          </div>

          {/* Tax Year dropdown */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Tax Year
            </label>
            <select
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer bg-white font-medium"
            >
              <option value="2026">2026 (Projections)</option>
              <option value="2025">2025 (Current)</option>
            </select>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold uppercase tracking-wider font-mono py-3 rounded-lg shadow-sm hover:shadow cursor-pointer transition-all"
          >
            Calculate Estimate
          </button>
        </div>

        {/* Right Details Results Panel */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col justify-between">
          {!estimate ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="p-4 bg-blue-50 rounded-full text-blue-500 mb-4">
                <Calculator className="w-8 h-8" />
              </div>
              <h3 className="font-sans font-bold text-slate-900 text-base">Ready to Estimate</h3>
              <p className="text-xs text-slate-400 max-w-xs font-sans mt-2">
                Enter your projected net income for the year on the left to see a detailed breakdown of your tax obligations.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h3 className="font-sans font-bold text-slate-900 text-base">Estimation Summary</h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded font-mono uppercase">
                  {taxYear} FEDERAL TAX
                </span>
              </div>

              {/* Core Output Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                {/* Total Tax Liability */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Total Estimated Tax</span>
                  <h4 className="text-xl font-sans font-bold text-slate-900 leading-none">
                    {isPrivacyMode ? '$••••' : `$${estimate.totalTax.toLocaleString()}`}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-rose-500 flex items-center gap-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5" /> {estimate.effectiveTaxRate}% effective rate
                  </span>
                </div>

                {/* Self-Employment Tax */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Self-Employment Tax</span>
                  <h4 className="text-xl font-sans font-bold text-slate-700 leading-none">
                    {isPrivacyMode ? '$••••' : `$${estimate.selfEmploymentTax.toLocaleString()}`}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-sans block">
                    15.3% of 92.35% business profits
                  </span>
                </div>

                {/* Take Home Pay */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Post-Tax Take-Home</span>
                  <h4 className="text-xl font-sans font-bold text-emerald-600 leading-none">
                    {isPrivacyMode ? '$••••' : `$${estimate.takeHomePay.toLocaleString()}`}
                  </h4>
                  <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded w-fit block mt-1">
                    Keep: {(100 - estimate.effectiveTaxRate).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Advanced tax deduction steps details */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Deduction Steps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg">
                    <span className="text-slate-500">Standard Deduction ({filingStatus}):</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {isPrivacyMode ? '-$••••' : `-${estimate.standardDeduction.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 border border-slate-100 rounded-lg">
                    <span className="text-slate-500">Taxable Net Income:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {isPrivacyMode ? '$••••' : `$${estimate.taxableIncome.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax Brackets Breakdown Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Federal Marginal Brackets</h4>
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="py-2.5 px-4">Rate</th>
                          <th className="py-2.5 px-4">Taxable Range</th>
                          <th className="py-2.5 px-4 text-right">Income in Bracket</th>
                          <th className="py-2.5 px-4 text-right">Tax Owed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-sans text-slate-600">
                        {estimate.bracketsBreakdown.map((b, idx) => (
                          <tr key={idx} className={b.taxableInBracket > 0 ? 'bg-blue-50/20 font-medium' : ''}>
                            <td className="py-2.5 px-4 font-mono font-bold text-blue-600">{b.rate}%</td>
                            <td className="py-2.5 px-4 font-mono text-slate-400">{b.range}</td>
                            <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                              {b.taxableInBracket > 0 ? (isPrivacyMode ? '$••••' : `$${b.taxableInBracket.toLocaleString()}`) : '$0'}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono text-slate-900 font-semibold">
                              {b.taxOwed > 0 ? (isPrivacyMode ? '$••••' : `$${b.taxOwed.toLocaleString()}`) : '$0'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Compliance / informational note */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5">
                <ShieldCheck className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-800 font-sans">Estimated Safe Harbor Advice</span>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans mt-0.5">
                    This is an educational estimate for planning purposes. Safe Harbor rules state you should pay 100% (or 110% for high earners) of last year's tax liability in quarterly payments to avoid underpayment penalties. Consult a certified CPA to file.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
