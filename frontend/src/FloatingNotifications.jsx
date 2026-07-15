import React, { useEffect, useRef, useState } from "react";
import { IoNotifications, IoClose } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { MdSms } from "react-icons/md";

const FloatingNotification = ({
  onWhatsappClick = () => {},
  onSmsClick = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside (Touch + Mouse support)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans"
    >
      {/* Popover Menu */}
      <div
        role="menu"
        aria-hidden={!open}
        className={`mb-4 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 origin-bottom-right
        ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Popover Header */}
        <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Broadcast Channel
          </p>
        </div>

        {/* Menu Options */}
        <div className="divide-y divide-slate-50">
          {/* WhatsApp Action */}
          <button
            role="menuitem"
            onClick={() => {
              onWhatsappClick();
              setOpen(false);
            }}
            className="flex items-center gap-4 w-full px-5 py-3.5 text-left hover:bg-emerald-50/50 transition-colors group focus:outline-none focus:bg-emerald-50/30"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform duration-200">
              <FaWhatsapp className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">WhatsApp</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Send template alerts</p>
            </div>
          </button>

          {/* SMS Action */}
          <button
            role="menuitem"
            onClick={() => {
              onSmsClick();
              setOpen(false);
            }}
            className="flex items-center gap-4 w-full px-5 py-3.5 text-left hover:bg-indigo-50/50 transition-colors group focus:outline-none focus:bg-indigo-50/30"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform duration-200">
              <MdSms className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">SMS Portal</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Send bulk network text</p>
            </div>
          </button>
        </div>
      </div>

      {/* Trigger Button (FAB) */}
      <button
        aria-label="Toggle broadcast menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white focus:outline-none focus:ring-4 transition-all duration-300 active:scale-95
        ${
          open
            ? "bg-slate-800 hover:bg-slate-900 focus:ring-slate-200"
            : "bg-purple-600 hover:bg-purple-700 hover:scale-105 focus:ring-indigo-100"
        }`}
      >
        {/* Seamless icon transition overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          open ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"
        }`}>
          <IoNotifications size={24} />
        </div>

        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          open ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-75"
        }`}>
          <IoClose size={26} />
        </div>
      </button>
    </div>
  );
};

export default FloatingNotification;