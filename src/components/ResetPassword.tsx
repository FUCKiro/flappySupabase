import React, { useState, useEffect } from 'react';
import { updatePassword } from '../services/authService';
import { supabase } from '../services/supabaseClient';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Check if we have a valid session
    const checkSession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (!accessToken) {
        console.error('No access token found in URL');
        setHasSession(false);
        return;
      }

      try {
        // Set the session with the access token
        const { data: { session }, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: accessToken, // Use access token as refresh token
        });

        if (error) {
          console.error('Error setting session:', error);
          throw error;
        }

        setHasSession(!!session);
      } catch (error) {
        console.error('Error setting session:', error);
        setHasSession(false);
      }
    };
    
    checkSession();
  }, []);

  useEffect(() => {
    if (!hasSession) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await updatePassword(newPassword);
      setSuccess(true);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!hasSession) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-[400px] w-full shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-6">Invalid or Expired Link</h2>
          <p className="text-gray-600 mb-4">
            This password reset link is invalid or has expired.
          </p>
          <p className="text-gray-600">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-[400px] w-full shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        {success ? (
          <div className="text-center">
            <p className="text-lg mb-4 text-green-600">
              Password successfully reset!
            </p>
            <p className="text-gray-600">
              Redirecting to home page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3"
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-red-500 text-base">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 text-lg font-semibold"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}