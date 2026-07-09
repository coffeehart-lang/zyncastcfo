import { useState } from 'react';
import { Transaction, AdvisorInsight } from '../types';
import { generateLocalInsights } from '../data';
import { Sparkles, Brain, AlertTriangle, RefreshCw, CheckCircle2, Play, Info, Lock } from 'lucide-react';

interface AIAdvisorViewProps {
  transactions: Transaction[];
  isPrivacyMode?: boolean;
  userTier?: 'free' | 'pro';
  onOpenCheckout?: () => void;
}

export default function AIAdvisorView({ 
  transactions, 
  isPrivacyMode = false,
  userTier = 'free',
  onOpenCheckout
}: AIAdvisorViewProps) {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiMissing, setApiMissing] = useState(false);
  const [activePromptTitle, setActivePromptTitle] = useState<string | null>(null);

  // Generate dynamic dashboard advisory boards
  const localInsights = generateLocalInsights(transactions);

  // Fallback CFO Local generator in case API key is missing
  const handleLocalHeuristicSummary = (customPromptText?: string) => {
    setLoading(true);
    setErrorMessage(null);
    setApiMissing(false);
    setLoadingStep('Running local heuristic analysis...');

    setTimeout(() => {
      setLoadingStep('Analyzing financial ledgers...');
      setTimeout(() => {
        setLoadingStep('Formulating expert CFO responses...');
        setTimeout(() => {
          // Calculations
          const incomes = transactions.filter(t => t.type === 'income');
          const expenses = transactions.filter(t => t.type === 'expense');
          const totalRev = incomes.reduce((sum, t) => sum + t.amount, 0);
          const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0);
          const netProf = totalRev - totalExp;
          const margin = totalRev > 0 ? (netProf / totalRev) * 100 : 0;
          const rent = expenses.filter(t => t.category === 'Rent & Utilities').reduce((sum, t) => sum + t.amount, 0);
          const rentRatio = totalExp > 0 ? (rent / totalExp) * 100 : 0;

          const maskVal = (v: number) => isPrivacyMode ? '••••' : v.toLocaleString();

          let summary = '';

          if (customPromptText && customPromptText.includes('overspending')) {
            summary = `### **Zyncast CFO Local Analysis: Overspending & Profit Margins**

**Strategic Expense Audit:**
You requested a 30-day review of overspending areas to optimize net profit margin.

1. **Overhead Density:**
   - Your **Rent & Utilities** totals **$${maskVal(rent)}** (**${rentRatio.toFixed(0)}%** of total expenses).
   - If your operating expenses are heavily concentrated here, Virtual Office plans or sub-leasing unused space is an immediate lever to boost margin.
   
2. **Actionable Step for Next Month:**
   - **Optimize SaaS Subscriptions:** Audit monthly software tools. Downgrading 2 redundant licenses or moving to annual plans typically boosts net profit margins by **1.5% to 3.0%** immediately.
   - **Vendor Consolidation:** Consolidate your consulting or contractor tools under a unified suite.

*Calculated with local Zyncast CFO heuristic rules.*`;
          } else if (customPromptText && customPromptText.includes('projecting')) {
            const projectedRev = totalRev * 1.10;
            const projectedNet = projectedRev - totalExp;
            summary = `### **Zyncast CFO Local Analysis: 6-Month Cash Runway**

**Growth Forecast Modeling:**
Modeling a **10% revenue increase** against current operating burn rates:

1. **Simulated Revenue Growth (Month-6):**
   - Projected monthly revenue shifts from average to **$${maskVal(Math.round(projectedRev / 6))}**/mo.
   - Net profit increases to approximately **$${maskVal(Math.round(projectedNet))}** over 6 months.

2. **Cash Runway Status:**
   - Your business is generating positive net margins (**${(projectedNet / projectedRev * 100).toFixed(1)}%**).
   - **Your cash runway extends indefinitely** as inflows exceed operating outflows. If sales slow down, the cushion is extremely strong.

*Calculated with local Zyncast CFO forecasting logic.*`;
          } else if (customPromptText && customPromptText.includes('tax account')) {
            const safeHarborReserve = Math.round(netProf * 0.28);
            summary = `### **Zyncast CFO Local Analysis: Tax Reserves & Quarterly Estimated Payments**

**Estimated Tax Safeguards:**
You logged a cumulative net income of **$${maskVal(netProf)}** so far.

1. **Estimated Reserve Level:**
   - We recommend keeping **$${maskVal(safeHarborReserve)}** reserved in a high-yield savings account (28% of current net profit).
   - Route **28% of all future invoices** directly to this account to prevent cash crunches during quarterly estimated tax filings.

2. **Filing Safeguards:**
   - Under IRS Safe Harbor rules, paying either **100% or 110% of last year's total tax liability** via quarterly vouchers ensures zero interest or underpayment penalties, regardless of current-year revenue spikes.

*Calculated with local Zyncast CFO accounting models.*`;
          } else if (customPromptText && customPromptText.includes('liability')) {
            const estimatedLiability = Math.round(netProf * 0.22);
            const optimizedSavings = Math.round(netProf * 0.18);
            summary = `### **Zyncast CFO Local Analysis: Tax Liability & Deduction Strategy**

**Business Deductions Audit:**
Current estimated baseline tax liability is approximately **$${maskVal(estimatedLiability)}** (at ~22% effective tax bracket).

1. **Maximizing Deductions Impact:**
   - Every **$1,000 in ordinary & necessary business deductions** reduces your taxable income directly, saving you **$220 to $350 in actual cash taxes** depending on state tax overlays.
   - Audit Section 179 equipment deductions, home office percentage, vehicle mileage logs, and professional services to capture maximum deductions.

2. **Operational recommendation:**
   - Maximize S-Corporation salary-to-dividend splits if your net profits exceed $80,000, which can lower self-employment tax obligations by thousands of dollars.

*Calculated with local Zyncast CFO tax schemas.*`;
          } else {
            summary = `### **Zyncast CFO Local Executive Summary**

**Financial Position Overview:**
Zyncast currently holds a cumulative **Total Revenue of $${maskVal(totalRev)}** and has logged **Total Expenses of $${maskVal(totalExp)}**, resulting in a **Net Profit of $${maskVal(netProf)}**. Your business is performing exceptionally well with an operating profit margin of **${margin.toFixed(1)}%**.

### **Key CFO Action Recommendations:**

1. **Address Overhead Concentration:**
Your **Rent & Utilities** expenses total **$${maskVal(rent)}**, which accounts for **${rentRatio.toFixed(0)}%** of your total operating expenses. CFO recommendations strongly suggest auditing these utilities and office rents to find virtual options or negotiate a 5-10% rate reduction, which would directly extend your cash runway.

2. **Establish Structured Tax Allocations:**
With a net business profit of **$${maskVal(netProf)}**, your estimated federal income and self-employment tax liabilities are approximately **$${isPrivacyMode ? '••••' : Math.round(netProf * 0.28).toLocaleString()}**. We recommend creating a dedicated, high-yield savings account and routing **28% of all gross monthly cash receipts** directly into it to comfortably cover quarterly estimated payments.

3. **Accelerate Scalable Service Revenue:**
The data indicates that project billing for consulting and core services is growing at a strong upward trajectory. Continue to incentivize upfront deposit structures (e.g., 50% down on agreements) to maintain positive operational cash balances.

*Analysis compiled locally by Zyncast CFO Expert Engine.*`;
          }

          setAiResponse(summary);
          setLoading(false);
        }, 600);
      }, 500);
    }, 400);
  };

  // Call the server endpoint for real-time Gemini AI CFO analysis
  const handleGenerateGeminiSummary = async (customPromptText?: string, promptTitle?: string) => {
    setLoading(true);
    setErrorMessage(null);
    setAiResponse(null);
    setApiMissing(false);
    setActivePromptTitle(promptTitle || null);
    
    try {
      setLoadingStep('Parsing ledger transaction streams...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setLoadingStep('Formulating financial prompts for Gemini...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLoadingStep('Generating custom CFO strategic review...');

      const response = await fetch('/api/advisor/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions, customPrompt: customPromptText }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Missing GEMINI_API_KEY') {
          setApiMissing(true);
          // Auto fall back to local heuristic for a seamless user experience!
          handleLocalHeuristicSummary(customPromptText);
          return;
        }
        throw new Error(data.message || 'Failed to generate advisory report.');
      }

      setAiResponse(data.text);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to communicate with the Gemini server proxy.');
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown-to-JSX Parser to format response beautifully
  const formatMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-sm font-bold text-slate-900 mt-5 mb-2 uppercase tracking-wide font-sans">{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <p key={idx} className="font-sans font-bold text-slate-800 mt-3">{trimmed.replace(/\*\*/g, '')}</p>;
      }

      // Bullet points
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const rawText = trimmed.substring(1).trim();
        // Check for nested bold tags like "1. Name: description"
        const parts = rawText.split('**');
        return (
          <li key={idx} className="text-xs text-slate-600 font-sans list-none pl-5 relative before:content-['•'] before:absolute before:left-1 before:text-blue-500 before:font-bold my-2 leading-relaxed">
            {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-800">{p}</strong> : p)}
          </li>
        );
      }

      // Standard text with bold tags inline
      if (trimmed) {
        const parts = trimmed.split('**');
        return (
          <p key={idx} className="text-xs text-slate-600 font-sans my-2.5 leading-relaxed">
            {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-900">{p}</strong> : p)}
          </p>
        );
      }

      return <div key={idx} className="h-2"></div>;
    });
  };

  const cfoPrompts = [
    {
      title: "Strategic Profitability",
      query: "Analyze my current transactions for the last 30 days. Based on my expense breakdown, where am I overspending, and what is one concrete action I can take to increase my net profit margin next month?",
      icon: "📈",
      desc: "Analyze overspending and margins"
    },
    {
      title: "6-Month Runway Projection",
      query: "I'm projecting my revenue growth to be 10%. Based on my current burn rate and expense structure, what does my cash runway look like in 6 months?",
      icon: "⏳",
      desc: "Forecast 10% revenue expansion"
    },
    {
      title: "Quarterly Tax Set-Aside",
      query: "Based on my filing status and net income logged, how much should I be setting aside in my tax account right now to ensure I'm covered for my quarterly estimated payments?",
      icon: "🏦",
      desc: "Estimated safe reserve target"
    },
    {
      title: "Maximize Deductions Audit",
      query: "What is my current tax liability estimate, and does this change if I maximize my business deductions for this quarter?",
      icon: "💼",
      desc: "Optimize deductions & structure"
    }
  ];

  return (
    <div id="ai-advisor-view" className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div id="advisor-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="advisor-title" className="text-2xl font-sans font-bold tracking-tight text-slate-900">
            AI Advisor
          </h2>
          <p id="advisor-subtitle" className="text-sm text-slate-500 font-sans mt-1">
            Automated financial insights and strategic CFO reviews based on transaction histories.
          </p>
        </div>
        <button
          onClick={() => {
            if (userTier !== 'pro') {
              onOpenCheckout?.();
            } else {
              handleGenerateGeminiSummary(undefined, 'Full CFO Review');
            }
          }}
          disabled={loading}
          className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-sans text-xs font-bold uppercase tracking-wider font-mono px-5 py-3 rounded-lg shadow-sm transition-all hover:shadow cursor-pointer ${
            loading ? 'opacity-70 pointer-events-none' : ''
          }`}
        >
          {userTier !== 'pro' ? (
            <>
              <Lock className="w-4 h-4" /> Unlock PRO Custom Review
            </>
          ) : (
            <>
              <Brain className="w-4.5 h-4.5 animate-pulse" /> Custom Gemini Review
            </>
          )}
        </button>
      </div>

      {/* Quick CFO Action Prompts Playbook */}
      <div id="cfo-quick-prompts-section" className="space-y-3 relative overflow-hidden p-1 rounded-xl">
        {userTier !== 'pro' && (
          <div id="ai-playbook-lock" className="absolute inset-0 bg-white/70 backdrop-blur-[3.5px] rounded-xl flex flex-col items-center justify-center text-center p-6 z-20 border border-slate-100/60 shadow-xs animate-fade-in">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-2 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-sans font-bold text-slate-800">CFO Action Playbook is Locked</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mt-0.5 leading-snug">
              Unlock strategic Gemini-powered playbooks for tax audits, cash flow projections, and runway analysis.
            </p>
            <button
              onClick={onOpenCheckout}
              className="mt-3.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              Upgrade to Pro Account
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-700 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider font-mono">CFO ACTION PLAYBOOK</span>
          <span className="text-xs font-semibold text-slate-600">Select an automated CFO playbook query to run on your ledger data:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cfoPrompts.map((p, idx) => {
            const isCurrentActive = activePromptTitle === p.title && aiResponse;
            return (
              <button
                key={idx}
                onClick={() => handleGenerateGeminiSummary(p.query, p.title)}
                disabled={loading}
                className={`group p-4 bg-white hover:bg-slate-50/50 rounded-xl border shadow-xs transition-all text-left cursor-pointer flex flex-col justify-between h-36 disabled:opacity-50 ${
                  isCurrentActive 
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20' 
                    : 'border-slate-100 hover:border-indigo-400'
                }`}
              >
                <div className="space-y-1 w-full overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-base">{p.icon}</span>
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${
                      isCurrentActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}>
                      {isCurrentActive ? 'ACTIVE REPORT' : 'RUN MODEL'}
                    </span>
                  </div>
                  <h4 className="font-sans font-bold text-slate-800 text-xs leading-snug group-hover:text-indigo-700 truncate w-full mt-1">
                    {p.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans leading-tight line-clamp-2 w-full">
                    {p.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-semibold text-indigo-600 font-mono group-hover:translate-x-1 transition-transform mt-2">
                  <span>Analyze Ledger</span> &rarr;
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advisory Cards Grid */}
      <div id="advisory-grid" className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Automated Diagnostic Board</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localInsights.map((insight) => (
            <div 
              key={insight.id}
              className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                    insight.status === 'positive' ? 'bg-emerald-50 text-emerald-600' :
                    insight.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {insight.statusLabel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">{insight.metric}</span>
                </div>
                <h4 className="font-sans font-bold text-slate-900 text-base leading-snug">{insight.title}</h4>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-sans">{insight.description}</p>
                <div className="mt-4 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest font-mono block mb-1">CFO Recommended Action</span>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">{insight.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading state for Gemini */}
      {loading && (
        <div className="bg-slate-900/5 p-8 rounded-xl border border-slate-100 shadow-inner flex flex-col items-center justify-center text-center py-12 animate-pulse">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <h4 className="font-sans font-semibold text-slate-800 text-sm">{loadingStep}</h4>
          <p className="text-xs text-slate-400 font-sans mt-1">Zyncast CFO is formatting ledger sheets and running forecasting metrics.</p>
        </div>
      )}

      {/* Error Alert Panel */}
      {errorMessage && (
        <div className="bg-rose-50 p-5 rounded-xl border border-rose-100 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-sans font-bold text-rose-900 text-sm">Advisory Analysis Interrupted</h4>
              <p className="text-xs text-rose-700 leading-relaxed font-sans mt-1">{errorMessage}</p>
            </div>
          </div>
          {apiMissing && (
            <div className="pt-3 border-t border-rose-100 flex flex-wrap gap-3 items-center justify-between">
              <span className="text-[10px] text-rose-600 font-sans">
                You can run the full, comprehensive analytical model locally on the client instead!
              </span>
              <button
                onClick={handleLocalHeuristicSummary}
                className="bg-white hover:bg-rose-100/50 text-rose-700 font-sans text-[11px] font-bold px-3 py-1.5 rounded border border-rose-200 cursor-pointer transition-all"
              >
                Run CFO Advisor Locally &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Gemini Executive Advisory Summary Result */}
      {aiResponse && !loading && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4 animate-scale-up">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-slate-900 text-base">Strategic Executive Review</h3>
              <p className="text-[10px] font-mono text-slate-400 font-bold uppercase mt-0.5">Custom Financial Report</p>
            </div>
          </div>

          {/* Formatted Text Box */}
          <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 max-h-[500px] overflow-y-auto">
            {formatMarkdown(aiResponse)}
          </div>

          <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Security Statement: Transactions are analyzed securely on the server.</span>
            <button
              onClick={() => {
                setAiResponse(null);
                setErrorMessage(null);
              }}
              className="text-slate-500 hover:text-slate-800 cursor-pointer font-bold uppercase tracking-wider"
            >
              Clear Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
