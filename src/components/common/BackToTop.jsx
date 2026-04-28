import { useEffect, useState } from "react";

export default function BackToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(1);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const currentScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    setScrolled(currentScroll);
    setShowScrollTop(window.scrollY >= window.innerHeight);

    const totalScrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    setScrollHeight(totalScrollHeight > 0 ? totalScrollHeight : 1);
  };
  const calculateStrokeDashoffset = () => {
    const totalLength = 307.919;
    if (scrollHeight <= 0 || isNaN(scrolled) || isNaN(scrollHeight)) {
      return totalLength;
    }

    const offset = totalLength - (scrolled / scrollHeight) * totalLength;
    return isNaN(offset) ? totalLength : offset;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`progress-wrap ${scrolled > 150 ? "active-progress" : ""}`}
      onClick={() => scrollToTop()}
    >
      <svg
        className="progress-circle svg-content"
        width="100%"
        height="100%"
        viewBox="-1 -1 102 102"
      >
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          style={{
            transition: "0s",
            strokeDasharray: "307.919, 307.919",
            strokeDashoffset: calculateStrokeDashoffset(),
          }}
        />
      </svg>
    </div>
  );
}
