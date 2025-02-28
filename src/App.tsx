import { useState, useEffect } from 'react'
import { supabase } from './client'
import { Session } from '@supabase/supabase-js'
import Auth from './components/Auth'
import Account from './components/Account'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  
  useEffect(() => {
    // Check for active session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="container">
      {!session ? (
        <Auth />
      ) : (
        <Account session={session} />
      )}
    </div>
  )
}

export default App
