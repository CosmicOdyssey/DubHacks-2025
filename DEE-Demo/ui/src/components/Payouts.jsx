import React, { useState, useEffect } from 'react';

function Payouts({ apiUrl }) {
  const [payouts, setPayouts] = useState([]);
  const [epochs, setEpochs] = useState([]);
  const [selectedEpoch, setSelectedEpoch] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpochs();
  }, [apiUrl]);

  useEffect(() => {
    fetchPayouts();
  }, [apiUrl, selectedEpoch]);

  const fetchEpochs = async () => {
    try {
      const response = await fetch(`${apiUrl}/ui/epochs?limit=50`);
      const data = await response.json();
      setEpochs(data);
    } catch (error) {
      console.error('Error fetching epochs:', error);
    }
  };

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const url = selectedEpoch === 'all' 
        ? `${apiUrl}/ui/payouts`
        : `${apiUrl}/ui/payouts?epoch=${selectedEpoch}`;
      const response = await fetch(url);
      const data = await response.json();
      setPayouts(data);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calculateStats = () => {
    if (payouts.length === 0) return { total: 0, avg: 0, max: 0, min: 0 };
    
    const totals = payouts.map(p => p.pTotal);
    const sum = totals.reduce((a, b) => a + b, 0);
    const avg = sum / totals.length;
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    
    return { total: sum, avg, max, min };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payouts...</p>
      </div>
    );
  }

  return (
    <div className="payouts-container">
      <div className="page-header">
        <h2 className="page-title">Payouts</h2>
        <div className="page-controls">
          <label htmlFor="epoch-select">Filter by Epoch:</label>
          <select
            id="epoch-select"
            className="control-select"
            value={selectedEpoch}
            onChange={(e) => setSelectedEpoch(e.target.value)}
          >
            <option value="all">All Epochs</option>
            {epochs.map((epoch) => (
              <option key={epoch.epochId} value={epoch.epochId}>
                {epoch.epochId}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total Distributed:</span>
          <span className="stat-value">{formatNumber(stats.total)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average:</span>
          <span className="stat-value">{formatNumber(stats.avg)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Maximum:</span>
          <span className="stat-value">{formatNumber(stats.max)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Minimum:</span>
          <span className="stat-value">{formatNumber(stats.min)}</span>
        </div>
      </div>

      {payouts.length === 0 ? (
        <div className="empty-state">
          <p>No payouts found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Epoch ID</th>
                <th>Contributor ID</th>
                <th>Weight MB</th>
                <th>Weight MF</th>
                <th>Payout MB</th>
                <th>Payout MF</th>
                <th>Total Payout</th>
                <th>Caps Applied</th>
                <th>Carryover</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={`${payout.epochId}-${payout.contributorId}`}>
                  <td className="epoch-id-cell">{payout.epochId}</td>
                  <td className="contributor-id">{payout.contributorId}</td>
                  <td>{formatNumber(payout.wMB)}</td>
                  <td>{formatNumber(payout.wMF)}</td>
                  <td>{formatNumber(payout.pMB)}</td>
                  <td>{formatNumber(payout.pMF)}</td>
                  <td>
                    <strong className="total-value">{formatNumber(payout.pTotal)}</strong>
                  </td>
                  <td>
                    {payout.capsApplied ? (
                      <span className="badge warning">Yes</span>
                    ) : (
                      <span className="badge success">No</span>
                    )}
                  </td>
                  <td>{formatNumber(payout.carryover)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Payouts;

