import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProductGenerator from './components/ProductGenerator';
import AIOrderConfig from './components/AIOrderConfig';
import Pricing from './components/Pricing';
import StoreBuilder from './components/StoreBuilder';

const SettingsPlaceholder = () => (
  <div className="p-8 bg-white rounded-2xl border border-slate-100 animate-fade-in">
    <h2 className="text-xl font-bold mb-4">Settings</h2>
    <p className="text-slate-500">General application settings would go here.</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductGenerator />;
      case 'ai-config':
        return <AIOrderConfig />;
      case 'billing':
        return <Pricing />;
      case 'store':
        return <StoreBuilder />;
      case 'settings':
        return <SettingsPlaceholder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <HashRouter>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
    </HashRouter>
  );
};

export default App;