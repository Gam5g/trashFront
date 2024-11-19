import React, { useState } from "react";
import AuthToken from "./AuthToken";
import "./ReportModal.css";

const ReportModal = ({ isOpen, onClose, questionBoardId }) => {
  const type = {
    0: "스팸 또는 광고성 게시물",
    1: "허위 정보 또는 오보",
    2: "사기 또는 사기 시도",
    3: "개인정보 침해",
    4: "불법 콘텐츠 링크 공유",
    5: "폭력적 위협 또는 협박",
    6: "성적 콘텐츠 또는 성희롱",
    7: "커뮤니티 규칙 위반",
    8: "인종차별 또는 차별 발언",
    9: "사생활 침해",
    10: "기타",
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [textAreaValue, setTextAreaValue] = useState("");

  if (!isOpen) return null;

  const handleCategoryChange = (e) => {
    setSelectedCategory(parseInt(e.target.value));
  };

  const handleTextAreaChange = (e) => {
    setTextAreaValue(e.target.value);
  };

  const handleSubmit = async () => {
    const dataToSend = {
      type: selectedCategory,
      description: textAreaValue,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await AuthToken.post(
        `/questionBoard/declare/${questionBoardId}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("신고가 성공적으로 접수되었습니다.");
        onClose();
      } else {
        alert("신고를 접수하는 데 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("신고를 접수하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>유저 신고하기</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="checkbox-container">
            {Object.keys(type).map((key) => (
              <label key={key} className="custom-checkbox">
                <input
                  type="radio"
                  className="category-radio"
                  name="category"
                  value={key}
                  checked={selectedCategory === parseInt(key)}
                  onChange={handleCategoryChange}
                />

                {type[key]}
              </label>
            ))}
          </div>
          <textarea
            placeholder="추가 작성할 내용이 있다면 적어주세요."
            value={textAreaValue}
            onChange={handleTextAreaChange}
          />
          <button
            type="submit"
            className="report-button"
            onClick={handleSubmit}
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
