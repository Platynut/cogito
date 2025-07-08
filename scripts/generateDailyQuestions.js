const fs = require('fs');
const path = require('path');
const questions = require('../data/questions.json');
const dailyQuestionsPath = path.join(__dirname, '../data/dailyQuestions.json');
let currentDaily = [];

if (fs.existsSync(dailyQuestionsPath)) {
  try {
    currentDaily = JSON.parse(fs.readFileSync(dailyQuestionsPath, 'utf8'));
  } catch (e) {
    currentDaily = [];
  }
}

function isAlreadyInDaily(q) {
  return currentDaily.some(dq => dq.description === q.description);
}

function loadDailyQuestions() {
  const dailyQuestion = [];
  const usedIndexes = new Set();
  while (dailyQuestion.length < 10 && usedIndexes.size < questions.quizzes.length) {
    const index = Math.floor(Math.random() * questions.quizzes.length);
    const candidate = questions.quizzes[index];
    if (!usedIndexes.has(index) && !isAlreadyInDaily(candidate)) {
      dailyQuestion.push(candidate);
      usedIndexes.add(index);
    }
  }
  return dailyQuestion;
}

const daily = loadDailyQuestions();
fs.writeFileSync(dailyQuestionsPath, JSON.stringify(daily, null, 2), 'utf8');
