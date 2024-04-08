import React, { useRef, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../AuthContext";
import axios from "axios";
import "../container/pages/Community/Community.css";
import "../Button.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CommunityWrite = ({ posttype }) => {
  const { isLoggedIn } = useAuthState();
  const [userInfo, setUserInfo] = useState({
    title: "",
    content: "",
  });
  const [TitleError, setTitleError] = useState("");
  const [ContentError, setContentError] = useState("");

  const onChangeTitle = (e) => {
    setTitleError("");
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeContent = (content) => {
    setContentError("");
    setUserInfo({
      ...userInfo,
      content: content,
    });
  };

  const onChangeNanum = (nanum) => {
    setUserInfo({
      ...userInfo,
      nanum: nanum,
    });
  };

  const NavigateToList = () => {
    navigate(`/community-${posttype}`);
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }, "link", "image"],
        ],
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
    "blockquote",
    "list",
    "bullet",
    "indent",
    "background",
    "color",
    "link",
  ];

  const quillRef = useRef(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!isLoggedIn) {
        alert("로그인 한 후에 글을 작성할 수 있습니다.");
        return;
      }
      if (userInfo.title.trim() === "") {
        setTitleError("제목은 필수 항목입니다.");
      }

      if (userInfo.content.trim().length < 10) {
        setContentError("내용은 최소 10자 이상이어야 합니다.");
      }

      if (
        userInfo.title.trim() !== "" &&
        userInfo.content.trim().length >= 10
      ) {
        const res = await axios.post(`url`, {
          title: userInfo.title,
          content: userInfo.content,
        });
        if (res.data.success === true) {
          navigate("/post");
        }
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="NotDrag">
      <div className="titleWrap" style={{ userSelect: "none" }}>
        {posttype === "bunri" ? "분리수거" : "나눔"} 게시판 글쓰기
      </div>
      <form onSubmit={onSubmit}>
        <div className="write" style={{ userSelect: "none" }}>
          <input
            type="text"
            id="title_txt"
            name="title"
            placeholder="제목"
            value={userInfo.title}
            onChange={onChangeTitle}
          />
          {TitleError && <p className="error-message">{TitleError}</p>}
        </div>
        <div style={{ userSelect: "none" }}>
          <ReactQuill
            key="quill"
            ref={quillRef}
            modules={modules}
            formats={formats}
            theme="snow"
            style={{ width: "800px", height: "250px", marginBottom: "40px" }}
            placeholder="내용을 입력해주세요."
            value={userInfo.content}
            onChange={onChangeContent}
          ></ReactQuill>
          {ContentError && <p className="error-message">{ContentError}</p>}
        </div>
        {posttype === "nanum" && (
          <label for="nanum">
            <input
              type="checkbox"
              id="nanum"
              name="nanum"
              value="나눔 완료"
              onChange={onChangeNanum}
              style={{ marginTop: "20px" }}
            />
            나눔 완료
          </label>
        )}
        <div></div>
        <button className="loginbutton" type="submit">
          등록
        </button>
        <button className="cancelbutton" onClick={NavigateToList}>
          취소
        </button>
      </form>
    </div>
  );
};

export default CommunityWrite;
