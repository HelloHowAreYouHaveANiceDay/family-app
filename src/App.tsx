import { useState, useEffect } from 'react'
import { supabase } from './client'
import { Session } from '@supabase/supabase-js'
import Auth from './components/Auth'
import Account from './components/Account'
import BabyTracker from './mini-apps/babytracker/BabyTrackerClient'
import './App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [app, setApp] = useState<string>('home')

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
        <div>

          <button onClick={() => setApp('home')}>Home</button>
          <button onClick={() => setApp('babytracker')}>Baby Tracker</button>
          <div>
            <Account session={session} />
          </div>

          {app === 'home' && <div>Home</div>}
          {app === 'babytracker' && (
            <div>
              <h1>Baby Tracker</h1>
              <BabyTracker />
            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default App
