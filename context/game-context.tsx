// context/GameContext.tsx
import React, { createContext, useContext, useState } from "react";

// Define types for player and game state
type Player = {
  id: string;
  name: string;
};

type GameState = {
  players: Player[];
  blackCard: { text: string };
  whiteCards: { id: string; text: string }[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setBlackCard: React.Dispatch<React.SetStateAction<{ text: string }>>;
  setWhiteCards: React.Dispatch<React.SetStateAction<{ id: string; text: string }[]>>;
  setGameState: (newState: Partial<GameState>) => void; // New function for setting the game state
};

// Create context
const GameContext = createContext<GameState | undefined>(undefined);

// Create a provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [blackCard, setBlackCard] = useState<{ text: string }>({ text: "Sample prompt?" }); // Default black card
  const [whiteCards, setWhiteCards] = useState<{ id: string; text: string }[]>([]);

  const setGameState = (newState: Partial<GameState>) => {
    if (newState.players !== undefined) setPlayers(newState.players);
    if (newState.blackCard !== undefined) setBlackCard(newState.blackCard);
    if (newState.whiteCards !== undefined) setWhiteCards(newState.whiteCards);
  };

  return (
    <GameContext.Provider value={{ players, blackCard, whiteCards, setPlayers, setBlackCard, setWhiteCards, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the GameContext
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
