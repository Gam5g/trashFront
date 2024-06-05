import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import "../container/pages/Community/Detail.css";
import AuthToken from "../container/pages/AuthToken";

const CommunityDetail = ({ postsType }) => {
  const location = useLocation();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const id = parseInt(location.pathname.split("/").pop());
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [post, setPost] = useState({
    title: "",
    content: "",
    recommend: "",
    view: "",
    writer: "",
    writerName: "",
    //createdDate: createdDate,
    //modifiedDate: modifiedDate,
    adopted: "",
    imageUrl: "",
    comments: "",
    adoptedComment: "",
  });
  const [loading, setLoading] = useState(true);
  const getAccountName = localStorage.getItem("accountName");
  const [questionBoardId, setQuestionBoardId] = useState();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인한 회원만 볼 수 있습니다.");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const questionBoardId = parseInt(location.pathname.split("/").pop());
    setQuestionBoardId(questionBoardId);
  }, []);

  const fetchBoardData = async () => {
    if (!questionBoardId) {
      return;
    }
    try {
      const response = await AuthToken.get(
        `http://3.39.190.90/api/questionBoard/read/${questionBoardId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = response.data;
      const createdDate = new Date(data.writer.createdDate).toLocaleString(
        "ko-KR",
        {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      const modifiedDate = new Date(data.writer.modifiedDate).toLocaleString(
        "ko-KR",
        {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      const content = data.content.replace(/^<p>|<\/p>$/g, "");
      const inputData = {
        title: data.title,
        content: content,
        recommend: data.recommend,
        view: data.view,
        writer: data.writer.nickname,
        writerName: data.writer.accountName,
        //createdDate: createdDate,
        //modifiedDate: modifiedDate,
        adopted: data.adopted,
        imageUrl: data.imageUrl,
        comments: data.comments,
        adoptedComment: data.adoptedComment,
      };

      setPost(inputData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [questionBoardId]);

  const togglePressLike = async () => {
    try {
      const response = await AuthToken.post(
        `http://3.39.190.90/api/questionBoard/recommend/${questionBoardId}/?id?={userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {}
  };

  // const togglePressLike = async () => {
  //   const questionBoardId = localStorage;
  //   try {
  //     const response = await AuthToken.post(
  //       `http://3.39.190.90/api/recommendBoard/${questionBoardId}?=accountId={userId}`,
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
      const response = await AuthToken.post(
        `http://3.39.190.90/api/questionComment/${questionBoardId}/create`,
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
      console.error("코멘트를 생성하는 데 오류 발생:", error);
    }
  };

  const deletePost = async () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      try {
        const response = await AuthToken.get(
          `http://3.39.190.90/api/questionBoard/delete/${questionBoardId}&id?={userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        alert("삭제되었습니다.");
        navigate(`/community-${postsType}`);
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
      }
    }
  };

  const deleteComment = async () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        const response = await AuthToken.get(
          `http://3.39.190.90/api/questionComment/delete/${questionBoardId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        alert("삭제되었습니다.");
        window.location.reload();
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
      }
    }
  };
  const editPost = async () => {};
  return (
    <div className="NotDrag">
      <div className="titleWrap" style={{ userSelect: "none" }}>
        {postsType === "bunri" ? "분리수거" : "나눔"} 커뮤니티 ＞
      </div>
      <p style={{ fontSize: "16px", marginTop: "-5px" }}>글 보기</p>
      <div className="container">
        <div className="post">
          {post && (
            <>
              {postsType === "bunri" && post.adopted == true ? (
                <div className="adopted-content">
                  <h1 className="adopted">채택</h1>
                  <h1>{post.title}</h1>
                </div>
              ) : (
                <div className="adopted-content">
                  <h1 className="not-adopted">채택 전</h1>
                  <h1>{post.title}</h1>
                </div>
              )}
              <div>
                글쓴이: {post.writer}
                <hr />
                <p>
                  조회수: {post.view} | 작성일: {post.createdDate} | 수정일 :{" "}
                  {post.modifiedDate} | 좋아요: {post.recommend}
                  {postsType === "nanum" && (
                    <span>| 나눔 완료 상태: {post.nanum}</span>
                  )}
                </p>
              </div>
              {post.content}
            </>
          )}
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
          <h3>{postsType === "bunri" ? "답변" : "댓글"}</h3>
          {post && (
            <div>
              <div>
                {post.adopted === true && <h5>채택 답변</h5>}
                {post.adoptedComment &&
                  post.adoptedComment.map((comment, index) => (
                    <div key={index}>{comment}</div>
                  ))}
              </div>
              <div className="comment-container">
                {post.comments &&
                  post.comments.map((comment, index) => (
                    <div className="comment" key={index}>
                      <div className="comment-content">
                        <h4>{comment.nickname}</h4>
                        <p>
                          {comment.content &&
                            JSON.parse(comment.content).comment}
                        </p>
                      </div>
                      <div className="comment-buttons">
                        {getAccountName === comment.accountName ? (
                          <>
                            <button className="modify-button">수정</button>
                            <button
                              className="delete-button"
                              onClick={deleteComment}
                            >
                              삭제
                            </button>
                          </>
                        ) : (
                          <button className="report-button">신고</button>
                        )}
                        {post.writerName !== comment.accountName &&
                          getAccountName === post.writerName &&
                          post.adopted === false && <button>채택하기</button>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          <hr style={{ border: "0.5px solid #d9d9d9" }}></hr>
          <div className="commentbox">
            <h5>{getAccountName}</h5>
            {isLoggedIn ? (
              <>
                <input
                  type="text"
                  name="comment"
                  className="commentinput"
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
        </div>
        {post && post.writerName && getAccountName === post.writerName ? (
          <div className="buttons">
            <button className="deleteButton" onClick={deletePost}>
              삭제
            </button>
            <button className="editButton" onClick={editPost}>
              수정
            </button>
            <button
              className="listButton"
              onClick={() => navigate(`/community-${postsType}`)}
            >
              목록
            </button>
          </div>
        ) : (
          <button
            className="listButton"
            onClick={() => navigate(`/community-${postsType}`)}
          >
            목록
          </button>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
