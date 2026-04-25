import './App.css'
import { FaRegBell } from "react-icons/fa";
import useStore from './common/store/store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProfileCard from './UI/ProfileCard';

const Navbar = () => {
  const navigate = useNavigate();
  const userRole = useStore((state) => state.role)
  const [showProfile, setShowProfile] = useState(false);

  const unread = useStore((s) => s.unread);
  const notifications = useStore((s) => s.notifications);
  const clearUnread = useStore((s) => s.clearUnread);
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!open);
    clearUnread(0); // mark read
  };
  const user = useStore((state) => state.user);


  let { logout } = useStore()

  function lgout() {
    logout();
    console.log("Role before logout:", userRole);
    if (userRole === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  }
  const firstLetter = user ? user.charAt(0).toUpperCase() : "";


  const handleProfileClick = () => {
    setShowProfile((prev) => !prev); // toggle
  };
  return (
    <>
      <nav className="sticky top-0 z-50 w-full shadow-md shadow-purple-300 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          {/* Left: Branding */}
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              MP <span className="text-purple-600">Education Portal</span>
            </h1>
            <p className="hidden text-xs font-semibold uppercase tracking-widest text-slate-500 sm:block">
              Centralized School Administration
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-6">

            {/* Notification Icon */}
            <div className="relative inline-block">
              {/* 🔔 Bell Button */}
              <button
                onClick={toggle}
                className="group relative flex items-center justify-center rounded-xl p-2.5 text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-purple-600 active:scale-95"
              >
                <FaRegBell className="h-6 w-6" />
                {unread > 0 && (
                  <span className="absolute right-2 top-2 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-red-500"></span>
                  </span>
                )}
              </button>

              {/* 📩 Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                    {unread > 0 && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                        {unread} New
                      </span>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <p className="text-sm font-medium text-slate-400">All caught up!</p>
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div
                          key={i}
                          className="group relative flex cursor-pointer gap-3 border-b border-slate-50 p-4 transition-colors hover:bg-slate-50 last:border-0"
                        >
                          {/* Optional: Status Dot */}
                          {!n.read && (
                            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600" />
                          )}

                          <div className="flex flex-col gap-1">
                            <p className="text-sm leading-snug text-slate-700 group-hover:text-slate-900">
                              {n.message}
                            </p>
                            <span className="text-[11px] font-medium text-slate-400">
                              {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <button className="w-full border-t border-slate-100 py-3 text-center text-xs font-semibold text-purple-600 transition-colors hover:bg-slate-50">
                      View all notifications
                    </button>
                  )}
                </div>
              )}
            </div>


            {/* User Actions Section */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:gap-4 sm:pl-6">

              {/* Logout Button - Hidden on small mobile to save space, or use icon */}
              <button
                onClick={() => lgout()}
                className="hidden rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-red-600 sm:block"
              >
                Logout
              </button>
              <button
                onClick={handleProfileClick}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold text-white shadow-lg ring-2 ring-purple-100 transition-transform active:scale-95"
              >
                {firstLetter}
              </button>
            </div>
          </div>
        </div >
      </nav>

      {/* Profile Avatar */}
      {user && (
        <div className="relative">
          {/* Profile Card Dropdown Container */}
          {showProfile && (
            <div className="absolute right-8">
              <ProfileCard />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Navbar
