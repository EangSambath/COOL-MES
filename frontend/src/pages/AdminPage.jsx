import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import AdminLoginModal from '../components/AdminLoginModal';

/**
 * Hidden admin route (/admin). Not linked anywhere in the public UI.
 * Shows a password gate first, then the dashboard.
 */
export default function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(
    () => localStorage.getItem('coolmes_admin_auth') === 'true'
  );

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950">
        <AdminLoginModal
          isOpen
          onClose={() => navigate('/')}
          onLoginSuccess={() => setAuthed(true)}
        />
      </div>
    );
  }

  return (
    <AdminDashboard
      onExitAdmin={() => navigate('/')}
      onRefreshStoreData={() => {}}
    />
  );
}

