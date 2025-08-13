import { useState } from "react";
import solo from "../icons/solo.png";
import "../css/solo.css";
import SelectCategories from "./SelectCategories";
import { generateCustomQuestions } from "../scripts/generateCustomQuestions";
import InfoModal from './modal/InfoModal';
import ProblemModal from './modal/ProblemModal';
import { Question } from './Questions';

export default function Solo() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [keys, setKeys] = useState(['id', 'question', 'answer', 'badAnswers', 'category', 'difficulty', 'description']);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemQuestion, setProblemQuestion] = useState(null);
  const [problemId, setProblemId] = useState(null);

  const handleStart = () => {
    const generatedQuestions = generateCustomQuestions();
    if (generatedQuestions.length === 0) {
      return;
    }
    setQuestions(generatedQuestions.map(q => [
      q.id,
      q.question,
      q.answer,
      q.badAnswers,
      q.category,
      q.difficulty,
      q.description
    ]));
    setStarted(true);
  };

  const handleShowInfo = (description) => {
    setSelectedInfo(description);
    setShowInfoModal(true);
  };

  const handleShowProblem = (row) => {
    setProblemQuestion(row[keys.indexOf('question')] || '');
    setProblemId(row[keys.indexOf('id')] || '');
    setShowProblemModal(true);
  };

  if (!started) {
    return (
      <div className="solo-page">
        <img src={solo} alt="Mode Solo" className="logo" />
        <SelectCategories />
        <button className="solo-btn" onClick={handleStart}>
          Commencer le mode Solo
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="solo-questions">
        <img src={solo} alt="Logo Cogito" className="logo" />
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