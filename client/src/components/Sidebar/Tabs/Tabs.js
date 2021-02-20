import Tab from './Tab/Tab'

import './Tabs.css'

export default function Tabs({room, showingTab, setShowingTab}) {
  return (
    <div className="tabs d-flex justify-content-between">
      <Tab 
        name={"room"}
        showingTab={showingTab}
        setShowingTab={setShowingTab}
      />
      {!room && 
      <Tab 
        name={"friends"}
        showingTab={showingTab}
        setShowingTab={setShowingTab}
      />
      }
    </div>
  )
}
