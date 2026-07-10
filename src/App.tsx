import { useState, useEffect } from 'react';
import { Transaction } from './types';
import { INITIAL_TRANSACTIONS } from './data';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import TransactionsView from './components/TransactionsView';
import ForecastView from './components/ForecastView';
import TaxEstimatorView from './components/TaxEstimatorView';
import AIAdvisorView from './components/AIAdvisorView';
import CheckoutModal from './components/CheckoutModal';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [taxEstimatorNetIncome, setTaxEstimatorNetIncome] = useState<number>(100000);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => {
    return localStorage.getItem('zyncast_cfo_privacy_mode') === 'true';
  });
  const [userTier, setUserTier] = useState<'free' | 'pro'>(() => {
    return (localStorage.getItem('zyncast_cfo_user_tier') as 'free' | 'pro') || 'free';
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('zyncast_cfo_privacy_mode', isPrivacyMode ? 'true' : 'false');
  }, [isPrivacyMode]);

  useEffect(() => {
    localStorage.setItem('zyncast_cfo_user_tier', userTier);
  }, [userTier]);

  // 1. Load transactions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('zyncast_cfo_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved transactions, resetting:", e);
        setTransactions(INITIAL_TRANSACTIONS);
        localStorage.setItem('zyncast_cfo_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
      }
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.setItem('zyncast_cfo_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    }
  }, []);

  // Helper to save current list to localStorage
  const saveToStorage = (updatedList: Transaction[]) => {
    setTransactions(updatedList);
    localStorage.setItem('zyncast_cfo_transactions', JSON.stringify(updatedList));
  };

  // 2. Add transaction handler
  const handleAddTransaction = (newT: Omit<Transaction, 'id'>) => {
    const t: Transaction = {
      ...newT,
      id: `t-${Date.now()}`,
    };
    const updated = [t, ...transactions];
    saveToStorage(updated);
  };

  // 3. Edit transaction handler
  const handleEditTransaction = (id: string, updatedT: Omit<Transaction, 'id'>) => {
    const updated = transactions.map((t) => {
      if (t.id === id) {
        return { ...updatedT, id };
      }
      return t;
    });
    saveToStorage(updated);
  };

  // 4. Delete transaction handler
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    saveToStorage(updated);
  };

  // Calculate net profit for tax pre-population
  const currentNetProfit = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) -
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div id="app-root-container" className="flex h-screen w-screen bg-slate-50/50 overflow-hidden text-slate-800">
      {/* Mobile menu button - ONLY visible below 1024px (lg breakpoint) */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-950 text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile sidebar backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50"
          />
        )}

        {/* Mobile sidebar - slides in from left */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isPrivacyMode={isPrivacyMode} 
            setIsPrivacyMode={setIsPrivacyMode} 
            userTier={userTier}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        </div>
      </div>

      {/* Desktop sidebar - ONLY visible at 1024px and above */}
      <div className="hidden lg:block">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isPrivacyMode={isPrivacyMode} 
          setIsPrivacyMode={setIsPrivacyMode} 
          userTier={userTier}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />
      </div>

      {/* Main content body */}
      <main id="main-content-scroll" className="flex-1 overflow-y-auto h-screen px-4 lg:px-8 py-10 pt-16 lg:pt-10">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              transactions={transactions} 
              setActiveTab={setActiveTab}
              setTaxEstimatorNetIncome={setTaxEstimatorNetIncome}
              isPrivacyMode={isPrivacyMode}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView 
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              isPrivacyMode={isPrivacyMode}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastView 
              transactions={transactions} 
              isPrivacyMode={isPrivacyMode}
              userTier={userTier}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
            />
          )}

          {activeTab === 'tax-estimator' && (
            <TaxEstimatorView 
              initialNetIncome={taxEstimatorNetIncome || currentNetProfit || 100000} 
              isPrivacyMode={isPrivacyMode}
            />
          )}

          {activeTab === 'ai-advisor' && (
            <AIAdvisorView 
              transactions={transactions} 
              isPrivacyMode={isPrivacyMode}
              userTier={userTier}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Demo subscription checkout modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        userTier={userTier}
        onUpdateTier={setUserTier}
      />
    </div>
  );
}
