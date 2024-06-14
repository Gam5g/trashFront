import React from "react";
import { useLocation } from "react-router-dom";
import SolutionList from "../../components/SolutionList";
import "./Categories.css";

const CategoriesSolutionList = () => {
  const location = useLocation();
  const data = location.state?.data || [];

  return (
    <div className="categories-solution-list">
      <h1>Category Solutions</h1>
      {data.length > 0 ? <SolutionList /> : <p>No data available</p>}
    </div>
  );
};

export default CategoriesSolutionList;
