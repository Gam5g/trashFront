import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import AuthToken from "../container/pages/AuthToken";
import "../container/pages/Search.css";

const CompareForm = ({
  type,
  nickName,
  solutionName,
  imageUrl,
  categories,
  tags,
  solution,
  state,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [originList, setOriginList] = useState({
    writerName: nickName,
    wasteName: solutionName,
    categories: categories,
    tags: tags,
    solution: solution,
    wikiState: state,
    createdDate: "",
    modifiedDate: "",
  });
  const [modifiedList, setModifiedList] = useState({
    writerName: "",
    wasteName: "",
    categories: [],
    tags: tags || [],
    solution: solution || "",
    wikiState: "",
    createdDate: "",
    modifiedDate: "",
  });
  const [charCount, setCharCount] = useState(0);
  const maxChars = 300;
  let wikiId = "";
  let wasteId = "";
  const [showDiff, setShowDiff] = useState(false);
  /*const [isExpanded, setIsExpanded] = useState(true);*/
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인 한 후에 글을 작성할 수 있습니다.");
      navigate("/sign-in");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AuthToken.get(`/wiki/${wikiId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data;
        const originCreatedDate = new Date(
          data.origin.createdDate
        ).toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const originModifiedDate = new Date(
          data.origin.modifiedDate
        ).toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const originData = response.data.content.map((data) => ({
          writerName: data.origin.writerName,
          wasteName: data.origin.wasteName,
          categories: data.origin.categories,
          tags: data.origin.tags,
          solution: data.origin.solution,
          wikiState: data.origin.wikiState,
          createdDate: originCreatedDate,
          modifiedDate: originModifiedDate,
        }));
        setOriginList(originData);
        const modifiedCreatedDate = new Date(
          data.origin.createdDate
        ).toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const modifiedModifiedDate = new Date(
          data.origin.modifiedDate
        ).toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const modifiedData = response.data.content.map((data) => ({
          writerName: data.modified.writerName,
          wasteName: data.modified.wasteName,
          categories: data.modified.categories,
          tags: data.modified.tags,
          solution: data.modified.solution,
          wikiState: data.modified.wikiState,
          createdDate: modifiedCreatedDate,
          modifiedDate: modifiedModifiedDate,
        }));
        setModifiedList(modifiedData);
      } catch (error) {
        if (error.response.data.cause === "EMPTY_WIKI") {
          alert("해당 위키가 존재하지 않습니다.");
        } else console.error(error);
      }
    };
    fetchData();
  }, [accessToken, navigate]);

  /*const toggleIcon = () => {
    setIsExpanded(!isExpanded);
  };*/
  useEffect(() => {
    setModifiedList((prev) => ({
      ...prev,
      categories: originList.categories,
      tags: originList.tags,
      solution: originList.solution,
    }));
  }, [originList]);

  const handleCategoryChange = (e) => {
    const { checked, value } = e.target;
    setModifiedList((prev) => {
      const categories = checked
        ? [...prev.categories, value]
        : prev.categories.filter((category) => category !== value);
      return { ...prev, categories };
    });
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setModifiedList((prev) => ({ ...prev, [name]: value }));
    setCharCount(value.length);
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setModifiedList((prev) => ({ ...prev, tags: tagsArray }));
  };

  const navigateToHome = () => {
    navigate(`/`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modifiedList.categories.length === 0) {
      alert("적어도 하나의 재질을 선택해야 합니다.");
      return;
    }

    if (modifiedList.tags.length === 0) {
      alert("적어도 하나의 태그를 입력해야 합니다.");
      return;
    }

    if (!modifiedList.solution.trim()) {
      alert("배출 방법을 입력해야 합니다.");
      return;
    }

    setShowDiff(true);
    const formData = new FormData();
    formData.append("categories", modifiedList.categories);
    formData.append("solution", modifiedList.solution);
    formData.append("tags", modifiedList.tags);
    try {
      await AuthToken.post(`/solution/${wasteId}/wiki`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (
          data.cause === "EXIST_WIKI" ||
          data.cause === "ConstraintViolationException"
        ) {
          alert(data.message);
        } else {
          console.error(data);
        }
      } else {
        console.error(error);
      }
    }
  };
  const handleAdminAccept = async (e) => {
    try {
      await AuthToken.put(`/wiki/${wikiId}/accepted`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("해당 위키의 요청이 승인되었습니다.");
    } catch (error) {
      alert(error);
    }
  };

  const handleAdminRejected = async (e) => {
    try {
      await AuthToken.put(`/wiki/${wikiId}/rejected`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("해당 위키의 요청이 거부되었습니다.");
    } catch (error) {
      if (error.response.data.cause === "EMPTY_WIKI") {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };

  return (
    <div className="button-container" style={{ userSelect: "none" }}>
      <div>
        <div className="origin-title">원본</div>
        <div className="origin-container">
          <p style={{ fontSize: "45px", textAlign: "center" }}>
            {originList.wasteName}
          </p>
          <img src={imageUrl} style={{ width: "30%", height: "30%" }} />
          <h3 className="search-font">재질</h3>
          <p>{originList.categories}</p>
          <h3 className="search-font">태그</h3>
          <p>{originList.tags}</p>
          <h3 className="search-font">배출요령</h3>
          <p>{originList.solution}</p>
        </div>
      </div>
      <div>
        <div className="modified-title">수정</div>
        <form onSubmit={handleSubmit} className={"modified-container"}>
          <p
            style={{
              fontSize: "45px",
              textAlign: "center",
              marginBottom: "-20px",
            }}
          >
            {originList.wasteName}
          </p>
          <div className="button-container" style={{ marginRight: "330px" }}>
            <h3 className="search-font" style={{ marginBottom: "5px" }}>
              재질
            </h3>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                paddingLeft: "30px",
              }}
            >
              {[
                "일반쓰레기",
                "종이류",
                "유리",
                "플라스틱",
                "캔류",
                "비닐류",
                "스티로폼",
                "폐유",
                "폐건전지",
                "재활용 어려움",
              ].map((category) => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="category"
                    value={modifiedList.categories}
                    onChange={handleCategoryChange}
                  />{" "}
                  {category}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="search-font">태그</h3>
            {originList && (
              <div>
                <p>{originList.tags}</p>
                <hr />
              </div>
            )}
            <div className="inputWrap">
              <input
                className="inputContent"
                type="text"
                name="tags"
                placeholder="태그를 입력하세요 (쉼표로 구분)"
                onChange={handleTagsChange}
                value={modifiedList.tags}
              />
            </div>
          </div>
          <div>
            <h3 className="search-font">배출요령</h3>
            <div>
              {originList && (
                <div>
                  <p>{originList.solution}</p>
                  <hr />
                </div>
              )}
            </div>
            <div>
              <textarea
                type="text"
                className="solution-input"
                name="solution"
                placeholder="솔루션을 입력하세요"
                value={modifiedList.solution}
                onChange={handleTextareaChange}
                maxLength={maxChars}
              />
              <div className="char-count">
                {charCount}/{maxChars} 글자
              </div>
            </div>
          </div>
        </form>
        {type === "edit" && (
          <div className="button-container">
            <button
              type="submit"
              onClick={handleSubmit}
              className="submitbutton"
            >
              생성 요청하기
            </button>
            <button className="cancelbutton" onClick={navigateToHome}>
              취소
            </button>
          </div>
        )}
        {type === "admin" && (
          <div className="button-container">
            <button
              type="submit"
              onClick={handleAdminAccept}
              className="submitbutton"
            >
              수정 승인
            </button>
            <button className="cancelbutton" onClick={handleAdminRejected}>
              수정 거절
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareForm;
