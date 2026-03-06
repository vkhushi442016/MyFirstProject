import React, { useState, useEffect } from 'react'
import ProgressBar from './ProgressBar'
import { IoMdAdd } from "react-icons/io";
import { BsBuildingAdd } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { useFormik } from 'formik';
import { PiCity } from "react-icons/pi";
import { MdPeopleAlt } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { PiStudent } from "react-icons/pi";
import { IoBookSharp } from "react-icons/io5";
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { BiSortAlt2 } from "react-icons/bi";
import BarChart from './BarChart';
import axios from 'axios'


const SchoolManagement = ({ colors }) => {
  let [finalRes, fn] = React.useState([])

  let [dise_code, setdise_code] = useState('')
  let [schoolName, setschoolName] = useState('')
  //let [district, setDistrict] = useState('')
  let [classes, setClasses] = useState('')
  let [staff, setStaff] = useState('')
  let [students, setStudents] = useState('')
  let [syllabus, setSyllabus] = useState('')

  let [city, setCity] = useState([])
  let [selectCity, setSelectCity] = useState('')
  const [attemptedCitySelect, setAttemptedCitySelect] = useState(false);
  let [performance, setPerformance] = useState('')
  let [selectdistrict, setSelectDistrict] = useState('')
  let [district, setDistrict] = useState([])
  const [attemptedDistrictSelect, setAttemptedDistrictSelect] = useState(false);
  const [attemptedPerformanceSelect, setAttemptedPerformanceSelect] = useState(false);

  const [results, setResults] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [open, setOpen] = useState(false);           // dropdown toggle
  const [openDistrict, setOpenDistrict] = useState(false)
  const [openCity, setOpenCity] = useState(false)

  const [selectedDistrict, setSelectedDistrict] = useState('')  //Dropdown selection of district
  const [searchDistrict, setSearchDistrict] = useState("");

  const [selectedCity, setSelectedCity] = useState('')          //Dropdown selection of cities
  const [searchCity, setSearchCity] = useState('')

  const [searchTerm, setSearchTerm] = useState("");          // typed by user
  const [openSearch, setOpenSearch] = useState(false);       // controls input visibility
  const [activeSearchColumn, setActiveSearchColumn] = useState(""); // which column is active
  const [res, setRes] = useState([]);                        // fetched data

  useEffect(() => {
    if (!activeSearchColumn) return; // don't call API if no column selected

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5008/searchschool?column=${activeSearchColumn}&search=${encodeURIComponent(searchTerm)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setRes(result);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    // Optional: debounce to avoid many requests
    const timer = setTimeout(fetchData, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, activeSearchColumn]);

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
      // console.log(cities)
      setCity(cities);
      return cities;
    } else {
      console.error('State not found or no cities available');
      return [];
    }
  };

  useEffect(() => {
    getMPCities('IN', 'MP');
  }, [])

  function getDistrictsData() {
    fetch('https://gist.githubusercontent.com/devzakir/ade5836fae0ac40531e6afb111d61870/raw/4fe8c90e127060d55ad3c7d6d603d13528450e5b/india-states-and-districts.json')
      .then((res) => res.json())
      .then((res) => {
        const mp = res.states.find((s) => s.state === "Madhya Pradesh");
        setDistrict(mp.districts)
      })
  }

  const getTextColor = (value) => {
    if (value >= 80) return "text-green-800 bg-green-100";
    if (value >= 60) return "text-blue-800 bg-blue-100";
    if (value >= 40) return "text-yellow-800 bg-yellow-100";
    return "text-red-800 bg-red-100";
  };

  const calculatePerformance = (syllabusValue) => {
    const value = Number(syllabusValue);

    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    if (value >= 40) return "Average";
    return "Poor";
  };

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
      toast.success("School Added Successfully")
    }
  })

  useEffect(() => {
    if (formik.values.syllabus !== "") {
      const performanceValue = calculatePerformance(formik.values.syllabus);
      formik.setFieldValue("performance", performanceValue);
    } else {
      formik.setFieldValue("performance", "");
    }
  }, [formik.values.syllabus]);

  const [summary, setSummary] = useState({});

  function getSchoolManagementData() {
    fetch('http://localhost:5008/schoolmanagement')
      .then((res) => res.json())
      .then((res) => {
        fn(res)

        // Calculate district-wise sum and count
        const districtData = res.reduce((acc, item) => {
          const district = item.district;
          const perf = Number(item.syllabus) || 0;

          if (!acc[district]) {
            acc[district] = { sum: perf, count: 1 };
          } else {
            acc[district].sum += perf;
            acc[district].count += 1;
          }

          return acc;
        }, {});

        // Calculate average for each district
        const districtAverage = {};
        Object.keys(districtData).forEach(district => {
          districtAverage[district] = (districtData[district].sum / districtData[district].count).toFixed(2);
        });

        setSummary(districtAverage); // save averages instead of sum
      })
  }

  // Prepare data for BarChart
  const chartData = {
    labels: Object.keys(summary),               // district names
    datasets: [
      {
        label: "Avg Syllabus Completion (%)",
        data: Object.values(summary),           // average values
        backgroundColor: colors || "#804ed7",  // use your colors prop or fallback
      },
    ],
  };

  useEffect(() => {
    getSchoolManagementData();
  }, [])

  useEffect(() => {
    getDistrictsData();
  }, [])

  useEffect(() => {
    if (!openDistrict && !formik.values.district && attemptedDistrictSelect) {
      formik.setFieldTouched("district", true);
    }
  }, [openDistrict, attemptedDistrictSelect]);

  let data = {
    dise_code: dise_code,
    schoolName: schoolName,
    district: selectdistrict,
    city: city,
    classes: classes,
    staffCount: staff,
    studentCount: students,
    syllabus: syllabus,
    performance: performance
  }
  //the keynames must match from the table and value can be any name

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
        setPerformance("");          // reset performance
        setOpenDistrict(false);
        setOpen(false);

        getSchoolManagementData();
      })

  }

  function search(data, keyword) {
    if (typeof keyword !== "string" || !keyword.trim()) {     //trim() is used to removes spaces from start and end
      throw new Error("Search keyword must be a non-empty string");
    }

    const matches = data.filter((item) => {
      const lowerKeyword = keyword.toLowerCase();
      return (
        item.schoolName.toLowerCase().includes(lowerKeyword) ||
        item.district.toLowerCase().includes(lowerKeyword) ||
        item.city.toLowerCase().includes(lowerKeyword)
      );
    });
    return matches;
  }

  const filterData = results.filter((item) =>
    selectedDistrict ? item.district === selectedDistrict : true
  )
    .filter((item) =>
      selectedCity ? item.city === selectedCity : true
    );

  //for modal dropdown district filter
  const filteredDistricts = district.filter((item) =>
    item.name.toLowerCase().includes(searchDistrict.toLowerCase())
  );
  //for modal dropdown city filter
  const filteredCity = city.filter((item) =>
    item.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    const filtered = search(finalRes, value);
    setResults(filtered)
  }

  useEffect(() => {
    if (!keyword.trim()) {
      setResults(finalRes); // show all if empty
    } else {
      setResults(search(finalRes, keyword));
    }
  }, [keyword, finalRes]);

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortKey, setSortKey] = useState("");

  const handleSort = (key) => {
    let sorted = [...paginatedData];  //for making a copy 

    sortedData.sort(function (a, b) {
      let valA = a[key];
      let valB = b[key];

      // If string, lowercase for consistent comparison
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA > valB) return sortOrder === "asc" ? -1 : 1;
      if (valA < valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setPaginatedData(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // toggle
    setSortKey(key);
  }

  useEffect(() => {
    // define the async function inside useEffect
    const getSchoolSearch = async () => {
      try {
        const response = await fetch(
          `http://localhost:5008/searchschool?column=${activeSearchColumn}&search=${encodeURIComponent(searchTerm)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setRes(result);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    getSchoolSearch();
  }, [searchTerm, activeSearchColumn]);

  ///////////////////////////////////
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedData, setPaginatedData] = useState([])

  const fetchSchoolData = async (pageNumber = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:5008/schoolmanpagination?page=${pageNumber}&limit=10`
      );

      setPaginatedData(response.data.data); // staff data
      setTotalPages(response.data.totalPages); // total pages
    } catch (error) {
      console.error("Pagination fetch error:", error);
    }
  };

  useEffect(() => {
    console.log("Total Pages State:", totalPages);
    fetchSchoolData(page);
  }, [page]);


  const tableData = searchTerm && res.length > 0 ? res : filterData;

  return (
    <div className='relative w-full'>
      <h1 className='text-2xl m-1 font-bold'>Schools Management</h1>

      <hr className='border-gray-300 m-2'/>
      <div className='flex m-1'>
        <button
          command="show-modal" commandfor="dialog"
          className="flex m-1 bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base">
          <IoMdAdd className='m-1 font-bold' />
          Add School
        </button>
        <input type="text"
          placeholder='Search School'
          value={keyword}
          onChange={handleChange}
          className='w-3/5 m-1 p-3 text-md rounded-md bg-white outline-2 focus:ring-2 focus:ring-violet-300 outline-none'
        />
      </div>

      <div className='w-full overflow-x-auto relative bg-white rounded-md h-130'>
        <table className="table-auto border-collapse w-full capitalise bg-white rounded-md">
          <thead>
            <tr className='border-b border-gray-300 h-11 px-4'>
              <th className='font-normal'>
                Dise Code
              </th>

              <th
                className="relative flex items-center justify-center cursor-pointer p-2 font-normal"
                onClick={() => {
                  setActiveSearchColumn("schoolName");
                  setOpenSearch(true);
                  setSearchTerm(""); // optional: reset search when reopening
                }}
              >
                <BiSortAlt2
                  className="m-1 text-xl"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering header click
                    handleSort("schoolName")
                  }}
                />
                {/* Hide label when search input is open */}
                {!(openSearch && activeSearchColumn === "schoolName") && "School Name"}

                {openSearch && activeSearchColumn === "schoolName" && (
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search School Name"
                    className="absolute top-0 left-0 h-full px-2 py-1 w-full rounded z-10 border border-purple-500 bg-white focus:ring-2 focus:ring-violet-300 outline-none"
                    autoFocus
                    onBlur={() => setOpenSearch(false)}
                  />
                )}
              </th>

              <th className='relative'>
                <div className="relative flex w-full items-center justify-center">
                  <BiSortAlt2 className='m-1 text-2xl cursor-pointer'
                    onClick={() => handleSort('district')}
                  />
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
                    className="flex peer group w-full text-left px-4 pr-2 py-2 rounded bg-white text-gray-700 hover:bg-gray-50 focus:outline-none">

                    <span className='flex items-center font-normal'>
                      {selectedDistrict || 'District'}
                    </span>

                    <svg className="w-5 h-5 inline ml-auto transition-transform duration-200 group-focus:rotate-0"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#6B7280">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2" d="m19 9-7 7-7-7" />
                    </svg>
                  </button>

                  {openDistrict && (
                    <ul className="absolute left-0 top-full mt-1 w-48 max-h-40 overflow-y-auto 
                        bg-white border border-gray-300 rounded shadow-lg z-[9999]">
                      <li className="px-3 pb-2">
                        <input
                          type="text"
                          placeholder="Search district..."
                          value={searchDistrict}
                          onChange={(e) => setSearchDistrict(e.target.value)}
                          className="w-full px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-normal"
                        onClick={() => {
                          setSelectedDistrict("");
                          setOpenDistrict(false);
                          setAttemptedDistrictSelect(false);
                        }}>
                        All Districts
                      </li>
                      {district.map((item) => (
                        <li
                          key={item}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-normal"
                          onClick={() => {
                            setSelectedDistrict(item.name);
                            setOpenDistrict(false);
                            setAttemptedDistrictSelect(false);
                          }}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  )}

                </div>
              </th>

              <th className="font-normal">
                <div className="flex w-full relative justify-center items-center">

                  <BiSortAlt2 
                    className='ml-3 text-2xl cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort('city');
                      }}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenCity(!openCity);
                  }}
                    className="flex w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none"
                  >
                    <span className="flex items-center">
                      {selectedCity || "City"}
                    </span>

                    <svg
                      className="w-5 h-5 ml-auto transition-transform duration-200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#6B7280"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 9-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {openCity && (
                    <ul
                      className="absolute top-full left-0 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded shadow-md mt-1 z-50 min-h-[8rem]">
                      <li className="px-4 py-2 hover:bg-slate-100 hover:text-black cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCity("");
                          setOpenCity(false);
                          setAttemptedCitySelect(false);
                        }}
                      >
                        All Cities
                      </li>
                      {city.length > 0 ? (
                        city.map((item) => (
                          <li
                            key={item.id}
                            className="px-4 py-2 hover:bg-slate-100 hover:text-black cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCity(item.name)
                              setOpenCity(false);
                              setAttemptedCitySelect(false)
                            }}
                          >
                            {item.name}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-400">No cities found</li>
                      )}
                    </ul>
                  )}

                </div>

              </th>
              <th className="font-normal">Classes</th>
              <th className="font-normal">Staff</th>
              <th className="font-normal">Students</th>
              <th className="font-normal">Syllabus</th>
              <th className="font-normal">Performance</th>
              <th className="font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              //(searchTerm && res.length > 0 ? res : filterData).map((item) => {
              paginatedData.map((item) => {
                return (
                  <>
                    <tr className="border-b border-gray-300 h-12">
                      <td className="h-11 px-4 pl-6 py-2">{item.dise_code}</td>
                      <td className="pl-6 py-2 capitalize font-semibold">{item.schoolName}</td>
                      <td className="pl-6 py-2 capitalize">{item.district}</td>
                      <td className="pl-6 py-2 capitalize">{item.city}</td>
                      <td className="pl-6 py-2">{item.classes}</td>
                      <td className="pl-6 py-2">{item.staffCount}</td>
                      <td className="pl-6 py-2">{item.studentCount}</td>
                      <td className="flex py-2">
                        <ProgressBar value={item.syllabus} />
                        {item.syllabus}%
                      </td>

                      <td className="pl-6 py-2 lowercase text-sm">
                        <div className={`rounded-3xl p-1 w-fit p-1 ${getTextColor(item.syllabus)}`}>
                          {item.performance}
                        </div>
                      </td>

                      <td className="">{item.action}</td>
                    </tr>
                  </>
                )
              })
            }

          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>{page} / {totalPages}</span>

        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">District Performance</h2>
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1">District</th>
              <th className="border px-2 py-1">Total Performance</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary).map(([district, total], index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{district}</td>
                <td className="border px-2 py-1">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <BarChart data={chartData} />
      </div>

      <form onSubmit={formik.handleSubmit}>

        <el-dialog>
          <dialog id="dialog" aria-labelledby="dialog-title" className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
            <el-dialog-backdrop class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

            <div tabIndex="0" className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
              <el-dialog-panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex size-12 text-3xl shrink-0 items-center justify-center rounded-md bg-blue-100 sm:mx-0 sm:size-14">
                      <BsBuildingAdd />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 id="dialog-title" className="text-2xl font-semibold text-gray-900">Add New School</h3>
                      <span className='text-gray-500'>Fill in the details to register a school in the system</span>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="flex flex-col">
                          <label className="text-sm text-gray-500 mb-1">
                            DISE Code *
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

                        <div className="flex flex-col">

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

                        <div className="flex flex-col w-full text-sm relative overflow-visible">
                          <label htmlFor="" className="text-sm text-gray-500 mb-1">
                            District *
                          </label>
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
                            className="flex peer group w-full text-left px-4 pr-2 py-2 border rounded bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none">
                            <span className='flex items-center'>
                              <IoLocationOutline className='mr-2' />
                              {formik.values.district || 'Select District'}
                            </span>
                            <svg className="w-5 h-5 inline ml-auto transition-transform duration-200 -rotate-90 group-focus:rotate-0"
                              xmlns="http://www.w3.org/2000/svg" fill="none"
                              viewBox="0 0 24 24" stroke="#6B7280">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                            </svg>

                          </button>

                          {openDistrict && (
                            <ul className="absolute top-full left-0 h-36 overflow-y-auto w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2 z-[9999]">
                              <li className="px-3 pb-2">
                                <input
                                  type="text"
                                  placeholder="Search district..."
                                  value={searchDistrict}
                                  onChange={(e) => setSearchDistrict(e.target.value)}
                                  className="w-full px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-blue-400"
                                />
                              </li>

                              {/* District List */}
                              <div className="max-h-32 py-1">
                                {filteredDistricts.length > 0 ? (
                                  filteredDistricts.map((item) => (
                                    <li
                                      key={item.name}
                                      className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                                      onClick={() => {
                                        formik.setFieldValue("district", item.name);
                                        setSelectDistrict(item.name);
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

                              {/* {district.map((item) => (
                                <li
                                  key={item}
                                  className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                                  onClick={() => {
                                    formik.setFieldValue("district", item.name);
                                    setSelectDistrict(item.name);
                                    setOpenDistrict(false);
                                    setAttemptedDistrictSelect(false);
                                  }}
                                >
                                  {item.name}
                                </li>
                              ))} */}
                            </ul>
                          )}

                          {attemptedDistrictSelect && !formik.values.district && (
                            <p className="text-red-500 text-sm mt-1">Please select a district</p>
                          )}
                        </div>

                        {/* <select
                        value={selectCity}
                        onChange={(e) => setSelectCity(e.target.value)}
                      >
                        <option value="">Select City</option>
                        {city.map((city) => (
                          <option key={city.id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select> */}

                        <div className="flex flex-col w-full text-sm relative overflow-visible">
                          <label htmlFor="" className="text-sm text-gray-500 mb-1">
                            Select City
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (openCity) {
                                // Closing dropdown
                                if (!formik.values.city) setAttemptedCitySelect(true);
                              } else {
                                // Opening dropdown
                                setAttemptedCitySelect(false);
                              }
                              setOpenCity(!openCity);
                            }}
                            className="flex peer group w-full text-left px-4 pr-2 py-2 border rounded bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
                          >
                            <span className='flex items-center'><PiCity className='mr-2' />
                              {formik.values.city || 'Select City'}
                            </span>
                            <svg className="w-5 h-5 inline ml-auto float-right transition-transform duration-200 -rotate-90 group-focus:rotate-0"
                              xmlns="http://www.w3.org/2000/svg" fill="none"
                              viewBox="0 0 24 24" stroke="#6B7280">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                            </svg>
                          </button>

                          {openCity && (
                            <ul className="absolute top-full left-0 h-36 overflow-y-auto w-full bg-white border border-gray-300 rounded shadow-md mt-1 z-[9999]">
                              <li className="px-4 p-2 bg-white">
                                <input
                                  type="text"
                                  placeholder="Search City..."
                                  value={searchCity}
                                  onChange={(e) => setSearchCity(e.target.value)}
                                  className="w-full px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                              </li>
                              <div className="max-h-32 py-1">
                                {
                                  filteredCity.length > 0 ?
                                    (filteredCity.map((item) => (
                                      <li
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                          formik.setFieldValue("city", item.name);
                                          setSelectCity(item.name);
                                          setOpenCity(false);
                                          setAttemptedCitySelect(false);
                                        }}
                                      >
                                        {item.name}
                                      </li>
                                    ))
                                    ) : <li className="px-4 py-2 text-gray-400">No district found</li>
                                }
                              </div>
                              {/* // {city.map((item) => (
                              //   <li
                              //     key={item.id}
                              //     className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                              //     onClick={() => {
                              //       formik.setFieldValue("city", item.name);
                              //       setSelectCity(item.name);
                              //       setOpenCity(false);
                              //       setAttemptedCitySelect(false);
                              //     }}
                              //   >
                              //     {item.name}
                              //   </li>
                              // ))} */}
                            </ul>
                          )}

                          {attemptedCitySelect && !formik.values.city && (
                            <p className="text-red-500 text-sm mt-1">Please select a city</p>
                          )}

                        </div>

                        <div className="relative flex flex-col">
                          <label htmlFor="" className="text-sm text-gray-500 mb-1">
                            Classes
                          </label>
                          <div className="relative">
                            <RxDashboard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                            <input
                              id='classes'
                              name='classes'
                              type="text"
                              value={formik.values.classes}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={`rounded-md w-full h-11 pl-10 border border-blue-200 transition-colors duration-200 ${formik.values.classes ? "bg-white" : "bg-slate-100 hover:bg-white focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                            />
                          </div>

                          {
                            formik.errors.classes && formik.touched.classes ?
                              (<div className='text-red-500 text-sm'>{formik.errors.classes}</div>) :
                              null
                          }
                        </div>


                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm text-gray-500 mb-1">
                            Staff
                          </label>
                          <div className="relative">
                            <MdPeopleAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />

                            <input
                              id='staffCount'
                              name='staffCount'
                              type="text"
                              value={formik.values.staffCount}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={`rounded-md w-full h-11 pl-10 border border-blue-200 transition-colors duration-200 ${formik.values.classes ? "bg-white" : "bg-slate-100 hover:bg-white focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                            />
                          </div>
                          {
                            formik.errors.staffCount && formik.touched.staffCount ?
                              (<div className='text-red-500 text-sm'>{formik.errors.staffCount}</div>) :
                              null
                          }
                        </div>

                        <div className="flex flex-col">

                          <label htmlFor="" className="text-sm text-gray-500 mb-1">
                            Student
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
                              className={`rounded-md w-full h-11 pl-10 border border-blue-200 transition-colors duration-200 ${formik.values.classes ? "bg-white" : "bg-slate-100 hover:bg-white focus:bg-white"} focus:ring-2 focus:ring-blue-300`}

                            />
                          </div>
                          {
                            formik.errors.studentCount && formik.touched.studentCount ?
                              (<div className='text-red-500 text-sm'>{formik.errors.studentCount}</div>) :
                              null
                          }
                        </div>

                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm text-gray-500 mb-1">
                            Syllabus
                          </label>
                          <div className="relative">
                            <IoBookSharp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />

                            <input
                              id='syllabus'
                              name='syllabus'
                              value={formik.values.syllabus}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={`rounded-md w-full h-11 pl-10 border border-blue-200 transition-colors duration-200 ${formik.values.classes ? "bg-white" : "bg-slate-100 hover:bg-white focus:bg-white"} focus:ring-2 focus:ring-blue-300`}
                            />
                          </div>
                          {
                            formik.errors.syllabus && formik.touched.syllabus ?
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
                      <br /><br /><br /><br /><br /><br /><br />
                      <div class="absolute right-10 bottom-2 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="submit" command="close"
                          className="inline-flex w-full justify-center rounded-md bg-blue-300 px-5 py-4 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto">
                          Submit
                        </button>
                        <button type="button" command="close" commandfor="dialog"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-4 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => {
                            formik.resetForm();
                            //Clears dropdown states
                            setSelectDistrict("");
                            setPerformance("");
                            setSelectCity("");

                            //Clears custom select states
                            setOpenDistrict(false);
                            setOpen(false);
                            setOpenCity(false);

                            //Clear custom validation flags
                            setAttemptedCitySelect(false)
                            setAttemptedDistrictSelect(false)
                            setAttemptedPerformanceSelect(false)
                          }}>
                          Cancel
                        </button>
                      </div>

                    </div>
                  </div>
                </div>

              </el-dialog-panel>
            </div>
          </dialog>

        </el-dialog>

      </form >

      {/* <label className="text-sm text-gray-500 mb-1">
                      dise Code
                    </label>
                    <br />
                    <input
                      type="text"
                      value={dise_code}
                      onChange={(e) => setdise_code(e.target.value)}
                      className="bg-white rounded-md w-40 h-11 px-4 border focus:ring-2 focus:ring-violet-300"
                    />
                    <br />
                    <label className="text-sm text-gray-500 mb-1">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setschoolName(e.target.value)}
                      className="bg-white mr-2 rounded-md w-full h-11 px-4 border focus:ring-2 focus:ring-violet-300"
                    /> */}


      < div >


        {/* <div className="flex flex-col">
                        <label htmlFor="" className="text-sm text-gray-500 mb-1">
                          District
                        </label>
                        <input type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className='bg-white rounded-md w-full h-9 focus:ring-2 focus:ring-violet-300 outline-2 outline-offset-2' />
                      </div> */}

        {/* <div className="flex flex-col">
                        <label htmlFor="" className="text-sm text-gray-500 mb-1">
                          City
                        </label>
                        <input type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className='bg-white mr-2 rounded-md w-full h-11 px-4 border focus:ring-2 focus:ring-violet-300' />
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="" className="text-sm text-gray-500 mb-1">
                          Classes
                        </label>
                        <input type="text"
                          value={classes}
                          onChange={(e) => setClasses(e.target.value)}
                          className='bg-white rounded-md w-full h-11 px-4 border focus:ring-2 focus:ring-violet-300' />
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="" className="text-sm text-gray-500 mb-1">
                          Staff
                        </label>
                        <input type="text"
                          value={staff}
                          onChange={(e) => setStaff(e.target.value)}
                          className='bg-white rounded-md w-full h-11 px-4 border focus:ring-2 focus:ring-violet-300' />
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="" className="text-sm text-gray-500 mb-1">
                          Student
                        </label>
                        <input type="text"
                          value={students}
                          onChange={(e) => setStudents(e.target.value)}
                          className='bg-white rounded-md w-full h-11 px-4 border focus:ring-2 focus:ring-violet-300' />
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="" className="text-sm text-gray-500 mb-1">
                          Syllabus
                        </label>
                        <input type="text"
                          value={syllabus}
                          onChange={(e) => setSyllabus(e.target.value)}
                          className='bg-white rounded-md w-full h-11 px-4 border focus:ring-2 focus:ring-violet-300' />
                      </div> */}
      </div >

    </div >

  )
}

export default SchoolManagement;
