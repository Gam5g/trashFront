import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AuthToken from "../container/pages/AuthToken";

const SolutionDetail = () => {
  const navigate = useNavigate();
  const { wasteId } = useParams();
  const maxChars = 300;
  const [charCount, setCharCount] = useState(0);
  const [solutionList, setSolutionList] = useState({
    nickName: "",
    solutionName: "",
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
          //wastId임
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        });
        const data = response.data;
        setSolutionList({
          nickName: data.nickName || "",
          solutionName: data.solutionName || "",
          imageUrl: data.imageUrl || "",
          categories: data.categories || [],
          tags: data.tags || [],
          solution: data.solution || "",
          state: data.state || "",
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

  const navigateToBack = () => {
    navigate(`/my-page/request/create-list`);
  };
  const handleSubmit = async () => {
    if (window.confirm("정말로 생성 요청을 승인하시겠습니까?")) {
      try {
        await AuthToken.put(`/solution/${wasteId}/accepted`, null, {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        });
        alert("승인되었습니다.");
        navigateToBack();
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
        navigateToBack();
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
    <div>
      <div className="NotDrag" style={{ marginTop: "200px" }}>
        <div className="info-title" style={{ marginTop: "125px" }}>
          새로운 정보 생성
        </div>{" "}
        <form onSubmit={handleSubmit} className="info-container">
          <div className="button-container">
            <h3 className="solution-font">이름</h3>
            <div className="inputWrap">
              <input
                className="inputContent"
                type="text"
                name="name"
                value={solutionList.solutionName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="button-container" style={{ marginRight: "330px" }}>
            <h3 className="search-font" style={{ marginBottom: "5px" }}>
              재질
            </h3>
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
                "폐건전지",
                "재활용 어려움",
              ].map((category) => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="category"
                    value={category}
                    checked={solutionList.categories.includes(category)}
                    onChange={handleCategoryChange}
                  />{" "}
                  {category}
                </label>
              ))}
            </div>
          </div>
          <div className="button-container">
            <h3 className="solution-font">태그</h3>
            <div className="inputWrap">
              <input
                className="inputContent"
                type="text"
                name="tags"
                value={solutionList.tags}
                onChange={handleTagsChange}
              />
            </div>
          </div>
          <div className="button-container">
            <h3
              style={{ color: "green", fontSize: "25px", marginRight: "15px" }}
            >
              배출요령
            </h3>
            <div>
              <textarea
                type="text"
                className="solution-input"
                name="solution"
                placeholder="솔루션을 입력하세요"
                value={solutionList.solution}
                onChange={handleTextareaChange}
                maxLength={maxChars}
                style={{ height: "250px" }}
              />
              <div className="char-count">
                {charCount}/{maxChars} 글자
              </div>
            </div>
          </div>
        </form>
        {solutionList.state !== "PENDING" ? (
          <button
            type="button"
            onClick={navigateToBack}
            className="cancelbutton"
          >
            돌아가기
          </button>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default SolutionDetail;
