import React from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";
const Card = ({ imageUrl, title, id }) => {
  const navigate = useNavigate();

  const navigateToSolution = (id) => {
    navigate(`solution/detail/${id}`);
  };

  return (
    <div className="card" onClick={() => navigateToSolution(id)}>
      <img
        src={imageUrl ? imageUrl : "https://via.placeholder.com/200"}
        alt={title}
        className="card-images"
      />
      <div className="card-body">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default Card;
