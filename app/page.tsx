"use client";

import React, { useEffect, useState, useRef } from "react";
import BlackCard from "@/components/black-card";
import WhiteCard from "@/components/white-card";
import PlayerList from "@/components/player-list";
import { io, Socket } from "socket.io-client";

const GamePage = () => {
  const [players, setPlayers] = useState([]);
  const [blackCard, setBlackCard] = useState({ text: "" });
  const [whiteCardsData, setWhiteCardsData] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (isConnected) {
      // Initialize socket connection once
      socketRef.current = io("http://localhost:8080");

      // Listen for game state updates from the server
      socketRef.current.on("gameState", (data) => {
        setBlackCard(data.blackCard);
        setWhiteCardsData(data.whiteCards);
        setPlayers(data.players);
      });

      // Emit the player's name to join the game
      socketRef.current.emit("joinGame", playerName);

      // Clean up the socket connection on unmount
      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isConnected, playerName]);

  const handlePlayCard = (cardId) => {
    socketRef.current?.emit("playCard", cardId);
  };

  const handleRefresh = () => {
    socketRef.current?.emit("refreshGame");
  };

  const handleConnect = () => {
    if (playerName.trim()) {
      setIsConnected(true);
    }
  };

  return (
    <div className="game-page flex flex-col items-center">
      {!isConnected ? (
        <div className="name-entry flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleConnect}
            className="connect-button p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Connect
          </button>
        </div>
      ) : (
        <>
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
                isSelected={!!players.find(p => p.id === socketRef.current.id)?.selectedCard}
              />
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className="refresh-button mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Refresh Game
          </button>
        </>
      )}
    </div>
  );
};

export default GamePage;
