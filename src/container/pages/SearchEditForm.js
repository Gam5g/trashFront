import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Trash } from "./trash";
import DiffViewer from "react-diff-viewer";

const SearchEditForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const searchResult = Trash.find((item) => item.name === query);
  const [rules, setRules] = useState(searchResult.rules);
  const [editedRules, setEditedRules] = useState(searchResult.rules);
  const [showDiff, setShowDiff] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인 한 후에 글을 작성할 수 있습니다.");
      navigate("/api/auth/sign-in");
    }
  }, [isLoggedIn, navigate]);

  const toggleIcon = () => {
    setIsExpanded(!isExpanded);
  };
  const handleRulesChange = (content) => {
    setEditedRules(content);
  };

  const modules = {
    toolbar: false,
  };

  const formats = [];
  const onSubmit = () => {
    setShowDiff(true);
  };
  // 클릭 시 checkbox들이 표현되는 형태 : 재질
  return (
    <div>
      <p style={{ fontSize: "45px", textAlign: "center" }}>{query}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <h3
          style={{
            color: "green",
            fontSize: "25px",
            margin: 0,
          }}
        >
          재질
        </h3>
        <button
          style={{ marginLeft: "5px" }}
          onClick={toggleIcon}
          className="nothing-button"
        >
          {isExpanded ? "▶" : "▼"}
        </button>
      </div>
      {isExpanded && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ marginRight: "20px" }}>
            <label>
              <input type="checkbox" /> 일반쓰레기
            </label>
            <br />
            <label>
              <input type="checkbox" /> 종이류
            </label>
            <br />
            <label>
              <input type="checkbox" /> 유리
            </label>
            <br />
            <label>
              <input type="checkbox" /> 플라스틱
            </label>
            <br />
            <label>
              <input type="checkbox" /> 무색페트
            </label>
            <br />
            <label>
              <input type="checkbox" /> 재활용 어려움
            </label>
            <br />
          </div>
        </div>
      )}
      <h3
        style={{
          textAlign: "center",
          color: "green",
          fontSize: "25px",
        }}
      >
        키워드
      </h3>
      <h3
        style={{
          textAlign: "center",
          color: "green",
          fontSize: "25px",
        }}
      >
        배출요령
      </h3>
      <ReactQuill
        value={editedRules}
        onChange={handleRulesChange}
        modules={modules}
        formats={formats}
      />
      <h3>기존 배출요령: {rules}</h3>
      <h3>변경 사항 비교:</h3>
      <DiffViewer
        oldValue={rules}
        newValue={editedRules}
        splitView={true}
        showDiffOnly={false}
      />
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <button
          onClick={onSubmit}
          style={{ padding: "10px 20px" }}
          className="white-button"
          title="클릭 시 관리자의 승인을 거친 다음 홈페이지에 반영됩니다"
        >
          제출
        </button>
      </div>
    </div>
  );
};

export default SearchEditForm;
