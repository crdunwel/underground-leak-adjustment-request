/* src/App.tsx */

import ExampleCard from './components/ExampleCard'
import { appConfig } from './data/appConfig'

import './styles/app.css'
import './styles/print.css'

function App() {
  return (
    <main className="appShell">
      <ExampleCard
        title={appConfig.name}
        description={appConfig.description}
      />
    </main>
  )
}

export default App
