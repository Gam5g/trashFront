import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../container/pages/Community/Detail.css";

const CommunityDetail = ({ posts, postsType }) => {
  const location = useLocation();
  const id = parseInt(location.pathname.split("/").pop());
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const getAccountName = localStorage.getItem("accountName");
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const foundPost = posts.find((post) => post.id === id);
        setPost(foundPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id, posts]);

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
    <div className="container">
      {post && (
        <div className="post">
          <h2>{post.title}</h2>
          <div className="post-info">
            <p>
              작성자: {post.nickname} | 조회수: {post.views} | 작성일:{" "}
              {post.date} | 좋아요: {post.likes}
              {postsType === "nanum" && (
                <span>| 나눔 완료 상태: {post.nanum}</span>
              )}
            </p>
          </div>
          <p className="post-content">{post.content}</p>
        </div>
      )}
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
  );
};

export default CommunityDetail;
