import React, { useEffect } from "react";
import quizData from "../public/data/questions.json";
import "../css/selectCategories.css";

export const selectedCategories = [];

function isCategorySelected(category) {
  return selectedCategories.includes(category);
}

function toggleCategory(category, setSelected) {
  const index = selectedCategories.indexOf(category);
  if (index > -1) {
    selectedCategories.splice(index, 1);
  } else {
    selectedCategories.push(category);
  }
  setSelected(isCategorySelected(category)); 
}

function CategoryButton({ category }) {
  const [selected, setSelected] = React.useState(isCategorySelected(category));

  return (
    <button
      className={`category-item ${selected ? "selected" : ""}`}
      id={category}
      onClick={() => toggleCategory(category, setSelected)}
    >
      {category}
    </button>
  );
}

export default function SelectCategories() {
  useEffect(() => {
    return () => {
      selectedCategories.length = 0;
    };
  }, []);

  const categories = Array.from(
    new Set(quizData.quizzes.map((q) => q.category))
  );

  return (
    <div className="category-selection">
      <h2>Faites votre choix</h2>
      {categories.map((category) => (
        <CategoryButton key={category} category={category} />
      ))}
    </div>
  );
}
