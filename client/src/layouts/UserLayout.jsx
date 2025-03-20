import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/OpNavbar'

const UserLayout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
        </div>
    )
}

export default UserLayout