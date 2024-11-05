import React, { useState, useEffect } from "react";
import AuthToken from "./AuthToken";
import "./ReportModal.css";

const ReportModal = ({ isOpen, onClose, targetId, targetNickname }) => {
  const [itemList, setItemList] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [targetInfo, setTargetInfo] = useState({
    accountName: "",
    targetId: "",
    targetNickname: "",
  });

  useEffect(() => {
    if (isOpen && targetNickname && targetId) {
      setTargetInfo((prev) => ({
        ...prev,
        targetId: targetId,
        targetNickname: targetNickname,
      }));
    }
  }, [isOpen, targetId, targetNickname]);

  if (!isOpen) return null;

  const handleCategoryChange = (e) => {
    const { checked, value } = e.target;
    setItemList((prev) =>
      checked ? [...prev, value] : prev.filter((category) => category !== value)
    );
  };

  const handleTextAreaChange = (e) => {
    setTextAreaValue(e.target.value);
  };

  const handleSubmit = async () => {
    const dataToSend = {
      targetId: targetInfo.targetId,
      targetNickname: targetInfo.targetNickname,
      reportCategories: itemList,
      additionalInfo: textAreaValue,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await AuthToken.post("/report", dataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

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
          <h2>{targetInfo.targetNickname} 유저 신고하기</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <table>
            <tbody>
              <tr>
                <div className="checkbox-container">
                  {[
                    "스팸 또는 광고성 게시물",
                    "허위 정보 또는 오보",
                    "사기 또는 사기 시도",
                    "개인정보 침해",
                    "불법 콘텐츠 링크 공유",
                    "폭력적 위협 또는 협박",
                    "성적 콘텐츠 또는 성희롱",
                    "커뮤니티 규칙 위반",
                    "인종차별 또는 차별 발언",
                    "사생활 침해",
                    "기타",
                  ].map((category) => (
                    <label key={category} className="custom-checkbox">
                      <input
                        type="checkbox"
                        className="category-checkbox"
                        name="category"
                        value={category}
                        checked={itemList.includes(category)}
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
              </tr>
            </tbody>
          </table>
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
