import React from "react";

export default function Loader() {
  return (
    <>
      <style>
        {`
          .loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }

          .spinner {
            width: 60px;
            height: 60px;
            border: 6px solid #e3f2fd;
            border-top: 6px solid #1e88e5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="loader-overlay">
        <div className="spinner"></div>
      </div>
    </>
  );
}