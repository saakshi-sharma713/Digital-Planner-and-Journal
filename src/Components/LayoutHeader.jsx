// LayoutWithHeader.jsx
import React from "react";
import Header from "./Home/Header";

const LayoutWithHeader = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default LayoutWithHeader;