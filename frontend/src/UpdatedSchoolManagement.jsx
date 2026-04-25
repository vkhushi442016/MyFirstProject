import React, { useEffect, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import ProgressBar from './ProgressBar';
import { BiSortAlt2 } from 'react-icons/bi';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import AddNewSchoolForm from './AddNewSchoolForm';
import useStore from './common/store/store';



const UpdatedSchoolManagement = () => {
    const token = useStore((state) => state.token);

    const [data, setData] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [activeSearch, setActiveSearch] = useState(null);
    const [searchValues, setSearchValues] = useState({
        schoolName: "",
        district: "",
    });

    const [districtSearch, setDistrictSearch] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");

    //school data
    const fetchSchoolData = async () => {
        try {
            const res = await fetch(
                `http://localhost:5008/schoolmanagement?page=${page}&limit=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then((res) => res.json())
                .then((data) => {
                    setData(data);
                    setTotalPages(data.totalPages)
                    console.log(data)
                })

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSchoolData()
    }, [page])

    const [sortKey, setSortKey] = useState("schoolName");
    const [sortOrder, setSortOrder] = useState("asc");

    //Sorting Function
    const handleSort = (key) => {
        const sorted = [...data].sort((a, b) => {
            let valA = a[key];
            let valB = b[key];

            // Handle null/undefined
            if (valA == null) return 1;
            if (valB == null) return -1;

            // Convert to number if possible
            if (!isNaN(valA) && !isNaN(valB)) {
                return sortOrder === "asc"
                    ? Number(valA) - Number(valB)
                    : Number(valB) - Number(valA);
            }

            // Otherwise treat as string
            valA = valA.toString().toLowerCase();
            valB = valB.toString().toLowerCase();

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });


        setData(sorted);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        setSortKey(key);
    };

    // const [district, setDistrict] = useState([])
    // function getDistrictsData() {
    //   fetch('https://gist.githubusercontent.com/devzakir/ade5836fae0ac40531e6afb111d61870/raw/4fe8c90e127060d55ad3c7d6d603d13528450e5b/india-states-and-districts.json')
    //     .then((res) => res.json())
    //     .then((res) => {
    //       const mp = res.states.find((s) => s.state === "Madhya Pradesh");
    //       setDistrict(mp.districts)
    //     })
    // }

    // useEffect(() => {
    //   getDistrictsData()
    // }, [])

    const [cityList, setCity] = useState([]); // API cities
    const [citySearch, setCitySearch] = useState(""); // search inside dropdown
    const [selectedCity, setSelectedCity] = useState(""); // selected city

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

    const cityOptions = cityList.map((c) => c.name);

    const filteredCities = cityOptions.filter((city) =>
        city.toLowerCase().includes(citySearch.toLowerCase())
    );

    const [selectedClassRange, setSelectedClassRange] = useState("");
    const [selectedPerformance, setSelectedPerformance] = useState(""); //for performance dropdown
    const [debouncedSchoolName, setDebouncedSchoolName] = useState(""); //for debounce search in search input field

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSchoolName(searchValues.schoolName)
        }, 500);

        return () => clearTimeout(timer)
    }, [searchValues.schoolName]);


    const filteredData = (data || []).filter(
        (item) =>
            (!selectedDistrict || item.district === selectedDistrict) &&
            (!selectedCity || item.city === selectedCity) &&
            (!selectedClassRange || item.classes === selectedClassRange) &&
            (!selectedPerformance || item.performance === selectedPerformance) &&
            item.schoolName
                ?.toLowerCase()
                .includes(debouncedSchoolName.toLowerCase())         // filter by schoolName
    )

    const districtOptions = [...new Set((data || []).map(item => item.district))];

    const filteredDistricts = districtOptions.filter((d) =>
        d.toLowerCase().includes(districtSearch.toLowerCase())
    );

    const getTextColor = (value) => {
        if (value >= 80) return "text-green-800 bg-green-100";
        if (value >= 60) return "text-blue-800 bg-blue-100";
        if (value >= 40) return "text-yellow-800 bg-yellow-100";
        return "text-red-800 bg-red-100";
    };

    return (
        <div>
            <div className='relative w-full'>
                <h1 className='text-2xl m-1 font-bold'>Schools Management</h1>

                <hr className='border-gray-300 m-2' />
                <div className='flex m-1'>
                    <AddNewSchoolForm />

                    <input type="text"
                        placeholder='Search School...'
                        value={searchValues.schoolName}
                        onChange={(e) =>
                            setSearchValues({ ...searchValues, schoolName: e.target.value })
                        }
                        className='w-3/5 m-1 p-3 text-md rounded-md bg-white outline-2 focus:ring-2 focus:ring-violet-300 outline-none'
                    />
                </div>


                <div className="w-full overflow-x-auto rounded-lg border border-gray-300 bg-white">

                    <table className="w-full min-w-max border-collapse bg-white">

                        {/* Head */}
                        <thead className="bg-gray-200 sticky top-0 z-10 uppercase text-sm text-gray-600">
                            <tr className="text-left">
                                {/* Dise Code */}
                                <th
                                    className="px-4 py-3 whitespace-nowrap cursor-pointer select-none"

                                >
                                    <div className="flex items-center gap-1">
                                        <BiSortAlt2 className="text-lg"
                                            onClick={() => handleSort("dise_code")}
                                        />
                                        <span>Dise Code</span>
                                    </div>
                                </th>

                                {/* School Name */}
                                {/* <th
                  className="px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                  
                >
                  <div className="flex items-center gap-1">
                    <BiSortAlt2 className="text-xl" 
                    onClick={() => handleSort("schoolName")}
                    />
                    <span>School Name</span>
                  </div>
                </th> */}

                                <th className="px-4 py-3 whitespace-nowrap">
                                    {activeSearch === "schoolName" ? (
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search school..."
                                            className="border-2 border-purple-400 bg-white outline-none font-semibold px-2 py-1 rounded w-full"
                                            value={searchValues.schoolName}
                                            onChange={(e) =>
                                                setSearchValues({ ...searchValues, schoolName: e.target.value })
                                            }
                                            onBlur={() => setActiveSearch(null)}
                                        />
                                    ) : (
                                        <div
                                            className="flex items-center gap-1 cursor-pointer"
                                            onClick={() => setActiveSearch("schoolName")}
                                        >
                                            <BiSortAlt2
                                                className="text-lg"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // prevents opening search
                                                    handleSort("schoolName");
                                                }}
                                            />

                                            <span>School Name</span>
                                        </div>
                                    )}
                                </th>

                                <th className="px-4 py-3 whitespace-nowrap hidden md:table-cell relative">

                                    {/* Header content always visible */}
                                    <div className="flex items-center gap-1">
                                        <BiSortAlt2
                                            className="text-lg cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSort("district");
                                            }}
                                        />
                                        <span>District {selectedDistrict && `(${selectedDistrict})`}</span>

                                        {/* Arrow icon toggles dropdown */}
                                        <IoIosArrowDown
                                            className={`cursor-pointer transition-transform ${activeSearch === "district" ? "rotate-180" : ""
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveSearch((prev) =>
                                                    prev === "district" ? null : "district"
                                                );
                                            }}
                                        />
                                    </div>

                                    {/* Dropdown renders on top, does NOT replace header */}
                                    {activeSearch === "district" && (
                                        <div
                                            tabIndex={0}
                                            className="absolute top-full left-0 mt-1 bg-white border rounded shadow-md p-2 w-56 z-50"
                                        >
                                            {/* Search input */}
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Search district..."
                                                className="w-full font-normal border px-2 py-1 mb-2 rounded outline-none"
                                                value={districtSearch}
                                                onChange={(e) => setDistrictSearch(e.target.value)}
                                            />

                                            <div
                                                className="font-normal px-2 py-1 hover:bg-purple-100 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedDistrict(""); // clear filter
                                                    setActiveSearch(null);
                                                    setDistrictSearch("");
                                                }}
                                            >
                                                All Districts
                                            </div>

                                            {/* Dropdown list */}
                                            <div className="max-h-40 overflow-y-auto">
                                                {filteredDistricts.length > 0 ? (
                                                    filteredDistricts.map((district, index) => (
                                                        <div
                                                            key={index}
                                                            className="font-normal px-2 py-1 hover:bg-purple-100 cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedDistrict(district);
                                                                setActiveSearch(null);
                                                                setDistrictSearch(""); // reset search
                                                            }}
                                                        >
                                                            {district}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-gray-400 text-sm font-normal px-2 py-1">
                                                        No results
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </th>

                                {/* City */}
                                <th className="px-4 py-3 whitespace-nowrap relative">
                                    <div className="flex items-center gap-1">
                                        <BiSortAlt2
                                            className="text-lg cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSort("city");
                                            }}
                                        />

                                        <span>
                                            City {selectedCity && `(${selectedCity})`}
                                        </span>

                                        <IoIosArrowDown
                                            className={`cursor-pointer ${activeSearch === "city" ? "rotate-180" : ""
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveSearch((prev) =>
                                                    prev === "city" ? null : "city"
                                                );
                                            }}
                                        />
                                    </div>

                                    {activeSearch === "city" && (
                                        <>
                                            {/* overlay */}
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setActiveSearch(null)}
                                            />

                                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-md p-2 w-56 z-50">

                                                {/* Search */}
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    placeholder="Search city..."
                                                    className="w-full border px-2 py-1 mb-2 rounded"
                                                    value={citySearch}
                                                    onChange={(e) => setCitySearch(e.target.value)}
                                                />

                                                {/* All Cities */}
                                                <div
                                                    className="px-2 py-1 hover:bg-purple-100 cursor-pointer font-normal"
                                                    onClick={() => {
                                                        setSelectedCity("");
                                                        setActiveSearch(null);
                                                        setCitySearch("");
                                                    }}
                                                >
                                                    All Cities
                                                </div>

                                                {/* City list */}
                                                <div className="max-h-40 overflow-y-auto">
                                                    {filteredCities.length > 0 ? (
                                                        filteredCities.map((city, index) => (
                                                            <div
                                                                key={index}
                                                                className="font-normal px-2 py-1 hover:bg-purple-100 cursor-pointer"
                                                                onClick={() => {
                                                                    setSelectedCity(city);
                                                                    setActiveSearch(null);
                                                                    setCitySearch("");
                                                                }}
                                                            >
                                                                {city}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-gray-400 text-sm px-2 py-1">
                                                            No results
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </th>

                                {/* Classes */}
                                <th className="px-4 py-3 whitespace-nowrap hidden lg:table-cell relative">

                                    {/* Header */}
                                    <div className="flex items-center gap-1">
                                        <BiSortAlt2
                                            className="text-lg cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSort("classes");
                                            }}
                                        />

                                        <span>
                                            Classes {selectedClassRange && `(${selectedClassRange})`}
                                        </span>

                                        <IoIosArrowDown
                                            className={`cursor-pointer ${activeSearch === "classes" ? "rotate-180" : ""
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveSearch((prev) =>
                                                    prev === "classes" ? null : "classes"
                                                );
                                            }}
                                        />
                                    </div>

                                    {/* Dropdown */}
                                    {activeSearch === "classes" && (
                                        <>
                                            {/* overlay */}
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setActiveSearch(null)}
                                            />

                                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-md p-2 w-40 z-50">

                                                {/* All option */}
                                                <div
                                                    className="px-2 py-1 hover:bg-purple-100 cursor-pointer font-normal"
                                                    onMouseDown={() => {
                                                        setSelectedClassRange("");
                                                        setActiveSearch(null);
                                                    }}
                                                >
                                                    All Classes
                                                </div>

                                                {/* Options */}
                                                {["1-5", "1-8", "1-12"].map((range, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-2 py-1 hover:bg-purple-100 cursor-pointer font-normal"
                                                        onMouseDown={() => {
                                                            setSelectedClassRange(range);
                                                            setActiveSearch(null);
                                                        }}
                                                    >
                                                        {range}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </th>

                                {/* Total Staff */}
                                <th
                                    className="px-4 py-3 whitespace-nowrap hidden lg:table-cell cursor-pointer select-none"
                                    onClick={() => handleSort("staffCount")}
                                >
                                    <div className="flex items-center gap-1">
                                        <BiSortAlt2 className="text-xl" />
                                        <span>Total Staff</span>
                                    </div>
                                </th>

                                {/* Students */}
                                <th
                                    className="px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                                    onClick={() => handleSort("studentCount")}
                                >
                                    <div className="flex items-center gap-1">
                                        <BiSortAlt2 className="text-xl" />
                                        <span>Students</span>
                                    </div>
                                </th>

                                {/* Syllabus */}
                                <th
                                    className="px-4 py-3 whitespace-nowrap cursor-pointer select-none"
                                    onClick={() => handleSort("syllabus")}
                                >
                                    <div className="flex items-center gap-1">
                                        <BiSortAlt2 className="text-xl" />
                                        <span>Syllabus</span>
                                    </div>
                                </th>

                                {/* Performance */}
                                <th className="px-4 py-3 whitespace-nowrap hidden lg:table-cell relative">

                                    {/* Header */}
                                    <div className="flex items-center gap-1">
                                        <BiSortAlt2
                                            className="text-xl cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSort("performance");
                                            }}
                                        />

                                        <span>
                                            Performance {selectedPerformance && `(${selectedPerformance})`}
                                        </span>

                                        <IoIosArrowDown
                                            className={`cursor-pointer ${activeSearch === "performance" ? "rotate-180" : ""
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveSearch((prev) =>
                                                    prev === "performance" ? null : "performance"
                                                );
                                            }}
                                        />
                                    </div>

                                    {/* Dropdown */}
                                    {activeSearch === "performance" && (
                                        <>
                                            {/* overlay */}
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setActiveSearch(null)}
                                            />

                                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-md p-2 w-44 z-50">

                                                {/* All option */}
                                                <div
                                                    className="px-2 py-1 hover:bg-purple-100 cursor-pointer font-normal"
                                                    onMouseDown={() => {
                                                        setSelectedPerformance("");
                                                        setActiveSearch(null);
                                                    }}
                                                >
                                                    All Performance
                                                </div>

                                                {/* Options */}
                                                {["Excellent", "Good", "Average", "Poor"].map((perf, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-2 py-1 hover:bg-purple-100 cursor-pointer font-normal"
                                                        onMouseDown={() => {
                                                            setSelectedPerformance(perf);
                                                            setActiveSearch(null);
                                                        }}
                                                    >
                                                        {perf}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </th>
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-sm">

                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                                            {item.dise_code}
                                        </div>
                                    </td>

                                    <td className="px-4 py-2 font-semibold whitespace-nowrap">
                                        {item.schoolName}
                                    </td>

                                    <td className="px-4 py-2 hidden md:table-cell whitespace-nowrap">
                                        {item.district}
                                    </td>

                                    <td className="px-4 py-2 hidden sm:table-cell whitespace-nowrap">
                                        {item.city}
                                    </td>

                                    <td className="px-4 py-2 hidden lg:table-cell whitespace-nowrap">
                                        {item.classes}
                                    </td>

                                    <td className="px-4 py-2 hidden lg:table-cell whitespace-nowrap">
                                        {item.staffCount}
                                    </td>

                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {item.studentCount}
                                    </td>

                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <ProgressBar value={item.syllabus} />
                                            <span>{item.syllabus}%</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-2 hidden md:table-cell whitespace-nowrap">
                                        <div className={`inline-flex items-center px-3 py-1 text-sm rounded-full transition-all duration-200 hover:scale-105 font-normal ${getTextColor(item.syllabus)}`}>
                                            {item.performance}
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>


                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-6">

                    {/* Prev Button */}
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm hover:bg-purple-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <IoIosArrowBack className="text-lg" />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => setPage(num)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition flex items-center justify-center
        ${page === num
                                    ? "bg-purple-600 text-white shadow-md"
                                    : "bg-white hover:bg-purple-100"
                                }`}
                        >
                            {num}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm hover:bg-purple-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <IoIosArrowForward className="text-lg" />
                    </button>

                </div>
            </div>
        </div>
    )
}

export default UpdatedSchoolManagement
