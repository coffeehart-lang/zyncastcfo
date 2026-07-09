import { useState, FormEvent } from 'react';
import { Transaction } from '../types';
import { ALL_CATEGORIES } from '../data';
import { 
  Plus, 
  Search, 
  X, 
  Edit3, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onEditTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  isPrivacyMode?: boolean;
}

type SortField = 'date' | 'description' | 'category' | 'amount';
type SortOrder = 'asc' | 'desc';

export default function TransactionsView({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  isPrivacyMode = false,
}: TransactionsViewProps) {
  // Recurring Presets state and templates
  const [presetNotification, setPresetNotification] = useState<string | null>(null);

  const recurringPresets = [
    { description: 'Monthly Office Rent', amount: 2200, category: 'Rent & Utilities', type: 'expense' as const },
    { description: 'SaaS Tools Subscription', amount: 240, category: 'Software & Tools', type: 'expense' as const },
    { description: 'Monthly Retainer Inflow', amount: 3200, category: 'Consulting', type: 'income' as const },
    { description: 'ISP & Electric Utilities', amount: 380, category: 'Rent & Utilities', type: 'expense' as const },
  ];

  const handleLogPreset = (p: typeof recurringPresets[0]) => {
    onAddTransaction({
      date: new Date().toISOString().split('T')[0],
      description: p.description,
      category: p.category,
      type: p.type,
      amount: p.amount,
    });
    setPresetNotification(`Booked "${p.description}"!`);
    setTimeout(() => {
      setPresetNotification(null);
    }, 2500);
  };

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form State
  const [formDate, setFormDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState(ALL_CATEGORIES[0]);
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [formAmount, setFormAmount] = useState('');
  const [formError, setFormError] = useState('');

  // Handle opening modal for new transaction
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormCategory(ALL_CATEGORIES[0]);
    setFormType('expense');
    setFormAmount('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle opening modal for editing an existing transaction
  const handleOpenEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setFormDate(t.date);
    setFormDescription(t.description);
    setFormCategory(t.category);
    setFormType(t.type);
    setFormAmount(t.amount.toString());
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formDate) return setFormError('Please select a valid date.');
    if (!formDescription.trim()) return setFormError('Please enter a description.');
    if (!formCategory) return setFormError('Please select a category.');
    
    const parsedAmount = parseFloat(formAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return setFormError('Please enter a valid amount greater than 0.');
    }

    const payload = {
      date: formDate,
      description: formDescription.trim(),
      category: formCategory,
      type: formType,
      amount: parsedAmount,
    };

    if (editingTransaction) {
      onEditTransaction(editingTransaction.id, payload);
    } else {
      onAddTransaction(payload);
    }

    setIsModalOpen(false);
  };

  // Handle Toggle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending
    }
  };

  // Apply filters
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Apply Sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      comparison = a.date.localeCompare(b.date);
    } else if (sortField === 'description') {
      comparison = a.description.localeCompare(b.description);
    } else if (sortField === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === 'amount') {
      comparison = a.amount - b.amount;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div id="transactions-view" className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div id="transactions-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="transactions-title" className="text-2xl font-sans font-bold tracking-tight text-slate-900">
            Transactions
          </h2>
          <p id="transactions-subtitle" className="text-sm text-slate-500 font-sans mt-1">
            Manage and track your business income and expense streams.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all hover:shadow cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      {/* Quick Recurring Presets */}
      <div id="recurring-presets-section" className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider font-mono">RECURRING PRESETS</span>
            <span className="text-xs font-semibold text-slate-600">Quick-log monthly overhead, subscriptions, or contract retains:</span>
          </div>
          {presetNotification && (
            <span className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-0.5 rounded-lg font-medium animate-pulse">
              {presetNotification}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recurringPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleLogPreset(preset)}
              className="flex items-center justify-between p-3 bg-white hover:bg-slate-50/50 rounded-lg border border-slate-200/60 shadow-xs text-left cursor-pointer transition-all hover:border-blue-400 group"
            >
              <div className="space-y-0.5 truncate pr-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  {preset.category}
                </span>
                <span className="text-xs font-sans font-semibold text-slate-800 group-hover:text-blue-600 block truncate">
                  {preset.description}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 block">
                  {preset.type === 'income' ? '+' : '-'}{isPrivacyMode ? '$••••' : `$${preset.amount.toLocaleString()}`}
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50/70 hover:bg-blue-100 px-2.5 py-1.5 rounded uppercase font-mono whitespace-nowrap">
                Book
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div id="filter-toolbar" className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-500 font-sans text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Multi Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Filter Category */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-xs font-sans focus:outline-none focus:border-blue-500 font-medium cursor-pointer max-w-[180px]"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div id="ledger-table-container" className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 font-mono tracking-widest uppercase">
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-100/50 transition-all select-none" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    Date {sortField === 'date' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-100/50 transition-all select-none" onClick={() => handleSort('description')}>
                  <div className="flex items-center gap-1">
                    Description {sortField === 'description' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-100/50 transition-all select-none" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1">
                    Category {sortField === 'category' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-100/50 transition-all select-none" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-1">
                    Type / Amount {sortField === 'amount' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-sans text-slate-700">
              {sortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-sans">
                    No transactions found matching the filters.
                  </td>
                </tr>
              ) : (
                sortedTransactions.map((t) => {
                  const dateFormatted = new Date(t.date + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Date */}
                      <td className="py-4.5 px-6 font-mono text-xs text-slate-500 font-semibold">
                        {dateFormatted}
                      </td>

                      {/* Description */}
                      <td className="py-4.5 px-6 font-semibold text-slate-800">
                        {t.description}
                      </td>

                      {/* Category */}
                      <td className="py-4.5 px-6">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                          {t.category}
                        </span>
                      </td>

                      {/* Amount / Badge */}
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-3">
                          {t.type === 'income' ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-mono">
                              <ArrowUpRight className="w-3 h-3" /> Income
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-mono">
                              <ArrowDownRight className="w-3 h-3" /> Expense
                            </span>
                          )}
                          <span className={`font-mono font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {t.type === 'income' ? '+' : '-'}{isPrivacyMode ? '$••••' : `$${t.amount.toLocaleString()}`}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(t)}
                            className="p-1.5 text-slate-400 hover:text-blue-500 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${t.description}"?`)) {
                                onDeleteTransaction(t.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Entry Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-scale-up">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-sans font-bold text-slate-900 text-base">
                {editingTransaction ? 'Edit Transaction' : 'Log Transaction'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-rose-50 text-rose-600 text-xs px-3.5 py-2.5 rounded-lg font-medium">
                  {formError}
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:border-blue-500 text-slate-800"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Office rent - monthly"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-300"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:border-blue-500 text-slate-800 cursor-pointer bg-white"
                >
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Type (Income / Expense) Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setFormType('expense')}
                    className={`py-2 px-4 rounded-lg border text-xs font-bold uppercase tracking-wider font-mono text-center cursor-pointer transition-all ${
                      formType === 'expense'
                        ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('income')}
                    className={`py-2 px-4 rounded-lg border text-xs font-bold uppercase tracking-wider font-mono text-center cursor-pointer transition-all ${
                      formType === 'income'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm font-sans focus:outline-none focus:border-blue-500 text-slate-800 placeholder-slate-300 font-mono"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold uppercase tracking-wider font-mono text-slate-500 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold uppercase tracking-wider font-mono text-white shadow-sm transition-all hover:shadow cursor-pointer"
                >
                  {editingTransaction ? 'Save Changes' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
