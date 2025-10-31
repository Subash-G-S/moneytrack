import React from "react";
import "./Loader.css"; // Import your CSS file

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="loader"></div>
    </div>
  );
};
