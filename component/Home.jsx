import React from 'react';
import homeIcon from '../icons/home.png';
import '../css/home.css';

export default function Home({ onHomeClick }) {
  return (
    <div className="home-bar">
      <button onClick={onHomeClick} className="home-button" style={{ background: 'none', border: 'none' }}>
        <img src={homeIcon} alt="Accueil" />
      </button>
    </div>
  );
}