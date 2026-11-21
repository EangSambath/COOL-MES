import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import AdminLoginModal from '../components/AdminLoginModal';
import { api } from '../api/api';

/**
 * Hidden admin route (/admin). Not linked anywhere in the public UI.
 * Shows a password gate first, then the dashboard.
 */
export default function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => api.hasAdminToken());

  useEffect(() => {
    const handleUnauthorized = () => setAuthed(false);
    window.addEventListener('coolmes:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('coolmes:unauthorized', handleUnauthorized);
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F5F5F7]">
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
