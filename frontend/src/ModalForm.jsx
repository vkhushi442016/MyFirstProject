import React, { useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";
import * as Yup from 'yup';
import { useFormik } from 'formik';

const ModalForm = () => {
    const [open, setOpen] = useState(false);

    function postStaffDetail(values) {
        console.log("Submitting:", values);
        fetch('http://localhost:5008/staffdetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
            })
    }

    const formik = useFormik({
        initialValues: {
            dise_code: '',
            staff_id: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            designation: '',
            qualification: '',
            experience: '',
            joining_date: '',
            salary: '',
            status: '',
        },
        validationSchema: Yup.object({
            dise_code: Yup.string().matches(/^\d{11}$/, "DISE code must be exactly 11 digits").required('Required'),         //   /^d{11}$/ short hand = /^[0-9]{11}$/
            staff_id: Yup.string().required('Required'),
            first_name: Yup.string().required('Required'),
            last_name: Yup.string().required('Required'),
            email: Yup.string().required('Required'),
            phone: Yup.string().required('Required'),
            dob: Yup.string().required('Required'),
            gender: Yup.string().required('Required'),
            designation: Yup.string().required('Required'),
            qualification: Yup.string().required('Required'),
            experience: Yup.string().required('Required'),
            joining_date: Yup.string().required('Required'),
            salary: Yup.string().required('Required'),
            status: Yup.string().required('Required'),

            //   district: Yup.string().required('Required'),
            //   city: Yup.string().matches(/^[a-zA-Z\s]+$/, 'Must be letters only').required('Required'),
            //   classes: Yup.string().required('Required'),
            //   staffCount: Yup.string().matches(/^[0-9]+$/, 'must be a number').required('Required'),
            //   studentCount: Yup.string().matches(/^[0-9]+$/, 'must be a number').required('Required'),
            //   performance: Yup.string().required('Required'),
            //   syllabus: Yup.string().matches(/^[0-9]+$/, 'must be a number').required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log("Formik submit triggered!", values);
            postStaffDetail(values);
            resetForm();
            //toast.success("Teacher Added Successfully")
        }
    })



    return (
        <>
            {/* Open Button */}
            <button
                onClick={() => setOpen(true)}
                className="flex m-1 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
            >Add Teacher
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                    {/* Modal Panel */}
                    <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">

                        {/* Modal Content */}
                        <div className="px-6 py-4">
                            <div className="flex">
                                <div className="mx-auto flex size-12 text-4xl text-white shrink-0 items-center justify-center rounded-md bg-pink-300 sm:mx-0 sm:size-14">
                                    <IoMdPersonAdd />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 id="dialog-title" className="text-xl sm:text-3xl font-semibold text-gray-900">Add New Teacher</h3>
                                    <span className='text-gray-500'>Fill in the details to register a school in the system</span>
                                </div>
                            </div>
                            <hr />

                            {/* Your Form */}
                            <form
                                onSubmit={formik.handleSubmit}
                                className="space-y-4"
                            >
                                <div className="m-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Dise Code
                                        </label>
                                        <input
                                            id='dise_code'
                                            name='dise_code'
                                            type="text"
                                            value={formik.values.dise_code}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.dise_code ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.dise_code && formik.touched.dise_code ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.dise_code}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Staff ID
                                        </label>

                                        <input
                                            id='staff_id'
                                            name='staff_id'
                                            type="text"
                                            value={formik.values.staff_id}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.staff_id ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.staff_id && formik.touched.staff_id ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.staff_id}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>

                                        <input
                                            id='first_name'
                                            name='first_name'
                                            type="text"
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.first_name ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.first_name && formik.touched.first_name ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.first_name}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>

                                        <input
                                            id='last_name'
                                            name='last_name'
                                            type="text"
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.last_name ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.last_name && formik.touched.last_name ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.last_name}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            id='email'
                                            name='email'
                                            type="text"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.email ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.email && formik.touched.email ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.email}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            id='phone'
                                            name='phone'
                                            type="text"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.phone ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.phone && formik.touched.phone ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.phone}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Birth
                                        </label>
                                        <input
                                            id='dob'
                                            name='dob'
                                            type="date"
                                            value={formik.values.dob}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.dob ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.dob && formik.touched.dob ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.dob}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Gender
                                        </label>

                                        <select
                                            id="gender"
                                            name="gender"
                                            value={formik.values.gender}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.status ? "bg-white" : "hover:bg-blue-50 focus:bg-white"
                                                } focus:ring-2 focus:ring-blue-300`}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>

                                        {formik.errors.gender && formik.touched.gender && (
                                            <div className="text-red-500 text-sm">{formik.errors.gender}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Designation
                                        </label>
                                        <input
                                            id='designation'
                                            name='designation'
                                            type="text"
                                            value={formik.values.designation}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.designation ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.designation && formik.touched.designation ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.designation}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Qualification
                                        </label>
                                        <input
                                            id='qualification'
                                            name='qualification'
                                            type="text"
                                            value={formik.values.qualification}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.qualification ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.qualification && formik.touched.qualification ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.qualification}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Experience
                                        </label>
                                        <input
                                            id='experience'
                                            name='experience'
                                            type="text"
                                            value={formik.values.experience}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.experience ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.experience && formik.touched.experience ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.experience}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Joining Date
                                        </label>
                                        <input
                                            id='joining_date'
                                            name='joining_date'
                                            type="date"
                                            value={formik.values.joining_date}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.joining_date ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.joining_date && formik.touched.joining_date ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.joining_date}</div>) :
                                            null
                                        }
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Salary
                                        </label>
                                        <input
                                            id='salary'
                                            name='salary'
                                            type="text"
                                            value={formik.values.salary}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.salary ? "bg-white" : " hover:bg-blue-50 focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                        />

                                        {formik.errors.salary && formik.touched.salary ?
                                            (<div className='text-red-500 text-sm'>{formik.errors.salary}</div>) :
                                            null
                                        }
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formik.values.status}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.status ? "bg-white" : "hover:bg-blue-50 focus:bg-white"
                                                } focus:ring-2 focus:ring-blue-300`}
                                        >
                                            <option value="">Select status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="inactive">On Leave</option>
                                        </select>

                                        {formik.errors.status && formik.touched.status && (
                                            <div className="text-red-500 text-sm">{formik.errors.status}</div>
                                        )}
                                    </div>


                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="rounded-md bg-pink-300 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default ModalForm;

