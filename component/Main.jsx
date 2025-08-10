import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Acceuil from './Acceuil.jsx';
import App from './Daily.jsx';
import Help from './Help.jsx';
import Home from './Home.jsx';
import Solo from './Solo.jsx';
import Profile from './Profile.jsx';

function Main() {
  const [page, setPage] = useState('acceuil');
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      {page === 'acceuil' && (
        <Acceuil
          onQuizDuJour={() => setPage('quiz')}
          onSolo={() => setPage('solo')}
          onProfile={() => setPage('profile')}
        />
      )}
      {page === 'quiz' && <App />}
      {page === 'solo' && <Solo />}
      {page === 'profile' && <Profile />}
      {page === "register" && (
        <Register onLogin={() => setPage("login")} />
      )}
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
