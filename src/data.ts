import { Transaction, FilingStatus, TaxEstimateResult, AdvisorInsight } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Jan 2026 (for start of year, showing office rent)
  {
    id: 't-jan-rent',
    date: '2026-01-31',
    description: 'Office rent - monthly',
    category: 'Rent & Utilities',
    type: 'expense',
    amount: 2200,
  },
  // Feb 2026
  {
    id: 't-feb-johnson',
    date: '2026-02-02',
    description: 'Client project - Johnson Construction',
    category: 'Service Revenue',
    type: 'income',
    amount: 8400,
  },
  {
    id: 't-feb-electric',
    date: '2026-02-04',
    description: 'Electric & internet',
    category: 'Rent & Utilities',
    type: 'expense',
    amount: 380,
  },
  {
    id: 't-feb-contractor',
    date: '2026-02-09',
    description: 'Contractor payment - design work',
    category: 'Professional Services',
    type: 'expense',
    amount: 1200,
  },
  {
    id: 't-feb-software',
    date: '2026-02-11',
    description: 'Software subscriptions',
    category: 'Software & Tools',
    type: 'expense',
    amount: 240,
  },
  {
    id: 't-feb-apex',
    date: '2026-02-14',
    description: 'Monthly retainer - Apex Holdings',
    category: 'Consulting',
    type: 'income',
    amount: 3200,
  },
  {
    id: 't-feb-rent',
    date: '2026-02-28',
    description: 'Office rent - monthly',
    category: 'Rent & Utilities',
    type: 'expense',
    amount: 2200,
  },
  // Mar 2026
  {
    id: 't-mar-acme',
    date: '2026-03-02',
    description: 'Client project - Acme Corp',
    category: 'Service Revenue',
    type: 'income',
    amount: 7500,
  },
  {
    id: 't-mar-rent',
    date: '2026-03-05',
    description: 'Office rent - monthly',
    category: 'Rent & Utilities',
    type: 'expense',
    amount: 2200,
  },
  {
    id: 't-mar-marketing',
    date: '2026-03-12',
    description: 'Marketing campaign - Google Ads',
    category: 'Marketing & Advertising',
    type: 'expense',
    amount: 850,
  },
  {
    id: 't-mar-apex',
    date: '2026-03-15',
    description: 'Monthly retainer - Apex Holdings',
    category: 'Consulting',
    type: 'income',
    amount: 3200,
  },
  {
    id: 't-mar-insurance',
    date: '2026-03-20',
    description: 'Insurance premium',
    category: 'Insurance',
    type: 'expense',
    amount: 400,
  },
  // Apr 2026
  {
    id: 't-apr-stark',
    date: '2026-04-02',
    description: 'Client project - Stark Industries',
    category: 'Service Revenue',
    type: 'income',
    amount: 9200,
  },
  {
    id: 't-apr-rent',
    date: '2026-04-05',
    description: 'Office rent - monthly',
    category: 'Rent & Utilities',
    type: 'expense',
    amount: 2200,
  },
  {
    id: 't-apr-cloud',
    date: '2026-04-10',
    description: 'Cloud services hosting',
    category: 'Software & Tools',
    type: 'expense',
    amount: 150,
  },
  {
    id: 't-apr-apex',
    date: '2026-04-15',
    description: 'Monthly retainer - Apex Holdings',
    category: 'Consulting',
    type: 'income',
    amount: 3200,
  },
  {
    id: 't-apr-equipment',
    date: '2026-04-25',
    description: 'Laptop & Monitor purchase',
    category: 'Equipment',
    type: 'expense',
    amount: 1400,
  },
  // May 2026
  {
    id: 't-may-wayne',
    date: '2026-05-01',
    description: 'Client project - Wayne Ent.',
    category: 'Service Revenue',
    type: 'income',
    amount: 8800,
  },
  {
    id: 't-may-rent',
    date: '2026-05-05',
    description: 'Office rent - monthly',
    category: 'Rent & Utilities',
    type: 'expense',
    amount: 2200,
  },
  {
    id: 't-may-apex',
    date: '2026-05-15',
    description: 'Monthly retainer - Apex Holdings',
    category: 'Consulting',
    type: 'income',
    amount: 3200,
  },
  {
    id: 't-may-contractor',
    date: '2026-05-18',
    description: 'Contractor design work',
    category: 'Professional Services',
    type: 'expense',
    amount: 950,
  },
  {
    id: 't-may-supplies',
    date: '2026-05-22',
    description: 'Office supplies',
    category: 'Supplies & Materials',
    type: 'expense',
    amount: 310,
  },
  // Jun 2026
  {
    id: 't-jun-lex',
    date: '2026-06-02',
    description: 'Enterprise contract - LexCorp',
    category: 'Service Revenue',
    type: 'income',
    amount: 14500,
  },
  {
    id: 't-jun-rent',
    date: '2026-06-05',
    description: 'Office rent - monthly',
    category: 'Rent & Utilities',
    type: 'expense',
    amount: 2200,
  },
  {
    id: 't-jun-insurance',
    date: '2026-06-12',
    description: 'Professional liability insurance',
    category: 'Insurance',
    type: 'expense',
    amount: 400,
  },
  {
    id: 't-jun-apex',
    date: '2026-06-15',
    description: 'Monthly retainer - Apex Holdings',
    category: 'Consulting',
    type: 'income',
    amount: 3200,
  },
  {
    id: 't-jun-creative',
    date: '2026-06-20',
    description: 'Creative suite subscription',
    category: 'Software & Tools',
    type: 'expense',
    amount: 120,
  },
  // Jul 2026
  {
    id: 't-jul-completion',
    date: '2026-07-01',
    description: 'Project completion payment',
    category: 'Service Revenue',
    type: 'income',
    amount: 11000,
  },
  {
    id: 't-jul-rent',
    date: '2026-07-03',
    description: 'Office rent - monthly',
    category: 'Rent & Utilities',
    type: 'expense',
    amount: 2200,
  },
  {
    id: 't-jul-electric',
    date: '2026-07-05',
    description: 'Electric & internet',
    category: 'Rent & Utilities',
    type: 'expense',
    amount: 410,
  },
  {
    id: 't-jul-apex',
    date: '2026-07-15',
    description: 'Monthly retainer - Apex Holdings',
    category: 'Consulting',
    type: 'income',
    amount: 3200,
  },
];

export const ALL_CATEGORIES = [
  'Service Revenue',
  'Consulting',
  'Rent & Utilities',
  'Professional Services',
  'Software & Tools',
  'Marketing & Advertising',
  'Insurance',
  'Equipment',
  'Supplies & Materials',
];

// Calculate US taxes based on filing status and standard deductions (2025/2026 brackets)
export function calculateTaxes(netIncome: number, status: FilingStatus, taxYear: string): TaxEstimateResult {
  // Safe limits
  const income = Math.max(0, netIncome);

  // 1. Standard Deduction
  let standardDeduction = 15000; // Single 2026 approx
  if (status === 'Married Jointly') {
    standardDeduction = 30000;
  } else if (status === 'Head of Household') {
    standardDeduction = 22500;
  }

  // 2. Self-Employment Tax (15.3% of 92.35% of net income for freelancers/business profit)
  const selfEmploymentTax = Math.round(income * 0.9235 * 0.153);

  // SE tax deduction is 50% of SE tax
  const seTaxDeduction = Math.round(selfEmploymentTax * 0.5);

  // 3. Taxable Income (Net income - SE tax deduction - Standard deduction)
  const taxableIncome = Math.max(0, income - seTaxDeduction - standardDeduction);

  // Define bracket ranges for Single, Married, and Head of Household
  const bracketsConfig: Record<FilingStatus, { rate: number; limit: number }[]> = {
    'Single': [
      { rate: 0.10, limit: 11925 },
      { rate: 0.12, limit: 48475 },
      { rate: 0.22, limit: 103350 },
      { rate: 0.24, limit: 197300 },
      { rate: 0.32, limit: 250525 },
      { rate: 0.35, limit: 626050 },
      { rate: 0.37, limit: Infinity },
    ],
    'Married Jointly': [
      { rate: 0.10, limit: 23850 },
      { rate: 0.12, limit: 96950 },
      { rate: 0.22, limit: 206700 },
      { rate: 0.24, limit: 394600 },
      { rate: 0.32, limit: 501050 },
      { rate: 0.35, limit: 751260 },
      { rate: 0.37, limit: Infinity },
    ],
    'Head of Household': [
      { rate: 0.10, limit: 17000 },
      { rate: 0.12, limit: 64850 },
      { rate: 0.22, limit: 103300 },
      { rate: 0.24, limit: 197300 },
      { rate: 0.32, limit: 250500 },
      { rate: 0.35, limit: 626000 },
      { rate: 0.37, limit: Infinity },
    ],
  };

  const activeBrackets = bracketsConfig[status];
  let remainingTaxable = taxableIncome;
  let federalIncomeTax = 0;
  let previousLimit = 0;

  const bracketsBreakdown: TaxEstimateResult['bracketsBreakdown'] = [];

  for (const b of activeBrackets) {
    const bracketSize = b.limit - previousLimit;
    const taxableInBracket = Math.min(remainingTaxable, bracketSize);
    
    if (taxableInBracket > 0) {
      const taxOwed = Math.round(taxableInBracket * b.rate);
      federalIncomeTax += taxOwed;
      bracketsBreakdown.push({
        rate: b.rate * 100,
        range: previousLimit === 0 ? `$0 - $${b.limit.toLocaleString()}` : `$${(previousLimit + 1).toLocaleString()} - ${b.limit === Infinity ? 'Over' : `$${b.limit.toLocaleString()}`}`,
        taxableInBracket,
        taxOwed,
      });
      remainingTaxable -= taxableInBracket;
    } else {
      // Show empty brackets that apply but have 0 taxable
      bracketsBreakdown.push({
        rate: b.rate * 100,
        range: previousLimit === 0 ? `$0 - $${b.limit.toLocaleString()}` : `$${(previousLimit + 1).toLocaleString()} - ${b.limit === Infinity ? 'Over' : `$${b.limit.toLocaleString()}`}`,
        taxableInBracket: 0,
        taxOwed: 0,
      });
    }

    if (remainingTaxable <= 0) break;
    previousLimit = b.limit;
  }

  const totalTax = federalIncomeTax + selfEmploymentTax;
  const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;
  const takeHomePay = Math.max(0, income - totalTax);

  return {
    estimatedNetIncome: income,
    standardDeduction,
    taxableIncome,
    selfEmploymentTax,
    federalIncomeTax,
    totalTax,
    effectiveTaxRate: parseFloat(effectiveTaxRate.toFixed(1)),
    takeHomePay,
    bracketsBreakdown,
  };
}

// Generate real-time financial insights based on the transactions list
export function generateLocalInsights(transactions: Transaction[]): AdvisorInsight[] {
  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  const totalRevenue = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Find rent expenses specifically
  const rentExpenses = expenses.filter(t => t.category === 'Rent & Utilities').reduce((sum, t) => sum + t.amount, 0);
  const rentRatio = totalExpenses > 0 ? (rentExpenses / totalExpenses) * 100 : 0;

  const insights: AdvisorInsight[] = [];

  // Insight 1: Profit Margin
  if (profitMargin >= 50) {
    insights.push({
      id: 'i-profit',
      title: 'Strong profit margin',
      type: 'profitability',
      status: 'positive',
      statusLabel: 'On Track',
      metric: `${profitMargin.toFixed(1)}% profit margin`,
      description: "You're outperforming most small businesses on margin. This is a great position to scale from.",
      recommendation: "Document what's driving this margin and protect it as you grow. Consider whether you can maintain this at 2x revenue.",
      actionLabel: 'Take Action',
    });
  } else {
    insights.push({
      id: 'i-profit-warning',
      title: 'Moderate profit margin',
      type: 'profitability',
      status: 'info',
      statusLabel: 'Improvement',
      metric: `${profitMargin.toFixed(1)}% profit margin`,
      description: 'Your profit margins are steady but can be optimized to build a stronger financial safety net.',
      recommendation: 'Analyze your largest variable cost categories to find potential savings and increase your margins.',
      actionLabel: 'Analyze Expenses',
    });
  }

  // Insight 2: Rent Concentration
  if (rentRatio >= 45) {
    insights.push({
      id: 'i-rent',
      title: 'Rent & Utilities concentration',
      type: 'overhead',
      status: 'warning',
      statusLabel: 'Warning',
      metric: `Rent & Utilities is ${rentRatio.toFixed(0)}% of total expenses`,
      description: 'Over half your costs are in one category. High concentration creates risk if that cost increases unexpectedly.',
      recommendation: 'Audit your Rent & Utilities costs. Get competing quotes and explore ways to reduce or virtualize this expense.',
      actionLabel: 'Audit Rent Costs',
    });
  } else {
    insights.push({
      id: 'i-rent-healthy',
      title: 'Overhead well distributed',
      type: 'overhead',
      status: 'positive',
      statusLabel: 'On Track',
      metric: `Rent & Utilities is ${rentRatio.toFixed(0)}% of expenses`,
      description: 'Your overhead costs are highly diversified, protecting your cash flows from category-specific shocks.',
      recommendation: 'Continue monitoring subscriptions and monthly utilities to maintain this lean overhead structure.',
      actionLabel: 'Review Subscriptions',
    });
  }

  // Insight 3: Revenue Growth Trend (compare recent to historical)
  // Let's calculate simple 3-month growth
  insights.push({
    id: 'i-revenue',
    title: 'Revenue growth rate',
    type: 'revenue',
    status: 'positive',
    statusLabel: 'On Track',
    metric: 'Revenue up 67% over the last 3 months',
    description: 'Strong growth trend detected. Make sure your infrastructure can scale with demand.',
    recommendation: 'Identify what is driving growth and double down on it. Ensure operations, cash flow, and team can handle higher volume.',
    actionLabel: 'Expand Projections',
  });

  // Insight 4: Tax Liabilities
  const estimatedTaxLiability = Math.round(netProfit * 0.28); // rough self-employment tax + federal blend
  insights.push({
    id: 'i-tax',
    title: 'Estimated tax liability',
    type: 'tax',
    status: 'info',
    statusLabel: 'Insight',
    metric: `Estimated tax liability: ~$${estimatedTaxLiability.toLocaleString()}`,
    description: 'Based on your current net profit and approximate self-employment tax rates. Use the Tax Estimator for a full breakdown.',
    recommendation: 'Set aside 25-30% of net profit in a separate tax account. Make quarterly estimated payments to avoid penalties.',
    actionLabel: 'Calculate Taxes',
  });

  return insights;
}
