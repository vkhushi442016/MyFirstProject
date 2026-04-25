import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { MdOutlinePassword } from 'react-icons/md'
import { FaUser, FaEye, FaGraduationCap } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { PiEyeClosedBold } from 'react-icons/pi';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff } from 'react-icons/hi';

const SignUp = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  //to show and hide password

    const data = {
        username: username,
        email: email,
        password: password
    }

    function postData(values) {
        fetch('http://localhost:5008/userregister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then(async (response) => {

            const result = await response.json(); // parse once

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            return result;
        })
            .then((res) => {
                console.log(res);
                if (res.status === "Success") {
                    toast.success("Signed In Successfully");
                    navigate('/login')
                } else {
                    navigate('/error')
                }
            })
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().min(4, 'Must be at least 4 characters').max(20, 'Cannot exceed 20 characters').matches(/^[a-z0-9]+$/).required('Required *'),
            email: Yup.string().email('Invalid email address').required('Required *'),
            password: Yup.string().min(5, 'Minimum 5 characters').max(15, 'Maximum 15 characters').matches(/^[a-z0-9]+$/).required('Required *')
        }),
        onSubmit: values => {
            postData(values);
        }
    })

    return (
        <>
           <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Branding (Consistent with Design #1) */}
        <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 text-white flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <FaGraduationCap size={36} />
              <span className="text-xl font-bold tracking-tight">FaithAcademy</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Begin Your <br /><span className="text-indigo-400">Mission</span>
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Create an administrative account to oversee curriculum, student spiritual growth, and ministry data.
            </p>
          </div>
          <div className="text-sm text-indigo-200">
            © 2024 School Ministry Management System
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-500 mt-1 text-sm font-medium">Join the administrative team</p>
          </div>

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Username Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <HiUser size={20} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  onBlur={formik.handleBlur}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none transition-all text-sm ${
                    formik.touched.username && formik.errors.username 
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' 
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50'
                  }`}
                />
              </div>
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-[11px] font-semibold mt-1 ml-1">{formik.errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <HiMail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@school.edu"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none transition-all text-sm ${
                    formik.touched.email && formik.errors.email 
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' 
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50'
                  }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-[11px] font-semibold mt-1 ml-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <HiLockClosed size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none transition-all text-sm ${
                    formik.touched.password && formik.errors.password 
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/30' 
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-[11px] font-semibold mt-1 ml-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] mt-4"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>

                        {/* <div className='ml-15 spavr-y-4'>
                            <label htmlFor="">Username</label><br />
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                className='bg-white rounded-sm w-60 h-7 mb-3 focus:ring-2 focus:ring-violet-300 outline-none' /><br />
                            <label htmlFor="">Email</label><br />
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                                className='bg-white rounded-sm w-60 h-7 mb-3 focus:ring-2 focus:ring-violet-300 outline-none' /><br />
                            <label htmlFor="">Password</label><br />
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                                className='bg-white rounded-sm w-60 h-7 mb-3 focus:ring-2 focus:ring-violet-300 outline-none' /><br />

                            <div className="flex justify-center bg-blue-400 hover:bg-blue-600 m-2 p-2 rounded-md cursor-pointer w-50 text-white"
                                onClick={() => postData()} >
                                <h1>SIGN UP</h1>
                            </div>
                            <label htmlFor="">Already have an account? <Link to='/login' className='text-blue-600 underline cursor-pointer'>Log In</Link></label>
                        </div> */}


{/* 
                    </div>
                    <div className='w-1/2 flex items-end relative justify-center'>
                        <label htmlFor=""
                            className='absolute top-10 text-2xl font-medium'>HELLO,</label>
                        <label htmlFor=""
                            className='absolute top-17 text-2xl font-medium'>WELCOME BACK</label>
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/010/925/681/small/enter-login-and-password-registration-page-on-screen-sign-in-to-your-account-creative-metaphor-login-page-mobile-app-with-user-page-identification-in-internet-vector.jpg" alt="" />
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default SignUp
