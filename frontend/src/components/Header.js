import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          📊 InfluencerHub
        </Link>
        <nav>
          <Link to="/" className="btn btn-primary">
            All Influencers
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;