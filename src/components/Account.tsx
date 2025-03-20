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
    <div className="flex flex-row">
        <p className='basis-2/3 self-center px-2'>{session.user.email}</p>
        <button onClick={handleSignOut} className="basis-1/3 bg-red-400 text-white px-2 py-1">
          Sign Out
        </button>
    </div>
  )
}
