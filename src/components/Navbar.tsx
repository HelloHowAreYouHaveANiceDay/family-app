import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../client'

interface Props {
  session: Session
}

export default function Navbar({ session }: Props) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  
  useEffect(() => {
    async function getProfile() {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', user.id)
        .single()

      if (data) {
        setUsername(data.username)
      }
      setLoading(false)
    }

    getProfile()
  }, [session])

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <nav>
      <div className="app-title">Family App</div>
      <div className="user-controls">
        <span>
          {loading ? 'Loading...' : `Hi, ${username || session.user.email}`}
        </span>
        <button onClick={signOut}>
          Sign Out
        </button>
      </div>
    </nav>
  )
}
