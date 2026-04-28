import React from "react";

const OvalLoader = ({
  width = 20,
  height = 20,
  primary = "#1e1e1e",
  secondary = "transparent",
}) => {
  const loaderStyle = {
    width: `${width}px`,
    height: `${height}px`,
    border: `2px solid ${secondary}`,
    borderTopColor: primary,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block",
  };

  return <div style={loaderStyle} />;
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(styleSheet);

export default OvalLoader;
