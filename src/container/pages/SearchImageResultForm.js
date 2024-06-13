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
      <h1>사진으로 나온 결과는 다음과 같습니다.</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default SearchImageResultForm;
