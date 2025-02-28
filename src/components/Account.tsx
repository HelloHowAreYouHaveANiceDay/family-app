import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../client'

interface AccountProps {
  session: Session
}

export default function Account({ session }: AccountProps) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  
  useEffect(() => {
    async function getProfile() {
      setLoading(true)
      
      const { user } = session
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
        .single()
        
      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
        
      setLoading(false)
    }
    
    getProfile()
  }, [session])
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }
  
  return (
    <div className="account-container">
      <h1>Account</h1>
      <div className="profile">
        <p><strong>Email:</strong> {session.user.email}</p>
        {username && <p><strong>Username:</strong> {username}</p>}
        
        <button onClick={handleSignOut} className="signout-button">
          Sign Out
        </button>
      </div>
    </div>
  )
}
