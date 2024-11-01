// components/WhiteCard.tsx
import React from "react";

type WhiteCardProps = {
  text: string;
  onClick: () => void;
};

const WhiteCard: React.FC<WhiteCardProps> = ({ text, onClick }) => {
  return (
    <div
      className="white-card bg-white text-black p-3 rounded-md text-center text-base shadow cursor-pointer hover:bg-gray-200"
      onClick={onClick}
    >
      <p>{text}</p>
    </div>
  );
};

export default WhiteCard;
