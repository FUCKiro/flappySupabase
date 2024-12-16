import React from 'react';
import Game from './components/Game';
import ResetPassword from './components/ResetPassword';

function App() {
  // Check if we're on the reset password route
  const isResetPasswordRoute = window.location.pathname === '/reset-password';

  return (
    <div className="min-h-screen bg-gray-900">
      {isResetPasswordRoute ? <ResetPassword /> : <Game />}
    </div>
  );
}

export default App;