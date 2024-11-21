import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import AuthToken from "../container/pages/AuthToken";
import "./CompareForm.css";
import "../container/pages/Search.css";

const CompareForm = ({
  wasteId,
  nickName,
  solutionName,
  imageUrl,
  categories,
  tags,
  solution,
  state,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [originList, setOriginList] = useState({
    writerName: nickName,
    name: solutionName,
    categories: categories,
    tags: tags,
    solution: solution,
    wikiState: state,
  });
  const [modifiedList, setModifiedList] = useState({
    categories: [...categories],
    tags: [...tags],
    solution: solution,
  });
  const [charCount, setCharCount] = useState(solution.length);
  const maxChars = 300;
  const [showDiff, setShowDiff] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인 한 후에 글을 작성할 수 있습니다.");
      navigate("/sign-in");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthToken.get(`/solution/${wasteId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data;
        setOriginList({
          writerName: data.origin.writerName,
          name: data.origin.name,
          categories: data.origin.categories,
          tags: data.origin.tags,
          solution: data.origin.solution,
          wikiState: data.origin.wikiState,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [accessToken, wasteId]);

  useEffect(() => {
    setModifiedList((prev) => ({
      ...prev,
      categories: originList.categories,
      tags: originList.tags,
      solution: originList.solution,
    }));
  }, [originList]);

  const handleCategoryChange = (e) => {
    const { checked, value } = e.target;
    setModifiedList((prev) => {
      const categories = checked
        ? [...prev.categories, value]
        : prev.categories.filter((category) => category !== value);
      return { ...prev, categories };
    });
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setModifiedList((prev) => ({ ...prev, [name]: value }));
    setCharCount(value.length);
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setModifiedList((prev) => ({ ...prev, tags: tagsArray }));
  };

  const navigateToHome = () => {
    navigate(`/`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modifiedList.categories.length === 0) {
      alert("적어도 하나의 재질을 선택해야 합니다.");
      return;
    }

    if (modifiedList.tags.length === 0) {
      alert("적어도 하나의 태그를 입력해야 합니다.");
      return;
    }

    if (!modifiedList.solution.trim()) {
      alert("배출 방법을 입력해야 합니다.");
      return;
    }
    if (window.confirm("해당 항목에 대한 수정을 요청하시겠습니까?")) {
      setShowDiff(true);
      const formData = new FormData();
      formData.append("categories", modifiedList.categories.join(","));
      formData.append("solution", modifiedList.solution);
      formData.append("tags", modifiedList.tags.join(","));
      try {
        await AuthToken.post(`/solution/${wasteId}/wiki`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("제출되었습니다. 감사합니다!");
        navigate(`/`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="button-container" style={{ userSelect: "none" }}>
      <div>
        <div className="origin-title">원본</div>
        <div className="origin-container">
          <h6 className="compare-title">{originList.name}</h6>
          <img
            src={imageUrl}
            style={{ width: "200px", height: "200px", marginTop: "20px" }}
            alt="solution"
          />
          <h3 className="compare-font">재질</h3>
          <h3 className="compare-content">
            {originList.categories.join(", ")}
          </h3>
          <h3 className="compare-font">태그</h3>
          <h3 className="compare-content">{originList.tags.join(", ")}</h3>
          <h3 className="compare-font">배출요령</h3>
          <h3 className="compare-content">{originList.solution}</h3>
        </div>
      </div>
      <div>
        <div className="modified-title">수정</div>
        <form onSubmit={handleSubmit} className={"modified-container"}>
          <h6 className="compare-title">{originList.name}</h6>
          <div style={{ width: "95%" }}>
            <h3 className="compare-font">재질</h3>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                paddingLeft: "30px",
              }}
            >
              {[
                "일반쓰레기",
                "종이류",
                "유리",
                "플라스틱",
                "캔류",
                "비닐류",
                "스티로폼",
                "폐유",
                "폐가전",
                "폐건전지",
                "재활용 어려움",
              ].map((category) => (
                <label key={category} className="custom-checkbox">
                  <input
                    type="checkbox"
                    className="category-checkbox"
                    name="category"
                    value={category}
                    checked={modifiedList.categories.includes(category)}
                    onChange={handleCategoryChange}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    className="checkbox-mark"
                  >
                    <path
                      d="M2 4.85716L5.85 10L14 1"
                      stroke="white"
                      stroke-width="3"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {category}
                </label>
              ))}
            </div>
            <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
          </div>
          <div style={{ width: "95%" }}>
            <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
            <h3 className="compare-font">태그</h3>
            {originList && (
              <h5 className="compare-default-text">
                {originList.tags.join(", ")}
              </h5>
            )}
            <div className="compare-input-wrap">
              <input
                className="compare-input"
                type="text"
                name="tags"
                placeholder="태그를 입력하세요 (쉼표로 구분)"
                onChange={handleTagsChange}
                value={modifiedList.tags.join(", ")}
              />
            </div>
            <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
          </div>
          <div style={{ width: "95%" }}>
            <hr style={{ border: "0.2px solid #ccc", margin: "20px 0" }} />
            <h3 className="compare-font">배출요령</h3>
            <div>
              {originList && (
                <h5 className="compare-default-text">{originList.solution}</h5>
              )}
            </div>
            <div>
              <textarea
                type="text"
                className="compare-input"
                name="solution"
                placeholder="솔루션을 입력하세요"
                value={modifiedList.solution}
                onChange={handleTextareaChange}
                maxLength={maxChars}
              />
              <div className="char-count">
                {charCount}/{maxChars} 글자
              </div>
            </div>
            <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
          </div>
        </form>

        <div className="button-container">
          <button
            type="submit"
            onClick={handleSubmit}
            className="update-request-button"
          >
            수정 요청하기
          </button>
          <button className="update-cancel-button" onClick={navigateToHome}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareForm;
