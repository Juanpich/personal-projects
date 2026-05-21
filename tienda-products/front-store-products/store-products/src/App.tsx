import './App.css'
import ErrorBoundary from './ErrorBoundary'
import { AppRouter } from './routes'

function App() {


  return (
    <>
    <ErrorBoundary>
        <AppRouter/>
    </ErrorBoundary>
      
    </>
  )
}

export default App
