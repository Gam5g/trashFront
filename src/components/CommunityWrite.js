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
import S3Upload from "../S3Upload";
import AWS from "aws-sdk";

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
  const [errors, setErrors] = useState({ title: "", content: "" });
  const questionId = null;
  const recycleId = null;
  const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
  const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
  const REGION = process.env.REACT_APP_REGION;
  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const uploadFileToS3 = (file) => {
    return new Promise((resolve, reject) => {
      const params = {
        ACL: "public-read",
        Body: file,
        Bucket: S3_BUCKET,
        Key: `${Date.now()}-${file.name}`,
      };

      myBucket.putObject(params).send((err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const imageUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${params.Key}`;
          resolve(imageUrl);
        }
      });
    });
  };

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

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const imageUrl = await uploadFileToS3(file);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", imageUrl);
          setBunriInfo((prev) => ({ ...prev, imageUrl }));
        } catch (error) {
          console.log(error);
        }
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
    }
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
      setErrors((prev) => ({ ...prev, location: "나눔할 위치를 작성하세요." }));
      return;
    }
    if (content.trim().length < 10) {
      setErrors((prev) => ({
        ...prev,
        content: "내용은 최소 10자 이상이어야 합니다.",
      }));
      return;
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
          Authorization: localStorage.getItem("accessToken"),
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
            value={posttype === "bunri" ? bunriInfo.title : nanumInfo.title}
            onChange={onChange}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>
        {posttype === "nanum" && (
          <>
            <div>
              <div className="button-container">
                <p
                  style={{
                    color: "gray",
                    fontSize: "14px",
                    marginLeft: "-70px",
                    marginRight: "10px",
                  }}
                >
                  공유 대상
                </p>
                <label htmlFor="shareTarget" className="inputWrap">
                  <input
                    className="inputContent"
                    type="text"
                    id="shareTarget"
                    name="shareTarget"
                    value={nanumInfo.shareTarget}
                    onChange={onChange}
                  />
                </label>
              </div>
              {errors.shareTarget && (
                <p className="error-message">{errors.shareTarget}</p>
              )}
            </div>
            <div>
              <div className="button-container">
                <p
                  style={{
                    marginLeft: "-75px",
                    color: "gray",
                    fontSize: "14px",
                    marginRight: "30px",
                  }}
                >
                  {" "}
                  위치
                </p>
                <label htmlFor="location" className="inputWrap">
                  <input
                    className="inputContent"
                    type="text"
                    id="location"
                    name="location"
                    value={nanumInfo.location}
                    onChange={onChange}
                  />
                </label>
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
