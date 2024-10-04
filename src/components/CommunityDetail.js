import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import "./CommunityDetail.css";
import "../container/pages/Community/Detail.css";
import AuthToken from "../container/pages/AuthToken";

const CommunityDetail = ({ posttype }) => {
  const location = useLocation();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const id = parseInt(location.pathname.split("/").pop());
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [bunriPost, setBunriPost] = useState({
    title: "",
    content: "",
    view: "",
    comments: [],
    writer: "",
    imageUrl: "",
    recommend: "",
    adopted: false,
    adoptedComment: [],
  });
  const [nanumPost, setNanumPost] = useState({
    title: "",
    content: "",
    view: "",
    comments: [],
    shareTarget: "",
    writer: "",
    imageUrl: "",
    createdDate: "",
    location: "",
    collection: false,
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ comment: "" });
  const getNickname = localStorage.getItem("nickname");
  const getAccountName = localStorage.getItem("accountName");
  const [questionBoardId, setQuestionBoardId] = useState();
  const [recycleBoardId, setRecycleBoardId] = useState();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인한 회원만 볼 수 있습니다.");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (posttype === "bunri") {
      const questionBoardId = parseInt(location.pathname.split("/").pop());
      setQuestionBoardId(questionBoardId);
    } else if (posttype === "nanum") {
      const recycleBoardId = parseInt(location.pathname.split("/").pop());
      setRecycleBoardId(recycleBoardId);
    }
  }, [posttype]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchBoardData = async () => {
    if (!questionBoardId && !recycleBoardId) {
      return;
    }
    try {
      let url = "";
      if (posttype === "bunri") {
        url = `/questionBoard/read/${questionBoardId}`;
      } else if (posttype === "nanum") {
        url = `/recycleBoard/read/${recycleBoardId}`;
      }

      const response = await AuthToken.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      const createdDate = formatDate(data.createdDate);
      const content = data.imageUrl
        ? data.content
          ? data.content.replace(/<img[^>]*>/g, "").replace(/^<p>|<\/p>$/g, "")
          : ""
        : data.content
          ? data.content.replace(/<img[^>]*>/g, "").replace(/^<p>|<\/p>$/g, "")
          : "";
      if (posttype === "bunri") {
        setBunriPost({
          title: data.title || "",
          content: content,
          view: data.view || 0,
          recommend: data.recommend || 0,
          comments: data.comments || [],
          writer: data.writer || "",
          imageUrl: data.imageUrl || "",
          adopted: data.adopted || false,
          adoptedComment: data.adoptedComment || [],
        });
      } else if (posttype === "nanum") {
        setNanumPost({
          title: data.title || "",
          content: content,
          view: data.view || 0,
          comments: data.comments || [],
          writer: data.writer || "",
          imageUrl: data.imageUrl || "",
          createdDate: createdDate,
          location: data.location || "",
          shareTarget: data.shareTarget || "",
          collection: data.collection || false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [questionBoardId, recycleBoardId]);

  const togglePressLike = async () => {
    try {
      await AuthToken.post(`/questionBoard/recommend/${questionBoardId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("게시글 추천 중 오류 발생:", error);
    }
  };

  useEffect(() => {}, [togglePressLike]);

  const recommendComment = async (questionCommentId) => {
    try {
      await AuthToken.post(`/questionComment/recommend/${questionCommentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchBoardData();
    } catch (error) {
      console.error("댓글 추천 중 오류 발생:", error);
    }
  };

  const handleComment = async () => {
    try {
      if (comment.trim().length < 10 || comment.trim().length >= 100) {
        setErrors((prev) => ({
          ...prev,
          comment: "내용은 10자 이상 100자 이하여야 합니다.",
        }));
        return;
      }
      let url = "";
      if (posttype === "bunri") {
        url = `/questionComment/${questionBoardId}/create`;
      } else if (posttype === "nanum") {
        url = `/recycleComment/${recycleBoardId}/create`;
      }
      await AuthToken.post(
        url,
        {
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("댓글 작성이 완료되었습니다.");
      window.location.reload();
      setComment("");
    } catch (error) {
      alert("코멘트를 생성하는 데 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const startEditingComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const handleUpdateComment = async () => {
    try {
      if (
        editingContent.trim().length < 10 ||
        editingContent.trim().length >= 100
      ) {
        setErrors((prev) => ({
          ...prev,
          comment: "내용은 10자 이상 100자 이하여야 합니다.",
        }));
        return;
      }
      let url = "";
      if (posttype === "bunri") {
        url = `/questionComment/update/${editingCommentId}`;
      } else if (posttype === "nanum") {
        url = `/recycleComment/update/${editingCommentId}`;
      }
      await AuthToken.put(
        url,
        {
          comment: editingContent,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("댓글 수정이 완료되었습니다.");
      setEditingCommentId(null);
      setEditingContent("");
      fetchBoardData();
    } catch (error) {
      alert("댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const deletePost = async () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      let url = "";
      try {
        if (posttype === "bunri") {
          url = `/questionBoard/delete/${questionBoardId}`;
        } else if (posttype === "nanum") {
          url = `/recycleBoard/delete/${recycleBoardId}`;
        }
        await AuthToken.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("삭제되었습니다.");
        navigate(`/community-${posttype}`);
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
      }
    }
  };

  const deleteComment = async (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        let url = ``;

        if (posttype === "bunri") {
          const questionCommentId = commentId;
          url = `/questionComment/delete/${questionCommentId}`;
        } else if (posttype === "nanum") {
          const recycleCommentId = commentId;
          url = `/recycleComment/delete/${recycleCommentId}`;
        }
        await AuthToken.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("삭제되었습니다.");
        window.location.reload();
      } catch (error) {
        alert("댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.", error);
      }
    }
  };

  const adoptComment = async (commentId) => {
    if (window.confirm("해당 댓글을 채택하시겠습니까?")) {
      try {
        const questionCommentId = commentId;
        await AuthToken.post(
          `/questionBoard/read/${questionBoardId}/${questionCommentId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        alert("해당 댓글이 채택되었습니다.");
        window.location.reload();
      } catch (error) {
        alert("댓글 채택 중 오류가 발생했습니다. 다시 시도해주세요.", error);
      }
    }
  };
  const navigateToEditPost = () => {
    navigate(`/community-${posttype}/update`, {
      state: {
        post: posttype === "bunri" ? bunriPost : nanumPost,
        boardId: posttype === "bunri" ? questionBoardId : recycleBoardId,
      },
    });
  };

  const commentLength =
    posttype === "bunri"
      ? bunriPost.comments.length
      : nanumPost.comments.length;

  const marginTopValues = [
    { condition: 10, value: "1540px" },
    { condition: 9, value: "1390px" },
    { condition: 8, value: "1240px" },
    { condition: 7, value: "1090px" },
    { condition: 6, value: "940px" },
    { condition: 5, value: "790px" },
    { condition: 4, value: "640px" },
    { condition: 3, value: "490px" },
    { condition: 2, value: "340px" },
    { condition: 1, value: "150px" },
  ];

  const marginTopValue =
    marginTopValues.find((mtv) => commentLength >= mtv.condition)?.value ||
    "0px";

  return (
    <div className="NotDrag" style={{ marginTop: marginTopValue }}>
      <div
        className="community-detail-title-wrap"
        style={{ userSelect: "none" }}
      >
        {posttype === "bunri" ? "분리수거" : "나눔"} 커뮤니티 ＞
      </div>
      <p className="community-detail-subtitle-wrap">글 보기</p>
      <div className="container">
        <div className="post">
          {posttype === "bunri" ? (
            bunriPost.adopted === true ? (
              <div className="adopted-content">
                <h1 className="adopted">채택 완료</h1>
                <h1>{bunriPost.title}</h1>
              </div>
            ) : (
              <div className="adopted-content">
                <h1 className="not-adopted">채택 전</h1>
                <h1>{bunriPost.title}</h1>
              </div>
            )
          ) : posttype === "nanum" ? (
            nanumPost.collection === true ? (
              <div className="adopted-content">
                <h1 className="adopted">나눔 완료</h1>
                <h1>{nanumPost.title}</h1>
              </div>
            ) : (
              <div className="adopted-content">
                <h1 className="not-adopted">나눔 전</h1>
                <h1>{nanumPost.title}</h1>
              </div>
            )
          ) : null}

          {posttype === "nanum" ? (
            <div>
              <div className="writer-and-buttons-container">
                글쓴이: {nanumPost.writer} | 나눔 위치 : {nanumPost.location} |
                나눔 항목 : {nanumPost.shareTarget}
                {(posttype === "bunri" && bunriPost.writer === getNickname) ||
                  (posttype === "nanum" && nanumPost.writer === getNickname && (
                    <div className="post-buttons">
                      <button
                        type="button"
                        className="list-button"
                        onClick={navigateToEditPost}
                      >
                        수정
                      </button>
                      <button className="list-button" onClick={deletePost}>
                        삭제
                      </button>
                    </div>
                  ))}
              </div>
              <hr />
              <p>
                조회수: {nanumPost.view} | 작성일 : {nanumPost.createdDate}
              </p>
              {nanumPost.imageUrl && (
                <img
                  src={nanumPost.imageUrl}
                  style={{ width: "30%", height: "30%" }}
                />
              )}
              <br />
              {nanumPost.content}
            </div>
          ) : (
            <div className="writer-and-buttons-container">
              <div className="writer-info">글쓴이: {bunriPost.writer}</div>
              {(posttype === "bunri" && bunriPost.writer === getNickname) ||
                (posttype === "nanum" && nanumPost.writer === getNickname && (
                  <div className="post-buttons">
                    <button
                      type="button"
                      className="list-button"
                      onClick={navigateToEditPost}
                    >
                      수정
                    </button>
                    <button className="list-button" onClick={deletePost}>
                      삭제
                    </button>
                  </div>
                ))}
              <hr />
              <p>
                조회수: {bunriPost.view} | 추천수: {bunriPost.recommend}
              </p>
              {bunriPost.imageUrl && (
                <img
                  src={bunriPost.imageUrl}
                  style={{ width: "30%", height: "30%" }}
                />
              )}
              <br />
              {bunriPost.content}
            </div>
          )}
          {posttype === "bunri" && (
            <>
              <h6 style={{ color: "gray", textAlign: "center" }}>
                이 게시글이 좋다면
              </h6>
              <div className="likes-container">
                <button
                  className="likes-button"
                  onClick={togglePressLike}
                  disabled={!isLoggedIn}
                >
                  <svg
                    width="28"
                    height="27"
                    viewBox="0 0 28 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.2105 6.9875e-09C17.3382 -6.39036e-05 18.4233 0.438289 19.2438 1.22537C20.0642 2.01245 20.5654 3.35264 20.6316 4.49796V10.4952H23.5789C24.6623 10.4951 25.708 10.8996 26.5175 11.632C27.3271 12.3644 27.8736 13.3988 28 14.4934V14.9932L26.488 22.8316C25.9265 25.2695 24.2745 27.0237 22.3469 26.9998L10.3158 26.9878C9.95483 26.9877 9.60307 26.732 9.33333 26.488C9.0636 26.244 8.88434 25.8532 8.8421 25.4884L8.84358 11.1909C8.84384 10.928 8.91206 10.6698 9.04139 10.4421C9.17072 10.2145 9.35662 10.0255 9.58042 9.89401C10.3158 9.4957 10.3158 9.4957 10.9486 8.63806C11.3321 8.0113 11.7307 7.03676 11.7792 6.30014L11.7895 4.49796C11.7895 3.30503 12.2553 2.16095 13.0844 1.31742C13.9135 0.473891 15.038 6.9875e-09 16.2105 6.9875e-09ZM4.42105 10.4952C4.78201 10.4953 5.13039 10.6301 5.40013 10.8741C5.66986 11.1182 5.85251 11.6299 5.89474 11.9946V25.4884C5.89469 25.8557 5.76217 26.2101 5.52231 26.4846C5.28246 26.759 4.95195 26.9343 4.59347 26.9773L2.94737 26.9878C2.20378 26.988 1.48759 26.7023 0.94235 26.1879C0.397115 25.6735 0.0631377 24.9684 0.00736874 24.214L1.47763e-07 13.4939C-0.000235169 12.7374 0.280599 12.0087 0.786206 11.454C1.29181 10.8993 2.20588 10.552 2.94737 10.4952H4.42105Z" />
                  </svg>
                  <p className="likes-number">{bunriPost.recommend}</p>
                </button>
              </div>
              <hr style={{ border: "0.5px solid #d9d9d9" }}></hr>
            </>
          )}

          <h3>{posttype === "bunri" ? "답변" : "댓글"}</h3>
          {(posttype === "bunri" && bunriPost) ||
          (posttype === "nanum" && nanumPost) ? (
            <div>
              {posttype === "bunri" &&
                bunriPost.adopted === true &&
                bunriPost.adoptedComment && (
                  <div className="adopted-comment-container">
                    <h2 style={{ color: "green" }}>채택된 답변</h2>
                    <div className="adopted-comment">
                      <span className="nickname">
                        {bunriPost.adoptedComment.nickname}
                      </span>
                      <div className="comment-content">
                        <p>
                          {JSON.parse(bunriPost.adoptedComment.content).comment}
                        </p>
                      </div>
                    </div>
                    <span className="date">
                      {formatDate(bunriPost.adoptedComment.createdDate)}
                    </span>
                  </div>
                )}
              <div className="comment-container">
                {(posttype === "bunri"
                  ? bunriPost.comments
                  : nanumPost.comments) &&
                  (posttype === "bunri"
                    ? bunriPost.comments
                    : nanumPost.comments
                  ).map((comment, index) => (
                    <div className="comment" key={index}>
                      <div className="comment-header">
                        <span className="nickname">{comment.nickname}</span>
                        {}
                      </div>
                      {editingCommentId === comment.id ? (
                        <div>
                          <textarea
                            type="text"
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="comment-update-textarea"
                          />
                        </div>
                      ) : (
                        <div className="comment-content">
                          <p>
                            {comment.content &&
                              JSON.parse(comment.content).comment}
                          </p>
                        </div>
                      )}
                      <div className="comment-info-container">
                        <span className="comment-date">
                          {formatDate(comment.createdDate)}
                        </span>
                        <div className="comment-buttons">
                          {posttype === "bunri" &&
                          getNickname !== comment.nickname ? (
                            <button
                              type="button"
                              className="recommend-button"
                              onClick={() => recommendComment(comment.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                              >
                                <path
                                  d="M17.7368 5C18.6229 4.99995 19.4754 5.34089 20.1201 5.95307C20.7647 6.56524 21.1585 7.60761 21.2105 8.49841V13.163H23.5263C24.3775 13.1628 25.1991 13.4775 25.8352 14.0471C26.4713 14.6168 26.9007 15.4213 27 16.2727V16.6614L25.812 22.7579C25.3708 24.6541 24.0728 26.0185 22.5583 25.9998L13.1053 25.9905C12.8217 25.9904 12.5453 25.7916 12.3333 25.6018C12.1214 25.412 11.9806 25.108 11.9474 24.8243L11.9485 13.7041C11.9487 13.4996 12.0023 13.2987 12.104 13.1217C12.2056 12.9446 12.3516 12.7976 12.5275 12.6953C13.1053 12.3855 13.1053 12.3855 13.6025 11.7185C13.9038 11.231 14.217 10.473 14.2551 9.90011L14.2632 8.49841C14.2632 7.57058 14.6291 6.68074 15.2806 6.02466C15.932 5.36858 16.8156 5 17.7368 5ZM8.47368 13.163C8.75729 13.163 9.03102 13.2679 9.24296 13.4577C9.45489 13.6475 9.5984 14.0454 9.63158 14.3291V24.8243C9.63154 25.11 9.52742 25.3857 9.33896 25.5991C9.1505 25.8125 8.89082 25.9489 8.60916 25.9823L7.31579 25.9905C6.73154 25.9907 6.16882 25.7684 5.74042 25.3684C5.31202 24.9683 5.04961 24.4199 5.00579 23.8331L5 15.4952C4.99982 14.9068 5.22047 14.3401 5.61773 13.9087C6.015 13.4772 6.73319 13.2071 7.31579 13.163H8.47368Z"
                                  fill="#8AAB5F"
                                />
                              </svg>{" "}
                              <p className="recommend-number">
                                {comment.recommend}
                              </p>
                            </button>
                          ) : (
                            <div>
                              {" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                              >
                                <path
                                  d="M17.7368 5C18.6229 4.99995 19.4754 5.34089 20.1201 5.95307C20.7647 6.56524 21.1585 7.60761 21.2105 8.49841V13.163H23.5263C24.3775 13.1628 25.1991 13.4775 25.8352 14.0471C26.4713 14.6168 26.9007 15.4213 27 16.2727V16.6614L25.812 22.7579C25.3708 24.6541 24.0728 26.0185 22.5583 25.9998L13.1053 25.9905C12.8217 25.9904 12.5453 25.7916 12.3333 25.6018C12.1214 25.412 11.9806 25.108 11.9474 24.8243L11.9485 13.7041C11.9487 13.4996 12.0023 13.2987 12.104 13.1217C12.2056 12.9446 12.3516 12.7976 12.5275 12.6953C13.1053 12.3855 13.1053 12.3855 13.6025 11.7185C13.9038 11.231 14.217 10.473 14.2551 9.90011L14.2632 8.49841C14.2632 7.57058 14.6291 6.68074 15.2806 6.02466C15.932 5.36858 16.8156 5 17.7368 5ZM8.47368 13.163C8.75729 13.163 9.03102 13.2679 9.24296 13.4577C9.45489 13.6475 9.5984 14.0454 9.63158 14.3291V24.8243C9.63154 25.11 9.52742 25.3857 9.33896 25.5991C9.1505 25.8125 8.89082 25.9489 8.60916 25.9823L7.31579 25.9905C6.73154 25.9907 6.16882 25.7684 5.74042 25.3684C5.31202 24.9683 5.04961 24.4199 5.00579 23.8331L5 15.4952C4.99982 14.9068 5.22047 14.3401 5.61773 13.9087C6.015 13.4772 6.73319 13.2071 7.31579 13.163H8.47368Z"
                                  fill="#8AAB5F"
                                />
                              </svg>{" "}
                              <p className="recommend-number">
                                {comment.recommend}
                              </p>
                            </div>
                          )}
                          {getNickname === comment.nickname &&
                          editingCommentId !== comment.id ? (
                            <>
                              <button
                                className="comment-button"
                                onClick={() =>
                                  startEditingComment(
                                    comment.id,
                                    JSON.parse(comment.content).comment
                                  )
                                }
                              >
                                수정
                              </button>

                              <button
                                className="comment-button"
                                onClick={() => deleteComment(comment.id)}
                              >
                                삭제
                              </button>
                            </>
                          ) : (
                            editingCommentId === comment.id && (
                              <>
                                <button
                                  onClick={handleUpdateComment}
                                  className="comment-button"
                                >
                                  등록
                                </button>
                                <button
                                  onClick={() => setEditingCommentId(null)}
                                  className="comment-button"
                                >
                                  취소
                                </button>
                              </>
                            )
                          )}
                          {posttype === "bunri" &&
                            bunriPost.writer !== comment.nickname &&
                            getNickname === bunriPost.writer &&
                            bunriPost.adopted === false && (
                              <button
                                type="button"
                                className="adopted-button"
                                onClick={() => adoptComment(comment.id)}
                              >
                                채택하기
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          <hr style={{ border: "0.5px solid #d9d9d9" }}></hr>

          <div className="commentbox">
            <h5>{getNickname}</h5>
            {isLoggedIn ? (
              <>
                <textarea
                  type="text"
                  name="comment"
                  className="comment-textarea"
                  placeholder="답글 입력하기"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <br />
                <button onClick={handleComment} className="submitButton">
                  등록
                </button>
              </>
            ) : (
              <input placeholder="로그인하세요" disabled></input>
            )}
          </div>
          {errors.comment && <p className="error-message">{errors.comment}</p>}
          <button
            className="list-button"
            onClick={() => navigate(`/community-${posttype}`)}
          >
            목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
