const { useState, useEffect } = React;

async function importerDepuisSheetPublic() {
  const sheetId = "16beridTdl2qTluwURv2cYY-l0Tg40jU7NLWC127jFdg";
  const originalUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1`;
  const finalUrl = "https://corsproxy.io/?" + encodeURIComponent(originalUrl);

  try {
    const response = await fetch(finalUrl);
    const texte = await response.text();

    const json = JSON.parse(texte.substring(47).slice(0, -2));
    const object = json.table.rows;

    const keys = [];
    const rows = [];

    const firstRow = object[0].c;
    for (let i = 0; i < firstRow.length; i++) {
      keys.push(firstRow[i] ? firstRow[i].v : '');
    }

    for (let j = 1; j < object.length; j++) {
      const row = object[j].c;
      const values = [];
      for (let k = 0; k < keys.length; k++) {
        const cell = row[k];
        values.push(cell ? cell.v : '');
      }
      rows.push(values);
    }

    return {
      keys,
      rows
    };
  } catch (err) {
    throw new Error("Erreur de chargement : " + err.message);
  }
}

function Question({ row, keys }) {
  const [message, setMessage] = React.useState(null);
  const [shuffledReponses, setShuffledReponses] = React.useState([]);
  const [answered, setAnswered] = React.useState(false); 

  const type = row[keys.indexOf("type")];
  const bonne = row[keys.indexOf("bonne_reponse")];
  const mauvaisesString = row[keys.indexOf("mauvaise_reponse")];
  const mauvaises = mauvaisesString ? mauvaisesString.split(",") : [];

  React.useEffect(() => {
    if (type === "Choix multiples") {
      const all = [...mauvaises, bonne];
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      setShuffledReponses(all);
    } else if (type === "Vrai ou Faux") {
      setShuffledReponses(["Vrai", "Faux"]);
    } else {
      setShuffledReponses([]);
    }
    setAnswered(false); 
    setMessage(null);
  }, [type, bonne, mauvaisesString]);

  const questionElements = [];

  for (let cellIdx = 0; cellIdx < row.length; cellIdx++) {
    const key = keys[cellIdx];
    const value = row[cellIdx];
    if (key === "bonne_reponse" || key === "mauvaise_reponse") continue;

    questionElements.push(
      React.createElement("div", {
        key: cellIdx,
        className: key || "",
        dangerouslySetInnerHTML: { __html: value },
      })
    );
  }

  if (type === "Choix multiples" || type === "Vrai ou Faux") {
    questionElements.push(
      React.createElement(
        "div",
        { className: "reponses", key: "reponses" },
        shuffledReponses.map((rep, i) =>
          React.createElement("button", {
            key: i,
            className: "reponse",
            dangerouslySetInnerHTML: { __html: rep },
            disabled: answered,           
            onClick: () => {
              if (!answered) {
                setMessage(rep === bonne ? "Bonne réponse !" : "Mauvaise réponse !");
                setAnswered(true);       
              }
            },
          })
        ),
        message && React.createElement("div", { className: "message" }, message)
      )
    );
  }

  return React.createElement("div", { className: "question" }, questionElements);
}



function App() {
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

  if (loading) return React.createElement("div", null, "Chargement...");
  if (error) return React.createElement("div", null, `Erreur : ${error}`);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("div", null,
      React.createElement("h1", null, "Cogito Quiz"),
      questions.map((row, idx) =>
        React.createElement(Question, { key: idx, row, keys })
      )
    ),
    React.createElement("button", {
      className: "help-fab",
      onClick: () => setShowHelp(true),
      "aria-label": "Aide"
    }, "?"),
    showHelp && React.createElement(React.Fragment, null,
      React.createElement("div", {
        className: "help-overlay",
        onClick: () => setShowHelp(false)
      }),
      React.createElement("div", { className: "help-modal" },
        React.createElement("button", {
          className: "help-close",
          onClick: () => setShowHelp(false),
          "aria-label": "Fermer l'aide"
        }, "×"),
        React.createElement("div", { className: "help-content" },
          "Bienvenue dans la bêta test de Cogito Quiz !",
          React.createElement("br"),
          "Ceci n'est que le début ! N'hésites pas à me faire part de tes retours !",
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
