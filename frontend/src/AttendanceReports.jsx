import React from 'react'
import PieChart from './PieChart'
import BarChart from './BarChart'

const AttendanceReports = () => {

  const data = {
    raisen: 12,
    bhopal: 14,
    khajuraho: 15,
    indore: 20
  }

  const sum = Object.values(data).reduce((acc, val) => acc + val, 0);

  console.log(sum);

  return (
    <div>
      <h1 className='text-2xl m-1 font-bold'>Attendance Reports</h1>
      <hr className='border-gray-300 m-2' />
      <PieChart />
    </div>
  )
}

export default AttendanceReports
