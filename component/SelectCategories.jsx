import quizData from "../data/questions.json";
import "../css/selectCategories.css";

export default function SelectCategories() {
    var categories = [];
    quizData.quizzes.forEach((question) => {
        if (!categories.includes(question.category)) {
            categories.push(question.category);
        }
    });

    return (
        <div className="category-selection">
            <h2>Sélectionnez une catégorie</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category}>
                        <button className="category-item" id={category} onClick={() => console.log(category)}>
                            {category}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
  
}
