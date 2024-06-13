import React from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css"; // Import the CSS file

const CategoriesList = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "일반쓰레기", path: "/general-waste" },
    { name: "종이", path: "/paper" },
    { name: "비닐", path: "/vinyl" },
    { name: "유리", path: "/glass" },
    { name: "플라스틱", path: "/plastic" },
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="categories-container">
      {categories.map((category) => (
        <button
          key={category.name}
          className="category-button"
          onClick={() => handleCategoryClick(category.path)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoriesList;
