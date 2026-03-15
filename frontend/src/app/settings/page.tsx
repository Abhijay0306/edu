"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SettingsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/auth/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setError('Failed to delete account. Please try again.'); return; }
      logout();
      router.push('/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-['Poppins'] text-3xl font-bold text-[#1F2937]">Account Settings</h1>
        <p className="text-[#6B7280] mt-1">Manage your account preferences</p>
      </div>

      {/* Account Info */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-[#1F2937]">Account Information</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#9CA3AF] w-24">Name</span>
            <span className="font-medium">{user.name || '—'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#9CA3AF] w-24">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#9CA3AF] w-24">Role</span>
            <span className={`badge ${user.role === 'SUPER_ADMIN' ? 'badge-green' : 'badge-purple'}`}>{user.role}</span>
          </div>
        </div>
        <div className="pt-2">
          <Link href="/profile" className="btn-secondary text-sm inline-flex">Edit Study Profile</Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-100 bg-red-50">
        <h2 className="font-semibold text-red-700 mb-2">⚠️ Danger Zone</h2>
        <p className="text-sm text-red-600 mb-4">
          Deleting your account is permanent and cannot be undone. Your profile, recommendations, and all data will be erased.
        </p>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 rounded-lg border border-red-300 bg-white text-red-600 text-sm font-medium hover:bg-red-50 transition-colors">
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-700">Are you absolutely sure? This cannot be reversed.</p>
            {error && <p className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded-lg">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
                {loading ? 'Deleting...' : 'Yes, delete my account'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
