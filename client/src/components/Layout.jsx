import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'




function Layout() {

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        
            <Outlet />
          
      </div>
      <Footer />
    </div>
  )
}

export default Layout