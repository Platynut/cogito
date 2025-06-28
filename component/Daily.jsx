import React, { useState, useEffect } from 'react';

async function importerDepuisSheetPublic() {
  const sheetId = "16beridTdl2qTluwURv2cYY-l0Tg40jU7NLWC127jFdg";
  const originalUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1`;
  const finalUrl = "https://corsproxy.io/?" + encodeURIComponent(originalUrl);

  try {
    const response = await fetch(finalUrl);
    const texte = await response.text();

    const json = JSON.parse(texte.substring(47).slice(0, -2));
    const object = json.table.rows;

    const rawKeys = json.table.cols.map(col => col.label);
    const keys = rawKeys.map(label => label.split(" ")[0]);
    const rows = [];

    for (let j = 0; j < object.length; j++) {
      const row = object[j].c;
      const values = [];
      for (let k = 0; k < keys.length; k++) {
        const cell = row[k];
        values.push(cell ? cell.v : '');
      }
      rows.push(values);
    }

    return { keys, rows };
  } catch (err) {
    throw new Error("Erreur de chargement : " + err.message);
  }
}

function Question({ row, keys }) {
  const [message, setMessage] = useState(null);
  const [shuffledReponses, setShuffledReponses] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [clickedIdx, setClickedIdx] = useState(null);

  const bonne = row[keys.indexOf("bonne_reponse")];
  const mauvaisesString = row[keys.indexOf("mauvaise_reponse")];
  const mauvaises = mauvaisesString ? mauvaisesString.split("|||") : [];

  const difficulteIdx = keys.indexOf("difficulte");
  const difficulte = difficulteIdx !== -1 ? (row[difficulteIdx] || '').toLowerCase() : '';
  const diffClass =
    difficulte === 'facile' ? 'difficulte-facile' :
    difficulte === 'normal' ? 'difficulte-normal' :
    difficulte === 'difficile' ? 'difficulte-difficile' : '';

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
  }, [bonne, mauvaisesString]);

  return (
    <div className="question">
      {row.map((value, idx) => {
        const key = keys[idx];
        if (key === "bonne_reponse" || key === "mauvaise_reponse") return null;

        if (key === "difficulte") {
          return <div key={idx} className={`difficulte ${diffClass}`} dangerouslySetInnerHTML={{ __html: value }} />;
        }

        if (key === "category") {
          const formatted = value.replace(/_/g, " ").toUpperCase();
          return <div key={idx} className="category" dangerouslySetInnerHTML={{ __html: formatted }} />;
        }

        return <div key={idx} className={key || ""} dangerouslySetInnerHTML={{ __html: value }} />;
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
                  }
                }}
              />
            );
          })}
          {message && <div className="message">{message}</div>}
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
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    importerDepuisSheetPublic()
      .then(({ keys, rows }) => {
        setKeys(keys);
        setQuestions(rows);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <>
      <div>
        <h1>Cogito Quiz</h1>
        {questions.map((row, idx) => (
          <Question key={idx} row={row} keys={keys} />
        ))}
      </div>

      <button
        className="help-fab"
        onClick={() => setShowHelp(true)}
        aria-label="Aide"
      >
        ?
      </button>

      {showHelp && (
        <>
          <div className="help-overlay" onClick={() => setShowHelp(false)} />
          <div className="help-modal">
            <button
              className="help-close"
              onClick={() => setShowHelp(false)}
              aria-label="Fermer l'aide"
            >
              ×
            </button>
            <div className="help-content">
              Bienvenue dans la bêta test de Cogito Quiz !
              <br />
              Ceci n'est que le début ! N'hésites pas à me faire part de tes retours !
            </div>
          </div>
        </>
      )}
    </>
  );
}
