import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useState } from 'react'
import useStore from './common/store/store';
import { PiEyeClosedBold } from 'react-icons/pi';
import { MdOutlinePassword } from "react-icons/md";
import LoginWithGoogle from './LoginWithGoogle';
import { FaRegUser, FaEye, FaGraduationCap } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const login = useStore((state) => state.login);

    const data = {
        username: username,
        password: password
    }

    function postData() {
        fetch('http://localhost:5008/userlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(async (res) => {
                return res.json();
            })
            .then((res) => {
                console.log(res);
                if (res.status === "Success") {
                    const userRole = res.role.toLowerCase();
                    login({
                        username: res.username,
                        token: res.token,
                        role: res.role,
                        staff_id: res.staff_id,
                        dise_code: res.dise_code,
                        ...(userRole !== "admin" && { sc_category: res.sc_category }),
                    });

                    if (userRole == "principal") {
                        toast.success("Login Successful");
                        navigate('/principal/dashboard')
                    } else if (userRole == "teacher") {
                        toast.success("You are a teacher")
                        navigate('/staff/dashboard')
                        console.log("You are a teacher.")
                    } else {
                        toast.error("Invalid Credentials");
                    }
                }
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                toast.error("Server error");
            });
    }


    // const staffId = useStore((state) => state.staff_id);


    // useEffect(() => {

    //     if (!staffId) return;

    //     fetch(`http://localhost:5008/school/${staffId}`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log(data);
    //             setSchool(data);
    //         });

    // }, [staffId]);
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] p-6">
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
                
                {/* Left Side - Institutional Sidebar */}
                <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 text-white flex-col justify-between relative overflow-hidden">
                    {/* Decorative subtle background pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-10 rounded-full -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2">
                                <FaGraduationCap size={32} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Ministry Portal</span>
                        </div>
                        <h1 className="text-4xl font-extrabold leading-[1.2] mb-6">
                            Education Management & <span className="text-indigo-400">Spiritual Growth.</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Access your educator dashboard to manage classes, track student progress, and oversee ministry activities.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm text-slate-500">
                        <p>© 2024 School Ministry System • Secure Gateway</p>
                    </div>
                </div>

                {/* Right Side - Professional Form */}
                <div className="w-full md:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-800">Staff Sign In</h2>
                        <p className="text-slate-500 mt-2">Welcome back! Please enter your credentials.</p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <FaRegUser size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="username"
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                    <MdOutlinePassword size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <PiEyeClosedBold size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={() => postData()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-100 active:scale-[0.99] mt-2"
                        >
                            Log in to Portal
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-slate-400 font-medium">Institutional Access</span></div>
                    </div>

                    {/* Google Login Placeholder - Style this to match your component */}
                    <div className="flex justify-center mb-6">
                        <LoginWithGoogle className="w-full" />
                    </div>

                    <p className="text-center text-slate-500 text-sm">
                        New faculty member?{" "}
                        <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
                            Request Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login
