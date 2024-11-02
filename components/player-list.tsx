// components/PlayerList.tsx
import React from "react";

type Player = {
  id: string;
  name: string;
  selectedCard: string; // Keep track of selected card
};

type PlayerListProps = {
  players: Player[];
};

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div className="player-list p-4 bg-white">
      <h2 className="text-lg font-semibold mb-2">Players</h2>
      <ul className="space-y-1">
        {players.map((player) => (
          <li key={player.id} className="flex items-center justify-between">
            <span className="text-base">{player.name}</span>
            {player.selectedCard && (
              <span className="text-sm text-gray-600 ml-2 italic border p-1 rounded bg-gray-200">
                Selected: {player.selectedCard}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
