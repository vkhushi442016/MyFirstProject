import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'


const SignUp = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

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
                    navigate('/')
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
            username: Yup.string().min(4, 'Must be at least 4 characters').max(20, 'Cannot exceed 20 characters').matches(/^[a-z0-9]+$/).required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(5, 'Minimum 5 characters').max(15, 'Maximum 15 characters').matches(/^[a-z0-9]+$/).required('Required')
        }),
        onSubmit: values => {
            postData(values);
        }
    })

    return (
        <>
            <div className='min-h-screen flex items-center justify-center p-4'>
                <div className='flex  h-100 w-6/10 rounded-lg shadow-xl'>
                    <div className='bg-blue-100 w-1/2 h-full max-w-md rounded-lg  overflow-hidden'>
                        <h1 className='text-3xl font-bold text-center p-5'>Sign Up</h1>
                        <div className='ml-20'>

                            <form onSubmit={formik.handleSubmit}>
                                <label htmlFor="username">Username</label><br />
                                <input id="username" name="username" type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.username}
                                    onBlur={formik.handleBlur}
                                    className='bg-white rounded-sm w-60 h-7 mb-3 focus:ring-2 focus:ring-violet-300 outline-none' />
                                <br />
                                {formik.touched.username && formik.errors.username ? (
                                    <div>{formik.errors.username}</div>
                                ) : null
                                }

                                <label htmlFor="email">Email</label><br />
                                <input id="email" name="email" type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    className='bg-white rounded-sm w-60 h-7 mb-3 focus:ring-2 focus:ring-violet-300 outline-none' />
                                <br />
                                {formik.touched.email && formik.errors.email ?
                                    (<div>
                                        {formik.errors.email}
                                    </div>) : null
                                }

                                <label htmlFor="password">Password</label><br />
                                <input id="password" name="password" type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    onBlur={formik.handleBlur}
                                    className='bg-white rounded-sm w-60 h-7 mb-3 focus:ring-2 focus:ring-violet-300 outline-none' />
                                <br />
                                {formik.touched.password && formik.errors.password ?
                                    (<div>{formik.errors.password}</div>) :
                                    null}


                                <button
                                    type="submit"
                                    className="flex justify-center bg-blue-400 hover:bg-blue-600 m-2 p-2 rounded-md cursor-pointer w-50 text-white">
                                    <h1>SIGN UP</h1>
                                </button>


                            </form>
                            <label htmlFor="">Already have an account? <Link to='/login' className='text-blue-600 underline cursor-pointer'>Log In</Link></label>
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

export default SignUp
