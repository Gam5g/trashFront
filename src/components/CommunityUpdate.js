import React, { useRef, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import "../container/pages/Community/Community.css";
import "../Button.css";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize";
import AuthToken from "../container/pages/AuthToken";
import { useMediaQuery } from "react-responsive";
//import { S3_BUCKET } from "../S3Upload";

Quill.register("modules/imageResize", ImageResize);

const CommunityUpdate = ({ posttype }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const post = location.state;
  const [bunriInfo, setBunriInfo] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  const [nanumInfo, setNanumInfo] = useState({
    title: "",
    content: "",
    nanum: false,
    imageUrl: "",
  });
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  let questionId = null;

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
    input.setAttribute("type", "file"); //파일 입력요소를 file 타입으로 설정
    input.setAttribute("accept", "image/*"); //파일 입력요소가 이미지 선택할 수 있게 accept 속성 설정
    input.click(); //파일 입력요소 클릭
    input.addEventListener("change", async () => {
      const file = input.files[0];
      try {
        const name = Date.now();
      } catch (error) {
        console.log(error);
      }
    });
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
    let url = "";
    let title, content, imageUrl, nanum;
    if (posttype === "bunri") {
      url = `http://3.39.190.90/api/questionBoard/update?id=${questionId}`;
      ({ title, content, imageUrl } = bunriInfo);
    } else if (posttype === "nanum") {
      url = ``;
      ({ title, content, imageUrl, nanum } = nanumInfo);
    }
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
      const payload =
        posttype === "bunri"
          ? { title, content, imageUrl }
          : { title, content, imageUrl, nanum };
      const res = await AuthToken.post(url, payload, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
          "Content-Type": "application/json",
        },
      });
      alert("글을 수정했습니다.");
      navigate(`/community-${posttype}`);
    } catch (error) {
      alert("글 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="NotDrag">
      <div className="titleWrap" style={{ userSelect: "none" }}>
        {posttype === "bunri" ? "분리수거" : "나눔"} 커뮤니티 &gt;
      </div>

      <p style={{ fontSize: "16px", marginTop: "-5px" }}>글 수정</p>
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
        {posttype === "nanum" && (
          <div>
            <label htmlFor="nanum">
              <input
                type="checkbox"
                id="nanum"
                name="nanum"
                checked={nanumInfo.nanum}
                onChange={(e) =>
                  setNanumInfo({ ...nanumInfo, nanum: e.target.checked })
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

export default CommunityUpdate;
