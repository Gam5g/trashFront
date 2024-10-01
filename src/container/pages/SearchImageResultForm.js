import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchImageResultForm.css";

const translations = {
  paper: "종이",
  can: "캔",
  pet: "페트병",
  plastic: "플라스틱",
  styrofoam: "스티로폼",
  plastic_bag: "비닐",
  glass: "유리",
  battery: "배터리",
  f_lamp: "형광등",
};

const SearchImageResultForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result } = location.state || {};
  const [res, setRes] = useState([]);

  useEffect(() => {
    if (result) {
      setRes(result);
    }
  }, [result]);

  return (
    <div className="NotDrag">
      {result.length > 0 && (
        <>
          <h1 className="image-result-title">
            사진으로 나온 결과는 다음과 같습니다.
          </h1>
          {res.map((item, index) => (
            <div key={index} className="image-result-list">
              <h2>{translations[item.name] || item.name}</h2>
              <h4>확률 {(item.confidence * 100).toFixed(2)} %</h4>
            </div>
          ))}
          <div>
            <p>{translations[result[0].name] || result[0].name} 버리는 방법</p>
            <img
              src={result[0].imageUrl}
              alt={result[0].name}
              className="image-result-rule"
            />
          </div>
        </>
      )}
      <br />
      <div>
        <div />
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          {result.length > 0 ? (
            <h1>결과가 마음에 안 든다면?</h1>
          ) : (
            <>
              <img
                src={"../../../images/sad.jpg"}
                style={{ width: "500px" }}
                alt="없음"
              />
              <h1>죄송합니다. 해당 항목에 나온 결과가 없습니다.</h1>
            </>
          )}
        </div>
        <button
          className="white-button"
          style={{ marginLeft: "25px", width: "500px", marginBottom: "20px" }}
          onClick={() => navigate(`/community-bunri/write`)}
        >
          분리수거 게시판에 글 쓰러 가기
        </button>
      </div>
    </div>
  );
};

export default SearchImageResultForm;
