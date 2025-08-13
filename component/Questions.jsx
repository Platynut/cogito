import { useState, useEffect } from "react";

export function Question({ row, keys, onShowInfo, onShowProblem }) {
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
            <button className="more-info" onClick={() => onShowProblem(row)} aria-label="Un problème ?">
                Un problème ?
            </button>
          )}
        </div>
      )}
    </div>
  );
}