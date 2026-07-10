import { LayoutDashboard, Receipt, TrendingUp, Calculator, Sparkles, Eye, EyeOff, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPrivacyMode: boolean;
  setIsPrivacyMode: (val: boolean) => void;
  userTier: 'free' | 'pro';
  onOpenCheckout: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isPrivacyMode, 
  setIsPrivacyMode,
  userTier,
  onOpenCheckout
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'tax-estimator', label: 'Tax Estimator', icon: Calculator },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Sparkles },
  ];

  return (
    <aside id="sidebar-container" className="w-64 bg-slate-950 text-slate-100 flex flex-col h-screen border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div id="brand-header" className="p-6 flex items-center gap-3 border-b border-slate-900">
        <div id="logo-icon" className="p-2 bg-blue-600 rounded-lg text-white flex items-center justify-center">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h1 id="brand-title" className="font-sans font-bold text-lg tracking-tight leading-none text-white">
            Zyncast <span className="text-blue-400 font-medium">CFO</span>
          </h1>
          <span id="brand-subtitle" className="text-xs text-slate-400 font-mono tracking-wider">BUSINESS INSIGHTS</span>
        </div>
      </div>

      {/* Subscription Status Widget */}
      <div id="subscription-status-widget" className="p-4 mx-4 mt-5 bg-slate-900/60 border border-slate-800/85 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">ACCOUNT SYSTEM</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
            userTier === 'pro'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {userTier === 'pro' ? 'PRO TIER' : 'FREE TIER'}
          </span>
        </div>
        
        {userTier === 'pro' ? (
          <div className="space-y-1">
            <span className="text-xs text-slate-300 font-medium block flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-blue-400 fill-current" /> All Features Unlocked
            </span>
            <button
              onClick={onOpenCheckout}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5 cursor-pointer underline bg-transparent border-0 p-0"
            >
              Manage subscription status &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 leading-tight block">
              Gated AI & interactive simulators require upgrade.
            </span>
            <button
              onClick={onOpenCheckout}
              className="w-full py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-1"
            >
              <Zap className="w-2.5 h-2.5 fill-current" /> Upgrade to PRO
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav id="sidebar-navigation" className="flex-1 px-4 py-6 space-y-1.5">
        <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3 font-mono">
          Overview
        </span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 pl-3 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div id="sidebar-footer" className="p-4 border-t border-slate-900 space-y-3">
        <button
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
            isPrivacyMode 
              ? 'bg-rose-950/40 text-rose-300 border border-rose-900/40 hover:bg-rose-950/60' 
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span>Privacy Mode</span>
          </div>
          <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
            isPrivacyMode ? 'bg-rose-900/50 text-rose-300' : 'bg-slate-800 text-slate-400'
          }`}>
            {isPrivacyMode ? 'ON' : 'OFF'}
          </span>
        </button>
        <p className="text-[10px] font-mono text-slate-500 text-center">
          Zyncast CFO &copy; 2026
        </p>
      </div>
    </aside>
  );
}
