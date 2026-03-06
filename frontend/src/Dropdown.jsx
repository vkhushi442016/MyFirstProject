import React, { useState } from "react";

export default function Dropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
      >
        Options
        <span className="text-gray-400">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 w-full rounded-md bg-white shadow-lg ring-1 ring-black/5">
          <div className="py-1">
            
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Account settings
            </a>

            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Support
            </a>

            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              License
            </a>

            <button
              onClick={() => {
                alert("Signed out");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
