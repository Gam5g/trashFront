import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import "../container/pages/Community/Detail.css";
import AuthToken from "../container/pages/AuthToken";

const CommunityDetail = ({ posttype }) => {
  const location = useLocation();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const id = parseInt(location.pathname.split("/").pop());
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [bunriPost, setBunriPost] = useState({
    title: "",
    content: "",
    view: "",
    comments: "",
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
      const content = data.content
        ? data.content.replace(/^<p>|<\/p>$/g, "")
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
    } catch (error) {}
  };

  // const togglePressLike = async () => {
  //   const questionBoardId = localStorage;
  //   try {
  //     const response = await AuthToken.post(
  //       `/recommendBoard/${questionBoardId}?=accountId={userId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     setAccount(response.data);
  //   } catch (error) {
  //     console.error("게시글 정보를 가져오는 데 실패했습니다.", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleComment = async () => {
    try {
      if (comment.trim().length < 10 || comment.trim().length >= 100) {
        setErrors((prev) => ({
          ...prev,
          comment: "내용은 10자 이상 100자 이하여야 합니다.",
        }));
        return;
      }
      await AuthToken.post(
        `/questionComment/${questionBoardId}/create`,
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

  const deletePost = async () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      let url = "";
      try {
        if (posttype == "bunri") {
          url = `/questionBoard/delete/${questionBoardId}`;
        } else if (posttype == "nanum") {
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
        const questionCommentId = commentId;
        await AuthToken.get(`/questionComment/delete/${questionCommentId}`, {
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
        alert("댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.", error);
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
      <div className="titleWrap" style={{ userSelect: "none" }}>
        {posttype === "bunri" ? "분리수거" : "나눔"} 커뮤니티 ＞
      </div>
      <p style={{ fontSize: "16px", marginTop: "-5px" }}>글 보기</p>
      <div className="container">
        <div className="post">
          {posttype === "bunri" ? (
            bunriPost.adopted === true ? (
              <div className="adopted-content">
                <h1 className="adopted">채택</h1>
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
              글쓴이: {nanumPost.writer} | 나눔 위치 : {nanumPost.location} |
              나눔 항목 : {nanumPost.shareTarget}
              <hr />
              <p>
                조회수: {nanumPost.view} | 작성일 : {nanumPost.createdDate}
              </p>
              {nanumPost.content}
            </div>
          ) : (
            <div>
              글쓴이: {bunriPost.writer}
              <hr />
              <p>
                조회수: {bunriPost.view} | 추천수: {bunriPost.recommend}
              </p>
              {bunriPost.content}
            </div>
          )}
          {posttype === "bunri" && (
            <>
              <h6 style={{ color: "gray", textAlign: "center" }}>
                이 게시글이 좋다면
              </h6>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "-20px",
                  marginBottom: "20px",
                }}
              >
                <button
                  className="likesButton"
                  onClick={togglePressLike}
                  disabled={!isLoggedIn}
                >
                  👍
                </button>
              </div>
              <hr style={{ border: "0.5px solid #d9d9d9" }}></hr>
            </>
          )}

          <h3>{posttype === "bunri" ? "답변" : "댓글"}</h3>
          {(posttype === "bunri" && bunriPost) ||
          (posttype === "nanum" && nanumPost) ? (
            <div>
              {posttype === "bunri" && bunriPost.adopted === true && (
                <div>
                  <h5>채택 답변</h5>
                  {bunriPost.adoptedComment &&
                    bunriPost.adoptedComment.map((comment, index) => (
                      <div key={index}>{comment}</div>
                    ))}
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
                      <div className="comment-content">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <h4>{comment.nickname}</h4>
                          <h6>{formatDate(comment.createdDate)}</h6>
                        </div>
                        <p>
                          {comment.content &&
                            JSON.parse(comment.content).comment}
                        </p>
                      </div>
                      <div className="comment-buttons">
                        {getNickname === comment.nickname ? (
                          <>
                            <button className="modify-button">수정</button>
                            <button
                              className="delete-button"
                              onClick={() => deleteComment(comment.id)}
                            >
                              삭제
                            </button>
                          </>
                        ) : (
                          <button className="report-button">신고</button>
                        )}
                        {posttype === "bunri" &&
                          bunriPost.writer !== comment.nickname &&
                          getNickname === bunriPost.writer &&
                          bunriPost.adopted === false && (
                            <button
                              type="button"
                              onClick={() => adoptComment(comment.id)}
                            >
                              채택하기
                            </button>
                          )}
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
          {(posttype === "bunri" && bunriPost.writer === getNickname) ||
          (posttype === "nanum" && nanumPost.writer === getNickname) ? (
            <div className="buttons">
              <button className="deleteButton" onClick={deletePost}>
                삭제
              </button>
              <button
                type="button"
                className="editButton"
                onClick={navigateToEditPost}
              >
                수정
              </button>
              <button
                className="listButton"
                onClick={() => navigate(`/community-${posttype}`)}
              >
                목록
              </button>
            </div>
          ) : (
            <button
              className="listButton"
              onClick={() => navigate(`/community-${posttype}`)}
            >
              목록
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
