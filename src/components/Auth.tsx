import { useState } from 'react'
import { supabase } from '../client'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<'sign_in' | 'sign_up'>('sign_in')
  const [message, setMessage] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (authMode === 'sign_in') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link')
      }
    } catch (error: any) {
      setMessage(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h1>{authMode === 'sign_in' ? 'Sign In' : 'Sign Up'}</h1>
      <form onSubmit={handleAuth} className="auth-form">
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : authMode === 'sign_in' ? 'Sign In' : 'Sign Up'}
        </button>
        
        <p>
          {authMode === 'sign_in' ? (
            <>
              Don't have an account?{' '}
              <button 
                type="button" 
                className="link-button" 
                onClick={() => setAuthMode('sign_up')}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                type="button" 
                className="link-button" 
                onClick={() => setAuthMode('sign_in')}
              >
                Sign In
              </button>
            </>
          )}
        </p>
        
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  )
}
