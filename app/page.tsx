// app/game/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import BlackCard from "@/components/black-card";
import WhiteCard from "@/components/white-card";
import PlayerList from "@/components/player-list";
import { io } from "socket.io-client";

const GamePage = () => {
  const initialPlayersData = [
    { id: "1", name: "Alice", selectedCard: "" },
    { id: "2", name: "Bob", selectedCard: "" },
    { id: "3", name: "Charlie", selectedCard: "" },
  ];

  const [players, setPlayers] = useState(initialPlayersData);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0); // Track current player
  const [blackCard, setBlackCard] = useState({ text: "" });
  const [whiteCardsData, setWhiteCardsData] = useState([]);

  useEffect(() => {
    // Establish socket connection
    const socket = io("http://localhost:3000"); // Update to your server endpoint

    // Listen for game state updates from the server
    socket.on("gameState", (data) => {
      setBlackCard(data.blackCard);
      setWhiteCardsData(data.whiteCards);
      setPlayers(initialPlayersData); // Reset player selections
      setCurrentPlayerIndex(0); // Reset to the first player
    });

    // Clean up socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handlePlayCard = (cardId: string) => {
    const card = whiteCardsData.find((card) => card.id === cardId);
    if (card) {
      // Update players with the selected card
      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index === currentPlayerIndex // Update only the current player's selection
            ? { ...player, selectedCard: card.text }
            : player
        )
      );

      // Emit selected card to the server
      const socket = io("http://localhost:3000"); // Re-establish connection to emit
      socket.emit("playCard", {
        playerId: players[currentPlayerIndex].id,
        selectedCard: card.text,
      });

      // Move to the next player (for demo purposes)
      setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    }
  };

  const handleRefresh = () => {
    // Emit refresh event to the server to get a new game state
    const socket = io("http://localhost:3000"); // Re-establish connection to emit
    socket.emit("refreshGame");
  };

  return (
    <div className="game-page flex flex-col items-center">
      <PlayerList players={players} />
      <div className="black-card-area my-4">
        <BlackCard text={blackCard.text} />
      </div>
      <div className="white-card-area grid grid-cols-3 gap-4">
        {whiteCardsData.map((card) => (
          <WhiteCard 
            key={card.id} 
            text={card.text} 
            onClick={() => handlePlayCard(card.id)} 
            isSelected={players[currentPlayerIndex].selectedCard === card.text} // Highlight the selected card
          />
        ))}
      </div>
      <button 
        onClick={handleRefresh} 
        className="refresh-button mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Refresh Game
      </button>
    </div>
  );
};

export default GamePage;
