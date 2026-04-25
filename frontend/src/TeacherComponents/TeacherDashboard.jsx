import React from 'react'
import { PiStudentDuotone } from "react-icons/pi";
import { useState, useEffect } from 'react';
import useStore from '../common/store/store';




const TeacherDashboard = () => {
  const [school, setSchool] = useState([]);
  const staffId = useStore((state) => state.staff_id);
  const dise_code = useStore((state) => state.dise_code);

  useEffect(() => {
    fetch(`http://localhost:5008/school/${staffId}`)
      .then((res) => res.json())
      .then((data) => {
        setSchool(data)
        console.log(data)
        
      });
  }, [staffId]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className='mb-4'>
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-1 w-8 md:w-12 bg-purple-600 rounded-full" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Institutional Overview
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {school.schoolName}
              <span className="block md:inline-block mt-2 md:mt-0 md:ml-3 text-[10px] md:text-sm font-medium text-slate-500 bg-slate-200/50 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-slate-200 w-fit">
                LMS Dashboard
              </span>
            </h1>
          </div>
        </header>
      </div>
        
        {/* Header Section */}
        <div className="flex flex-col gap-1 mt-10">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Schools
          </p>
          <h2 className="text-3xl font-bold text-slate-900">
            123
          </h2>
        </div>

        {/* Icon - Placed with better visual balance */}
        <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <PiStudentDuotone className="text-2xl" />
        </div>

        {/* Footer Stats */}
        <div className="mt-4 flex items-center gap-2">
          <span className="flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            +123
          </span>
          <span className="text-xs text-slate-400 font-medium">from last 30 days</span>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
