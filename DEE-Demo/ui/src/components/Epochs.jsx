import React, { useState, useEffect } from 'react';

function Epochs({ apiUrl }) {
  const [epochs, setEpochs] = useState([]);
  const [selectedEpoch, setSelectedEpoch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpochs();
  }, [apiUrl]);

  const fetchEpochs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/ui/epochs?limit=50`);
      const data = await response.json();
      setEpochs(data);
    } catch (error) {
      console.error('Error fetching epochs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderKPI = (kpi) => {
    if (!kpi || typeof kpi !== 'object') return 'N/A';
    return (
      <div className="kpi-display">
        {Object.entries(kpi).map(([key, value]) => (
          <div key={key} className="kpi-item">
            <span className="kpi-key">{key}:</span>
            <span className="kpi-value">{formatNumber(value)}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading epochs...</p>
      </div>
    );
  }

  return (
    <div className="epochs-container">
      <div className="page-header">
        <h2 className="page-title">Epochs History</h2>
        <p className="page-description">
          View historical data for each equity distribution epoch
        </p>
      </div>

      {epochs.length === 0 ? (
        <div className="empty-state">
          <p>No epochs found</p>
        </div>
      ) : (
        <div className="epochs-grid">
          {epochs.map((epoch) => (
            <div 
              key={epoch.epochId} 
              className={`epoch-card-detailed ${selectedEpoch === epoch.epochId ? 'expanded' : ''}`}
              onClick={() => setSelectedEpoch(selectedEpoch === epoch.epochId ? null : epoch.epochId)}
            >
              <div className="epoch-card-header">
                <h3 className="epoch-title">
                  {epoch.epochId}
                </h3>
                <span className="epoch-period">
                  {formatDate(epoch.tStart)} → {formatDate(epoch.tEnd)}
                </span>
              </div>

              <div className="epoch-metrics">
                <div className="metric-row">
                  <div className="metric-item">
                    <span className="metric-label">Circulating Supply</span>
                    <span className="metric-value">{formatNumber(epoch.sCirculating)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Gate Value</span>
                    <span className="metric-value">{formatNumber(epoch.gateValue)}</span>
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-item">
                    <span className="metric-label">Alpha (α)</span>
                    <span className="metric-value">{formatNumber(epoch.alpha)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Beta (β)</span>
                    <span className="metric-value">{formatNumber(epoch.beta)}</span>
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-item">
                    <span className="metric-label">Tau (weeks)</span>
                    <span className="metric-value">{formatNumber(epoch.tauWeeks)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Rho (ρ)</span>
                    <span className="metric-value">{formatNumber(epoch.rho)}</span>
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-item">
                    <span className="metric-label">eT</span>
                    <span className="metric-value">{formatNumber(epoch.eT)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Policy Hash</span>
                    <span className="metric-value hash">{epoch.policyHash.substring(0, 12)}...</span>
                  </div>
                </div>
              </div>

              {selectedEpoch === epoch.epochId && (
                <div className="epoch-details-expanded">
                  <div className="details-section">
                    <h4 className="details-title">Previous KPIs</h4>
                    {renderKPI(epoch.kpiPrev)}
                  </div>

                  <div className="details-section">
                    <h4 className="details-title">Current KPIs</h4>
                    {renderKPI(epoch.kpiCurr)}
                  </div>

                  <div className="details-section">
                    <h4 className="details-title">Delta K</h4>
                    {renderKPI(epoch.deltaK)}
                  </div>

                  {epoch.extras && Object.keys(epoch.extras).length > 0 && (
                    <div className="details-section">
                      <h4 className="details-title">Extras</h4>
                      <pre className="json-display">
                        {JSON.stringify(epoch.extras, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <div className="epoch-card-footer">
                <button className="expand-button">
                  {selectedEpoch === epoch.epochId ? '▲ Show Less' : '▼ Show More'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Epochs;

