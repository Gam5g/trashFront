import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Medicine from "./MedicineMap";
import AuthToken from "./AuthToken";
import "../../style.css";
import "./Solution.css";

function SolutionDetailForm() {
  const navigate = useNavigate();
  const { wasteId } = useParams();
  const [activePage, setActivePage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [solutionResult, setSolutionResult] = useState({
    accountNickName: "",
    name: "",
    imageUrl: "",
    categories: [],
    tags: [],
    solution: " ",
    state: "",
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
          accountNickName: resultData.accountNickName,
          solutionName: resultData.solutionName,
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
    <div className="NotDrag" style={{ marginTop: "120px" }}>
      <div>
        <div>
          <h1 style={{ textAlign: "center" }}>{solutionResult.name}</h1>
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
                  width: "30%",
                  height: "30%",
                }}
                alt={solutionResult.name}
              />
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <p className="solution-detail-font">재질</p>
            {solutionResult.categories.join(", ")}
            <p className="solution-detail-font">키워드</p>
            {solutionResult.tags.join(", ")}
            <p className="solution-detail-font">배출 요령</p>
            <p>{formatRules(solutionResult.solution)}</p>
            <p className="solution-detail-font">솔루션 작성자</p>
            {solutionResult.accountNickName !== "midas"
              ? solutionResult.accountNickName
              : "비공개"}
          </div>
          <p className="solution-detail-font">솔루션 현재 상태</p>
          <p
            style={{
              textAlign: "center",
            }}
          >
            {solutionResult.state === "ACCEPTED" && "수락됨"}
            {solutionResult.state === "REJECTED" && "거부됨"}
            {solutionResult.state === "PENDING" && "대기중"}
          </p>
        </div>
        <div className="button-container">
          <button
            className="white-button"
            onClick={navigateToBack}
            style={{ marginLeft: "5px" }}
          >
            돌아가기
          </button>
        </div>
        {solutionResult.solutionName === "폐의약품" && (
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
    </div>
  );
}

export default SolutionDetailForm;
