import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import "./CardContainer.css";
import AuthToken from "../container/pages/AuthToken";

const CardContainer = () => {
  const containerRef = useRef(null);
  const scrollSpeed = 2; // 스크롤 속도 설정 (숫자가 커질수록 빠름)
  const [isPaused, setIsPaused] = useState(false); // 애니메이션 일시정지 상태
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        const fetchedCards = [];
        for (let i = 1; i <= 12; i++) {
          const response = await AuthToken.get(`/solution/${i}`, {
            headers: {
              Authorization: localStorage.getItem("accessToken"),
            },
          });
          const { name, imageUrl, wasteId } = response.data;
          fetchedCards.push({ title: name, imageUrl, id: wasteId });
        }
        setCards(fetchedCards);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCardsData();
  }, []);

  const repeatedCards = [...cards, ...cards]; // 카드 배열을 두 번 반복하여 무한 느낌

  useEffect(() => {
    const container = containerRef.current;
    let animationFrameId;

    const scroll = () => {
      if (container && !isPaused) {
        container.scrollLeft += scrollSpeed; // 스크롤을 계속 진행
        // 스크롤 위치가 끝에 도달했으면 처음으로 돌아가기
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0; // 처음으로 자연스럽게 돌아가기
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId); // 컴포넌트 언마운트 시 애니메이션 취소
  }, [isPaused]);

  return (
    <div
      className="card-container"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)} // 마우스 오버 시 애니메이션 멈춤
      onMouseLeave={() => setIsPaused(false)} // 마우스 아웃 시 애니메이션 재개
    >
      <div className="card-scroll">
        {repeatedCards.map((card, index) => (
          <Card
            key={index}
            imageUrl={card.imageUrl}
            title={card.title}
            id={card.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
