import { TfiLayoutSidebar2 } from 'react-icons/tfi'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Sidebar1 from './NewSidebar'
import useStore from './common/store/store';
import FloatingNotification from './FloatingNotifications'
import { useState } from 'react'
import WhatsappModal from './WhatsappModal'
import SmsSender from './UI/SmsSender'

const Layout = () => {
    const role = useStore(state => state.role);
    const [whatsappOpen, setWhatsappOpen] = useState(false);
    const [smsOpen, setSmsOpen] = useState(false);

    return (
        <div className='h-screen flex flex-col overflow-x-hidden'>
            <Navbar />
            <div className='flex flex-1 overflow-x-hidden'>
                {/* <Sidebar /> */}
                {role ? <Sidebar1 /> : <div className="w-64 bg-gray-200 h-screen">Loading sidebar...</div>}
                <div className='flex-1 overflow-x-hidden overflow-y-auto p-4 bg-gray-100'>
                    <Outlet />
                </div>
            </div>

            {role == "admin" && (
                <>
                    <FloatingNotification
                        onWhatsappClick={() => setWhatsappOpen(true)}
                        onSmsClick={() => setSmsOpen(true)}
                    />

                    <WhatsappModal
                        isOpen={whatsappOpen}
                        onClose={() => setWhatsappOpen(false)}
                    />

                    <SmsSender
                        isOpen={smsOpen}
                        onClose={() => setSmsOpen(false)}
                    />
                </>
            )}
        </div>
    )
}

export default Layout;