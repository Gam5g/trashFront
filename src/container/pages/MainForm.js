import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { HiXCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "../../Button.css";
import "../../style.css";
import AuthToken from "./AuthToken";
import { useMediaQuery } from "react-responsive";

function MainForm() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isActive, setActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [image, setImage] = useState(null);
  const [lastFile, setLastFile] = useState(null);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const accessToken = localStorage.getItem("accessToken");

  const prevInputValueRef = useRef("");
  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await AuthToken.get(`/account/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        localStorage.setItem("nickname", response.data.nickname);
      } catch (error) {}
    })();
  });
  const handleFileChange = (e) => {
    e.preventDefault();
    const files = e.target.files || e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setLastFile(file);
      console.log("Local file uploaded:", imageUrl);
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
    inputRef.current.value = null;
    cameraInputRef.current.value = null;
  };

  const isAdmin = localStorage.getItem("accountName") === "admin";

  const handleUploadComplete = async () => {
    if (lastFile) {
      console.log("GET 요청 파일명 :", lastFile.name);
      try {
        const imageURL = encodeURIComponent(lastFile.name); // URL 인코딩
        const response = await AuthToken.get(
          `/separation?url=${imageURL}`,
          {
            url: imageURL,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        console.log("데이터:", data);
        navigate("/loading");
      } catch (error) {
        console.error("에러 :", error);
      }
    }
  };

  const onSubmit = async (data) => {
    const searchTerm = data.searchTerm.trim();
    if (!searchTerm) {
      return; // 검색어가 비어있으면 종료
    }
    console.log(data);
    try {
      const response = await AuthToken.get(
        `/solution/keyword`,
        {
          keyword: searchTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSearchResults([response.data]);
      console.log(searchTerm);
      navigateToSearch(searchTerm);
    } catch (error) {
      console.log(error);
    }
    reset();
  };

  const handleSearchButtonClick = async (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };

  const navigateToSearch = (selectedQuery) => {
    console.log(selectedQuery);
    navigate(`/search?query=${encodeURIComponent(selectedQuery)}`);
  };

  const navigateTowrite = () => {
    navigate(`/solution/create`);
  };
  const ScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="upload-container">
      <h2>찾고자 하는 쓰레기를 검색해보세요!</h2>
      <div
        className={query ? "search-active-container" : "trash-search-container"}
      >
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="search-form"
        >
          <div className="search-input-container">
            <div>
              <input
                {...register("searchTerm")}
                type="text"
                placeholder="이름 또는 태그로 검색하기"
                className="search-input"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />

              {watch("searchTerm") && watch("searchTerm").length > 0 && (
                <HiXCircle
                  className="clear-search-button"
                  onClick={() => reset({ searchTerm: "" })}
                  style={{ color: "gray" }}
                />
              )}
              <button
                type="submit"
                className="search-button"
                aria-label="검색"
                onClick={handleSearchButtonClick}
              >
                <FaSearch className="search-icon" />
              </button>
            </div>
          </div>
        </form>
      </div>
      <div onClick={navigateTowrite} className="direct-write-button">
        등록되지 않은 쓰레기 배출 방법을 직접 작성하기
      </div>
      <div className="upload-container">
        <h2>찾고자 하는 쓰레기를 업로드해보세요!</h2>
        <div>
          <input
            type="file"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <input
            type="file"
            id="camera"
            name="camera"
            capture="camera"
            accept="image/*"
            ref={cameraInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {image ? (
            <div className="upload-container">
              <div className="upload-buttons">
                <button
                  className="white-button"
                  onClick={() => inputRef.current.click()}
                >
                  사진 촬영
                </button>
                <button className="white-button" onClick={handleUploadComplete}>
                  업로드 완료
                </button>
              </div>
              <img src={image} className="uploaded-image" alt="Uploaded" />
              <br />
              <button className="white-button" onClick={handleImageRemove}>
                사진 지우기
              </button>
            </div>
          ) : (
            <button
              className={`upload-button ${isActive ? "active" : ""}`}
              onClick={handleImageClick}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileChange}
            >
              클릭이나 드래그로 사진 업로드
            </button>
          )}
          <button onClick={ScrollToTop} className="MoveTopBtn" />
        </div>
        <div>
          {isAdmin && (
            <button className="white-button" onClick={() => navigate("/admin")}>
              수정 요청 관리
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainForm;
