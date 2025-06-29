import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Acceuil from './Acceuil.jsx';
import App from './Daily.jsx';
import Help from './Help.jsx';
import Home from './Home.jsx';

function Main() {
  const [page, setPage] = useState('acceuil');
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      {page === 'acceuil' && (
        <Acceuil
          onQuizDuJour={() => setPage('quiz')}
          onSolo={() => setPage('solo')}
        />
      )}
      {page === 'quiz' && <App />}
      {/* Ajoute ici la page solo si besoin */}
      <button
        className="help-fab"
        onClick={() => setShowHelp(true)}
        aria-label="Aide"
      >
        ?
      </button>
      {showHelp && <Help onClose={() => setShowHelp(false)} />}
      <Home onHomeClick={() => setPage('acceuil')} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
