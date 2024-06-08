import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import AuthToken from "./AuthToken";
import "./Solution.css";

const SolutionCreate = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isActive, setActive] = useState(false);
  const [image, setImage] = useState(null);
  const [lastFile, setLastFile] = useState(null);
  const [solutionList, setSolutionList] = useState({
    name: query || "",
    categories: [],
    tags: [],
    solution: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 300;
  const accessToken = localStorage.getItem("accessToken");
  const wastedId = 0;
  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    e.preventDefault();
    const files = e.target.files || e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setLastFile(file);
      setSolutionList((prev) => ({ ...prev, imageUrl }));
      e.target.value = null;
      setActive(true);
    }
  };

  const handleImageClick = () => {
    inputRef.current.click();
    setActive(!isActive);
  };

  const handleImageRemove = () => {
    alert("파일 업로드가 취소되었습니다.");
    setImage(null);
    setActive(false);
    setLastFile(null);

    if (inputRef.current) {
      inputRef.current.value = null;
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = null;
    }
  };

  const toggleIcon = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCategoryChange = (e) => {
    const { checked, value } = e.target;
    setSolutionList((prev) => {
      const categories = checked
        ? [...prev.categories, value]
        : prev.categories.filter((category) => category !== value);
      return { ...prev, categories };
    });
  };

  const navigateToHome = () => {
    navigate(`/`);
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

  const handleSubmit = async () => {
    //name과 imageUrl 추가 api가 나올 때까지 stop
    try {
      const formData = new FormData();
      //formData.append("name", solutionList.name);
      formData.append("categories", solutionList.categories);
      formData.append("solution", solutionList.solution);
      formData.append("tags", solutionList.tags.join(","));

      const response = await AuthToken.post(
        "http://3.39.190.90/api/solution/${wasteId}/wiki",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("솔루션 제출이 완료되었습니다. 감사합니다!");
      navigate("/");
    } catch (error) {
      if (error.response.data.cause === "DataIntegrityViolationException") {
        alert("현재 검색어 이름과 중복된 데이터가 존재합니다.");
        return;
      } else console.error("Error submitting form:", error);
    }
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setSolutionList((prev) => ({ ...prev, tags: tagsArray }));
  };

  return (
    <div className="NotDrag" style={{ marginTop: "200px" }}>
      <div
        className="info-title"
        style={isExpanded ? { marginTop: "125px" } : {}}
      >
        새로운 정보 작성
      </div>{" "}
      <form
        onSubmit={handleSubmit}
        className={isExpanded ? "info-expand-container" : "info-container"}
      >
        <div className="button-container">
          <h3 className="solution-font">이름</h3>
          <div className="inputWrap">
            <input
              className="inputContent"
              type="text"
              name="name"
              value={solutionList.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="button-container" style={{ marginRight: "330px" }}>
          <h3 className="solution-font">재질</h3>
          <button
            style={{ marginLeft: "5px" }}
            onClick={toggleIcon}
            className="nothing-button"
            type="button"
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        </div>
        {isExpanded && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ marginRight: "20px" }}>
              <label>
                <input
                  type="checkbox"
                  value="일반쓰레기"
                  onChange={handleCategoryChange}
                />{" "}
                일반쓰레기
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="종이류"
                  onChange={handleCategoryChange}
                />{" "}
                종이류
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="유리"
                  onChange={handleCategoryChange}
                />{" "}
                유리
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="플라스틱"
                  onChange={handleCategoryChange}
                />{" "}
                플라스틱
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="무색페트"
                  onChange={handleCategoryChange}
                />{" "}
                무색페트
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="비닐류"
                  onChange={handleCategoryChange}
                />{" "}
                비닐류
              </label>
              <br />
              <label>
                <input
                  type="checkbox"
                  value="재활용 어려움"
                  onChange={handleCategoryChange}
                />{" "}
                재활용 어려움
              </label>
              <br />
            </div>
          </div>
        )}
        <div className="button-container">
          <h3 className="solution-font">태그</h3>
          <div className="inputWrap">
            <input
              className="inputContent"
              type="text"
              name="tags"
              placeholder="태그를 입력하세요 (쉼표로 구분)"
              onChange={handleTagsChange}
            />
          </div>
        </div>
        <div className="button-container">
          {!image && (
            <h3 className="solution-font" style={{ marginLeft: "35px" }}>
              사진
            </h3>
          )}
          <div>
            <input
              type="file"
              ref={inputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {image ? (
              <div className="info-upload-container">
                <img
                  src={image}
                  className="solution-uploaded-image"
                  alt="Uploaded"
                  style={{
                    objectFit: "cover",
                  }}
                />
                <br />
                <button
                  className="white-button"
                  onClick={handleImageRemove}
                  style={{ margin: "0 auto" }}
                >
                  사진 지우기
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`solution-upload-button ${isActive ? "active" : ""}`}
                onClick={handleImageClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileChange}
              >
                클릭이나 드래그로 사진 업로드
              </button>
            )}
          </div>
        </div>
        <div className="button-container">
          <h3 style={{ color: "green", fontSize: "25px", marginRight: "15px" }}>
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
            />
            <div className="char-count">
              {charCount}/{maxChars} 글자
            </div>
          </div>
        </div>
      </form>
      <div className="button-container">
        <button type="submit" onClick={handleSubmit} className="submitbutton">
          생성 요청하기
        </button>
        <button className="cancelbutton" onClick={navigateToHome}>
          취소
        </button>
      </div>
    </div>
  );
};

export default SolutionCreate;
