import React from 'react';

interface GameUIProps {
  score: number;
  highScore: number;
  user: User | null;
  onSignOut: () => void;
}

export function GameUI({ score, highScore, user, onSignOut }: GameUIProps) {
  return (
    <>
      <div className="absolute top-4 left-4 z-30 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
        Score: {score}
      </div>
      
      <div className="absolute top-4 right-4 z-30 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
        High: {highScore}
      </div>
      
      {user && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
          <span className="font-medium">{user.username}</span>
          <button 
            onClick={onSignOut}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}