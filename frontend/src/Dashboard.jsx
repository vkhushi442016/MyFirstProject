import React, { useEffect, useState } from 'react'
import DynamicPage from './DynamicPage'
import { SiVirustotal } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { PiStudentBold } from "react-icons/pi";
import { GrDocumentPerformance } from "react-icons/gr";
import { SiBasicattentiontoken } from "react-icons/si";
import { VscVmActive } from "react-icons/vsc";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import useStore from './common/store/store';

const Dashboard = () => {
  let [finalRes, fn] = useState({})
  let [staff, setStaff] = useState({})
  let [totalstudents, setTotalStudents] = useState({});

  let { user } = useStore()
  let navigate = useNavigate()

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


  console.log(user)

  return (
    <div class="flex">
      <div class="bg-gray-100 w-full min-h-screen">
        <div class="flex flex-wrap">
          <div class="relative h-35 w-104 rounded-md bg-white m-4 p-6 shadow-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <h1 className="font-medium pb-1">TOTAL SCHOOLS </h1>
            <SiVirustotal className='absolute right-10 top-12 text-5xl bg-blue-400 rounded-md p-2 text-white' />
            <h2 className="text-2xl pb-1 font-bold">{finalRes[0]?.total ?? 'Loading...'}</h2>
            <h3 class="text-green-600 font-medium">+234</h3>
          </div>
          <div class="relative h-35 w-104 rounded-md bg-white m-4 p-6 shadow-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <h1 class="font-medium pb-1">TOTAL STAFF</h1>
            <h2 class="text-2xl pb-1 font-bold">{staff[0]?.total ?? 'Loading...'}</h2>
            <h3 class="text-green-600 font-medium">+1,456</h3>
            <FaPeopleGroup className='absolute right-10 top-12 text-5xl bg-green-400 rounded-md p-2 text-white' />
          </div>
          <div class="relative h-35 w-104 rounded-md bg-white m-4 p-6 shadow-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <h1 class="font-medium pb-1">TOTAL STUDENTS</h1>
            <h2 class="text-2xl pb-1 font-bold">{totalstudents[0]?.total_student ?? 'Loading...'}</h2>
            <h3 class="text-green-600 font-medium">+234</h3>
            <PiStudentBold className='absolute right-10 top-12 text-5xl bg-cyan-400 rounded-md p-2 text-white' />
          </div>
          <div class="relative h-35 w-104 rounded-md bg-white m-4 p-6 shadow-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <h1 class="font-medium pb-1">EXCELLENT PERFORMANCE</h1>
            <h2 class="text-2xl pb-1 font-bold">68.4%</h2>
            <h3 class="text-green-600 font-medium">+3.2%</h3>
            <GrDocumentPerformance className='absolute right-10 top-12 text-5xl bg-orange-400 rounded-md p-2 text-white' />
          </div>
          <div class="relative h-35 w-104 rounded-md bg-white m-4 p-6 shadow-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <h1 class="font-medium pb-1">NEEDS ATTENTION</h1>
            <h2 class="text-2xl pb-1 font-bold">142</h2>
            <h3 class="text-green-600 font-medium">Schools</h3>
            <SiBasicattentiontoken className='absolute right-10 top-12 text-5xl bg-red-500 rounded-md p-2 text-white' />
          </div>
          <div class="relative h-35 w-104 rounded-md bg-white m-4 p-6 shadow-xl transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <h1 class="font-medium pb-1">ACTIVE DISTRICTS</h1>
            <h2 class="text-2xl pb-1 font-bold">55</h2>
            <h3 class="text-green-600 font-medium">All Active</h3>
            <VscVmActive className='absolute right-10 top-12 text-5xl bg-pink-400 rounded-md p-2 text-white' />
          </div>
        </div>


        <h2>Welcome: {user}</h2>
        <div class="w-full rounded-md bg-white m-4 p-6">
          <div class="flex justify-between">
            <h1 class="text-2xl font-medium">Recent School Activities</h1>
            <h3 class="text-blue-500 cursor-pointer font-medium">View All</h3>
          </div>

          <div class="relative h-20 w-full rounded-md bg-violet-50 mt-2 p-3 ">
            <h1 class="font-medium pb-1">Government Higher Secondary School</h1>
            <h2 class="pb-1 text-gray-500">MP-BPL-001 • Bhopal</h2>
            <div class="absolute top-3 right-3 text-sm rounded-full bg-green-100 text-green-800 p-1">
              <h6 class="">excellent</h6>
            </div>
            <div class="absolute top-9 right-10 text-gray-500">
              <h6>85% Complete</h6>
            </div>
          </div>
          <div class="h-20 w-78% rounded-md bg-violet-50 mt-2 p-3 relative">
            <h1 class="font-medium pb-1">Saraswati Vidya Mandir</h1>
            <h2 class="pb-1 text-gray-500">MP-IND-042 • Indore</h2>
            <div class="absolute top-3 right-10 text-sm rounded-full bg-blue-100 text-blue-800 p-1">
              <h6 class="">good</h6>
            </div>
            <div class="absolute top-9 right-10 text-gray-500">
              <h6>78% Complete</h6>
            </div>
          </div>

          <div class="h-20 w-78% rounded-md bg-violet-50 mt-2 p-3 relative">
            <h1 class="font-medium pb-1">Maharana Pratap School</h1>
            <h2 class="pb-1 text-gray-500">MP-JBL-128 • Jabalpur</h2>
            <div class="absolute top-3 right-10 text-sm rounded-full bg-green-100 text-green-800 p-1">
              <h6 class="">excellent</h6>
            </div>
            <div class="absolute top-9 right-10 text-gray-500">
              <h6>92% Complete</h6>
            </div>
          </div>
          <div class="h-20 w-78% rounded-md bg-violet-50 text-green-800 mt-2 p-3 relative">
            <h1 class="font-medium pb-1">Primary School Simariya</h1>
            <h2 class="pb-1 text-gray-500">MP-REW-256 • Rewa</h2>
            <div class="absolute top-3 right-10 text-sm rounded-full bg-red-100 text-red-800 p-1">
              <h6 class="">poor</h6>
            </div>
            <div class="absolute top-9 right-10 text-gray-500">
              <h6>85% Complete</h6>
            </div>
          </div>
          <div class="h-20 w-78% rounded-md bg-violet-50 mt-2 p-3 relative">
            <h1 class="font-medium pb-1">Govt Excellence School</h1>
            <h2 class="pb-1 text-gray-500">MP-GWL-089 • Gwalior</h2>
            <div class="absolute top-3 right-10 text-sm rounded-full bg-green-100 text-green-800 p-1">
              <h6 class="">excellent</h6>
            </div>
            <div class="absolute top-9 right-10 text-gray-500">
              <h6>85% Complete</h6>
            </div>
          </div>

        </div >

        <div class="h-70 rounded-md bg-white m-4 p-6">
          <h1 class="text-2xl font-medium">District Performance</h1>
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
        <DynamicPage />
      </div>
    </div>
  )
}

export default Dashboard