import React, { useRef, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import "../container/pages/Community/Community.css";
import "../Button.css";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize";
import AuthToken from "../container/pages/AuthToken";
import { useMediaQuery } from "react-responsive";

Quill.register("modules/imageResize", ImageResize);

const CommunityWrite = ({ posttype }) => {
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [userInfo, setUserInfo] = useState({
    title: "",
    content: "",
    nanum: false,
    imageUrl: "",
    category: posttype === "bunri" ? "분리수거" : "나눔",
  });
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const storedQuestionId = localStorage.getItem("currentQuestionId");
    if (storedQuestionId) {
      setCurrentQuestionId(parseInt(storedQuestionId, 10));
    } else {
      localStorage.setItem("currentQuestionId", "0");
    }
  }, []);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file"); //파일 입력요소를 file 타입으로 설정
    input.setAttribute("accept", "image/*"); //파일 입력요소가 이미지 선택할 수 있게 accept 속성 설정
    input.click(); //파일 입력요소 클릭
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }, "link", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },

      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },
    };
  }, []);

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "background",
    "color",
    "link",
    "image",
  ];

  const quillRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("로그인 한 후에 글을 작성할 수 있습니다.");
      return;
    }
    const questionId = currentQuestionId;
    const { title, content, imageUrl, category } = userInfo;
    if (!title.trim()) {
      setErrors((prev) => ({ ...prev, title: "제목은 필수 항목입니다." }));
      return;
    }

    if (content.trim().length < 10) {
      setErrors((prev) => ({
        ...prev,
        content: "내용은 최소 10자 이상이어야 합니다.",
      }));
      return;
    }

    try {
      const res = await AuthToken.post(
        `http://3.39.190.90/api/questionBoard/create?id=${questionId}`,
        {
          title,
          content,
          category,
          imageUrl,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
            //Cookie: `RefreshToken=${refreshToken}`,
          },
        }
      );
      if (res.data.success === true) {
        navigate("/post");
        const newQuestionId = questionId + 1;
        setCurrentQuestionId(newQuestionId);
        localStorage.setItem("currentQuestionId", newQuestionId.toString());
      }
    } catch (error) {
      alert("글 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="NotDrag">
      <div className="titleWrap" style={{ userSelect: "none" }}>
        {posttype === "bunri" ? "분리수거" : "나눔"} 커뮤니티 &gt;
      </div>

      <p style={{ fontSize: "16px", marginTop: "-5px" }}>글 작성</p>
      <form onSubmit={onSubmit}>
        <div className="write" style={{ userSelect: "none" }}>
          <p style={{ color: "gray", fontSize: "14px" }}>제목</p>
          <input
            type="text"
            id="title_txt"
            name="title"
            value={userInfo.title}
            onChange={onChange}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>
        <div style={{ userSelect: "none" }}>
          <p style={{ color: "gray", fontSize: "14px" }}>내용</p>
          <ReactQuill
            key="quill"
            ref={quillRef}
            modules={modules}
            formats={formats}
            theme="snow"
            name="content"
            className="quill-editor"
            placeholder="내용을 입력해주세요."
            value={userInfo.content}
            onChange={(content) => setUserInfo({ ...userInfo, content })}
          />
          {errors.content && <p className="error-message">{errors.content}</p>}
        </div>
        {posttype === "nanum" && (
          <div>
            <label htmlFor="nanum">
              <input
                type="checkbox"
                id="nanum"
                name="nanum"
                checked={userInfo.nanum}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, nanum: e.target.checked })
                }
                style={{ marginTop: "40px" }}
              />
              나눔 완료
            </label>
          </div>
        )}
        <div className="button-container">
          <button className="greenbutton" type="submit">
            등록
          </button>
          <button
            className="cancelbutton"
            type="button"
            onClick={() => navigate(`/community-${posttype}`)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityWrite;
