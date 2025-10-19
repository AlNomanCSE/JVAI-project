'use client';
import { useAppSelector } from '@/lib/hook';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const { token, refreshToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [localRefresh, setLocalRefresh] = useState<string | null>(null);

  useEffect(() => {
    setLocalToken(localStorage.getItem('token'));
    setLocalRefresh(localStorage.getItem('refreshToken'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Info</h1>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">Redux State</h2>
            <div className="space-y-2 font-mono text-sm">
              <p><strong>isAuthenticated:</strong> {isAuthenticated ? '✓ true' : '✗ false'}</p>
              <p><strong>token:</strong> {token ? `${token.substring(0, 20)}...` : 'null'}</p>
              <p><strong>refreshToken:</strong> {refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null'}</p>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-2">LocalStorage</h2>
            <div className="space-y-2 font-mono text-sm">
              <p><strong>token:</strong> {localToken ? `${localToken.substring(0, 20)}...` : 'null'}</p>
              <p><strong>refreshToken:</strong> {localRefresh ? `${localRefresh.substring(0, 20)}...` : 'null'}</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}