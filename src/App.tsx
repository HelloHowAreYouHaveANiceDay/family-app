import { useState, useEffect } from 'react'
import { supabase } from './client'
import { Session } from '@supabase/supabase-js'
import Auth from './components/Auth'
import Account from './components/Account'
import BabyTracker from './mini-apps/babytracker/BabyTracker'
import './App.css'

import { BellSnoozeIcon, HomeIcon, HomeModernIcon } from '@heroicons/react/20/solid'

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
    <div className="">
      {!session ? (
        <Auth />
      ) : (
        <div className='flex-none flex flex-col h-screen'>
          <div className='p-2 bg-gray-100'>
            <Account session={session} />
          </div>


          <div className='grow'>
            {/* Main */}
            {app === 'home' && <div> Home</div>}
            {app === 'babytracker' && (
                <BabyTracker />
            )}
          </div>

          <div className='flex-none mt-auto p-2 bg-gray-100'>
            {/* Nav */}
            {
              app === 'home' ? (
                <button className='p-2 m-1 bg-black' onClick={() => setApp('home')}>
                  <HomeIcon className='h-6 w-6 text-white'></HomeIcon>
                </button>
              ) : (
                <button className='p-2 m-1 border' onClick={() => setApp('home')}>
                  <HomeIcon className='h-6 w-6 text-black'></HomeIcon>
                </button>
              )
            }
            {
              app === 'babytracker' ? (
                <button className='p-2 m-1 bg-black' onClick={() => setApp('babytracker')}>
                  <BellSnoozeIcon className='h-6 w-6 text-white'></BellSnoozeIcon>
                </button>
              ) : (
                <button className='p-2 m-1 border' onClick={() => setApp('babytracker')}>
                  <BellSnoozeIcon className='h-6 w-6 text-black'></BellSnoozeIcon>
                </button>
              )
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default App
