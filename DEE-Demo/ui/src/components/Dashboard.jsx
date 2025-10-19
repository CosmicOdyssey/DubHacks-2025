import React, { useState, useEffect } from 'react';

function Dashboard({ apiUrl }) {
  const [summary, setSummary] = useState(null);
  const [topContributors, setTopContributors] = useState([]);
  const [recentEpochs, setRecentEpochs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, contributorsRes, epochsRes] = await Promise.all([
        fetch(`${apiUrl}/ui/summary`).then(r => r.json()),
        fetch(`${apiUrl}/ui/contributors?limit=10`).then(r => r.json()),
        fetch(`${apiUrl}/ui/epochs?limit=5`).then(r => r.json()),
      ]);
      setSummary(summaryRes);
      setTopContributors(contributorsRes);
      setRecentEpochs(epochsRes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-section">
        <h2 className="section-title">Overview</h2>
        <div className="metrics-grid">
          <div className="metric-card primary">
            <div className="metric-content">
              <h3 className="metric-label">Total MB</h3>
              <p className="metric-value">{formatNumber(summary?.sumMB || 0)}</p>
            </div>
          </div>

          <div className="metric-card secondary">
            <div className="metric-content">
              <h3 className="metric-label">Total MF</h3>
              <p className="metric-value">{formatNumber(summary?.sumMF || 0)}</p>
            </div>
          </div>

          <div className="metric-card accent">
            <div className="metric-content">
              <h3 className="metric-label">Contributors</h3>
              <p className="metric-value">{summary?.contributors || 0}</p>
            </div>
          </div>

          <div className="metric-card success">
            <div className="metric-content">
              <h3 className="metric-label">Median Payout</h3>
              <p className="metric-value">{formatNumber(summary?.medianPayout || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Top Contributors</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Contributor ID</th>
                <th>MB Total</th>
                <th>MF Value</th>
                <th>Total Equity</th>
              </tr>
            </thead>
            <tbody>
              {topContributors.map((contributor, index) => (
                <tr key={contributor.contributorId}>
                  <td>
                    <span className="rank-badge">{index + 1}</span>
                  </td>
                  <td className="contributor-id">{contributor.contributorId}</td>
                  <td>{formatNumber(contributor.MB_total)}</td>
                  <td>{formatNumber(contributor.MF_value)}</td>
                  <td>
                    <strong>{formatNumber(contributor.equity)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Recent Epochs</h2>
        {recentEpochs.length === 0 ? (
          <div className="empty-state">
            <p>No epochs recorded yet</p>
          </div>
        ) : (
          <div className="epochs-list">
            {recentEpochs.map((epoch) => (
              <div key={epoch.epochId} className="epoch-card">
                <div className="epoch-header">
                  <h3 className="epoch-id">{epoch.epochId}</h3>
                  <span className="epoch-date">
                    {formatDate(epoch.tStart)} - {formatDate(epoch.tEnd)}
                  </span>
                </div>
                <div className="epoch-details">
                  <div className="epoch-stat">
                    <span className="stat-label">Circulating:</span>
                    <span className="stat-value">{formatNumber(epoch.sCirculating)}</span>
                  </div>
                  <div className="epoch-stat">
                    <span className="stat-label">Alpha:</span>
                    <span className="stat-value">{formatNumber(epoch.alpha)}</span>
                  </div>
                  <div className="epoch-stat">
                    <span className="stat-label">Beta:</span>
                    <span className="stat-value">{formatNumber(epoch.beta)}</span>
                  </div>
                  <div className="epoch-stat">
                    <span className="stat-label">Gate Value:</span>
                    <span className="stat-value">{formatNumber(epoch.gateValue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <button className="action-button refresh" onClick={fetchData}>
          Refresh Data
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

