import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import Dashboard from './components/Dashboard';
import Contributors from './components/Contributors';
import Payouts from './components/Payouts';
import Epochs from './components/Epochs';
import Events from './components/Events';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiBaseUrl, setApiBaseUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get API base URL from Forge backend
    invoke('getConfig').then(config => {
      setApiBaseUrl(config.apiUrl);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load config:', err);
      // Fallback for development
      setApiBaseUrl('http://localhost:4000');
      setLoading(false);
    });
  }, []);

  if (loading || !apiBaseUrl) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading DEE Dashboard...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'contributors', label: 'Contributors' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'epochs', label: 'Epochs' },
    { id: 'events', label: 'Events' },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">⚖️</span>
            Dynamic Equity Engine
          </h1>
          <p className="app-subtitle">Product Manager Dashboard</p>
        </div>
      </header>

      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {activeTab === 'dashboard' && <Dashboard apiUrl={apiBaseUrl} />}
        {activeTab === 'contributors' && <Contributors apiUrl={apiBaseUrl} />}
        {activeTab === 'payouts' && <Payouts apiUrl={apiBaseUrl} />}
        {activeTab === 'epochs' && <Epochs apiUrl={apiBaseUrl} />}
        {activeTab === 'events' && <Events apiUrl={apiBaseUrl} />}
      </main>
    </div>
  );
}

export default App;

