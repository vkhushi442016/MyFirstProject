import React, { useState, useEffect } from 'react'
import { RiAddLargeFill } from "react-icons/ri";
import Modal from './Modal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { VscChromeClose } from "react-icons/vsc";


const Syllabus = () => {

    const [topics, setTopics] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjectss, setSubjectss] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedClassName, setSelectedClassName] = useState("");

    useEffect(() => {
        fetch(`http://localhost:5008/classes`)
            .then(res => res.json())
            .then(data => setClasses(data))
    }, [])

    const handleClassChange = async (class_id, className) => {
        console.log("Class ID sent:", class_id);

        setSelectedClassName(className)
        setSelectedClass(class_id)

        const res = await fetch(`http://localhost:5008/subject/${class_id}`)
        const data = await res.json()
        //console.log("API Response:", data);
        //console.log("Subject Name: ", data[0].subject_name)
        setSubjectss(data)
    }

    const [selectedSubjectName, setSelectedSubjectName] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const handleSubjectClick = async (subject_id, subject_name) => {
        setSelectedSubject(subject_id);
        setSelectedSubjectName(subject_name);

        console.log('Clicked sub', subject_id);

        const res = await fetch(`http://localhost:5008/topics/${subject_id}`);
        const data = await res.json();
        console.log(data);

        setTopics(data);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);      //modal state for syllabus addition
    const [subjectId, setSubjectId] = useState("");
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");

    const handleSyllabusSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:5008/add/syllabus', {
                subject_id: subjectId,
                topic: topic,
                description: description
            })

            toast.success("Syllabus added successfully")

            setSubjectId("");
            setTopic("");
            setDescription("");

            handleSubjectClick(selectedSubject, selectedSubjectName)

        } catch (error) {
            console.error("Error Saving Syllabus", error.message);
            toast.error("Error in saving")
        }
    }

    const [isModalOpen2, setIsModalOpen2] = useState(false);    //for adding new subject
    const [newSubjectID, setNewSubjectID] = useState("");
    const [newSubjectName, setNewSubjectName] = useState("")

    const addNewSubject = async () => {
        try {
            const res = await axios.post(`http://localhost:5008/classes/${selectedClass}/subjects`,
                {
                    subject_id: newSubjectID,
                    subject_name: newSubjectName
                })

            toast.success("New subject added successfully")
            setNewSubjectID("");
            setNewSubjectName("");

        } catch (error) {
            console.log("Error adding new subject. ", error.message);
        }
    }

    const deleteTopic = async (subject_id, topic) => {
        try {
            setSelectedSubject(subject_id);
            //console.log("subject id", subject_id);
            const encodedTopic = encodeURIComponent(topic);

            const result = await axios.delete(`http://localhost:5008/delete/${subject_id}/${encodedTopic}`)
            toast.success("Topic deleted successfully")
            handleSubjectClick(subject_id, selectedSubjectName);

        } catch (error) {
            console.log("Error in deleting", error.message);
        }
    }

    return (
        <div className="flex flex-col gap-4 p-1">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Syllabus</h1>
                <p className="text-sm font-medium text-slate-500">Your guide to smarter study planning</p>
            </div>

            <div className="flex gap-6 mt-2">
                {/* Sidebar Navigation */}
                <div className="w-1/4 min-w-[240px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                
                    <div className="mb-1 px-3 py-4 border-b-2 border-gray-100">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                               Classes
                            </h2>
                        </div>

                    <div className="space-y-1">
                        {classes.map((cls) => (
                            <button
                                key={cls.id}
                                onClick={() => handleClassChange(cls.class_id, cls.className)}
                                className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 
              ${selectedClass === cls.class_id
                                        ? "bg-purple-100 text-purple-600 shadow-sm ring-1 ring-purple-100"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <span>{cls.className} Syllabus</span>

                                {/* Active Indicator Arrow */}
                                <svg
                                    className={`h-4 w-4 transition-transform ${selectedClass === cls.class_id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                <div className='flex flex-col border border-gray-100 bg-white rounded-xl shadow-sm h-[650px] w-1/4 overflow-hidden'>
                    {/* Header Section */}
                    <div className='flex items-center justify-between p-4 shadow-md'>
                        <div className="mb-1 px-3 py-2">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                All Subjects
                            </h2>
                        </div>
                        <button
                            onClick={() => setIsModalOpen2(true)}
                            className="p-1.5 bg-purple-500 hover:bg-purple-400 rounded-lg transition-colors duration-200 text-white"
                            title="Add Subject"
                        >
                            <RiAddLargeFill size={18} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        {!selectedClass ? (
                            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                                    <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
                                </div>
                                <p className="font-semibold text-purple-900 text-sm">No class selected</p>
                                <p className="text-purple-400 text-[11px] mt-1 leading-relaxed">
                                    Select a class from the list to view available subjects
                                </p>
                            </div>
                        ) : (
                            <div className="p-3">
                                <p className='text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-3 px-2'>
                                    Select Subject
                                </p>
                                <div className="space-y-1">
                                    {subjectss.map((sub) => (
                                        <div
                                            key={sub.subject_id}
                                            className={`group flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                                ${selectedSubject === sub.subject_id
                                                    ? "bg-purple-100 text-purple-700 ring-1 ring-purple-200"
                                                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                                                }`}
                                            onClick={() => handleSubjectClick(sub.subject_id, sub.subject_name)}
                                        >
                                            {/* Small indicator dot */}
                                            <span className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${selectedSubject === sub.subject_id
                                                ? "bg-purple-600 scale-125"
                                                : "bg-gray-300 group-hover:bg-purple-300"
                                                }`} />
                                            {sub.subject_name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                <Modal
                    isOpen={isModalOpen2}
                    onClose={() => setIsModalOpen2(false)}
                    title="Add New Subject"
                    footer={
                        <>
                            <button
                                onClick={() => setIsModalOpen2(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                form="addSubjectForm"
                                className="px-6 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
                            >
                                Submit
                            </button>
                        </>
                    }
                >

                    <form onSubmit={addNewSubject} id="addSubjectForm" className="max-w-md mx-auto space-y-5">
                        {/* Subject Code */}
                        <div>
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Class Input */}
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-gray-700 font-medium mb-2">Class</label>
                                    <input
                                        type="text"
                                        value={selectedClassName}
                                        onChange={(e) => setSelectedClassName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* Subject Code Input */}
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-gray-700 font-medium mb-2">Subject Code</label>
                                    <input
                                        type="text"
                                        value={newSubjectID}
                                        onChange={(e) => setNewSubjectID(e.target.value)}
                                        placeholder="Enter subject code"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                </div>
                            </div>

                            <label className="block text-gray-700 font-medium mb-2">Subject Name</label>
                            <input
                                type="text"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                placeholder="Enter subject name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </form>

                </Modal>

                <div className="bg-white rounded-xl shadow-md border border-gray-200 w-4/6 flex flex-col h-[650px]">

                    {/* Sticky Header: Syllabus + Add Button */}
                    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-5 py-4 flex rounded-t-xl items-center justify-between shadow-sm">
                        {/* Left: Syllabus Label */}
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 ">
                            Syllabus
                        </h2>

                        {/* Right: Add Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white shadow-sm transition"
                            title="Add Subject"
                        >
                            <RiAddLargeFill size={18} />
                        </button>
                    </div>

                    {/* Selected Subject Info (Fixed) */}
                    {selectedSubject && (
                        <div className="bg-white border-b border-gray-200 px-5 py-4 flex items-center shadow-sm">
                            <div className="border-l-4 border-violet-500 pl-4">
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                                    {selectedSubjectName}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Subject Code: {selectedSubject}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Scrollable Topics */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
                        {!selectedSubject ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                                <p className="font-semibold text-lg">Select a subject to view syllabus</p>
                                <p className="text-sm mt-1 text-gray-400">Your topics will appear here</p>
                            </div>
                        ) : topics.length > 0 ? (
                            topics.map((topic, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                                            {topic.topic}
                                        </h3>
                                        <button
                                            onClick={() => deleteTopic(selectedSubject, topic.topic)}
                                            className="text-gray-400 hover:text-red-500 transition"
                                        >
                                            <VscChromeClose size={18} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                        {topic.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                No topics found
                            </div>
                        )}
                    </div>
                </div>


                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Add Syllabus"
                    footer={
                        <>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                form="syllabusForm"
                                className="px-6 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
                            >
                                Submit
                            </button>
                        </>
                    }
                >
                    <form onSubmit={handleSyllabusSubmit} id="syllabusForm" className="max-w-md mx-auto space-y-5">
                        {/* Subject Code */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Subject Code</label>
                            <input
                                type="text"
                                value={subjectId}
                                onChange={(e) => setSubjectId(e.target.value)}
                                placeholder="Enter subject code"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Topic */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Topic</label>
                            <input
                                type="text"
                                placeholder="Enter topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Description</label>
                            <textarea
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none h-24"
                            />
                        </div>
                    </form>
                </Modal>
            </div>



        </div>
    )
}

export default Syllabus
