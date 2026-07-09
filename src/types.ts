export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
}

export type FilingStatus = 'Single' | 'Married Jointly' | 'Head of Household';

export interface TaxEstimateResult {
  estimatedNetIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  selfEmploymentTax: number;
  federalIncomeTax: number;
  totalTax: number;
  effectiveTaxRate: number;
  takeHomePay: number;
  bracketsBreakdown: {
    rate: number;
    range: string;
    taxableInBracket: number;
    taxOwed: number;
  }[];
}

export interface AdvisorInsight {
  id: string;
  title: string;
  type: 'profitability' | 'overhead' | 'revenue' | 'tax' | 'general';
  status: 'positive' | 'warning' | 'info';
  statusLabel: string;
  metric: string;
  description: string;
  recommendation: string;
  actionLabel: string;
}
