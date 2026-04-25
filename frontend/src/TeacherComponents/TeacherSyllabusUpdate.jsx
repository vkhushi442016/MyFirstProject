import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import useStore from "../common/store/store";
import { FaChevronDown } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaClock, FaTimesCircle } from "react-icons/fa";



export default function SyllabusDashboard() {
    const dise_code = useStore((state) => state.dise_code);
    const school_category = useStore((state) => state.sc_category);

    const [data, setData] = useState([]);
    const [selectedClass, setSelectedClass] = useState("class1");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [editing, setEditing] = useState(null);
    const [editTopic, setEditTopic] = useState("");

    const [updatingId, setUpdatingId] = useState(null);
    const [stats, setStats] = useState([])


    // Fetch syllabus
    const fetchSyllabus = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:5008/api/syllabus/${selectedClass}/${dise_code}`
            );
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSyllabus();
    }, [selectedClass, dise_code]);

    // Subjects based on API data
    const subjects = [
        ...new Set(data.map((item) => item.subject_name))
    ];

    useEffect(() => {
        if (!selectedSubject && subjects.length > 0) {
            setSelectedSubject(subjects[0]); // or first subject
        }
    }, [subjects]);

    // Filter
    const filtered = data.filter((item) =>
        item.subject_name === selectedSubject &&
        item.topic.toLowerCase().includes(search.toLowerCase())
    );

    // Update status (UI only for now)
    const updateStatus = async (topic_id, status) => {
        setUpdatingId(topic_id);

        try {
            await axios.post("http://localhost:5008/api/update-status", {
                topic_id,
                status,
                dise_code
            });

            setData((prev) =>
                prev.map((item) =>
                    item.topic_id === topic_id ? { ...item, status } : item
                )
            );
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null); // VERY IMPORTANT
        }
    };

    const fetchStats = async (selectedClass, dise_code) => {
        const res = await axios.get(
            `http://localhost:5008/subject-stats/${selectedClass}/${dise_code}`
        );
        setStats(res.data);
        console.log(res.data);
    };
    useEffect(() => {
        fetchStats(selectedClass, dise_code);
    }, [selectedClass, dise_code])

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const categoryMap = {
        Primary: 5,
        Middle: 8,
        "Higher Secondary": 12,
    };

    const maxClass = categoryMap[school_category] || 5;

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans antialiased text-slate-900">
            <div className="max-w-7xl mx-auto">

                {/* HEADER SECTION */}
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Syllabus Dashboard</h1>
                        <p className="text-slate-500 mt-1 text-sm">Manage and track curriculum progress across classes.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-72 group">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm"
                                placeholder="Search topics..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </header>




                {/* FILTERS CARD */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Class</label>
                        <div className="relative">
                        <select
                            className="appearance-none pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            {Array.from({ length: maxClass }, (_, i) => {
                                const classId = `class${i + 1}`;
                                return (
                                    <option key={classId} value={classId}>
                                        {classId.toUpperCase()}
                                    </option>
                                );
                            })}
                        </select>
                        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
                        </div>
                        
                        {/* <div className="relative">
                            <select
                                className="appearance-none pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                {["class1", "class2", "class3", "class4", "class5"].map(c => (
                                    <option key={c} value={c}>{c.toUpperCase()}</option>
                                ))}
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
                        </div> */}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</label>
                        <div className="relative">
                            <select
                                className="appearance-none pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                {subjects.map((sub) => (
                                    <option key={sub}>{sub}</option>
                                ))}
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
                        </div>
                    </div>
                </div>

                {/* TABLE CONTAINER */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                                    <p className="font-medium">Syncing Syllabus...</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-200">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Subject</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Topic Details</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Progress Status</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Update</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center opacity-40">
                                                        <FaSearch className="text-4xl mb-2" />
                                                        <p className="text-lg">No matches found for your criteria</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((item) => (
                                                <tr key={item.topic_id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                                            {item.subject_name}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {editing === item.topic_id ? (
                                                            <input
                                                                autoFocus
                                                                value={editTopic}
                                                                onChange={(e) => setEditTopic(e.target.value)}
                                                                className="border-2 border-blue-400 px-3 py-1.5 rounded-lg w-full outline-none shadow-inner"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-slate-700">{item.topic}</span>
                                                                <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-500 transition-all">
                                                                    <FaEdit size={12} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(item.status)}`}>
                                                            {item.status === 'Completed' && <FaCheckCircle size={10} />}
                                                            {item.status === 'In Progress' && <FaClock size={10} />}
                                                            {item.status === 'Not Started' && <FaTimesCircle size={10} />}
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        <select
                                                            disabled={updatingId === item.topic_id}
                                                            value={item.status}
                                                            onChange={(e) => updateStatus(item.topic_id, e.target.value)}
                                                            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm hover:border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all disabled:opacity-50"
                                                        >
                                                            <option value="Not Started">Not Started</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}

                        </div>

                        {/* FOOTER STATS (Optional) */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                            <p className="text-xs text-slate-500 font-medium">
                                Showing {filtered.length} topics
                            </p>
                        </div>

                    </div>
                    <div className="flex-[1] w-full lg:max-w-xs flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">
                            Subject Insights
                        </h2>

                        {stats.map((sub) => (
                            <div
                                key={sub.subject_id}
                                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all group"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-slate-800 truncate pr-2">
                                        {sub.subject_name}
                                    </h3>
                                    <span className="text-sm font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                                        {sub.completion_percentage}%
                                    </span>
                                </div>

                                {/* Simplified Progress Bar */}
                                <div className="flex h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                                    <div
                                        className="bg-emerald-500"
                                        style={{ width: `${(sub.completed_topics / sub.total_topics) * 100}%` }}
                                    />
                                    <div
                                        className="bg-amber-400"
                                        style={{ width: `${(sub.in_progress_topics / sub.total_topics) * 100}%` }}
                                    />
                                </div>

                                {/* Compact Legend */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] font-bold text-slate-500">{sub.completed_topics}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                            <span className="text-[10px] font-bold text-slate-500">{sub.in_progress_topics}</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400">
                                        {sub.total_topics} Total
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}