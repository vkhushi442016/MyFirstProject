import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { FaRegCheckCircle } from "react-icons/fa";
import { GiCrossMark } from "react-icons/gi";


const InfrastructureFacilities = () => {
  const [res, finalRes] = useState([])
  async function getISData() {
    const response = await axios('http://localhost:5008/infrasdetail');
    console.log(response.data)
    finalRes(response.data)
  }

  useEffect(() => {
    getISData();
  }, [])

  function facility(status) {
    return status == true ? <FaRegCheckCircle className='text-green-400 text-2xl' /> : <GiCrossMark className='text-red-500 text-2xl' />
  }

  const booleanColumns = ["drinking_water", "kitchen", "play_ground", "toilet", "electricity", "hm_room", "separate_classrooms"]


  function condition(n) {
    if (n < 4)
      return <p className='bg-red-100 rounded-full p-1 text-red-600'>poor</p>
    if (n <= 5)
      return <p className='bg-yellow-100 rounded-full text-yellow-600 p-1'>average</p>
    if (n == 6)
      return <p className='bg-blue-100 rounded-full text-blue-600 p-1'>good</p>
    return <p className='bg-green-100 text-green-600 rounded-full p-1'>excellent</p>
  }

  return (
    <div>
      <h1 className='text-2xl m-1 font-bold'>Infrastructure Facilities</h1>

      <div className='w-full overflow-x-auto overflow-y-visible'>
        <table className="table-auto mt-2 border-collapse w-full bg-white rounded-md">
          <thead>
            <tr className='border-b border-gray-300 h-11 px-4'>
              <th className="font-normal">Dise Code</th>
              <th className="font-normal">School Name</th>
              <th className="font-normal">Drinking Water</th>
              <th className="font-normal">Kitchen</th>
              <th className="font-normal">Play Ground</th>
              <th className="font-normal">Toilet</th>
              <th className="font-normal">Electricity</th>
              <th className="font-normal">HM Room</th>
              <th className="font-normal">Separate Classrooms</th>
              <th className="font-normal">Condition</th>
            </tr>
          </thead>
          <tbody>
            {res.map((item) => {
              const sum = booleanColumns.reduce((acc, curr) => acc + (item[curr] ? 1 : 0),
                0);
              return (
                <tr className='border-b border-gray-300 h-12'>
                  <td className="h-11 px-4 pl-6 py-2">{item.dise_code}</td>
                  <td className="h-11 px-4 pl-6 py-2 font-semibold">{item.schoolName}</td>
                  <td className="h-11 px-4 pl-6 py-2">{facility(item.drinking_water)}</td>
                  <td className="h-11 px-4 pl-6 py-2">{facility(item.kitchen)}</td>
                  <td className="h-11 px-4 pl-6 py-2">{facility(item.play_ground)}</td>
                  <td className="h-11 px-4 pl-6 py-2">{facility(item.toilet)}</td>
                  <td className="h-11 px-4 pl-6 py-2">{facility(item.electricity)}</td>
                  <td className="h-11 px-4 pl-6 py-2">{facility(item.hm_room)}</td>
                  <td className="h-11 px-4 pl-6 py-2">{facility(item.separate_classrooms)}</td>
                  <td className="h-11 px-4 pl-6 py-2">{condition(sum)}</td>
                </tr>
              )
            })}

          </tbody>

        </table>
      </div>

    </div>
  )
}

export default InfrastructureFacilities
