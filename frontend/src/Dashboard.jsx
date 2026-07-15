import React, { useEffect, useState } from 'react'
import { data, Link } from 'react-router-dom';
import { SiVirustotal } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { PiStudentBold } from "react-icons/pi";
import { GrDocumentPerformance } from "react-icons/gr";
import { SiBasicattentiontoken } from "react-icons/si";
import { VscVmActive } from "react-icons/vsc";
import axios from 'axios';
import BarChart from './BarChart';
import ProgressBar from './ProgressBar';
import PerformanceBar from './PerformanceBar';
import useStore from './common/store/store';
import { FaCalendarAlt, FaClock } from "react-icons/fa";



const Dashboard = () => {
  const token = useStore((state) => state.token);

  let [finalRes, fn] = useState({})
  let [staff, setStaff] = useState({})
  let [totalstudents, setTotalStudents] = useState({});
  const [res, setRes] = useState([])
  const [past30Staff, setPast30Staff] = useState([])
  const [past30Schools, setPast30Schools] = useState([])

  const [performancePercentage, setPerformancePercentage] = useState({});
  const [events, setEvents] = useState([])

  function getTotalSchools() {
    fetch('http://localhost:5008/totalschools')
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        fn(res)
      })
  }


  useEffect(() => {
    getTotalSchools()
  }, [])

  async function getPast30DaysStaffCount() {
    const result = await axios.get('http://localhost:5008/past-month/staff-count')
    setPast30Staff(result.data)
  }

  useEffect(() => {
    getPast30DaysStaffCount()
  }, [])

  async function getPast30DaysSchoolCount() {
    const result = await axios.get('http://localhost:5008/past-month/school-count')
    setPast30Schools(result.data)
  }

  useEffect(() => {
    getPast30DaysSchoolCount()
  }, [])

  async function getTotalStaff() {
    let response = await fetch('http://localhost:5008/totalstaff')
    let result = await response.json();
    setStaff(result);
  }

  useEffect(() => {
    getTotalStaff()
  }, [])

  async function getTotalStudents() {
    let result = await axios('http://localhost:5008/totalstudents')
    setTotalStudents(result.data)
  }
  useEffect(() => {
    getTotalStudents()
  }, [])

  const [chartData, setChartData] = useState(null)
  //function for BarChartData
  async function getSyllabusDataForChart() {
    let result = await axios(`http://localhost:5008/barchart/data`)
    //console.log(result.data);

    const transformData = {
      labels: result.data.map((item) => item.district),
      datasets: [
        {
          label: "Average Syllabus Completion Per District",
          data: result.data.map((item) => parseInt(item.avg_syllabus)),
          backgroundColor: "#8b5cf6",
        },
      ]
    }
    setChartData(transformData)
  }

  useEffect(() => {
    getSyllabusDataForChart()
  }, [])

  function getSchoolManagementData() {
    fetch('http://localhost:5008/schoolmanagement',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => res.json())
      .then((res) => {
        setRes(res)
        //console.log(res);


        //for counting performance value in number format
        const countPerformance = res.reduce((acc, item) => {
          const key = item.performance;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})

        //console.log("performance: ", countPerformance)
        //find total count performance
        const totalCountPerformance = Object.values(countPerformance).reduce((sum, val) => sum + val, 0);

        //performance percentage
        const performancePercentage = {};

        for (let key in countPerformance) {
          const value =
            (countPerformance[key] / totalCountPerformance) * 100;

          performancePercentage[key] = Math.round(value);
        }
        setPerformancePercentage(performancePercentage)
        //console.log(performancePercentage);
      });
  }

  useEffect(() => {
    getSchoolManagementData()
  }, [])

  const colorMap = {
    1: "from-blue-500 to-cyan-400",
    2: "from-purple-500 to-pink-500",
    3: "from-orange-500 to-red-400",
    4: "from-green-500 to-emerald-400",
  };

  //get events
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      const result = await axios.get(`http://localhost:5008/schoolevent`)
      setEvents(result.data)
      console.log(result.data);
    }
    fetchCalendarEvents()
  }, [])

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);

    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear &&
      eventDate >= today
    )
  })


  const districts = [
    { name: 'Bhopal', value: 0.92, theme: { track: 'bg-green-100', bar: 'bg-green-500' } },
    { name: 'Indore', value: 0.88, theme: { track: 'bg-green-100', bar: 'bg-green-500' } },
    { name: 'Jabalpur', value: 0.76, theme: { track: 'bg-blue-100', bar: 'bg-blue-500' } },
    { name: 'Gwalior', value: 0.71, theme: { track: 'bg-blue-100', bar: 'bg-blue-500' } },
    { name: 'Sagar', value: 0.58, theme: { track: 'bg-orange-100', bar: 'bg-orange-500' } },
    { name: 'Rewa', value: 0.45, theme: { track: 'bg-red-100', bar: 'bg-red-500' } },
  ];

  return (
    <div className="flex">
      <div className="ml-0 bg-gray-100 w-full min-h-screen p-4 md:static z-20 transition-all duration-300">

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">

          {/* Card */}
          <Link to='/schoolmanagement'>
            <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* Header Section */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Schools
                </p>
                <h2 className="text-3xl font-bold text-slate-900">
                  {finalRes[0]?.total?.toLocaleString() ?? '---'}
                </h2>
              </div>

              {/* Icon - Placed with better visual balance */}
              <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <SiVirustotal className="text-2xl" />
              </div>

              {/* Footer Stats */}
              <div className="mt-4 flex items-center gap-2">
                <span className="flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  +{past30Schools[0]?.last_30_days}
                </span>
                <span className="text-xs text-slate-400 font-medium">from last 30 days</span>
              </div>
            </div>

          </Link>

          <Link to='/staffdirectory'>
            <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* Header Section */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Staff Members
                </p>
                <h2 className="text-3xl font-bold text-slate-900">
                  {staff[0]?.total?.toLocaleString() ?? '---'}
                </h2>
              </div>

              {/* Icon - Using a soft green background to match the "growth" theme */}
              <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <FaPeopleGroup className="text-2xl" />
              </div>

              {/* Footer Stats */}
              <div className="mt-4 flex items-center gap-2">
                <span className="flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                  + {past30Staff[0]?.last_30_days}
                </span>
                <span className="text-xs text-slate-400 font-medium">New joins this month</span>
              </div>
            </div>

          </Link>

          <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Students</p>
              <h2 className="text-3xl font-bold text-slate-900">
                {totalstudents[0]?.total_student?.toLocaleString() ?? '---'}
              </h2>
            </div>
            <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <PiStudentBold className="text-2xl" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">+234</span>
              <span className="text-xs text-slate-400 font-medium">New registrations</span>
            </div>
          </div>


          <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Excellent Performance</p>
              <h2 className="text-3xl font-bold text-slate-900">68.4%</h2>
            </div>
            <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <GrDocumentPerformance className="text-2xl" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold text-green-600">↑ 3.2%</span>
              <span className="text-xs text-slate-400 font-medium">vs last semester</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Needs Attention</p>
              <h2 className="text-3xl font-bold text-slate-900 text-red-600">142</h2>
            </div>
            <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <SiBasicattentiontoken className="text-2xl" />
            </div>
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-500">Schools requiring follow-up</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Districts</p>
              <h2 className="text-3xl font-bold text-slate-900">55</h2>
            </div>
            <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
              <VscVmActive className="text-2xl" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-slate-500">All regions operational</span>
            </div>
          </div>

        </div>

        <div className='flex mt-4 left-0 grid sm:grid-cols-1 md:grid-cols-2'>
          <div className="w-full my-2 ">
            {chartData ? (
              <BarChart
                data={chartData}
                title="Average Syllabus Completion Per District"
              />
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>

          <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 mx-auto my-2 ">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Performance Distribution</h1>
            <hr className='text-gray-300' />
            <div className="max-w-md mx-auto mt-4">
              {["Excellent", "Good", "Average", "Poor"].map((label) => (
                <PerformanceBar
                  key={label}
                  label={label}
                  value={performancePercentage[label] || 0}
                />
              ))}
            </div>

          </div>


        </div>

        <div className="flex items-center justify-center">
          {/* Card Container */}
          <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">

            {/* Header Section */}
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">District Performance</h1>
              <p className="text-xs text-gray-500 mt-1">Overview of regional efficiency metrics</p>
            </div>

            {/* Progress List */}
            <div className="space-y-4">
              {districts.map((district) => (
                <div key={district.name} className="space-y-1.5">

                  {/* Labels & Meta */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{district.name}</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(district.value * 100)}%
                    </span>
                  </div>

                  {/* Progress Track */}
                  <div className={`w-full h-2 ${district.theme.track} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full ${district.theme.bar} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${district.value * 100}%` }}
                    />
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

        <div className='bg-white m-2 p-2 rounded-xl'>
          {/* 1. Admin Header Section */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
            {/* Left Section: Admin Context */}
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                System Management
              </span>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Event Management
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Review, authorize, and moderate system-wide schedule logs.
              </p>
            </div>

            {/* Right Section: System Metrics */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:px-6">
              <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                {/* Admin Server/Calendar Icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Records
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {currentMonthEvents.length}
                </h2>
              </div>
            </div>
          </div>

          {/* 2. Admin Vertical List Layout (Line-by-Line) */}
          <div className="flex flex-col gap-3">
            {currentMonthEvents.map((event) => {
              const date = new Date(event.event_date);

              return (
                <div
                  key={event.id}
                  className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md md:flex-row md:items-center md:justify-between"
                >
                  {/* Subtle Dynamic Colored Left Sidebar Marker */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${colorMap[event.color_idx]}`}
                  />

                  {/* Left Block: ID, Title, Badges */}
                  <div className="flex flex-1 flex-col gap-2 pl-3 sm:flex-row sm:items-center sm:gap-6">
                    <span className="w-20 font-mono text-xs font-bold text-slate-400 shrink-0">
                      ID: #{event.id}
                    </span>

                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      <div className="sm:hidden">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${colorMap[event.color_idx]}`}>
                          Type {event.color_idx}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center Block: Schedule Metadata (Date & Time) */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pl-3 md:pl-0">
                    <div className="hidden sm:block">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white ${colorMap[event.color_idx]}`}>
                        Type {event.color_idx}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <FaCalendarAlt size={14} className="text-slate-400" />
                      <span>
                        {date.toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <FaClock size={14} className="text-slate-400" />
                      <span>{event.event_time}</span>
                    </div>
                  </div>

                  {/* Right Block: Admin Operational Controls */}
                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 md:border-t-0 md:pt-0 pl-3 md:pl-0 shrink-0">
                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900">
                      Edit
                    </button>
                    <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-slate-800">
                      Manage
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Admin Empty State */}
          {currentMonthEvents.length === 0 && (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm">
                <FaCalendarAlt size={20} />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                No Database Entries Found
              </h2>

              <p className="mt-1 max-w-sm text-xs font-medium text-slate-500">
                There are no live scheduling records registered for this specific parameters.
              </p>
            </div>
          )}
        </div>



      </div>

    </div>
  )
}

export default Dashboard