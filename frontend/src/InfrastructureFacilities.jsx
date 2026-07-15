import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaRegCheckCircle } from "react-icons/fa";
import { GiCrossMark } from "react-icons/gi";
import { LuGlassWater } from "react-icons/lu";
import { TbToolsKitchen2 } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import { HiOutlineLightningBolt } from "react-icons/hi"; // Swapped for style consistency

const InfrastructureFacilities = () => {
  const [res, setRes] = useState([]);
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(true);

  const booleanColumns = [
    "drinking_water", 
    "kitchen", 
    "play_ground", 
    "toilet", 
    "electricity", 
    "hm_room", 
    "separate_classrooms"
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [infraRes, avgRes] = await Promise.all([
          axios.get('http://localhost:5008/infrasdetail'),
          axios.get('http://localhost:5008/infras/average')
        ]);
        setRes(infraRes.data);
        // Take the first item of the average array if it exists
        setAvg(avgRes.data?.[0] || null);
      } catch (error) {
        console.error("Error fetching infrastructure data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Professional check/cross indicators
  function renderFacilityIcon(status) {
    return status ? (
      <div className="flex justify-center">
        <FaRegCheckCircle className="text-emerald-500 text-lg" />
      </div>
    ) : (
      <div className="flex justify-center">
        <GiCrossMark className="text-rose-500 text-lg" />
      </div>
    );
  }

  // Premium, unified condition badge pills
  function renderConditionBadge(score) {
    if (score < 4) {
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          Poor
        </span>
      );
    }
    if (score <= 5) {
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Average
        </span>
      );
    }
    if (score === 6) {
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Good
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Excellent
      </span>
    );
  }

  return (
    <div className="w-full bg-gray-50/50 min-h-screen p-2 space-y-8">
      
      {/* Dashboard Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Infrastructure Facilities</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time status tracking and quality indicators across schools</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Drinking Water */}
        <div className="relative overflow-hidden border border-gray-100 rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Drinking Water</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{avg?.drinking_water_avg ?? 0}%</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <LuGlassWater className="text-2xl" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Overall resource compliance</p>
        </div>

        {/* Card 2: Electricity */}
        <div className="relative overflow-hidden border border-gray-100 rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Electricity Supply</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{avg?.electricity_avg ?? 0}%</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <HiOutlineLightningBolt className="text-2xl" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Power grid operational</p>
        </div>

        {/* Card 3: Kitchen */}
        <div className="relative overflow-hidden border border-gray-100 rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Kitchen Facilities</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{avg?.kitchen_avg ?? 0}%</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <TbToolsKitchen2 className="text-2xl" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Prepared meal readiness</p>
        </div>

        {/* Card 4: Classrooms */}
        <div className="relative overflow-hidden border border-gray-100 rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Separate Classrooms</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{avg?.separate_classroom_avg ?? 0}%</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
              <SiGoogleclassroom className="text-2xl" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Optimal spatial ratios</p>
        </div>

      </div>

      {/* Main Table Card Wrapper */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Institutional Breakdown</h2>
          <p className="text-xs text-gray-500 mt-0.5">Filter and review raw data indicators per campus</p>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] table-auto border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dise Code</th>
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">School Name</th>
                <th className="py-3.5 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Drinking Water</th>
                <th className="py-3.5 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Kitchen</th>
                <th className="py-3.5 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Play Ground</th>
                <th className="py-3.5 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Toilet</th>
                <th className="py-3.5 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Electricity</th>
                <th className="py-3.5 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">HM Room</th>
                <th className="py-3.5 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Separate Class</th>
                <th className="py-3.5 px-6 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {res.map((item, idx) => {
                const activeFacilitiesCount = booleanColumns.reduce(
                  (acc, curr) => acc + (item[curr] ? 1 : 0), 
                  0
                );

                return (
                  <tr key={item.dise_code || idx} className="hover:bg-gray-50/50 transition-colors">
                    {/* Dise Code */}
                    <td className="py-4 px-6 text-sm font-mono text-gray-500">{item.dise_code}</td>
                    
                    {/* School Name */}
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900 max-w-xs truncate">
                      {item.schoolName}
                    </td>
                    
                    {/* Indicators */}
                    <td className="py-4 px-4">{renderFacilityIcon(item.drinking_water)}</td>
                    <td className="py-4 px-4">{renderFacilityIcon(item.kitchen)}</td>
                    <td className="py-4 px-4">{renderFacilityIcon(item.play_ground)}</td>
                    <td className="py-4 px-4">{renderFacilityIcon(item.toilet)}</td>
                    <td className="py-4 px-4">{renderFacilityIcon(item.electricity)}</td>
                    <td className="py-4 px-4">{renderFacilityIcon(item.hm_room)}</td>
                    <td className="py-4 px-4">{renderFacilityIcon(item.separate_classrooms)}</td>
                    
                    {/* Condition Metric */}
                    <td className="py-4 px-6 text-center">
                      {renderConditionBadge(activeFacilitiesCount)}
                    </td>
                  </tr>
                );
              })}

              {!loading && res.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-sm text-gray-400">
                    No institutional record found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default InfrastructureFacilities;