import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useStore from "./common/store/store";
import { sidebarData } from "./SidebarData";
import { GiHamburgerMenu } from "react-icons/gi";

const Sidebar1 = () => {

  const role = useStore(state => state.role?.toUpperCase());
  const menu = sidebarData[role] || [];

  const [isOpen, setIsOpen] = useState(false);

  if (!role) return <div className="w-64 p-4">Loading menu...</div>;

  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-violet-600 text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <GiHamburgerMenu />
      </button>

      {/* Sidebar */}
      <div
        className={`
        bg-white h-[calc(100vh-80px)] overflow-y-auto
        w-64 flex-shrink-0
        
        fixed top-20 left-0 z-40 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        
        lg:static lg:translate-x-0
        `}
      >

        <div className="p-3">
          {menu.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium mb-1 transition
                ${isActive
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

      </div>
    </>
  );
};

export default Sidebar1;