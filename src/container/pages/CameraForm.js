import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Button.css";
import "./CameraForm.css";
import "../../style.css";
import AuthToken from "./AuthToken";
import { useMediaQuery } from "react-responsive";

function CameraForm() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isActive, setActive] = useState(false);
  const [image, setImage] = useState(null);
  const [lastFile, setLastFile] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

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
        localStorage.setItem("accountId", response.data.accountId);
        localStorage.setItem("nickname", response.data.nickname);
        localStorage.setItem("latitude", response.data.latitude);
        localStorage.setItem("longitude", response.data.longitude);
      } catch (error) {}
    })();
  }, [accessToken]);

  const handleFileChange = (e) => {
    e.preventDefault();
    const files = e.target.files || e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setLastFile(file);
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

  const handleUploadComplete = async () => {
    if (lastFile) {
      try {
        const formData = new FormData();
        formData.append("image", lastFile);

        const res = await AuthToken.post(`/s3`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageURL = res.data;
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

        navigate("/search/result", {
          state: { result: separationResponse.data.result },
        });
      } catch (error) {
        if (
          error.response &&
          error.response.data.cause === "IllegalArgumentException"
        ) {
          alert(error.response.data.message);
        } else if (
          error.response &&
          error.response.data.cause === "MaxUploadSizeExceededException"
        ) {
          alert("업로드할 사진 용량을 초과했습니다.");
        } else {
          console.error("에러 :", error);
          alert("An unexpected error occurred. Please try again.");
        }
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
              이곳을 눌러 사진을 찍거나 가져와 주세요 <br />
              jpg 또는 png 확장자만 가능해요
            </button>
          )}
          <button onClick={ScrollToTop} className="MoveTopBtn" />
        </div>
      </div>
    </div>
  );
}

export default CameraForm;
