import React, { useState, useEffect } from 'react'
import ProgressBar from './ProgressBar'
import { IoMdAdd } from "react-icons/io";
import { BsBuildingAdd } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { BiSortAlt2 } from "react-icons/bi";
import BarChart from './BarChart';
import axios from 'axios'
import AddNewSchoolForm from './AddNewSchoolForm';


const SchoolManagement = ({ colors }) => {
  let [finalRes, fn] = useState([])

  let [city, setCity] = useState([])
  const [attemptedCitySelect, setAttemptedCitySelect] = useState(false);
  let [selectdistrict, setSelectDistrict] = useState('')
  let [district, setDistrict] = useState([])
  const [attemptedDistrictSelect, setAttemptedDistrictSelect] = useState(false);

  const [results, setResults] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [open, setOpen] = useState(false);           // dropdown toggle
  const [openDistrict, setOpenDistrict] = useState(false)
  const [openCity, setOpenCity] = useState(false)

  const [selectedDistrict, setSelectedDistrict] = useState('')  //Dropdown selection of district
  const [searchDistrict, setSearchDistrict] = useState("");

  const [selectedCity, setSelectedCity] = useState('')          //Dropdown selection of cities

  const [searchTerm, setSearchTerm] = useState("");          // typed by user
  const [openSearch, setOpenSearch] = useState(false);       // controls input visibility
  const [activeSearchColumn, setActiveSearchColumn] = useState(""); // which column is active
  const [res, setRes] = useState([]);                        // fetched data
  const [selectedPerformance, setSelectedPerformance] = useState('')
  const [openPerformance, setOpenPerformance] = useState(false)

  const [data2, setData] = useState([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchSchoolData = async () => {
    try {
      const res = await fetch(
        `http://localhost:5008/schoolmanagement?page=${page}&limit=10`
      );
      const data = await res.json();
      setData(data.data);
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSchoolData()
  }, [page])

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

  const [summary, setSummary] = useState({});

  function getSchoolManagementData() {
    fetch('http://localhost:5008/schoolmanagement')
      .then((res) => res.json())
      .then((res) => {
        fn(res)
        //console.log(res);

        //for counting performance value in number format
        const countPerformance = res.data.reduce((acc, item) => {
          const key = item.performance;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})

        console.log("performance: ", countPerformance)
        //find total count performance
        const totalCountPerformance = Object.values(countPerformance).reduce((sum, val) => sum + val, 0);

        //performance percentage
        const performancePercentage = {}
        for(let key in countPerformance){
          performancePercentage[key] = ((countPerformance[key] / totalCountPerformance) * 100).toFixed(2); 
        }

        console.log(performancePercentage);
        



        // Calculate district-wise sum and count
        const districtData = res.data.reduce((acc, item) => {
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

  //Automatically calculate the performance
  const calculatePerformance = (syllabusValue) => {
    const value = Number(syllabusValue);

    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    if (value >= 40) return "Average";
    return "Poor";
  };

  const filterData = data2.filter((item) =>
    selectedDistrict ? item.district === selectedDistrict : true
  )
    .filter((item) =>
      selectedCity ? item.city === selectedCity : true
    )
    .filter((item) =>
      selectedPerformance
        ? calculatePerformance(item.syllabus) === selectedPerformance
        : true
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


  const tableData = searchTerm && res.length > 0 ? res : filterData;

  return (
    <div className='relative w-full'>
      <h1 className='text-2xl m-1 font-bold'>Schools Management</h1>

      <hr className='border-gray-300 m-2' />
      <div className='flex m-1'>
        <AddNewSchoolForm />

        <input type="text"
          placeholder='Search School'
          value={keyword}
          onChange={handleChange}
          className='w-3/5 m-1 p-3 text-md rounded-md bg-white outline-2 focus:ring-2 focus:ring-violet-300 outline-none'
        />
      </div>

      <div className='w-full overflow-x-auto relative bg-white rounded-md h-135'>
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
                    className="flex peer group w-full text-left px-4 pr-2 py-2 rounded bg-white text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >

                    <span className='flex items-center font-normal'>
                      {selectedDistrict || 'District'}
                    </span>

                    <svg className="w-5 h-5 inline ml-auto transition-transform duration-200 group-focus:rotate-0"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#6B7280">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}  // can be number
                        d="m19 9-7 7-7-7"
                      />
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
              <th className="font-normal"
              >
                <div className="flex w-full relative justify-center items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPerformance("");
                      setOpenPerformance(!openPerformance);
                    }}
                    className="flex w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none"
                  >
                    <span className="flex items-center">
                      {selectedPerformance || "Performance"}
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

                  {openPerformance && (
                    <ul
                      className="absolute top-full left-0 w-full max-h-42 overflow-y-auto bg-white border border-gray-300 rounded shadow-md mt-1 z-50 min-h-[8rem]">
                      <li className="px-2 py-1 hover:bg-slate-100 hover:text-black cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenPerformance(false);
                        }}
                      >
                        All Performance
                      </li>
                      {
                        ["Good", "Excellent", "Poor", "Average"].map((item) => (
                          <li
                            key={item}
                            className="px-2 py-1 hover:bg-slate-100 hover:text-black cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPerformance(item)
                              setOpenPerformance(false);
                              //setAttemptedCitySelect(false)
                            }}
                          >
                            {item}
                          </li>
                        ))
                      }
                    </ul>
                  )}
                </div>
              </th>
              <th className="font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              (searchTerm && res.length > 0 ? res : filterData).map((item) => {
                //paginatedData.map((item) => {
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
                        <div className={`rounded-3xl p-1 w-fit ${getTextColor(item.syllabus)}`}>
                          {calculatePerformance(item.syllabus)}
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
          className="px-4 py-2 bg-purple-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>{page} / {totalPages}</span>

        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-purple-300 rounded disabled:opacity-50"
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
