import React, { useState, useEffect } from 'react';

function Events({ apiUrl }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [apiUrl, limit]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/ui/events?limit=${limit}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
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

  const eventTypes = ['all', 'commit', 'review', 'merge', 'incident_fix', 'doc', 'deploy'];

  const filteredEvents = typeFilter === 'all' 
    ? events 
    : events.filter(e => e.type === typeFilter);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="page-header">
        <h2 className="page-title">Events Feed</h2>
        <div className="page-controls">
          <div className="control-group">
            <label htmlFor="type-filter">Type:</label>
            <select
              id="type-filter"
              className="control-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="limit-select">Show:</label>
            <select
              id="limit-select"
              className="control-select"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <p>No events found</p>
        </div>
      ) : (
        <div className="events-list">
          {filteredEvents.map((event) => (
            <div key={event.eventId} className="event-card">
              <div className="event-card-header">
                <div className="event-type-info">
                  <span className={`event-type-badge ${event.type}`}>
                    {event.type}
                  </span>
                  {event.isMilestone && (
                    <span className="milestone-badge">Milestone</span>
                  )}
                </div>
                <span className="event-timestamp">{formatDate(event.ts)}</span>
              </div>

              <div className="event-card-body">
                <div className="event-info-grid">
                  <div className="info-item">
                    <span className="info-label">Contributor:</span>
                    <span className="info-value contributor-id">{event.contributorId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Repository:</span>
                    <span className="info-value">{event.repo}</span>
                  </div>
                  {event.lang && (
                    <div className="info-item">
                      <span className="info-label">Language:</span>
                      <span className="info-value">{event.lang}</span>
                    </div>
                  )}
                  {event.stack && (
                    <div className="info-item">
                      <span className="info-label">Stack:</span>
                      <span className="info-value">{event.stack}</span>
                    </div>
                  )}
                  {event.teamId && (
                    <div className="info-item">
                      <span className="info-label">Team:</span>
                      <span className="info-value">{event.teamId}</span>
                    </div>
                  )}
                  {event.prId && (
                    <div className="info-item">
                      <span className="info-label">PR:</span>
                      <span className="info-value">{event.prId}</span>
                    </div>
                  )}
                </div>

                {event.issueKeys && event.issueKeys.length > 0 && (
                  <div className="issue-keys">
                    <span className="info-label">Issues:</span>
                    <div className="issue-tags">
                      {event.issueKeys.map((key) => (
                        <span key={key} className="issue-tag">{key}</span>
                      ))}
                    </div>
                  </div>
                )}

                {event.tags && event.tags.length > 0 && (
                  <div className="event-tags">
                    {event.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                {event.score && (
                  <div className="event-scores">
                    <h4 className="scores-title">Scores</h4>
                    <div className="scores-grid">
                      <div className="score-item primary">
                        <span className="score-label">MB:</span>
                        <span className="score-value">{formatNumber(event.score.toMB)}</span>
                      </div>
                      <div className="score-item primary">
                        <span className="score-label">MF:</span>
                        <span className="score-value">{formatNumber(event.score.toMF)}</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Quality (q):</span>
                        <span className="score-value">{formatNumber(event.score.q)}</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Complexity (c):</span>
                        <span className="score-value">{formatNumber(event.score.c)}</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Risk (r):</span>
                        <span className="score-value">{formatNumber(event.score.r)}</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Business (b):</span>
                        <span className="score-value">{formatNumber(event.score.b)}</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Velocity (v):</span>
                        <span className="score-value">{formatNumber(event.score.v)}</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Beta Split:</span>
                        <span className="score-value">{formatNumber(event.score.betaSplit)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;

