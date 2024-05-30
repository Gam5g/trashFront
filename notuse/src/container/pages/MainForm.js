import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { HiXCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "../../Button.css";
import "../../style.css";
import { Trash } from "./trash";

function MainForm() {
  const [isActive, setActive] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [query, setQuery] = useState("");
  const [image, setImage] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const { register, handleSubmit } = useForm();

  const prevInputValueRef = useRef("");
  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const handleDragStart = () => setActive(true);
  const handleDragEnd = () => setActive(false);
  const navigate = useNavigate();

  const readImage = (file) => {
    setImage(URL.createObjectURL(file));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploaded file:", file);
      readImage(file);
    } else {
      console.log("File upload cancelled");
      setActive(false);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    console.log("Uploaded file:", file);
    readImage(file);
    setActive(false);
  };
  const handleImageClick = () => {
    inputRef.current.click();
    setActive(!isActive);
  };
  const handleCameraChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    const picElement = document.getElementById("pic");
    if (picElement) {
      picElement.src = imageUrl;
    }
  };
  const handleButtonClick = () => {
    cameraInputRef.current.click();
  };

  const onSubmit = () => {
    if (prevInputValueRef.current !== inputValue) {
      prevInputValueRef.current = inputValue;
      setQuery(inputValue);
    }
    if (query.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(query)}`); // 쿼리스트링이 비어 있지 않은 경우에만 추가
    }
  };
  const ScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const navigateToSearch = (selectedQuery) => {
    navigate(`/search?query=${encodeURIComponent(selectedQuery)}`);
  };
  return (
    <div className="NotDrag" style={{ paddingTop: "50px" }}>
      <h2>찾고자 하는 쓰레기를 검색해보세요!</h2>
      <div className="trash-search-container">
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="search-form"
        >
          <div className="search-input-container">
            <input
              {...register("searchTerm")}
              type="text"
              placeholder="검색"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {isFocused && query && query.length > 0 && (
              <HiXCircle
                className="clear-search-button"
                onClick={() => setQuery("")}
                style={{ color: "gray" }}
              />
            )}
            <div>
              {query && query.length > 0 && (
                <div className="list">
                  {Trash.filter((target) => target.name.includes(query)).map(
                    (target) => (
                      <ul
                        key={target.id}
                        className="list-item"
                        onClick={() => navigateToSearch(target.name)}
                      >
                        {target.name}
                      </ul>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
        <button type="submit" className="search-button">
          <FaSearch className="search-icon" />
        </button>
      </div>
      <h2>찾고자 하는 쓰레기를 업로드해보세요!</h2>
      <input
        type="file"
        id="camera"
        name="camera"
        capture="camera"
        accept="image/*"
        style={{ display: "none" }}
        ref={cameraInputRef}
        onChange={handleCameraChange}
      />
      <button onClick={handleButtonClick} className="loginbutton">
        사진 찍기
      </button>
      <div>
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <img
          src={
            image
              ? image
              : isActive
              ? "/images/file_upload2.png"
              : "/images/file_upload.png"
          }
          onDragEnter={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragEnd}
          onDrop={handleDrop}
          onClick={handleImageClick}
          className="upload-img"
        />
        <button onClick={ScrollToTop} className="MoveTopBtn" />
      </div>
    </div>
  );
}
export default MainForm;
