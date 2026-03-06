import React from 'react'
import './App.css'
import { FaRegBell } from "react-icons/fa";
import useStore from './common/store/store';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const user = useStore((state) => state.user);
    let { logout } = useStore()

    function lgout() {
        logout()
        navigate("/login")
    }
    const firstLetter = user ? user.charAt(0).toUpperCase() : "";

    return (
        <>
            <div className="fixed top-0 left-0 z-50 flex bg-purple-400 h-20 p-3 w-full ">
                <div className="">
                    <h1 className="text-3xl font-bold text-white">
                        Madhya Pradesh Education Portal
                    </h1>
                    <h2 className="font-bold text-purple-800">
                        Centralized School Administration System
                    </h2>
                </div>
                <FaRegBell className="absolute right-52 top-7 h-6 w-6 text-white" />
                {user && (
                    <div className="absolute right-8 top-5 w-10 h-10 rounded-full bg-white text-purple-800 flex items-center justify-center font-semibold text-lg shadow-md hover:bg-gray-200">
                        {firstLetter}
                    </div>
                )}
                <div>
                    <button className="absolute right-23 top-4 flex m-1 font-semibold text-purple-800 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm sm:text-base"
                        onClick={() => lgout()}>
                        Logout
                    </button>
                </div>

            </div>

        </>
    )
}

export default Navbar
