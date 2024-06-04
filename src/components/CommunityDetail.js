import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import "../container/pages/Community/Detail.css";
import AuthToken from "../container/pages/AuthToken";

const CommunityDetail = ({ posts, postsType }) => {
  const location = useLocation();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const id = parseInt(location.pathname.split("/").pop());
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [toggleLikes, setToggleLikes] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const getAccountName = localStorage.getItem("accountName");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const foundPost = posts.find((post) => post.id === id);
        setPost(foundPost);
        if (foundPost) {
          setLikes(foundPost?.recommend);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id, posts]);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인한 회원만 볼 수 있습니다.");
      navigate("/");
    } else {
      (async () => {
        try {
          const response = await AuthToken.get(
            `http://3.39.190.90/api/account/me?id=${userId}`
          );
          setAccount(response.data);
        } catch (error) {
          console.error("계정 정보를 가져오는 데 실패했습니다.", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isLoggedIn, navigate, userId]);

  const togglePressLike = () => {
    if (!isLoggedIn) return;

    if (toggleLikes) {
      setLikes((prevLikes) => prevLikes - 1);
    } else {
      setLikes((prevLikes) => prevLikes + 1);
    }
    setToggleLikes((prevToggle) => !prevToggle);
  };

  // const togglePressLike = async () => {
  //   const questionBoardId = localStorage;
  //   try {
  //     const response = await AuthToken.post(
  //       `http://3.39.190.90/api/recommendBoard/${questionBoardId}?=accountId={userId}`,
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("accessToken"),
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
    const response = await AuthToken.post(
      //`http://3.39.190.90/api/questionComment/questionBoardId=${questionBoardId}?=accountId={userId}`,
      {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      }
    );
  };
  const deletePost = async () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      // const updatedPosts = posts.filter((post) => post.id !== id);
      navigate("/community");
      alert("삭제되었습니다.");
    }
  };
  const editPost = () => {
    // 게시글 수정 로직 구현
  };
  return (
    <div className="NotDrag">
      <div className="titleWrap" style={{ userSelect: "none" }}>
        {postsType === "bunri" ? "분리수거" : "나눔"} 커뮤니티 ＞
      </div>
      <p style={{ fontSize: "16px", marginTop: "-5px" }}>글 보기</p>
      <div className="container">
        {post && (
          <div className="post">
            <h1>{post.title}</h1>
            <div>
              글쓴이: {post.nickname}
              <p>
                조회수: {post.views} | 작성일: {post.date} | 좋아요:{" "}
                {post.recommend}
                {postsType === "nanum" && (
                  <span>| 나눔 완료 상태: {post.nanum}</span>
                )}
              </p>
            </div>
            <p className="post-content">{post.content}</p>
          </div>
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
            👍 {likes}
          </button>
        </div>
        <hr style={{ border: "0.5px solid #d9d9d9" }}></hr>
        <h3>{postsType === "bunri" ? "답변" : "댓글"}</h3>
        <hr style={{ border: "0.5px solid #d9d9d9" }}></hr>
        <div className="commentbox">
          <h5>{getAccountName}</h5>
          {isLoggedIn ? (
            <input
              type="text"
              className="commentinput"
              placeholder="답글 입력하기"
            ></input>
          ) : (
            <input placeholder="로그인하세요" disabled></input>
          )}
          <br />
          <button /*onClick={handleComment}*/ className="submitButton">
            등록
          </button>
        </div>
        {getAccountName === post?.accountName ? (
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
