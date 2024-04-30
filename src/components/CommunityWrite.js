import React, { useRef, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import axios from "axios";
import "../container/pages/Community/Community.css";
import "../Button.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CommunityWrite = ({ posttype }) => {
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [userInfo, setUserInfo] = useState({
    title: "",
    content: "",
    nanum: false,
    images: [],
  });
  const [errors, setErrors] = useState({ title: "", content: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    "image",
  ];

  const quillRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    /* if (!isLoggedIn) {
      alert("로그인 한 후에 글을 작성할 수 있습니다.");
      return;
    } */
    const { title, content, images } = userInfo;
    if (!title.trim()) {
      setErrors((prev) => ({ ...prev, title: "제목은 필수 항목입니다." }));
    }

    if (content.trim().length < 10) {
      setErrors((prev) => ({
        ...prev,
        content: "내용은 최소 10자 이상이어야 합니다.",
      }));
    }

    try {
      {
        const res = await axios.post(
          "http://3.39.190.90/api/questionBoard/create",
          {
            title: title,
            content: content,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.data.success === true) {
          navigate("/post");
        }
      }
    } catch (error) {
      alert("글 등록에 실패했습니다. 다시 시도해주세요.");
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
            onChange={onChange}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>
        <div style={{ userSelect: "none" }}>
          <ReactQuill
            key="quill"
            ref={quillRef}
            modules={modules}
            formats={formats}
            theme="snow"
            name="content"
            style={{ width: "800px", height: "250px", marginBottom: "40px" }}
            placeholder="내용을 입력해주세요."
            value={userInfo.content}
            onChange={(content) => setUserInfo({ ...userInfo, content })}
          ></ReactQuill>
          {errors.content && <p className="error-message">{errors.content}</p>}
        </div>
        {posttype === "nanum" && (
          <label for="nanum">
            <input
              type="checkbox"
              id="nanum"
              name="nanum"
              value="나눔 완료"
              onChange={(e) =>
                setUserInfo({ ...userInfo, nanum: e.target.checked })
              }
              style={{ marginTop: "20px" }}
            />
            나눔 완료
          </label>
        )}
        <div className="button-container">
          <button className="greenbutton" type="submit">
            등록
          </button>
          <button
            className="cancelbutton"
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
