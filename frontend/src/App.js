import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header.js';
import InfluencerList from './components/InfluencerList.js';
import InfluencerProfile from './components/InfluencerProfile.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<InfluencerList />} />
            <Route path="/influencer/:username" element={<InfluencerProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 