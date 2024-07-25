import React from 'react'
import { BrowserRouter, Route,  Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import ScorePage from './pages/ScorePage'

function App() {
  return (
    <div className='bg-slate-700 h-screen w-screen'>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage/>} />
                <Route path='/game' element={<GamePage/>} />
                <Route path='/score' element={<ScorePage/>} />
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App