import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { HiXCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Trash } from "./trash";
import axios from "axios";
import "../../Button.css";
import "../../style.css";
import AuthToken from "./AuthToken";
import { useMediaQuery } from "react-responsive";

function MainForm() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isActive, setActive] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [query, setQuery] = useState("");
  const [image, setImage] = useState(null);
  const [lastFile, setLastFile] = useState(null);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const prevInputValueRef = useRef("");
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
          `http://3.39.190.90/api/separation?url=${imageURL}`,

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
  const onSubmit = (data) => {
    const searchTerm = data.searchTerm.trim();
    if (searchTerm) {
      axios
        .get(
          `http://3.39.190.90/api/separation/${encodeURIComponent(searchTerm)}`
        ) // 배출방법 현재 없다고 나옴
        .then((response) => {
          console.log("Search Results :", response.data);
          navigate(`/search/${searchTerm}`);
        })
        .catch((error) => {
          console.error("Search error : ", error);
        });
    }
    reset();
    /*if (prevInputValueRef.current !== inputValue) {
      prevInputValueRef.current = inputValue;
      setQuery(inputValue);
    }
    if (query.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    } */
  };
  const navigateToSearch = (selectedQuery) => {
    console.log(selectedQuery);
    navigate(`/search?query=${encodeURIComponent(selectedQuery)}`);
  };
  const handleSearchButtonClick = () => {
    if (query && query.trim() !== "") {
      const targetItem = Trash.find((item) => item.name.includes(query));
      if (targetItem) {
        navigateToSearch(targetItem.name);
      }
    }
  };
  const ScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setSearchFocused(true);
                }}
                onBlur={() => {
                  setSearchFocused(false);
                }}
              />
              {query && query.length > 0 && (
                <HiXCircle
                  className="clear-search-button"
                  onClick={() => setQuery("")}
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
              {query && query.length > 0 && (
                <div className="list">
                  {Trash.filter((target) => target.name.includes(query))
                    .slice(0, 5)
                    .map((target) => (
                      <ul
                        key={target.id}
                        className="list-item"
                        onClick={() => navigateToSearch(target.name)}
                      >
                        {target.name}
                      </ul>
                    ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
      <div>
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
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                position: "flex",
              }}
            >
              <button
                className="white-button"
                onClick={() => inputRef.current.click()}
              >
                사진 촬영
              </button>
              <button className="white-button" onClick={handleUploadComplete}>
                업로드 완료
              </button>
              <div />
              <img
                src={image}
                className="uploaded-image"
                alt="Uploaded"
                style={{
                  width: "50%",
                  height: "50%",
                  objectFit: "cover",
                }}
              />
              <div />
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
              style={{ width: "350px", height: "350px" }}
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
