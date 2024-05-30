import { useRef } from "react";
const ScrollToTop = () => {
  const topRef = useRef(null);
  if (topRef.current) {
    topRef.current.scrollIntoView({ behavior: "smooth" });
  }
};

export default ScrollToTop;
