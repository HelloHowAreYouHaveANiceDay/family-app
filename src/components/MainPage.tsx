import { useState } from 'react'
import BabyTracker from '../mini-apps/babytracker/BabyTracker'

export default function MainPage() {
  const [activeApp, setActiveApp] = useState<string | null>(null)

  const renderMiniApp = () => {
    switch (activeApp) {
      case 'babytracker':
        return <BabyTracker />;
      default:
        return null;
    }
  }

  // Show main menu when no mini-app is active
  const renderMainMenu = () => (
    <>
      <h1>Welcome to Family App</h1>
      <p>This is a placeholder for the main page content.</p>
      
      <div>
        <h2>Available Mini-Apps</h2>
        <button onClick={() => setActiveApp('babytracker')}>
          Baby Tracker
        </button>
      </div>
      
      <div>
        <h2>Coming Soon</h2>
        <button onClick={() => alert('Feature coming soon!')}>
          View Family Calendar
        </button>
      </div>
      
      <div>
        <button onClick={() => alert('Feature coming soon!')}>
          Manage Family Members
        </button>
      </div>
    </>
  )

  return (
    <div className="main-page">
      {activeApp ? (
        <>
          <button onClick={() => setActiveApp(null)} className="back-button">
            &larr; Back to Main Menu
          </button>
          {renderMiniApp()}
        </>
      ) : (
        renderMainMenu()
      )}
    </div>
  )
}