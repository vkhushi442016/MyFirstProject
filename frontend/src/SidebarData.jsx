// sidebarData.js

import { RxDashboard } from "react-icons/rx";
import { BiSolidSchool } from "react-icons/bi";
import { MdPeopleAlt, MdOutlineReportProblem } from "react-icons/md";
import { RiBookShelfFill } from "react-icons/ri";
import { LuClipboardPen } from "react-icons/lu";
import { FaRegChartBar, FaAward } from "react-icons/fa";
import { PiBuilding } from "react-icons/pi";
import { IoNewspaperOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";

export const sidebarData = {
  ADMIN: [
    { name: "Dashboard", path: "/", icon: <RxDashboard size={18} /> },
    { name: "School Management", path: "/updated/schoolmanagement", icon: <BiSolidSchool size={18} /> },
    { name: "Staff Directory", path: "/staffdirectory", icon: <MdPeopleAlt size={18} /> },
    { name: "Syllabus", path: "/syllabus", icon: <RiBookShelfFill size={18} /> },
    { name: "Syllabus Tracking", path: "/syllabustracking", icon: <RiBookShelfFill size={18} /> },
    { name: "Attendance Reports", path: "/attendance", icon: <FaRegChartBar size={18} /> },
    { name: "Performance Analytics", path: "/performanceanalytics", icon: <LuClipboardPen size={18} /> },
    { name: "Infrastructure & Facilities", path: "/infrafacilities", icon: <PiBuilding size={18} /> },
    { name: "Examinations", path: "/exams", icon: <IoNewspaperOutline size={18} /> },
    { name: "Academic Calendar", path: "/calendar", icon: <SlCalender size={18} /> },
    { name: "Achievements & Awards", path: "/achievements", icon: <FaAward size={18} /> },
    { name: "Complaints & Issues", path: "/complaints", icon: <MdOutlineReportProblem size={18} /> },
    { name: "Reports & Downloads", path: "/reports", icon: <MdOutlineReportProblem size={18} /> },
    { name: "Settings", path: "/settings", icon: <MdOutlineReportProblem size={18} /> },
  ],

  PRINCIPAL: [
    { name: "Dashboard", path: "/principal/dashboard", icon: <RxDashboard size={18} /> },
    { name: "Staff Directory", path: "/principal/staffdirectory", icon: <MdPeopleAlt size={18} /> },
    { name: "Syllabus", path: "/principal/syllabus", icon: <FaRegChartBar size={18} /> },
    { name: "Students", path: "/principal/facilities", icon: <MdOutlineReportProblem size={18} /> },
    { name: "Infrastructure Info", path: "/principal/infra-info", icon: <MdOutlineReportProblem size={18} /> },
    { name: "Complaints & Issues", path: "/complaints/issues", icon: <MdOutlineReportProblem size={18} /> },
  ],

  TEACHER: [
    { name: "Dashboard", path: "/staff/dashboard", icon: <RxDashboard size={18} /> },
    { name: "Students", path: "/staff/students", icon: <FaRegChartBar size={18} /> },
    { name: "Syllabus Update", path: "/syllabus/update", icon: <RiBookShelfFill size={18} /> },
  ]
};