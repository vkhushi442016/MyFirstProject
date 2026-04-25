import React from 'react'
import { RxDashboard } from "react-icons/rx";
import { BiSolidSchool } from "react-icons/bi";
import { MdPeopleAlt } from "react-icons/md";
import { RiBookShelfFill } from "react-icons/ri";
import { LuClipboardPen } from "react-icons/lu";
import { FaRegChartBar } from "react-icons/fa";
import { PiBuilding } from "react-icons/pi";
import { IoNewspaperOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { FaAward } from "react-icons/fa6";
import { MdOutlineReportProblem } from "react-icons/md";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="flex w-64 relative">
            <div className="w-3xs h-screen text-base m-2 p-2 fixed top-18">
                <div>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <RxDashboard size={18} />
                        <span className="text-base font-medium">Dashboard</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/schoolmanagement"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <BiSolidSchool size={18} />
                        <span className="text-base font-medium">School Management</span>
                    </NavLink>
                </div>


                <div>
                    <NavLink
                        to="/staffdirectory"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <MdPeopleAlt size={18} />
                        <span className="text-base font-medium">Staff Directory</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/syllabustracking"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <RiBookShelfFill size={18} />
                        <span className="text-base font-medium">Syllabus Tracking</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/attendance"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <FaRegChartBar size={18} />
                        <span className="text-base font-medium">Attendance Reports</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/performaceanalytics"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <LuClipboardPen size={18} />
                        <span className="text-base font-medium">Performance Analytics</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/infrafacilities"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <PiBuilding size={18} />
                        <span className="text-base font-medium">Infrastrure & Facilities</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/exams"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <IoNewspaperOutline size={18} />
                        <span className="text-base font-medium">Examinations</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/calender"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <SlCalender size={18} />
                        <span className="text-base font-medium">Academic Calender</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/achievements"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <FaAward size={18} />
                        <span className="text-base font-medium">Achievements & Awards</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/complaints"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <MdOutlineReportProblem size={18} />
                        <span className="text-base font-medium">Complaints & Issues</span>
                    </NavLink>
                </div>
                
                <div>
                    <NavLink
                        to="/reports"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <MdOutlineReportProblem size={18} />
                        <span className="text-base font-medium">Reports & Downloads</span>
                    </NavLink>
                </div>

                <div>
                    <NavLink
                        to="/settings"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-3 rounded-md cursor-pointer w-full
                                ${isActive
                                ? "bg-violet-200 text-violet-800"
                                : "hover:bg-gray-100 text-gray-700"}`
                        }
                    >
                        <MdOutlineReportProblem size={18} />
                        <span className="text-base font-medium">Settings</span>
                    </NavLink>
                </div>
            </div>
        </div >
    )
}

export default Sidebar
