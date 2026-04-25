import React, { useEffect } from 'react'
import { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { IoMdPersonAdd } from 'react-icons/io';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { IoLocationOutline } from 'react-icons/io5';
import { PiCity } from 'react-icons/pi';
import { BsBuildingAdd } from 'react-icons/bs';
import { RxDashboard } from 'react-icons/rx';
import { MdPeopleAlt } from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';
import { IoBookSharp } from 'react-icons/io5';

const AddNewSchoolForm = () => {

    const [open, setOpen] = useState(false);
    const [district, setDistrict] = useState([])
    const [openDistrict, setOpenDistrict] = useState(false)

    const [cities, setCities] = useState([]); // list of cities from API
    const [openCity, setOpenCity] = useState(false); // dropdown open/close

    const [openClasses, setOpenClasses] = useState(false)   //for classes dropdown

    const formik = useFormik({
        initialValues: {
            dise_code: '',
            schoolName: '',
            district: '',
            city: '',
            classes: '',
            staffCount: '',
            studentCount: '',
            performance: '',
            syllabus: '',
        },
        validationSchema: Yup.object({
            dise_code: Yup.string().matches(/^\d{11}$/, "DISE code must be exactly 11 digits").required('Required'),         //   /^d{11}$/ short hand = /^[0-9]{11}$/
            schoolName: Yup.string().required('Required'),
            district: Yup.string().required('Required'),
            city: Yup.string().matches(/^[a-zA-Z\s]+$/, 'Must be letters only').required('Required'),
            classes: Yup.string().required('Required'),
            staffCount: Yup.string().matches(/^[0-9]+$/, 'must be a number').required('Required'),
            studentCount: Yup.string().matches(/^[0-9]+$/, 'must be a number').required('Required'),
            performance: Yup.string().required('Required'),
            syllabus: Yup.string().matches(/^[0-9]+$/, 'must be a number').required('Required'),
        }),
        onSubmit: (values, { resetForm }) => {
            postSchoolDetailData(values, resetForm)
            setOpen(false);
            toast.success("School Added Successfully")
        }
    })

    function postSchoolDetailData(values, resetForm) {

        fetch('http://localhost:5008/schooldetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then((res) => res.json())
            .then((res) => {

                resetForm();                 // reset formik
                setSelectDistrict("");       // reset district button
                // reset performance
                setOpenDistrict(false);
                setOpen(false);

                getSchoolManagementData();
            })
    }

    //For MP District api
    function getDistrictsData() {
        fetch('https://gist.githubusercontent.com/devzakir/ade5836fae0ac40531e6afb111d61870/raw/4fe8c90e127060d55ad3c7d6d603d13528450e5b/india-states-and-districts.json')
            .then((res) => res.json())
            .then((res) => {
                const mp = res.states.find((s) => s.state === "Madhya Pradesh");
                setDistrict(mp.districts)
            })
    }

    useEffect(() => {
        getDistrictsData();
    }, [])


    //get Mp Cities for Dropdown in modal
    const getMPCities = async (countryCode, stateCode) => {
        const response = await fetch(
            `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
            {
                headers: { 'X-CSCAPI-KEY': '20596f2fc57ec65c30e68873d178064450faa52d39863feffbcd5b64ea07240a' }
            }
        );

        if (response.ok) {
            const cities = await response.json();
            // console.log(`Found ${cities.length} cities in ${stateCode}, ${countryCode}`);
            //console.log(cities)
            setCities(cities);
            return cities;
        } else {
            console.error('State not found or no cities available');
            return [];
        }
    };

    useEffect(() => {
        getMPCities('IN', 'MP');
    }, [])

    //Automatically calculate the performance
    const calculatePerformance = (syllabusValue) => {
        const value = Number(syllabusValue);

        if (value >= 80) return "Excellent";
        if (value >= 60) return "Good";
        if (value >= 40) return "Average";
        return "Poor";
    };

    useEffect(() => {
        if (formik.values.syllabus !== "") {
            const performanceValue = calculatePerformance(formik.values.syllabus);
            formik.setFieldValue("performance", performanceValue);
        } else {
            formik.setFieldValue("performance", "");
        }
    }, [formik.values.syllabus]);

    const [searchDistrict, setSearchDistrict] = useState('')
    const [attemptedDistrictSelect, setAttemptedDistrictSelect] = useState(false)
    
    //for modal dropdown district filter
    const filteredDistricts = district.filter((item) =>
        item.name.toLowerCase().includes(searchDistrict.toLowerCase())
    );

    //Dropdown selection of cities
    const [searchCity, setSearchCity] = useState('')
    const [attemptedCitySelect, setAttemptedCitySelect] = useState(false)
    //for modal dropdown city filter
    const filteredCity = cities.filter((item) =>
        item.name.toLowerCase().includes(searchCity.toLowerCase())
    );

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex m-1 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base">
                <IoMdAdd className='m-1 font-bold' />
                Add School
            </button>


            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">

                    <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">


                        {/* Modal Panel */}
                        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                            {/* Your Form */}
                            <form
                                onSubmit={formik.handleSubmit}
                                className="space-y-4"
                            >
                                {/* Modal Content */}
                                <div className="px-6 py-4">
                                    <div className="flex">
                                        <div className="mx-auto flex size-12 text-4xl text-white shrink-0 items-center justify-center rounded-md bg-blue-300 sm:mx-0 sm:size-14">
                                            <BsBuildingAdd />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 id="dialog-title" className="text-xl sm:text-3xl font-semibold text-gray-900">Add School</h3>
                                            <span className='text-gray-500'>Fill in the details to register a school in the system</span>
                                        </div>
                                    </div>
                                    <hr />



                                    <div className="m-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm text-gray-500 mb-1">
                                                Dise Code *
                                            </label>

                                            <input
                                                id='dise_code'
                                                name='dise_code'
                                                type="text"
                                                value={formik.values.dise_code}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.dise_code ? "bg-white" : "bg-slate-100 hover:bg-white focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                            />

                                            {formik.errors.dise_code && formik.touched.dise_code ?
                                                (<div className='text-red-500 text-sm'>{formik.errors.dise_code}</div>) :
                                                null
                                            }
                                        </div>

                                        <div className="relative flex flex-col">

                                            <label className="text-sm text-gray-500 mb-1">
                                                School Name
                                            </label>

                                            <input
                                                id='schoolName'
                                                name='schoolName'
                                                type="text"
                                                value={formik.values.schoolName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`rounded-md w-full h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.classes ? "bg-white" : "bg-slate-100 hover:bg-white focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                            />
                                            {
                                                formik.errors.schoolName && formik.touched.schoolName ?
                                                    (<div className='text-red-500 text-sm'>{formik.errors.schoolName}</div>) :
                                                    null
                                            }
                                        </div>

                                        <div className="relative flex flex-col">
                                            <label className="text-sm text-gray-500 mb-1">District *</label>

                                            {/* Dropdown button */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (openDistrict) {
                                                        // Closing dropdown
                                                        if (!formik.values.district) setAttemptedDistrictSelect(true);
                                                    } else {
                                                        // Opening dropdown
                                                        setAttemptedDistrictSelect(false);
                                                    }
                                                    setOpenDistrict(!openDistrict);
                                                }}
                                                className="flex w-full text-left px-4 py-2 border rounded bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
                                            >
                                                <span className="flex items-center">
                                                    <IoLocationOutline className="mr-2" />
                                                    {formik.values.district || 'Select District'}
                                                </span>
                                                <svg
                                                    className="w-5 h-5 ml-auto transition-transform duration-200 -rotate-90 group-focus:rotate-0"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="#6B7280"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Dropdown list */}
                                            {openDistrict && (
                                                <ul className="absolute left-0 top-full mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded shadow-lg z-[9999]">
                                                    {/* All Districts option */}
                                                    <li className="px-3 pb-2 m-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Search district..."
                                                            value={searchDistrict}
                                                            onChange={(e) => setSearchDistrict(e.target.value)}
                                                            className="w-full px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-blue-400"
                                                        />
                                                    </li>

                                                    {/* Map MP districts */}
                                                    <div className="max-h-32 py-1">
                                                        {filteredDistricts.length > 0 ? (
                                                            filteredDistricts.map((item) => (
                                                                <li
                                                                    key={item.name}
                                                                    className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        formik.setFieldValue("district", item.name);

                                                                        setOpenDistrict(false);
                                                                        setAttemptedDistrictSelect(false);
                                                                        setSearchDistrict(""); // reset search
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="px-4 py-2 text-gray-400">No district found</li>
                                                        )}
                                                    </div>
                                                </ul>
                                            )}

                                            {/* Validation error */}
                                            {attemptedDistrictSelect && !formik.values.district && (
                                                <p className="text-red-500 text-sm mt-1">Please select a district</p>
                                            )}
                                        </div>

                                        <div className="relative flex flex-col w-full text-sm">
                                            <label className="text-sm text-gray-500 mb-1">
                                                Select City
                                            </label>

                                            {/* Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (openCity) {
                                                        // Closing dropdown
                                                        if (!formik.values.city) setAttemptedCitySelect(true);
                                                    } else {
                                                        // Opening dropdown
                                                        setAttemptedCitySelect(false);
                                                    }
                                                    setOpenCity(!openCity);
                                                }}
                                                className="flex w-full text-left px-4 py-2 border rounded bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50"
                                            >
                                                <span className="flex items-center">
                                                    <PiCity className="mr-2" />
                                                    {formik.values.city || 'Select City'}
                                                </span>
                                                <svg className="w-5 h-5 inline ml-auto float-right transition-transform duration-200 -rotate-90 group-focus:rotate-0"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none"
                                                    viewBox="0 0 24 24" stroke="#6B7280">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Dropdown */}
                                            {openCity && (
                                                <ul className="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded shadow-md z-[9999]">
                                                    <li className="px-4 p-2 bg-white">
                                                        <input
                                                            type="text"
                                                            placeholder="Search City..."
                                                            value={searchCity}
                                                            onChange={(e) => setSearchCity(e.target.value)}
                                                            className="w-full px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-indigo-400"
                                                        />
                                                    </li>
                                                    {filteredCity.length > 0 ? (
                                                        filteredCity.map((item) => (
                                                            <li
                                                                key={item.id}
                                                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();   //prevents reopening
                                                                    formik.setFieldValue("city", item.name);
                                                                    setOpenCity(false);
                                                                    setAttemptedCitySelect(false);
                                                                }}
                                                            >
                                                                {item.name}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="px-4 py-2 text-gray-400">
                                                            No city found
                                                        </li>
                                                    )}

                                                </ul>
                                            )}

                                            {attemptedCitySelect && !formik.values.city && (
                                                <p className="text-red-500 text-sm mt-1">Please select a city</p>
                                            )}

                                        </div>

                                        <div className="relative flex flex-col w-full text-sm">
                                            <label className="text-sm text-gray-500 mb-1">
                                                Classes *
                                            </label>

                                            {/* Button */}
                                            <button
                                                type="button"
                                                onClick={() => setOpenClasses(!openClasses)}
                                                className="flex w-full items-center px-4 py-2 border rounded bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <RxDashboard className="text-gray-400 text-lg" />
                                                    <span>
                                                        {formik.values.classes || 'Select Classes'}
                                                    </span>
                                                </div>

                                                {/* Arrow icon (right side) */}
                                                <svg
                                                    className="w-5 h-5 ml-auto"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="#6B7280"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Dropdown */}
                                            {openClasses && (
                                                <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-md z-[9999]">

                                                    {["1-5", "1-8", "1-12"].map((item) => (
                                                        <li
                                                            key={item}
                                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                                            onClick={() => {
                                                                formik.setFieldValue("classes", item);
                                                                setOpenClasses(false);
                                                            }}
                                                        >
                                                            {item}
                                                        </li>
                                                    ))}

                                                </ul>
                                            )}

                                            {/* Validation */}
                                            {formik.errors.classes && formik.touched.classes && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    {formik.errors.classes}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-500 mb-1">
                                                Staff
                                            </label>
                                            <div className='relative'>
                                                <MdPeopleAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />

                                                <input
                                                    id='staffCount'
                                                    name='staffCount'
                                                    type="text"
                                                    value={formik.values.staffCount}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={`w-full pl-10 pr-3 py-2 rounded-md h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.dise_code 
                                                        ? "bg-white" : "bg-slate-100 hover:bg-white focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                                />
                                            </div>

                                            {formik.errors.staffCount && formik.touched.staffCount ?
                                                (<div className='text-red-500 text-sm'>{formik.errors.staffCount}</div>) :
                                                null
                                            }
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-500 mb-1">
                                                Total Students
                                            </label>

                                            <div className="relative">
                                                <PiStudent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />

                                                <input
                                                    id='studentCount'
                                                    name='studentCount'
                                                    type="text"
                                                    value={formik.values.studentCount}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={`rounded-md w-full pl-10 pr-3 py-2 h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.dise_code ? "bg-white" : "bg-slate-100 hover:bg-white focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                                />

                                            </div>

                                            {formik.errors.studentCount && formik.touched.studentCount ?
                                                (<div className='text-red-500 text-sm'>{formik.errors.studentCount}</div>) :
                                                null
                                            }
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-500 mb-1">
                                                Syllabus *
                                            </label>

                                            <div className="relative">
                                                <IoBookSharp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />

                                                <input
                                                    id='syllabus'
                                                    name='syllabus'
                                                    type="text"
                                                    value={formik.values.syllabus}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={`rounded-md w-full pl-10 pr-3 py-2 h-11 px-4 border border-blue-200 transition-colors duration-200 ${formik.values.dise_code ? "bg-white" : "bg-slate-100 hover:bg-white focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                                                />

                                            </div>
                                            {formik.errors.syllabus && formik.touched.syllabus ?
                                                (<div className='text-red-500 text-sm'>{formik.errors.syllabus}</div>) :
                                                null
                                            }
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-500 mb-1">
                                                Performance
                                            </label>

                                            <input
                                                type="text"
                                                value={formik.values.performance}
                                                readOnly
                                                className={`rounded-md w-full h-11 px-4 border border-blue-200 bg-gray-100 
                                                    ${formik.values.performance === "Excellent" ? "text-green-600" :
                                                        formik.values.performance === "Good" ? "text-blue-600" :
                                                            formik.values.performance === "Average" ? "text-yellow-600" :
                                                                formik.values.performance === "Poor" ? "text-red-600" : ""}
                                                        `}
                                            />
                                        </div>
                                    </div>

                                </div>
                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-4 m-6">
                                    <button
                                        type="button" command="close"
                                        onClick={() => {
                                            formik.resetForm();

                                            //Clears dropdown states


                                            //Clears custom select states
                                            setOpenDistrict(false);
                                            setOpen(false);
                                            setOpenCity(false);

                                            //Clear custom validation flags
                                            setAttemptedCitySelect(false)
                                            setAttemptedDistrictSelect(false)
                                        }}
                                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit" command="close"
                                        className="rounded-md bg-blue-300 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
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
    )
}


export default AddNewSchoolForm
