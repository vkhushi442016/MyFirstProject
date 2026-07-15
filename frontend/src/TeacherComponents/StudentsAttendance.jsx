import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import useStore from '../common/store/store';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const StudentsAttendance = () => {
    const dise_code = useStore((state) => state.dise_code);
    const token = useStore((state) => state.token);

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date());
    // Class Filter State
    const [selectedClass, setSelectedClass] = useState("All");

    // Pagination states
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getStudentsData = async (dise_code, page, limit) => {
        try {
            const studentsResult = await axios.get(
                `http://localhost:5008/api/students-data/${dise_code}?page=${page}&limit=${limit}`
            );
            setStudents(studentsResult.data.data);
            setTotalPages(studentsResult.data.totalPages);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        if (dise_code) {
            getStudentsData(dise_code, page, limit);
        }
    }, [dise_code, page, limit]);

    // 1. Extract unique classes dynamically for the dropdown
    const availableClasses = useMemo(() => {
        if (!students) return [];
        const uniqueClasses = [...new Set(students.map((s) => s.class))];
        return uniqueClasses.sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
    }, [students]);

    // 2. Filter students based on selected class
    const filteredStudents = useMemo(() => {
        if (selectedClass === "All") return students;
        return students.filter((student) => String(student.class) === String(selectedClass));
    }, [students, selectedClass]);

    const handleChange = (studentId, status) => {
        setAttendance({
            ...attendance,
            [studentId]: status,
        });
    };

    const handleSubmit = async () => {
        if (!date) {
            toast.error("Please select a date first.");
            return;
        }

        // Convert to YYYY-MM-DD
        const formattedDate = new Date(date)
            .toISOString()
            .split("T")[0];

        const payload = Object.keys(attendance).map((id) => ({
            student_id: id,
            date: formattedDate,
            status: attendance[id],
        }));

        try {
            await axios.post("http://localhost:5008/attendance/mark", payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Attendance saved successfully!");
        } catch (error) {
            console.error("Error submitting attendance:", error);
            toast.error("Failed to save attendance.");
        }
    };
    const today = new Date();

    const minDate = new Date();
    minDate.setDate(today.getDate() - 2);
    // // min = today - 2 days
    // const minDate = new Date(today);
    // minDate.setDate(today.getDate() - 2);

    // // format function
    // const formatDate = (d) =>
    //     d.getFullYear() +
    //     "-" +
    //     String(d.getMonth() + 1).padStart(2, "0") +
    //     "-" +
    //     String(d.getDate()).padStart(2, "0");

    // const formattedMin = formatDate(minDate);
    // const formattedMax = formatDate(today);

    const isSunday = (d) => d.getDay() === 0;

    const handleDateChange = (d) => {
        if (isSunday(d)) {
            toast.error("Sundays are not allowed");
            return;
        }
        setDate(d);
    };

    const getAttendance = async (selectedDate) => {

    try {

        const formattedDate = new Date(selectedDate)
            .toISOString()
            .split("T")[0];

        const result = await axios.get(
            `http://localhost:5008/attendance/date/${formattedDate}`
        );

        console.log(result.data);

        // Convert array into object
        const attendanceMap = {};

        result.data.forEach((item) => {
            attendanceMap[item.student_id] = item.status;
        });

        setAttendance(attendanceMap);

    } catch (error) {
        console.error("Error fetching attendance:", error);
    }
};


useEffect(() => {

    if (date) {
        getAttendance(date);
    }

}, [date]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Header Section */}
                <div className="p-6 bg-white border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Student Attendance</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and submit daily attendance records</p>
                    </div>

                    {/* Top Controls: Class Filter, Date, and Submit */}
                    <div className="flex flex-wrap items-center gap-3 self-end md:self-center">

                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Show</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="bg-white border border-slate-200 text-sm font-bold text-purple-600 py-1 px-2 rounded-md outline-none cursor-pointer focus:ring-2 focus:ring-purple-100"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                            <p className="text-xs font-bold text-slate-400 uppercase">entries</p>
                        </div>

                        {/* Class Dropdown */}
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Filter Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all h-10 w-36"
                            >
                                <option value="All">All Classes</option>
                                {availableClasses.map((cls) => (
                                    <option key={cls} value={cls}>
                                        Class {cls}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Input */}
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                                Select Date
                            </label>
                            <DatePicker
                                selected={date}
                                onChange={handleDateChange}

                                minDate={minDate}
                                maxDate={today}

                                filterDate={() => true}   // IMPORTANT FIX

                                dayClassName={(d) =>
                                    isSunday(d)
                                        ? "bg-red-500 text-red-800 font-bold rounded-lg"
                                        : ""
                                }

                                dateFormat="yyyy-MM-dd"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm h-10"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSubmit}
                            className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 self-end"
                        >
                            Save Attendance
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Student Name</th>
                                <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Class</th>
                                <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Present</th>
                                <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Absent</th>
                                <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Late</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.map((student) => (
                                <tr key={student.student_id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4 text-sm font-semibold text-gray-800">{student.student_id}</td>
                                    <td className="p-4 text-sm font-semibold text-gray-800">{student.student_name}</td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                                            Class {student.class}
                                        </span>
                                    </td>

                                    {["present", "absent", "late"].map((status) => (
                                        <td key={status} className="p-4 text-center">
                                            <label className="inline-flex items-center justify-center cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name={`status-${student.student_id}`}
                                                    value={status}
                                                    checked={attendance[student.student_id] === status}
                                                    onChange={() => handleChange(student.student_id, status)}
                                                    className="w-5 h-5 cursor-pointer text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 rounded-full transition duration-150 ease-in-out"
                                                />
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                                        No students found for this class.
                                    </td>

                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-gray-600 font-medium">
                        Page <span className="font-bold text-gray-800">{page}</span> of <span className="font-bold text-gray-800">{totalPages}</span>
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="px-4 py-1.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium rounded-lg transition"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className="px-4 py-1.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium rounded-lg transition"
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentsAttendance;
