import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, RouterProvider ,Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Challan from './pages/Challan.jsx'
import Maps from './pages/Maps.jsx'
import Trips from './pages/Trips.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import Dashboard from './pages/Dashboard.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path= "/" element= {<Home />}  />
    <Route path= "/register" element= {<Register />} />
    <Route path= "/login" element= {<Login />}/>
    <Route path= "/about" element= {<About />}/>
    <Route path= "/contact" element= {<Contact />}/>
    <Route path= "/challan" element= {<Challan />}/>
    <Route path="/nav-maps" element={<Maps />}/>
    <Route path="/trips" element={<> <ScrollToTop /> <Trips /> </>}/>
    <Route path="/profile" element={<Profile />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
   <RouterProvider router={router}/>
   </AuthProvider>
  </StrictMode>,
)
