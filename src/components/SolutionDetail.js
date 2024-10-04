import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AuthToken from "../container/pages/AuthToken";
import "./SolutionDetail.css";

const SolutionDetail = ({ type }) => {
  const navigate = useNavigate();
  const { wasteId } = useParams();
  const maxChars = 300;
  const [charCount, setCharCount] = useState(0);
  const [solutionList, setSolutionList] = useState({
    accountNickName: "",
    name: "",
    imageUrl: "",
    categories: [],
    tags: [],
    solution: "",
    state: "",
  });
  useEffect(() => {
    const fetchSolutionData = async () => {
      try {
        const response = await AuthToken.get(`/solution/${wasteId}`, {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        });
        const data = response.data;
        setSolutionList({
          accountNickName: data.accountNickName || "",
          name: data.name || "",
          imageUrl: data.imageUrl || "",
          categories: data.categories || [],
          tags: data.tags || [],
          solution: data.solution || "",
          state: data.state || "",
          createdDate: data.createdDate || "",
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchSolutionData();
  }, [wasteId]);

  const handleCategoryChange = (e) => {
    const { checked, value } = e.target;
    setSolutionList((prev) => {
      const categories = checked
        ? [...prev.categories, value]
        : prev.categories.filter((category) => category !== value);
      return { ...prev, categories };
    });
  };

  const navigateToAdminBack = () => {
    navigate(-1);
  };
  const navigateToBack = () => {
    navigate(-1);
  };
  const handleSubmit = async () => {
    if (solutionList.categories.length === 0) {
      alert("적어도 하나의 재질을 선택되어야 합니다.");
      return;
    }

    if (!solutionList.solution.trim()) {
      alert("배출 방법을 입력해야 합니다.");
      return;
    }

    if (solutionList.tags.length === 0) {
      alert("적어도 하나의 태그를 입력해야 합니다.");
      return;
    }
    if (window.confirm("정말로 생성 요청을 승인하시겠습니까?")) {
      try {
        await AuthToken.put(`/solution/${wasteId}/accepted`, null, {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        });
        alert("승인되었습니다.");
        navigateToAdminBack();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.config
        ) {
          if (error.response.data.config.cause === "SOLUTION_NOT_FOUND") {
            alert(error.response.data.config.message);
          } else {
            console.error(error);
          }
        } else {
          console.error(error);
        }
      }
    }
  };

  const handleRejectClick = async () => {
    if (window.confirm("정말로 생성 요청을 거절하시겠습니까?")) {
      try {
        await AuthToken.put(`/solution/${wasteId}/rejected`, null, {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        });
        alert("생성 거절되었습니다.");
        navigateToAdminBack();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.config
        ) {
          if (error.response.data.config.cause === "SOLUTION_NOT_FOUND") {
            alert(error.response.data.config.message);
          } else {
            console.error(error);
          }
        } else {
          console.error(error);
        }
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSolutionList((prev) => ({ ...prev, [name]: value }));
  };
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setSolutionList((prev) => ({ ...prev, [name]: value }));
    setCharCount(value.length);
  };
  const handleTagsChange = (e) => {
    const { value } = e.target;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setSolutionList((prev) => ({ ...prev, tags: tagsArray }));
  };
  return (
    <div className="soultion-detail-container">
      <div>
        <div className="solution-container">
          <div className="solution-info">
            <span className="nickname">{solutionList.accountNickName}</span>
          </div>
          <div className="solution-status">
            {solutionList.state === "ACCEPTED"
              ? "✔️"
              : solutionList.state === "PENDING"
                ? "대기"
                : "❌"}
            <div>
              <span className="date">{solutionList.createdDate}</span>
            </div>
          </div>
        </div>
        <div className="info-title-container">
          <div className="info-title">새로운 정보 생성</div>
        </div>
        <form onSubmit={handleSubmit} className="solution-info-container">
          <div>
            <h3 className="result-type-text">이름</h3>
          </div>
          <div>
            <input
              className="inputContent"
              type="text"
              name="name"
              value={solutionList.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <h3 className="result-type-text">재질</h3>
          </div>
          <div className="checkbox-container">
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
                  checked={solutionList.categories.includes(category)}
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

          <div>
            <h3 className="result-type-text">사진</h3>
          </div>
          <div>
            <img src={solutionList.imageUrl} alt="uploaded" />
          </div>
          <div>
            <h3 className="result-type-text"> 키워드</h3>
          </div>
          <div>
            <input
              className="inputContent"
              type="text"
              name="tags"
              value={solutionList.tags}
              onChange={handleTagsChange}
            />
          </div>
          <div>
            <h3 className="result-type-text">배출요령</h3>
          </div>
          <div>
            <textarea
              className="inputContent textarea"
              name="solution"
              placeholder="솔루션을 입력하세요"
              value={solutionList.solution}
              onChange={handleTextareaChange}
              maxLength={maxChars}
              style={{ height: "150px" }}
            />
            <div className="char-count">
              {charCount}/{maxChars} 글자
            </div>
          </div>
        </form>
        {type !== "admin" ? (
          <button
            type="button"
            onClick={navigateToBack}
            className="cancelbutton"
          >
            돌아가기
          </button>
        ) : solutionList.state === "PENDING" ? (
          <div className="button-container">
            <button
              type="submit"
              onClick={handleSubmit}
              className="submitbutton"
            >
              생성 요청 승인
            </button>
            <button
              type="button"
              onClick={handleRejectClick}
              className="cancelbutton"
            >
              생성 거절
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={navigateToAdminBack}
            className="navigate-back-button"
          >
            목록으로 돌아가기
          </button>
        )}
      </div>
    </div>
  );
};

export default SolutionDetail;
