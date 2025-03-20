import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
// Pages
import Login from './pages/Login';
import Verify from './pages/Verify';
import Forgot from './pages/Forgot';
import Forbidden from './pages/Forbidden';

// 
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

import Profile from './pages/Profile';
import Reset from './pages/Reset';
// 
import ProtectedRoute from './components/ProtectedRoute';
import RealtimeData from './pages/RealtimeData';
import HistoricalData from './pages/HistoricalData';
import ThresholdSettings from './components/ThresholdSettings';
const App = () => {
  return (
    <BrowserRouter>
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route path='/forgot' element={<Forgot/>} />
        <Route path='/forbidden' element={<Forbidden />} />
        {/* AdminLayout */}
        <Route path='/admin' element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path='profile' element={<Profile/>} />
          <Route path='reset' element={<Reset/>}/>
        </Route>
        {/* User Layout */}
        <Route path='/operator' element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
          <Route path='profile' element={<Profile/>} />
          <Route path='reset' element={<Reset/>}/>
          <Route path='realtime' element={<RealtimeData/>}/>
          <Route path='historical' element={<HistoricalData/>}/>
          <Route path='threshold' element={<ThresholdSettings/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App