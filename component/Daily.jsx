import React, { useState, useEffect } from 'react';
import logo from "../icons/logo.png";
import "../css/daily.css";
import InfoModal from './InfoModal';
import ProblemModal from './ProblemModal';

function Question({ row, keys, onShowInfo, onShowProblem }) {
  const [message, setMessage] = useState(null);
  const [shuffledReponses, setShuffledReponses] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [clickedIdx, setClickedIdx] = useState(null);
  const [infoButton, setInfoButton] = useState(false);

  const bonne = row[keys.indexOf("answer")];
  const mauvaises = row[keys.indexOf("badAnswers")] || [];
  const infos = row[keys.indexOf("description")];
  const difficulte = (row[keys.indexOf("difficulty")] || '').toLowerCase();

  const diffClass =
    difficulte === 'facile' ? 'difficulte-facile' :
    difficulte === 'normal' ? 'difficulte-normal' :
    difficulte === 'difficile' ? 'difficulte-difficile' : '';

   const displayOrder = ["difficulty", "category", "question"];
    
  useEffect(() => {
    const all = [...mauvaises, bonne].filter(Boolean);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    setShuffledReponses(all);
    setAnswered(false);
    setMessage(null);
    setClickedIdx(null);
  }, [bonne, mauvaises]);

  return (
    <div className="question">
      {displayOrder.map((key) => {
        const idx = keys.indexOf(key);
        if (idx === -1) return null;
        const value = row[idx];

        switch (key) {
          case "difficulty":
            return <div key={idx} className={`difficulte ${diffClass}`} dangerouslySetInnerHTML={{ __html: value }} />;
          case "category":
            return <div key={idx} className="category" dangerouslySetInnerHTML={{ __html: (value || '').replace(/_/g, ' ').toUpperCase() }} />;
          case "question":
            return <div key={key} className="question" dangerouslySetInnerHTML={{ __html: value || '' }} />;
          default:
            return null;
        }
      })}

      {shuffledReponses.length > 0 && (
        <div className="reponses">
          {shuffledReponses.map((rep, i) => {
            let btnClass = "reponse";
            if (answered) {
              if (rep === bonne) btnClass += " reponse-bonne";
              else if (i === clickedIdx) btnClass += " reponse-mauvaise";
            }
            return (
              <button
                key={i}
                className={btnClass}
                disabled={answered}
                dangerouslySetInnerHTML={{ __html: rep }}
                onClick={() => {
                  if (!answered) {
                    setMessage(rep === bonne ? "Bonne réponse !" : "Mauvaise réponse !");
                    setAnswered(true);
                    setClickedIdx(i);
                    setInfoButton(true);
                  }
                }}
              />
            );
          })}
          {message && <div className="message">{message}</div>}
          {infoButton && (
            <button 
              className="more-info"
              onClick={() => onShowInfo(infos)} 
              aria-label="En savoir plus"
            >
              En savoir plus
            </button>
          )}
          {infoButton && (
            <button className="more-info" onClick={onShowProblem} aria-label="Un problème ?">
              Un problème ?
            </button>
          )}
        </div>
      )}
    </div>
  );
}

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
  fetch("/cogito/data/dailyQuestions.json")
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
        <img src={logo} alt="Logo Cogito" className="daily-logo" />
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
