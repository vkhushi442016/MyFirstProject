import React, { useState } from 'react';
// Importing specific icons from Font Awesome and Heroicons via React Icons
import { FaGraduationCap } from 'react-icons/fa';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import useStore from '../common/store/store';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
                    });

                    if (userRole == "admin") {
                        toast.success("Login Successful");
                        navigate('/')
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        
        {/* Branding Sidebar */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-800 p-12 text-white flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <FaGraduationCap size={40} className="text-white" />
              <span className="text-2xl font-bold tracking-tight">FaithPortal</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-snug mb-6">
              Empowering School Ministries
            </h1>
            <p className="text-indigo-100/90 text-base leading-relaxed">
              Log in to access your administrative tools and manage your ministry's impact with ease and security.
            </p>
          </div>
          <div className="text-xs font-medium text-indigo-200/80 uppercase tracking-widest">
            Secured Admin Interface
          </div>
        </div>

        {/* Login Section */}
        <div className="w-full md:w-7/12 p-8 md:p-14 bg-white">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Login to your account</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Username Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-indigo-600">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <HiMail size={22} />
                </div>
                <input
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-indigo-600">
                  Password
                </label>
                <button type="button" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <HiLockClosed size={22} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-md cursor-pointer"
              />
              <label htmlFor="remember" className="ml-3 text-sm text-slate-600 cursor-pointer select-none">
                Keep me logged in
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              onClick={() => postData()}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-xl shadow-slate-200 active:scale-[0.98]"
            >
              Login
            </button>
          </form>

          <footer className="mt-12 text-center text-sm text-slate-400">
            Design for <span className="font-semibold text-slate-600">School Ministry Management</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
