import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import AuthToken from "./AuthToken";
import "./SolutionCreate.css";
import "./Solution.css";

const SolutionCreate = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [isActive, setActive] = useState(false);
  const [image, setImage] = useState(null);
  const [lastFile, setLastFile] = useState(null);
  const [solutionList, setSolutionList] = useState({
    name: query || "",
    imageUrl: "",
    categories: [],
    tags: [],
    solution: "",
  });
  const [charCount, setCharCount] = useState(0);
  const maxChars = 300;
  const accessToken = localStorage.getItem("accessToken");
  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인한 후에 접속하세요.");
      navigate(-1);
    }
  }, [isLoggedIn]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLastFile(file);
    setImage(URL.createObjectURL(file));
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

  const handleUploadComplete = async () => {
    if (lastFile) {
      try {
        const formData = new FormData();
        formData.append("image", lastFile);

        const response = await AuthToken.post(`/s3`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageURL = response.data;
        if (!imageURL) {
          throw new Error("Image URL not found in response");
        }

        const separationResponse = await AuthToken.get(
          `/solution/image?imageUrl=${imageURL}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        return { imageURL, result: separationResponse.data.result };
      } catch (error) {
        if (error.response?.data?.cause === "MaxUploadSizeExceededException") {
          alert("업로드할 사진 용량을 초과했습니다.");
          return;
        }
        console.error("에러 :", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (!solutionList.name.trim()) {
        alert("이름을 입력해야 합니다.");
        return;
      }

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
      const uploadData = await handleUploadComplete();
      if (!uploadData) return;

      const { imageURL } = uploadData;

      const formData = new FormData();
      formData.append("name", solutionList.name);
      formData.append("imageUrl", imageURL);
      formData.append("categories", solutionList.categories);
      formData.append("solution", solutionList.solution);
      formData.append("tags", solutionList.tags.join(","));

      await AuthToken.post(`/solution`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("솔루션 제출이 완료되었습니다. 감사합니다!");
      navigate("/");
    } catch (error) {
      if (error.response?.data?.cause === "DataIntegrityViolationException") {
        alert("현재 검색어 이름과 중복된 데이터가 존재합니다.");
        return;
      } else {
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setSolutionList((prev) => ({ ...prev, tags: tagsArray }));
  };

  return (
    <div className="solution-create-form">
      <div className="solution-title" style={{ marginTop: "300px" }}>
        새로운 정보 생성
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
          <h3 className="result-type-text"> 사진</h3>
        </div>
        <div>
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
                  style={{ margin: "0 auto", marginBottom: "10px" }}
                >
                  사진 지우기
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`solution-image-upload-button ${isActive ? "active" : ""}`}
                onClick={handleImageClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileChange}
              >
                클릭이나 드래그로 사진 업로드
              </button>
            )}
          </div>
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
      <div className="button-container">
        <button
          type="submit"
          onClick={handleSubmit}
          className="solution-create-request-button"
        >
          생성 요청하기
        </button>
        <button
          className="solution-cancel-request-button"
          onClick={navigateToHome}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default SolutionCreate;
