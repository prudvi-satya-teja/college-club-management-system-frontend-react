import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Spinner from '../components/common/Spinner'
import './OAuth2Callback.css'

export default function OAuth2Callback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useAuthStore(state => state.login)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      try {
        login(token)
        setTimeout(() => navigate('/'), 500)
      } catch (error) {
        console.error('OAuth callback error:', error)
        navigate('/login?error=oauth_failed')
      }
    } else {
      navigate('/login?error=no_token')
    }
  }, [searchParams, login, navigate])

  return (
    <div className="oauth-root">
      <div className="oauth-bg-grid" />
      <div className="oauth-glow" />
      <div className="oauth-glow2" />

      <div className="oauth-card">
        <div className="oauth-logo">A<span>Club</span></div>
        <Spinner size="lg" />
        <p className="oauth-message">Processing Microsoft login…</p>
        <p className="oauth-sub">Please wait, you'll be redirected shortly.</p>
      </div>
    </div>
  )
}