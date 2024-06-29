import React, { useState, useEffect } from "react";
import AuthToken from "./AuthToken";
import "./Modal.css"; // 모달 스타일을 적용하기 위한 CSS 파일

const Modal = ({ isOpen, onClose, accountId }) => {
  const [targetInfo, setTargetInfo] = useState({
    accountName: "",
    email: "",
    nickname: "",
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await AuthToken.get(`/account/${accountId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const responseData = response.data;
          const info = {
            accountName: responseData.accountName,
            email: responseData.email,
            nickname: responseData.nickname,
          };
          setTargetInfo(info);
        } catch (error) {
          console.error("Error fetching account info:", error);
        }
      };

      fetchData();
    }
  }, [isOpen, accountId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{targetInfo.accountName}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <table>
            <tbody>
              <tr>
                <td>아이디</td>
                <td className="right-align">{targetInfo.accountName}</td>
              </tr>
              <tr>
                <td>이메일</td>
                <td className="right-align">{targetInfo.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Modal;
