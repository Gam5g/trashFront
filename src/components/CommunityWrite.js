import React, { useRef, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize";
import AuthToken from "../container/pages/AuthToken";
import "../container/pages/Community/Community.css";
import "../Button.css";
import "./CommunityWrite.css";

Quill.register("modules/imageResize", ImageResize);

const CommunityWrite = ({ posttype }) => {
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [bunriInfo, setBunriInfo] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [nanumInfo, setNanumInfo] = useState({
    title: "",
    content: "",
    shareTarget: "",
    location: "",
    imageUrl: "",
    collection: false,
  });
  const [lastFile, setLastFile] = useState(null);
  const [errors, setErrors] = useState({ title: "", content: "" });
  const questionId = null;
  const recycleId = null;

  const handleUploadSuccess = (url) => {
    if (posttype === "bunri") {
      setBunriInfo((prev) => ({ ...prev, imageUrl: url }));
    } else if (posttype === "nanum") {
      setNanumInfo((prev) => ({ ...prev, imageUrl: url }));
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (posttype === "bunri") {
      setBunriInfo((prev) => ({ ...prev, [name]: value }));
    } else if (posttype === "nanum") {
      setNanumInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        setLastFile(file);

        const reader = new FileReader();
        reader.onload = () => {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
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
    let url = "";
    let title, content, imageUrl, shareTarget, location;
    if (!isLoggedIn) {
      alert("로그인 한 후에 글을 작성할 수 있습니다.");
      return;
    }
    if (posttype === "bunri") {
      ({ title, content, imageUrl } = bunriInfo);
    } else if (posttype === "nanum") {
      ({ title, content, imageUrl, shareTarget, location } = nanumInfo);
      if (!title.trim()) {
        setErrors((prev) => ({ ...prev, title: "제목은 필수 항목입니다." }));
        return;
      }
      if (!shareTarget.trim()) {
        setErrors((prev) => ({
          ...prev,
          shareTarget: "나눔할 항목을 작성하세요.",
        }));
        return;
      }
      if (!location.trim()) {
        setErrors((prev) => ({
          ...prev,
          location: "나눔할 위치를 작성하세요.",
        }));
        return;
      }
    }

    if (content.trim().length < 10) {
      setErrors((prev) => ({
        ...prev,
        content: "내용은 최소 10자 이상이어야 합니다.",
      }));
      return;
    }

    if (lastFile) {
      try {
        const formData = new FormData();
        formData.append("image", lastFile);

        const response = await AuthToken.post(`/s3`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageURL = response.data;
        if (!imageURL) {
          throw new Error("Image URL not found in response");
        }
        handleUploadSuccess(imageURL);
      } catch (error) {
        if (error.response.data.cause === "MaxUploadSizeExceededException") {
          alert("업로드할 사진 용량을 초과했습니다.");
          return;
        }
        console.error("에러 :", error);
      }
    }

    if (posttype === "bunri") {
      url = `/questionBoard/create?id=${questionId}`;
    } else if (posttype === "nanum") {
      url = `/recycleBoard/create?id=${recycleId}`;
    }
    try {
      const payload =
        posttype === "bunri"
          ? { title, content, imageUrl }
          : { title, content, imageUrl, shareTarget, location };

      const res = await AuthToken.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("글을 작성했습니다.");
      navigate(`/community-${posttype}`);
    } catch (error) {
      alert("글 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="NotDrag">
      <div className="community-title-wrap" style={{ userSelect: "none" }}>
        {posttype === "bunri" ? "분리수거" : "나눔"} 커뮤니티 &gt;
      </div>

      <p className="community-subtitle-wrap">글 작성</p>
      <form onSubmit={onSubmit}>
        <div className="write" style={{ userSelect: "none" }}>
          <p style={{ color: "gray", fontSize: "14px" }}>제목</p>
          <input
            type="text"
            id="title_txt"
            name="title"
            value={posttype === "bunri" ? bunriInfo.title : nanumInfo.title}
            onChange={onChange}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>
        {posttype === "nanum" && (
          <>
            <div>
              <div className="button-container">
                <p>공유 대상</p>
                <input
                  className="community-input-content"
                  type="text"
                  id="shareTarget"
                  name="shareTarget"
                  value={nanumInfo.shareTarget}
                  onChange={onChange}
                />
              </div>
              {errors.shareTarget && (
                <p className="error-message">{errors.shareTarget}</p>
              )}
            </div>
            <div>
              <div className="button-container">
                <p>위치</p>
                <input
                  className="community-input-content"
                  type="text"
                  id="location"
                  name="location"
                  value={nanumInfo.location}
                  onChange={onChange}
                />
              </div>
              {errors.location && (
                <p className="error-message">{errors.location}</p>
              )}
            </div>
          </>
        )}
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
            value={posttype === "bunri" ? bunriInfo.content : nanumInfo.content}
            onChange={(content) =>
              posttype === "bunri"
                ? setBunriInfo({ ...bunriInfo, content })
                : setNanumInfo({ ...nanumInfo, content })
            }
          />
          {errors.content && <p className="error-message">{errors.content}</p>}
        </div>

        <div className="community-write-button-container">
          <button className="green-button" type="submit">
            등록
          </button>
          <button
            className="cancel-button"
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
