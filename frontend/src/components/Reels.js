
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // ADD THIS LINE

const Reels = ({ influencerId }) => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!influencerId) return;

    const fetchReels = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/reels/influencer/${influencerId}`); // ADD BASE_URL
        setReels(response.data || []);
      } catch (error) {
        console.error('Error fetching reels:', error);
        setReels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, [influencerId]);

  const formatNumber = (num) => {
    if (!num && num !== 0) return '-';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getVibeEmoji = (vibe) => {
    const vibeEmojis = {
      'party': '🎉',
      'travel luxury': '✈️',
      'casual daily life': '😊',
      'workout': '💪',
      'cooking': '👨‍🍳',
      'dance': '💃'
    };
    return vibeEmojis[vibe] || '🎬';
  };

  const getSettingEmoji = (setting) => {
    const settingEmojis = {
      'indoor': '🏠',
      'outdoor': '🌳',
      'studio': '🎬',
      'travel': '✈️',
      'home': '🏡'
    };
    return settingEmojis[setting] || '📍';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" aria-label="Loading"></div>
        Loading reels...
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
        <h3>No reels found</h3>
        <p>This influencer hasn't posted any reels yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#333' }}>🎬 Recent Reels ({reels.length})</h2>
      </div>

      <div className="posts-grid">
        {reels.map((reel) => {
          const analysis = reel.analysis || {};

          return (
            <div key={reel._id} className="post-card">
              <div style={{ position: 'relative' }}>
                <img
                  src={reel.thumbnailUrl || '/default-reel.png'}
                  alt="Reel thumbnail"
                  className="post-image"
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '15px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  🎬 {formatDuration(reel.duration)}
                </div>
              </div>

              <div className="post-content">
                <p className="post-caption">
                  {reel.caption?.length > 150 ? `${reel.caption.substring(0, 150)}...` : reel.caption || 'No caption'}
                </p>

                <div className="post-stats">
                  <span>👁️ {formatNumber(reel.views)}</span>
                  <span>❤️ {formatNumber(reel.likes)}</span>
                  <span>💬 {formatNumber(reel.comments)}</span>
                  <span>📤 {formatNumber(reel.shares)}</span>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  📅 {formatDate(reel.postDate)}
                </div>

                {/* Analysis Section */}
                <div style={{ marginTop: '1rem' }}>
                  {/* Vibe */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{getVibeEmoji(analysis.vibe)}</span>
                    <span style={{ textTransform: 'capitalize', color: '#667eea', fontWeight: '600' }}>
                      {analysis.vibe || 'Unknown'}
                    </span>
                  </div>

                  {/* Setting */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1rem' }}>{getSettingEmoji(analysis.setting)}</span>
                    <span style={{ textTransform: 'capitalize', color: '#764ba2', fontWeight: '600', fontSize: '0.9rem' }}>
                      {analysis.setting || 'Unknown'}
                    </span>
                  </div>

                  {/* Events */}
                  {analysis.events?.length > 0 && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.3rem', color: '#333' }}>
                        🎭 Events:
                      </div>
                      <div className="post-tags">
                        {analysis.events.slice(0, 3).map((event, idx) => (
                          <span key={idx} className="tag" style={{ background: '#e3f2fd' }}>
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Objects */}
                  {analysis.objects?.length > 0 && (
                    <div style={{ marginBottom: '0.8rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.3rem', color: '#333' }}>
                        🎯 Objects:
                      </div>
                      <div className="post-tags">
                        {analysis.objects.slice(0, 3).map((object, idx) => (
                          <span key={idx} className="tag" style={{ background: '#f3e5f5' }}>
                            {object}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {analysis.tags?.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.3rem', color: '#333' }}>
                        🏷️ Tags:
                      </div>
                      <div className="post-tags">
                        {analysis.tags.slice(0, 4).map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  <div style={{ marginTop: '0.8rem', padding: '0.8rem', background: 'linear-gradient(45deg, rgba(245,87,108,0.1), rgba(102,126,234,0.1))', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span>Total Engagement:</span>
                      <span style={{ fontWeight: '600', color: '#f5576c' }}>
                        {formatNumber((reel.likes || 0) + (reel.comments || 0) + (reel.shares || 0))}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span>Views-to-Likes Ratio:</span>
                      <span style={{ fontWeight: '600', color: '#667eea' }}>
                        {reel.views ? ((reel.likes || 0) / reel.views * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Engagement Rate:</span>
                      <span style={{ fontWeight: '600', color: '#764ba2' }}>
                        {reel.views ? (((reel.likes || 0) + (reel.comments || 0)) / reel.views * 100).toFixed(2) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reels;
