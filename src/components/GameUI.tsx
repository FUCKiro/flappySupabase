import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import ChangePassword from './ChangePassword';

interface GameUIProps {
  score: number;
  highScore: number;
  user: User | null;
  onSignOut: () => void;
}

export function GameUI({ score, highScore, user, onSignOut }: GameUIProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
          <span className="font-medium truncate max-w-[100px]">{user.username}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPasswordModal(true);
            }}
            className="hover:text-indigo-300"
            title="Change Password"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSignOut();
            }}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Sign Out
          </button>
        </div>
      )}
      
      <ChangePassword
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}