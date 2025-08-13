import { useState, useEffect } from 'react';
import logo from "../icons/logo.png";
import "../css/daily.css";
import InfoModal from './modal/InfoModal';
import ProblemModal from './modal/ProblemModal';
import { Question } from './Questions';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null); 
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemQuestion, setProblemQuestion] = useState(null);
  const [problemId, setProblemId] = useState(null);

useEffect(() => {
  fetch(`/cogito/data/dailyQuestions.json`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur lors du chargement du fichier: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      const keys = ['id', 'question', 'answer', 'badAnswers', 'category', 'difficulty', 'description'];
      const rows = data.map(q => [
        q.id,
        q.question,
        q.answer,
        q.badAnswers,
        q.category,
        q.difficulty,
        q.description
      ]);
      setKeys(keys);
      setQuestions(rows);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  const handleShowInfo = (description) => {
    setSelectedInfo(description); 
    setShowInfoModal(true);
  };

  const handleShowProblem = (row) => {
    setProblemQuestion(row[keys.indexOf('question')] || '');
    setProblemId(row[keys.indexOf('id')] || '');
    setShowProblemModal(true);
  };

  return (
    <>
      <div className="daily">
        <img src={logo} alt="Logo Cogito" className="logo" />
        {questions.map((row, idx) => (
          <Question
            key={idx}
            row={row}
            keys={keys}
            onShowInfo={handleShowInfo}
            onShowProblem={() => handleShowProblem(row, idx)}
          />
        ))}
      </div>
      {showInfoModal && (
        <InfoModal
          onClose={() => setShowInfoModal(false)}
          description={selectedInfo}
        />
      )}
      {showProblemModal && (
        <ProblemModal
          onClose={() => setShowProblemModal(false)}
          onSubmit={() => setShowProblemModal(false)}
          question={problemQuestion}
          id={problemId}
        />
      )}
    </>
  );
}
