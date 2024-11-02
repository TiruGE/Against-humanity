// components/BlackCard.tsx
import React from "react";

type BlackCardProps = {
  text: string;
};

const BlackCard: React.FC<BlackCardProps> = ({ text }) => {
  return (
    <div className="black-card bg-gray-900 text-white p-4 rounded-md text-center text-lg shadow-lg">
      <p>{text}</p>
    </div>
  );
};

export default BlackCard;
