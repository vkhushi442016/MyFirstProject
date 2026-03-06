import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useState } from 'react'
import useStore  from './common/store/store';

const Login = () => {
    const navigate = useNavigate()

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
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if (res.status === "Success") {
                    login(username, res.token)
                    toast.success("Login Successful");
                    navigate('/')
                } else {
                    toast.error("Invalid Credentials")
                }
            })
    }

    return (
        <>
            <div className='min-h-screen flex items-center justify-center p-4'>
                <div className='flex  h-100 w-6/10 rounded-lg shadow-xl'>
                    <div className='bg-blue-100 w-1/2 h-full max-w-md rounded-lg  overflow-hidden'>
                        <h1 className='text-3xl font-bold text-center p-5'>Login</h1>
                        <div className='ml-15 spavr-y-4'>
                            <label htmlFor="">Username</label><br />
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                className='bg-white rounded-sm w-60 h-7 mb-3 focus:ring-2 focus:ring-blue-300 outline-none' /><br />
                            <label htmlFor="">Password</label><br />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className='bg-white rounded-sm w-60 h-7 mb-3 focus:ring-2 focus:ring-blue-300 outline-none' /><br />
                            <label htmlFor=""
                                className='flex justify-end cursor-pointer'>
                                Forgot Password?
                            </label>
                                <div className="flex justify-center bg-blue-400 hover:bg-blue-600 m-2 p-2 rounded-md cursor-pointer w-50 text-white font-medium"
                                    onClick={() => postData()}>
                                    <h1>LOGIN</h1>
                                </div>
                            <label htmlFor=""
                                className='cursor-pointer'>Don't have an account? <Link to={'/signup'} className='text-blue-600 underline cursor-pointer'>Sign In</Link></label>
                        </div>
                    </div>
                    <div className='w-1/2 flex items-end relative justify-center'>
                        <label htmlFor=""
                            className='absolute top-10 text-2xl font-medium'>HELLO,</label>
                        <label htmlFor=""
                            className='absolute top-17 text-2xl font-medium'>WELCOME BACK</label>
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/010/925/681/small/enter-login-and-password-registration-page-on-screen-sign-in-to-your-account-creative-metaphor-login-page-mobile-app-with-user-page-identification-in-internet-vector.jpg" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
