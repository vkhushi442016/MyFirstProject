import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { FaRegCheckCircle } from "react-icons/fa";
import { GiCrossMark } from "react-icons/gi";
import { VscVmActive } from 'react-icons/vsc';
import { LuGlassWater } from "react-icons/lu";
import { FcElectricity } from "react-icons/fc";
import { TbToolsKitchen2 } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";

const InfrastructureFacilities = () => {
  const [res, finalRes] = useState([])
  const [avg, setAvg] = useState([]);

  async function getISData() {
    const response = await axios('http://localhost:5008/infrasdetail');
    console.log(response.data)
    finalRes(response.data)
  }

  useEffect(() => {
    getISData();
  }, [])

  async function getAverage() {
    const response = await axios('http://localhost:5008/infras/average');
    console.log(response.data)
    setAvg(response.data)
  }

  useEffect(() => {
    getAverage();
  }, [])


  function facility(status) {
    return status == true ? <FaRegCheckCircle className='text-green-400 text-2xl' /> : <GiCrossMark className='text-red-500 text-2xl' />
  }

  const booleanColumns = ["drinking_water", "kitchen", "play_ground", "toilet", "electricity", "hm_room", "separate_classrooms"]


  function condition(n) {
    if (n < 4)
      return <div className='flex justify-center bg-red-100 rounded-full p-1 text-red-600'>
        <h6>poor</h6>
      </div>
    if (n <= 5)
      return <div className='flex justify-center bg-yellow-100 rounded-full text-yellow-600 p-1'>average</div>
    if (n == 6)
      return <div className='flex justify-center bg-blue-100 rounded-full text-blue-600 p-1'>good</div>
    return <div className='flex justify-center bg-green-100 text-green-600 rounded-full p-1'>excellent</div>
  }

  return (
    <div className=''>
      <h1 className='text-2xl m-1 font-bold'>Infrastructure Facilities</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="relative h-36w-100 border-t-4 border-green-500 rounded-md bg-white p-6 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">            
       
        <LuGlassWater className='top-3 text-5xl bg-green-400 rounded-md p-2 text-white' />
        <h2 className="text-2xl pb-1 font-bold">{avg[0]?.drinking_water_avg} %</h2>
        <h2 className="text-md pb-1 font-semibold text-gray-500">Schools wih drinking water</h2>
      </div>

      <div className="relative h-36w-100 border-t-4 border-orange-500 rounded-md bg-white p-6 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">            
       
        <FcElectricity className='top-3 text-5xl bg-orange-400 rounded-md p-2 text-white' />
        <h2 className="text-2xl pb-1 font-bold">{avg[0]?.electricity_avg} %</h2>
        <h2 className="text-md pb-1 font-semibold text-gray-500">Schools with electricity</h2>
      </div>

      <div className="relative h-36w-100 border-t-4 border-blue-500 rounded-md bg-white p-6 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">            
       
        <TbToolsKitchen2 className='top-3 text-5xl bg-blue-400 rounded-md p-2 text-white' />
        <h2 className="text-2xl pb-1 font-bold">{avg[0]?.kitchen_avg} %</h2>
        <h2 className="text-md pb-1 font-semibold text-gray-500">Schools with kitchen</h2>
      </div>

      <div className="relative h-36w-100 border-t-4 border-pink-500 rounded-md bg-white p-6 shadow-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">            
       
        <SiGoogleclassroom className='top-3 text-5xl bg-pink-400 rounded-md p-2 text-white' />
        <h2 className="text-2xl pb-1 font-bold">{avg[0]?.separate_classroom_avg} %</h2>
        <h2 className="text-md pb-1 font-semibold text-gray-500">Schools with separate classrooms</h2>
      </div>
      </div>
      <br />
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
