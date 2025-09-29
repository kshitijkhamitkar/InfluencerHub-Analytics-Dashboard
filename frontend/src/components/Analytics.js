import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';



import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // ADD THIS LINE

const Analytics = ({ influencerId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [postsAnalytics, setPostsAnalytics] = useState(null);
  const [reelsAnalytics, setReelsAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Wrap fetchAnalytics in useCallback
  const fetchAnalytics = useCallback(async () => {
    try {
      const [generalResponse, postsResponse, reelsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/influencers/${influencerId}/analytics`), // ADD BASE_URL
        axios.get(`${BASE_URL}/api/posts/influencer/${influencerId}/analytics`), // ADD BASE_URL
        axios.get(`${BASE_URL}/api/reels/influencer/${influencerId}/analytics`), // ADD BASE_URL
      ]);

      setAnalytics(generalResponse.data);
      setPostsAnalytics(postsResponse.data);
      setReelsAnalytics(reelsResponse.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [influencerId]);

  // ✅ Add fetchAnalytics to dependency array
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading analytics...
      </div>
    );
  }

  // ------------------- Chart Data -------------------
  const engagementTrendData = {
    labels: postsAnalytics?.engagementTrend?.slice(0, 15).map((_, index) => `Post ${index + 1}`) || [],
    datasets: [
      {
        label: 'Likes',
        data: postsAnalytics?.engagementTrend?.slice(0, 15).map(item => item.likes) || [],
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Comments',
        data: postsAnalytics?.engagementTrend?.slice(0, 15).map(item => item.comments) || [],
        borderColor: 'rgb(118, 75, 162)',
        backgroundColor: 'rgba(118, 75, 162, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const vibeData = {
    labels: postsAnalytics?.vibeDistribution?.map(item => item.vibe) || [],
    datasets: [
      {
        data: postsAnalytics?.vibeDistribution?.map(item => item.count) || [],
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#f5576c',
          '#4facfe',
          '#00f2fe',
        ],
        borderWidth: 0,
      },
    ],
  };

  const keywordsData = {
    labels: postsAnalytics?.topKeywords?.slice(0, 8).map(item => item.keyword) || [],
    datasets: [
      {
        label: 'Frequency',
        data: postsAnalytics?.topKeywords?.slice(0, 8).map(item => item.count) || [],
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const reelsViewsData = {
    labels: reelsAnalytics?.viewsTrend?.slice(0, 10).map((_, index) => `Reel ${index + 1}`) || [],
    datasets: [
      {
        label: 'Views',
        data: reelsAnalytics?.viewsTrend?.slice(0, 10).map(item => item.views) || [],
        borderColor: 'rgb(245, 87, 108)',
        backgroundColor: 'rgba(245, 87, 108, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  // ------------------- Render -------------------
  return (
    <div>
      {/* Key Metrics Summary */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-item">
          <div className="stat-number">{analytics?.totalPosts || 0}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{analytics?.totalReels || 0}</div>
          <div className="stat-label">Total Reels</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{formatNumber(analytics?.averageLikes || 0)}</div>
          <div className="stat-label">Avg Likes</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{formatNumber(analytics?.averageComments || 0)}</div>
          <div className="stat-label">Avg Comments</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{analytics?.engagementRate || 0}%</div>
          <div className="stat-label">Engagement Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{formatNumber(reelsAnalytics?.totalViews || 0)}</div>
          <div className="stat-label">Total Reel Views</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="chart-container">
          <h3 className="chart-title">📈 Engagement Trend (Recent Posts)</h3>
          <Line data={engagementTrendData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">🎨 Content Vibe Distribution</h3>
          <Doughnut data={vibeData} options={doughnutOptions} />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">🔍 Top Content Keywords</h3>
          <Bar data={keywordsData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">🎬 Reels Views Trend</h3>
          <Line data={reelsViewsData} options={chartOptions} />
        </div>
      </div>

      {/* Content Analysis Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div className="demographic-card">
          <h3 className="demographic-title">📝 Top Post Keywords</h3>
          {postsAnalytics?.topKeywords?.slice(0, 5).map((item, index) => (
            <div key={index} className="demographic-item">
              <span>{item.keyword}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>{item.count}</span>
                <div className="demographic-bar">
                  <div 
                    className="demographic-fill" 
                    style={{ 
                      width: `${(item.count / (postsAnalytics?.topKeywords?.[0]?.count || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="demographic-card">
          <h3 className="demographic-title">🎬 Top Reel Tags</h3>
          {reelsAnalytics?.topTags?.slice(0, 5).map((item, index) => (
            <div key={index} className="demographic-item">
              <span>{item.tag}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>{item.count}</span>
                <div className="demographic-bar">
                  <div 
                    className="demographic-fill" 
                    style={{ 
                      width: `${(item.count / (reelsAnalytics?.topTags?.[0]?.count || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="demographic-card">
          <h3 className="demographic-title">⭐ Content Quality</h3>
          <div className="demographic-item">
            <span>Average Visual Appeal</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>
                {postsAnalytics?.averageQuality?.visualAppeal || 0}/10
              </span>
              <div className="demographic-bar">
                <div 
                  className="demographic-fill" 
                  style={{ width: `${((postsAnalytics?.averageQuality?.visualAppeal || 0) / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="demographic-item">
            <span>Total Posts</span>
            <span>{postsAnalytics?.totalPosts || 0}</span>
          </div>
          <div className="demographic-item">
            <span>Average Reel Views</span>
            <span>{formatNumber(reelsAnalytics?.averageViews || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
