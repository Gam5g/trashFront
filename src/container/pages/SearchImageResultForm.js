import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const SearchImageResultForm = () => {
  const location = useLocation();
  const { result } = location.state || {};
  const [res, setRes] = useState({
    name: result.name,
    confidence: result.confidence,
  });

  if (!result) {
    return <div>No result data available</div>;
  }

  return (
    <div>
      <h1>{res.name}으로 추정됩니다.</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default SearchImageResultForm;
