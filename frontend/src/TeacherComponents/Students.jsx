import axios from 'axios'
import React, { useState, useEffect } from 'react'
import useStore from '../common/store/store'
import toast from 'react-hot-toast';
import { IoSearch, IoAdd, IoChevronDown } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import AddStudentForm from './AddStudentForm';
import { Pagination } from '../UI/Pagination';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone, HiOutlineUserGroup, HiUser, HiOutlineUser, HiOutlinePencilAlt   } from 'react-icons/hi';
const Students = () => {
    const dise_code = useStore((state) => state.dise_code);

    const [students, setStudents] = useState([])
    const [isOpen, setIsOpen] = useState(false);


    //////////////////// for pagination states
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getStudentsData = async (dise_code, page, limit) => {
        const studentsResult = await axios.get(`http://localhost:5008/api/students-data/${dise_code}?page=${page}&limit=${limit}`)
        setStudents(studentsResult.data.data)
        setTotalPages(studentsResult.data.totalPages);
    }

    useEffect(() => {
        getStudentsData(dise_code, page, limit)
    }, [dise_code, page, limit])

    const updateStudentData = async (student) => {
        try {
            const formData = new FormData();

            formData.append("student_name", student.student_name)
            formData.append("class", student.class)
            formData.append("age", student.age)
            formData.append("gender", student.gender)
            formData.append("guardian_name", student.guardian_name)
            formData.append("contact", student.contact)

            if (student.imageFile) {
                formData.append("image", student.imageFile);
            }

            const res = await axios.patch(
                `http://localhost:5008/api/update-student/${student.student_id}`,
                formData, // send updated data
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            return res.data;
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    // For adding student
    const handleAddSubmit = async (data) => {
        console.log("Student Data:", data);

        // API call example
        await axios.post("http://localhost:5008/api/students-data", data);
        toast.success("Student Added")
        setIsOpen(false);
    };

    //For search
    const [search, setSearch] = useState("");
    const [selectedClass, setSelectedClass] = useState("");

    const filteredStudents = students.filter((s) => {
        return (
            s.student_name.toLowerCase().includes(search.toLowerCase()) &&
            (selectedClass ? s.class === selectedClass : true)
        );
    });

    const [selectedStudent, setSelectedStudent] = useState(null); //for students detail in a sidebar



    //////////////////////
    const [editData, setEditData] = useState({
        student_name: "",
        class: "",
        age: "",
        gender: "",
        guardian_name: "",
        contact: "",
        passport_img: "",

        profilePic: "",     // frontend preview (URL.createObjectURL)
        imageFile: null     // actual file for multer upload
    });
    const [sidebarMode, setSidebarMode] = useState("view"); // 'view' or 'edit'


    useEffect(() => {
        if (selectedStudent) {
            setEditData({
                ...selectedStudent, // <- this runs when selectedStudent changes

                profilePic: "",
                imageFile: null
            })
        }
    }, [selectedStudent]);

    const handleUpdateStudent = async (e) => {
        e.preventDefault();

        await updateStudentData(editData);
        toast.success("Student profile updated")
        await getStudentsData(dise_code); //fresh data from DB

        setSelectedStudent(null); // close sidebar
    };



    return (
        <div className="flex flex-col gap-6 p-6 bg-slate-50 min-h-screen">
            {/* 1. TOP HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Students Record
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage enrolled students and track academic performance.
                    </p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-purple-700 active:scale-95 transition-all w-full md:w-auto"
                >
                    <IoAdd size={20} />
                    <span>Add Student</span>
                </button>

                {isOpen && (
                    <AddStudentForm
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onSubmit={handleAddSubmit}
                    />
                )}
            </div>

            {/* 2. FILTER ACTION BAR */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* Search - Takes more space */}
                    <div className="relative flex-1 w-full group">
                        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search students by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
                        />
                    </div>

                    {/* Class Filter - Compact */}
                    <div className="relative w-full md:w-48">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 appearance-none cursor-pointer outline-none transition-all"
                        >
                            <option value="">All Classes</option>
                            {[1, 2, 3, 4, 5].map((cls) => (
                                <option key={cls} value={cls}>Class {cls}</option>
                            ))}
                        </select>
                        <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    {/* 4. TOP PAGINATION */}
                    <div className="py-2 px-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
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
                            <p className="text-sm text-slate-500">entries</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    </div>

                    <table className="min-w-full divide-y divide-gray-200 bg-white text-sm text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-900">ID</th>
                                <th className="px-4 py-3 font-semibold text-gray-900">Name</th>
                                <th className="px-4 py-3 font-semibold text-gray-900">Class</th>
                                <th className="px-4 py-3 font-semibold text-gray-900 text-center">Age</th>
                                <th className="px-4 py-3 font-semibold text-gray-900">Gender</th>
                                <th className="px-4 py-3 font-semibold text-gray-900">Father's Name</th>
                                <th className="px-4 py-3 font-semibold text-gray-900">Contact</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
                                <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">#{student.student_id}</td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button
                                            onClick={() => {
                                                setSelectedStudent(student)
                                            }}
                                            className="text-indigo-600 cursor-pointer font-semibold hover:text-indigo-900 hover:underline transition-all"
                                        >
                                            {student.student_name}
                                        </button>
                                    </td>

                                    <td className="px-4 py-3 text-gray-700">
                                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                            {student.class}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700 text-center">{student.age}</td>
                                    <td className="px-4 py-3 text-gray-700 uppercase text-xs">{student.gender}</td>
                                    <td className="px-4 py-3 text-gray-700">{student.father_name}</td>
                                    <td className="px-4 py-3 text-gray-500 font-mono text-sm">{student.contact}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Right Sidebar (Slide-over) --- */}
            {
                selectedStudent && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
                            onClick={() => setSelectedStudent(null)}
                        />

                        {/* Sidebar */}
                        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col">

                            {/* Header */}
                            <div className="flex items-center justify-between p-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {sidebarMode === "view" ? "Student Profile" : "Edit Student"}
                                </h2>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Toggle */}
                            <div className="px-6 py-4 bg-white">
                                <div className="flex p-1 bg-slate-100 rounded-xl">
                                    <button
                                        onClick={() => setSidebarMode("view")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${sidebarMode === "view"
                                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                            }`}
                                    >
                                        <HiOutlineUser size={16} className={sidebarMode === "view" ? "text-indigo-600" : "text-slate-400"} />
                                        View Profile
                                    </button>

                                    <button
                                        onClick={() => setSidebarMode("edit")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${sidebarMode === "edit"
                                                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                            }`}
                                    >
                                        <HiOutlinePencilAlt size={16} className={sidebarMode === "edit" ? "text-indigo-600" : "text-slate-400"} />
                                        Edit Details
                                    </button>
                                </div>
                            </div>


                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">

                                {/* VIEW MODE */}
                                {sidebarMode === "view" && (
                                    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-right duration-300">

                                        {/* 1. Header: Profile Identity */}
                                        <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
                                            <div className="relative inline-block mb-4">
                                                {selectedStudent?.passport_img ? (
                                                    <img
                                                        src={`http://localhost:5008/upload/${selectedStudent.passport_img}?t=${Date.now()}`}
                                                        alt="Profile"
                                                        className="h-20 w-20 rounded-2xl object-cover border-4 border-white shadow-md ring-1 ring-slate-200"
                                                    />
                                                ) : (
                                                    <div className="h-20 w-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-100">
                                                        {selectedStudent?.student_name?.charAt(0)?.toUpperCase() || "?"}
                                                    </div>
                                                )}
                                                <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white h-4 w-4 rounded-full shadow-sm"></span>
                                            </div>

                                            <h3 className="text-lg font-bold text-slate-800 leading-tight">
                                                {selectedStudent?.student_name}
                                            </h3>
                                            <div className="flex items-center justify-center gap-1.5 mt-1 text-slate-500">
                                                <HiOutlineIdentification size={14} className="text-indigo-500" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    ID: {selectedStudent?.student_id}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 2. Content: Information Groups */}
                                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                                            {/* Academic Summary Quick-Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Class</p>
                                                    <p className="text-sm font-bold text-slate-700">{selectedStudent?.class || 'N/A'}</p>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Age</p>
                                                    <p className="text-sm font-bold text-slate-700">{selectedStudent?.age || 'N/A'} Yrs</p>
                                                </div>
                                            </div>

                                            {/* Contact Information */}
                                            <div className="space-y-4">
                                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Contact Details</h4>

                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><HiOutlineMail size={18} /></div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-[10px] text-slate-400 font-medium leading-none mb-1">Email Address</p>
                                                        <p className="text-sm font-semibold text-slate-700 truncate">{selectedStudent?.email || 'No email'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><HiOutlinePhone size={18} /></div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 font-medium leading-none mb-1">Contact Number</p>
                                                        <p className="text-sm font-semibold text-slate-700">{selectedStudent?.contact || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Family Details */}
                                            <div className="space-y-4">
                                                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Family Info</h4>

                                                <div className="bg-slate-50 rounded-2xl p-4 space-y-4 border border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <HiOutlineUserGroup size={16} className="text-slate-400" />
                                                            <span className="text-xs text-slate-500">Father</span>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">{selectedStudent?.father_name || '—'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <HiOutlineUserGroup size={16} className="text-slate-400" />
                                                            <span className="text-xs text-slate-500">Mother</span>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">{selectedStudent?.mother_name || '—'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. Footer: Primary Action */}
                                        <div className="p-6 bg-white border-t border-slate-100">
                                            <button
                                                onClick={() => setSidebarMode("edit")}
                                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-100 active:scale-95 uppercase tracking-widest"
                                            >
                                                Edit Student File
                                            </button>
                                        </div>
                                    </div>
                                )}


                                {/* EDIT MODE */}
                                {sidebarMode === "edit" && (
                                    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-left duration-300">

                                        {/* 1. Header: Profile Photo Update */}
                                        <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
                                            <div className="relative inline-block group">
                                                <div className="relative h-20 w-20">
                                                    {editData.profilePic ? (
                                                        <img
                                                            src={editData.profilePic}
                                                            alt="Preview"
                                                            className="h-20 w-20 rounded-2xl object-cover border-4 border-white shadow-md ring-1 ring-slate-200"
                                                        />
                                                    ) : editData.passport_img ? (
                                                        <img
                                                            src={`http://localhost:5008/upload/${editData.passport_img}`}
                                                            alt="Profile"
                                                            className="h-20 w-20 rounded-2xl object-cover border-4 border-white shadow-md ring-1 ring-slate-200"
                                                        />
                                                    ) : (
                                                        <div className="h-20 w-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl shadow-inner">
                                                            {selectedStudent?.student_name?.charAt(0)?.toUpperCase() || "?"}
                                                        </div>
                                                    )}

                                                    {/* Professional Upload Overlay */}
                                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                                                        <MdOutlineEdit size={24} />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const previewUrl = URL.createObjectURL(file);
                                                                    setEditData(prev => ({
                                                                        ...prev,
                                                                        profilePic: previewUrl,
                                                                        imageFile: file
                                                                    }));
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                                <p className="mt-2 text-[10px] font-bold text-indigo-600 uppercase tracking-tight">Change Photo</p>
                                            </div>
                                        </div>

                                        {/* 2. Content: Form Inputs */}
                                        <form onSubmit={handleUpdateStudent} className="flex-1 overflow-y-auto p-6 space-y-5">

                                            {/* Field Groups */}
                                            <div className="space-y-4">
                                                {[
                                                    { label: "Full Name", key: "student_name", icon: <HiUser /> },
                                                    { label: "Email Address", key: "email", type: "email", icon: <HiOutlineMail /> },
                                                    { label: "Contact Number", key: "contact", icon: <HiOutlinePhone /> },
                                                ].map((field) => (
                                                    <div key={field.key} className="space-y-1">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                            {field.label}
                                                        </label>
                                                        <input
                                                            type={field.type || "text"}
                                                            value={editData[field.key]}
                                                            onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                                        />
                                                    </div>
                                                ))}

                                                {/* Academic Row */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Class</label>
                                                        <input
                                                            type="text"
                                                            value={editData.class}
                                                            onChange={(e) => setEditData({ ...editData, class: e.target.value })}
                                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age</label>
                                                        <input
                                                            type="number"
                                                            value={editData.age}
                                                            onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Family Inputs */}
                                                <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100 mt-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Father's Name</label>
                                                        <input
                                                            type="text"
                                                            value={editData.father_name}
                                                            onChange={(e) => setEditData({ ...editData, father_name: e.target.value })}
                                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mother's Name</label>
                                                        <input
                                                            type="text"
                                                            value={editData.mother_name}
                                                            onChange={(e) => setEditData({ ...editData, mother_name: e.target.value })}
                                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Gender Dropdown */}
                                                <div className="space-y-1">
                                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                                                    <select
                                                        value={editData.gender}
                                                        onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </form>

                                        {/* 3. Footer: Save & Cancel */}
                                        <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setSidebarMode("view")}
                                                className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all uppercase tracking-widest"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleUpdateStudent}
                                                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-100 active:scale-95 uppercase tracking-widest"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </>
                )
            }




        </div >
    )
}

export default Students
