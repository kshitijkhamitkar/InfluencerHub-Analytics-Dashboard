import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Analytics from './Analytics';
import Posts from './Posts';
import Reels from './Reels';
import Demographics from './Demographics';

const BASE_URL = process.env.REACT_APP_API_URL;

const InfluencerProfile = () => {
  const { username } = useParams();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!username) return;
    const fetchInfluencer = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/influencers/username/${username}`);
        setInfluencer(response.data);
      } catch (error) {
        console.error('Error fetching influencer:', error);
        setInfluencer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencer();
  }, [username]);

  const formatNumber = (num) => {
    if (!num && num !== 0) return '-';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) return <div className="loading"><div className="spinner" aria-label="Loading"></div>Loading profile...</div>;
  if (!influencer) return <div className="card"><h1 style={{ textAlign: 'center', color: '#333' }}>Influencer not found</h1></div>;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <Analytics influencerId={influencer._id} />;
      case 'posts': return <Posts influencerId={influencer._id} />;
      case 'reels': return <Reels influencerId={influencer._id} />;
      case 'demographics': return <Demographics demographics={influencer.demographics || {}} />;
      default: return <Analytics influencerId={influencer._id} />;
    }
  };

  return (
    <div>
      {/* Profile Header */}
      <div className="card">
        <div className="profile-header">
          <img
            src={influencer.profilePicture || '/default-profile.png'}
            alt={influencer.name || 'Profile Picture'}
            className="profile-picture"
          />
          <div className="profile-info">
            <h1>{influencer.name || 'Unknown Name'}</h1>
            <p className="username">@{influencer.username || 'unknown'}</p>
            <p className="bio">{influencer.bio || 'No bio available.'}</p>
            {influencer.verified && <span className="verified-badge">✓ Verified</span>}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{formatNumber(influencer.followers)}</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{formatNumber(influencer.following)}</div>
            <div className="stat-label">Following</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{formatNumber(influencer.postsCount)}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{formatNumber(influencer.engagement?.averageLikes)}</div>
            <div className="stat-label">Avg Likes</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{formatNumber(influencer.engagement?.averageComments)}</div>
            <div className="stat-label">Avg Comments</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{influencer.engagement?.engagementRate ?? '-'}%</div>
            <div className="stat-label">Engagement Rate</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card">
        <div className="nav-tabs">
          {['overview', 'posts', 'reels', 'demographics'].map((tab) => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && '📊 Analytics Overview'}
              {tab === 'posts' && '📷 Posts'}
              {tab === 'reels' && '🎬 Reels'}
              {tab === 'demographics' && '👥 Demographics'}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default InfluencerProfile;












