import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Spinner from '../../components/common/Spinner';

export default function CallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore(state => state.login);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        login(token);
        setTimeout(() => navigate('/dashboard'), 500);
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login?error=oauth_failed');
      }
    } else {
      navigate('/login?error=no_token');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <Spinner size="lg" />
        <p className="text-xl font-semibold mt-4">Processing login...</p>
      </div>
    </div>
  );
}
