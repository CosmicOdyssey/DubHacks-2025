import React, { useState, useEffect } from 'react';

function Contributors({ apiUrl }) {
  const [contributors, setContributors] = useState([]);
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [contributorEvents, setContributorEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchContributors();
  }, [apiUrl, limit]);

  const fetchContributors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/ui/contributors?limit=${limit}`);
      const data = await response.json();
      setContributors(data);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContributorDetails = async (contributorId) => {
    try {
      const response = await fetch(`${apiUrl}/ui/contributors/${contributorId}/feed`);
      const events = await response.json();
      setContributorEvents(events);
      setSelectedContributor(contributorId);
    } catch (error) {
      console.error('Error loading contributor details:', error);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return 'N/A';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading contributors...</p>
      </div>
    );
  }

  return (
    <div className="contributors-container">
      <div className="page-header">
        <h2 className="page-title">Contributors</h2>
        <div className="page-controls">
          <label htmlFor="limit-select">Show:</label>
          <select 
            id="limit-select"
            className="control-select"
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
            <option value={100}>Top 100</option>
            <option value={200}>Top 200</option>
          </select>
        </div>
      </div>

      <div className="contributors-content">
        <div className="contributors-list">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Contributor ID</th>
                  <th>MB Total</th>
                  <th>MF Value</th>
                  <th>Total Equity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contributors.map((contributor, index) => (
                  <tr 
                    key={contributor.contributorId}
                    className={selectedContributor === contributor.contributorId ? 'selected' : ''}
                  >
                    <td>
                      <span className="rank-badge">{index + 1}</span>
                    </td>
                    <td className="contributor-id">{contributor.contributorId}</td>
                    <td>{formatNumber(contributor.MB_total)}</td>
                    <td>{formatNumber(contributor.MF_value)}</td>
                    <td>
                      <strong>{formatNumber(contributor.equity)}</strong>
                    </td>
                    <td>
                      <button
                        className="action-button small"
                        onClick={() => loadContributorDetails(contributor.contributorId)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedContributor && (
          <div className="contributor-details">
            <div className="details-header">
              <h3>Activity Feed: {selectedContributor}</h3>
              <button
                className="close-button"
                onClick={() => {
                  setSelectedContributor(null);
                  setContributorEvents([]);
                }}
              >
                ✕
              </button>
            </div>
            
            {contributorEvents.length === 0 ? (
              <div className="empty-state">
                <p>No events found for this contributor</p>
              </div>
            ) : (
              <div className="events-feed">
                {contributorEvents.map((event) => (
                  <div key={event.eventId} className="event-item">
                    <div className="event-header">
                      <span className={`event-type-badge ${event.type}`}>
                        {event.type}
                      </span>
                      <span className="event-time">{formatDate(event.ts)}</span>
                    </div>
                    <div className="event-details">
                      <div className="event-info">
                        <strong>Repo:</strong> {event.repo}
                      </div>
                      {event.lang && (
                        <div className="event-info">
                          <strong>Language:</strong> {event.lang}
                        </div>
                      )}
                      {event.score && (
                        <div className="event-score">
                          <div className="score-item">
                            <span>MB:</span> {formatNumber(event.score.toMB)}
                          </div>
                          <div className="score-item">
                            <span>MF:</span> {formatNumber(event.score.toMF)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contributors;

