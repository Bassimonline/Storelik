import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Wand2, MessageSquare, CreditCard, Settings, Menu, X, Store } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Product Studio', icon: Wand2 },
    { id: 'ai-config', label: 'AI Orders', icon: MessageSquare },
    { id: 'store', label: 'My Store', icon: Store },
    { id: 'billing', label: 'Pricing & Plans', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 z-30 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
            D
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">Dukkani<span className="text-indigo-600">AI</span></span>
          <button className="ml-auto lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-4">Menu</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <div className="flex items-center p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <img src="https://picsum.photos/100/100" alt="User" className="w-9 h-9 rounded-full mr-3 border border-slate-200" />
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-medium text-slate-800 truncate">Ahmed Benali</h4>
              <p className="text-xs text-slate-500 truncate">ahmed@store.ma</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-slate-200 px-6 h-16 flex items-center justify-between lg:hidden">
          <div className="flex items-center">
             <button onClick={() => setIsSidebarOpen(true)} className="mr-4 text-slate-600">
               <Menu className="w-6 h-6" />
             </button>
             <span className="font-bold text-slate-800">Dukkani AI</span>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;