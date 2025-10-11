import { useState } from 'react'
import Navbar from './components/Navbar'
import bgVideo from "../src/assets/car-drive.mp4"

function App() {

  
  return (
    <>
      <div className='main-screen w-full min-h-screen bg-zinc-900 overflow-hidden'>
        <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover">
        <source src={bgVideo} type="video/mp4" />
        </video>

        <div className="relative z-10">
        <Navbar />
        </div>
      </div>
    </>
  )
}

export default App
