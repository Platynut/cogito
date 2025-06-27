const { useState, useEffect } = React;

async function importerDepuisSheetPublic() {
  const sheetId = "16beridTdl2qTluwURv2cYY-l0Tg40jU7NLWC127jFdg";
  const originalUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
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
    console.log("Clés :", keys);
    console.log("Lignes :", rows);

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

  const bonne = row[keys.indexOf("bonne_reponse")];
  const mauvaisesString = row[keys.indexOf("mauvaise_reponse")];
  const mauvaises = mauvaisesString ? mauvaisesString.split(",") : [];

  React.useEffect(() => {
    const all = [...mauvaises, bonne].filter(Boolean);
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    setShuffledReponses(all);
    setAnswered(false);
    setMessage(null);
  }, [bonne, mauvaisesString]);

 return React.createElement(
  "div",
  { className: "question" },
  row.map((value, idx) => {
    const key = keys[idx];
    if (key === "bonne_reponse" || key === "mauvaise_reponse") return null;
    return React.createElement("div", {
      key: idx,
      className: key || "",
      dangerouslySetInnerHTML: { __html: value }
    });
  }),
  shuffledReponses.length > 0 &&
    React.createElement(
      "div",
      { className: "reponses" },
      shuffledReponses.map((rep, i) =>
        React.createElement("button", {
          key: i,
          className: "reponse",
          disabled: answered,
          dangerouslySetInnerHTML: { __html: rep },
          onClick: () => {
            if (!answered) {
              setMessage(rep === bonne ? "Bonne réponse !" : "Mauvaise réponse !");
              setAnswered(true);
            }
          }
        })
      ),
      message && React.createElement("div", { className: "message" }, message)
    )
  );
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
          "Ceci n'est que le début ! N'hésites pas à me faire part de tes retours !"
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
