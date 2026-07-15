import { SiVirustotal } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { PiStudentBold } from "react-icons/pi";
import { GrDocumentPerformance } from "react-icons/gr";
import { SiBasicattentiontoken } from "react-icons/si";
import { VscVmActive } from "react-icons/vsc";
import axios from "axios";
import useStore from "../common/store/store";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BarChart from "../BarChart";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PrincipleDashboard = () => {
    const [school, setSchool] = useState([]);
    const [totalStaff, setTotalStaff] = useState([])
    const [totalStudents, setTotalStudents] = useState([]);
    const [classStats, setClassStats] = useState([]);


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


    const getTotalStaffCount = async (dise_code) => {
        const result = await axios.get(`http://localhost:5008/api/staff/${dise_code}`)
        setTotalStaff(result.data[0]?.total_staff || 0)
    }

    const getTotalStudentCount = async (dise_code) => {
        const result = await axios.get(`http://localhost:5008/api/students/${dise_code}`)
        setTotalStudents(result.data[0]?.total_students || 0)
    }

    const fetchClassStats = async (dise_code) => {
        const res = await axios.get(
            `http://localhost:5008/api/class-wise-stats/${dise_code}`
        );
        setClassStats(res.data);
    };

    useEffect(() => {
        getTotalStaffCount(dise_code)
        getTotalStudentCount(dise_code)
        fetchClassStats(dise_code)
    }, [dise_code])

    const [data, setData] = useState({ facilities: {} });
    const facilities = data.facilities || {};

    const fetchFacilities = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5008/api/school/facilities-with-images/${dise_code}`
            );
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (dise_code) fetchFacilities();
    }, [dise_code]);

    const total = Object.keys(facilities).length;
    const available = Object.values(facilities).filter(f => f.available).length;
    return (
        <div className="p-4 bg-slate-50/50 min-h-screen font-sans">

            {/* HEADER SECTION - Stacked on mobile, side-by-side on desktop */}
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

            {/* STATS GRID - 1 col (mobile), 2 col (tablet), 3 col (desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">

                {/* Helper function/component for Cards */}
                {[
                    { label: "DISE CODE", val: school.dise_code, sub: "Verified", icon: <SiVirustotal />, color: "blue" },
                    { label: "TOTAL STAFF", val: totalStaff, sub: "+1,456 this year", icon: <FaPeopleGroup />, color: "emerald", link: '/principal/staffdirectory' },
                    { label: "TOTAL STUDENTS", val: totalStudents, sub: "+234 New Admissions", icon: <PiStudentBold />, color: "cyan",  link: '/principal/facilities' },
                    // { label: "PERFORMANCE", val: "68.4%", sub: "↑ 3.2% Trend", icon: <GrDocumentPerformance />, color: "orange" },
                    // { label: "ATTENTION", val: "142", sub: "High Priority", icon: <SiBasicattentiontoken />, color: "red" },
                    // { label: "ACTIVE DISTRICTS", val: "55", sub: "Fully Operational", icon: <VscVmActive />, color: "purple" }
                ].map((item, idx) => {
                    const CardWrapper = item.link ? Link : 'div';
                    return (
                        <CardWrapper
                            to={item.link}
                            key={idx}
                            className="group bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-default"
                        >
                            <div className="flex justify-between items-start">
                                <div className="max-w-[70%]">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
                                        {item.label}
                                    </p>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-800 truncate">
                                        {item.val}
                                    </h2>
                                    <p className={`mt-2 font-bold text-[10px] md:text-xs ${item.color === 'red' ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {item.sub}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl transition-all duration-300 
                            ${item.color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : ''}
                            ${item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : ''}
                            ${item.color === 'cyan' ? 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white' : ''}
                            ${item.color === 'orange' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' : ''}
                            ${item.color === 'red' ? 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white' : ''}
                            ${item.color === 'purple' ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white' : ''}
                        `}>
                                    {item.icon}
                                </div>
                            </div>
                        </CardWrapper>
                    );
                })}
            </div>


            <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 bg-slate-50/50 min-h-screen">
    
    {/* 1. LEFT SIDE: PRIMARY ANALYTICS (70% width on Desktop) */}
    <div className="lg:w-[65%] flex flex-col gap-6">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 md:p-8">
                {/* Header with Glassmorphism pill */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Academic Completion</h2>
                        </div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Live progress across all grades</p>
                    </div>
                    <button className="text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-5 py-2.5 rounded-xl transition-all border border-purple-100 shadow-sm">
                        Generate Report
                    </button>
                </div>

                {/* Chart Container */}
                <div className="w-full overflow-x-auto no-scrollbar">
                    <div className="min-w-[600px] md:min-w-full h-[400px]">
                        <BarChart
                            data={{
                                labels: classStats.map(c => c.className),
                                datasets: [{
                                    label: "Completion %",
                                    data: classStats.map(c => c.completion_percentage),
                                    backgroundColor: "#8b5cf6",
                                    borderRadius: 8,
                                    barThickness: 32,
                                }],
                            }}
                            title="All Grades Syllabus Progress"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* 2. RIGHT SIDE: FACILITY STATUS (35% width on Desktop) */}
    <div className="lg:w-[35%] flex flex-col gap-6">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col h-full hover:shadow-md transition-all">
            
            {/* Summary Info */}
            <div className="mb-8">
                <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Facilities Overview</h2>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${(available / total) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-black text-slate-500">
                        {available}/{total}
                    </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Active Infrastructure</p>
            </div>

            {/* Status Grid - Compact and tidy */}
            <div className="grid grid-cols-1 gap-3">
                {Object.entries(facilities).map(([name, value]) => {
                    const isAvailable = value.available;

                    return (
                        <div
                            key={name}
                            className={`group flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
                                isAvailable
                                    ? "bg-emerald-50/30 border-emerald-100/50 hover:bg-emerald-50"
                                    : "bg-rose-50/30 border-rose-100/50 hover:bg-rose-50"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl shadow-sm ${
                                    isAvailable ? "bg-white text-emerald-600" : "bg-white text-rose-500"
                                }`}>
                                    {isAvailable ? <FaCheckCircle size={14} /> : <FaTimesCircle size={14} />}
                                </div>
                                <span className="text-xs font-bold text-slate-700 capitalize tracking-tight">
                                    {name.replace(/_/g, " ")}
                                </span>
                            </div>
                            
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                                isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                            }`}>
                                {isAvailable ? "Available" : "Unavailable"}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Insight */}
            <div className="mt-auto pt-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[10px] leading-relaxed text-slate-400 font-medium">
                        Last audit performed today. Contact system admin for facility maintenance requests.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>


        </div>

    )
}

export default PrincipleDashboard
