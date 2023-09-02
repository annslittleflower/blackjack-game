import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'




function App() {
  const [count, setCount] = useState(0)


  const renderUsefulLinks = () => {
    return (
      <div>
        <a href='https://www.youtube.com/watch?v=PljDuynF-j0' target='_blank'>how to play</a>
        https://www.youtube.com/watch?v=ZApzTKZV0Ro
        https://www.youtube.com/watch?v=xjqTIzYkGdI
        https://www.youtube.com/watch?v=GWBcCkJFXl8
      </div>
    )
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {renderUsefulLinks()}
    </>
  )
}

export default App
