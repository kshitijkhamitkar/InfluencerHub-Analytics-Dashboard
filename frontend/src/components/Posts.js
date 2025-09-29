import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // ADD THIS LINE

const Posts = ({ influencerId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!influencerId) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/posts/influencer/${influencerId}`); // ADD BASE_URL
        setPosts(response.data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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
      casual: '😊',
      aesthetic: '✨',
      luxury: '💎',
      energetic: '⚡',
      professional: '💼',
      playful: '🎉'
    };
    return vibeEmojis[vibe] || '📷';
  };

  const getQualityColor = (quality) => {
    const colors = {
      excellent: '#4CAF50',
      good: '#8BC34A',
      average: '#FFC107',
      poor: '#FF5722'
    };
    return colors[quality] || '#9E9E9E';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" aria-label="Loading"></div>
        Loading posts...
      </div>
    );
  }

  const displayPosts = showAll ? posts : posts.slice(0, 10);

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
        <h3>No posts found</h3>
        <p>This influencer hasn't posted any content yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#333' }}>📷 Recent Posts ({posts.length})</h2>
        {posts.length > 10 && (
          <button className="btn btn-primary" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : 'Show All Posts'}
          </button>
        )}
      </div>

      <div className="posts-grid">
        {displayPosts.map((post) => {
          const analysis = post.analysis || {};
          const quality = analysis.quality || {};

          return (
            <div key={post._id} className="post-card">
              <img src={post.imageUrl || '/default-post.png'} alt="Post" className="post-image" />
              <div className="post-content">
                <p className="post-caption">
                  {post.caption?.length > 150 ? `${post.caption.substring(0, 150)}...` : post.caption || 'No caption'}
                </p>

                <div className="post-stats">
                  <span>❤️ {formatNumber(post.likes)}</span>
                  <span>💬 {formatNumber(post.comments)}</span>
                  <span>👁️ {formatNumber(post.views)}</span>
                  <span>📅 {formatDate(post.postDate)}</span>
                </div>

                {/* Analysis Section */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{getVibeEmoji(analysis.vibe)}</span>
                    <span style={{ textTransform: 'capitalize', color: '#667eea', fontWeight: '600' }}>
                      {analysis.vibe || 'Unknown'}
                    </span>
                  </div>

                  {/* Quality Indicators */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      <span>💡 Lighting:</span>
                      <span style={{ color: getQualityColor(quality.lighting), fontWeight: '600', textTransform: 'capitalize' }}>
                        {quality.lighting || 'N/A'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      <span>⭐ Visual Appeal:</span>
                      <span style={{ color: '#667eea', fontWeight: '600' }}>{quality.visualAppeal || 'N/A'}/10</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <span>🎯 Consistency:</span>
                      <span style={{ color: '#764ba2', fontWeight: '600', textTransform: 'capitalize' }}>
                        {quality.consistency || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Keywords */}
                  {analysis.keywords?.length > 0 && (
                    <div className="post-tags">
                      {analysis.keywords.slice(0, 4).map((keyword, index) => (
                        <span key={index} className="tag">{keyword}</span>
                      ))}
                    </div>
                  )}

                  {/* Engagement Rate */}
                  <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Engagement:</span>
                      <span style={{ fontWeight: '600', color: '#667eea' }}>{formatNumber((post.likes || 0) + (post.comments || 0))}</span>
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

export default Posts;
