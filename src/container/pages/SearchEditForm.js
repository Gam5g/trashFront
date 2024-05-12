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

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인 한 후에 글을 작성할 수 있습니다.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

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
  return (
    <div>
      <h1>{query}의 배출요령을 편집하세요</h1>
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
          title="클릭 시 관리자의 승인을 거친 다음 홈페이지에 반영됩니다"
        >
          제출
        </button>
      </div>
    </div>
  );
};

export default SearchEditForm;
