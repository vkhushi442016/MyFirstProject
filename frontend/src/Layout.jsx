import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className='h-screen flex flex-col overflow-x-hidden'>
            <Navbar />
            <div className='flex flex-1 pt-20 overflow-x-hidden'>
                <Sidebar />
                <div className='flex-1 overflow-x-hidden overflow-y-auto p-4 bg-gray-100'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout;