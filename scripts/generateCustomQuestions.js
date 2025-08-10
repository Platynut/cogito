import { selectedCategories } from "../component/SelectCategories";
import quizData from "../public/data/questions.json";

export function generateCustomQuestions() {
    const nb_questions = 10;

    if (selectedCategories.length === 0) {
    window.alert("Veuillez sélectionner au moins une catégorie.");
    return [];
    }

    const filteredQuestions = quizData.quizzes.filter((quiz) =>
        selectedCategories.includes(quiz.category)
    );

    for (let i = filteredQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
    }

  return filteredQuestions.slice(0, nb_questions);
}