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
  const [query, setQuery] = useState("");
  const [image, setImage] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const { register, handleSubmit } = useForm();

  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setImage(URL.createObjectURL(file));
      console.log("Uploaded file:", file);
      navigate("/loading");
    } else {
      console.log("File upload cancelled");
      alert("파일 업로드가 취소되었습니다.");
      setActive(false);
    }
  };
  const handleImageClick = () => {
    inputRef.current.click();
    setActive(!isActive);
  };
  const handleCameraChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      console.log(imageUrl);
    }
  };

  const onSubmit = (data) => {
    const searchTerm = data.searchTerm.trim();
    if (searchTerm !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
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
              placeholder="이름 또는 태그로 검색하기"
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
        <button type="submit" className="search-button" aria-label="검색">
          <FaSearch className="search-icon" />
        </button>
      </div>
      <h2>찾고자 하는 쓰레기를 업로드해보세요!</h2>
      <button
        type="file"
        id="camera"
        name="camera"
        capture="camera"
        accept="image/*"
        style={{ display: "none" }}
        ref={cameraInputRef}
        onChange={handleCameraChange}
        aria-label="카메라로 촬영"
      />
      <div>
        <button
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          aria-label="파일 업로드"
        />
        {image ? (
          <img src={image} className="uploaded-image" alt="Uploaded" />
        ) : (
          <button
            className={`upload-button ${isActive ? "active" : ""}`}
            onClick={handleImageClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileChange}
            aria-label="사진 업로드"
          >
            클릭이나 드래그로 사진 업로드
          </button>
        )}
        <button onClick={ScrollToTop} className="MoveTopBtn" />
      </div>
    </div>
  );
}
export default MainForm;
