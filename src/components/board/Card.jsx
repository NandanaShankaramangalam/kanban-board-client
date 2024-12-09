import React from "react";

const Card = ({ boardName }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{boardName}</div>
      </div>
      <div className="px-6 pt-4 pb-2"></div>
    </div>
  );
};

export default Card;
