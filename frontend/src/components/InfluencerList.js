import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const InfluencerList = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInfluencers = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/influencers`);
      setInfluencers(response.data || []);
    } catch (error) {
      console.error('Error fetching influencers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading influencers...</div>;

  return (
    <div>
      <div className="card">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Featured Influencers</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem' }}>Discover top influencers and their engagement analytics</p>
        <div className="posts-grid">
          {influencers.length > 0 ? influencers.map((influencer) => (
            <div key={influencer._id} className="post-card">
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <img src={influencer.profilePicture || '/default-avatar.png'} alt={influencer.name} className="profile-picture" style={{ width: '100px', height: '100px', marginBottom: '1rem', borderRadius: '50%' }} />
                <h2 style={{ marginBottom: '0.5rem', color: '#333' }}>
                  {influencer.name}{influencer.verified && <span style={{ color: '#667eea', marginLeft: '0.5rem' }}>✓</span>}
                </h2>
                <p className="username">@{influencer.username}</p>
                <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {influencer.bio ? influencer.bio.substring(0, 100) + '...' : 'No bio available'}
                </p>

                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <div className="stat-item" style={{ padding: '0.8rem' }}>
                    <div className="stat-number" style={{ fontSize: '1.2rem' }}>{formatNumber(influencer.followers)}</div>
                    <div className="stat-label" style={{ fontSize: '0.8rem' }}>Followers</div>
                  </div>
                  <div className="stat-item" style={{ padding: '0.8rem' }}>
                    <div className="stat-number" style={{ fontSize: '1.2rem' }}>{formatNumber(influencer.postsCount)}</div>
                    <div className="stat-label" style={{ fontSize: '0.8rem' }}>Posts</div>
                  </div>
                  <div className="stat-item" style={{ padding: '0.8rem' }}>
                    <div className="stat-number" style={{ fontSize: '1.2rem' }}>{influencer.engagement?.engagementRate || 0}%</div>
                    <div className="stat-label" style={{ fontSize: '0.8rem' }}>Engagement</div>
                  </div>
                </div>

                <div className="post-tags">
                  <span className="tag">{influencer.category || 'General'}</span>
                </div>

                <Link to={`/influencer/${influencer.username}`} className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>View Profile</Link>
              </div>
            </div>
          )) : <p style={{ textAlign: 'center', color: '#666' }}>No influencers found.</p>}
        </div>
      </div>
    </div>
  );
};

export default InfluencerList;





