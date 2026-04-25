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

const Dashboard = () => {
  const token = useStore((state) => state.token);

  let [finalRes, fn] = useState({})
  let [staff, setStaff] = useState({})
  let [totalstudents, setTotalStudents] = useState({});
  const [res, setRes] = useState([])
  const [past30Staff, setPast30Staff] = useState([])
  const [past30Schools, setPast30Schools] = useState([])

  const [performancePercentage, setPerformancePercentage] = useState({});


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
        const countPerformance = res.data.reduce((acc, item) => {
          const key = item.performance;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})

        //console.log("performance: ", countPerformance)
        //find total count performance
        const totalCountPerformance = Object.values(countPerformance).reduce((sum, val) => sum + val, 0);

        //performance percentage
        const performancePercentage = {}
        for (let key in countPerformance) {
          performancePercentage[key] = ((countPerformance[key] / totalCountPerformance) * 100);
        }
        setPerformancePercentage(performancePercentage)
        //console.log(performancePercentage);
      });
  }

  useEffect(() => {
    getSchoolManagementData()
  }, [])


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

        <div className="h-70 rounded-md bg-white m-4 p-6">
          <h1 className="text-2xl font-medium">District Performance</h1>
          <h4>Bhopal</h4>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500 ease-out"
              style={{ width: `${0.92 * 100}%` }}
            />
          </div>
          <h4>Indore</h4>
          <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500 ease-out"
              style={{ width: `${0.88 * 100}%` }}
            />
          </div>
          <h4>Jabalpur</h4>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${0.76 * 100}%` }}
            />
          </div>
          <h4>Gwalior</h4>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${0.71 * 100}%` }}
            />
          </div>
          <h4>Sagar</h4>
          <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${0.58 * 100}%` }}
            />
          </div>
          <h4>Rewa</h4>
          <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500 ease-out"
              style={{ width: `${0.45 * 100}%` }}
            />
          </div>
        </div>

      </div>
    </div >
  )
}

export default Dashboard