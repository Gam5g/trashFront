import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Medicine from "./MedicineMap";
import AuthToken from "./AuthToken";
import Modal from "./Modal";
import "../../style.css";
import "./Solution.css";
import "./SolutionDetailForm.css";

function SolutionDetailForm() {
  const navigate = useNavigate();
  const { wasteId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [solutionResult, setSolutionResult] = useState({
    accountNickName: "",
    name: "",
    imageUrl: "",
    categories: [],
    tags: [],
    solution: " ",
    state: "",
    wasteId: "",
  });

  useEffect(() => {
    const fetchWikiData = async () => {
      try {
        const response = await AuthToken.get(`/solution/${wasteId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });
        const resultData = response.data;
        setSolutionResult({
          name: resultData.name,
          accountId: resultData.accountId,
          accountNickName: resultData.accountNickName,
          imageUrl: resultData.imageUrl,
          categories: resultData.categories,
          tags: resultData.tags,
          solution: resultData.solution,
          state: resultData.state,
        });
      } catch (error) {
        console.error("위키 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    if (wasteId) {
      fetchWikiData();
    }
  }, [wasteId]);

  const navigateToBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/search/edit?query=${encodeURIComponent(solutionResult.name)}`, {
      state: { searchData: solutionResult },
    });
  };

  const formatRules = (rules) => {
    if (!rules) return null;
    return rules.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="solution-detail-form-container">
      <div>
        <div>
          <h1 className="result-title">{solutionResult.name}</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {solutionResult.imageUrl && (
              <img
                src={solutionResult.imageUrl}
                style={{
                  width: "200px",
                  height: "200px",
                }}
                alt={solutionResult.name}
              />
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <p className="result-type-text">재질</p>
            <p className="result-text">
              {solutionResult.categories.join(", ")}
            </p>
            <p className="result-type-text">키워드</p>
            <p className="result-text">{solutionResult.tags.join(", ")}</p>
            <p className="result-type-text">배출 요령</p>
            <p className="result-text">
              {formatRules(solutionResult.solution)}
            </p>
            <p className="result-type-text">솔루션 작성자</p>
            <p
              className="result-text"
              style={{ cursor: "pointer" }}
              onClick={() => setModalOpen(true)}
            >
              {" "}
              {solutionResult.accountNickName}{" "}
            </p>
            <p className="result-type-text">솔루션 현재 상태</p>
            <p className="result-text">
              {solutionResult.state === "ACCEPTED" && "수락됨"}
              {solutionResult.state === "REJECTED" && "거부됨"}
              {solutionResult.state === "PENDING" && "대기중"}
            </p>
          </div>
        </div>
        <div className="button-container">
          <button className="update-button" onClick={handleEdit}>
            수정하기
          </button>
          <button className="back-button" onClick={navigateToBack}>
            돌아가기
          </button>
        </div>
        {solutionResult.name === "폐의약품" && (
          <div>
            <div>
              <h1>근처에 폐의약품이나 폐건전지 수거함을 찾아보세요</h1>
            </div>
            <div>
              <Medicine />
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        accountId={solutionResult.accountId}
      />
    </div>
  );
}

export default SolutionDetailForm;
