import React from 'react'
import { useState, useEffect } from 'react';
import Toggle from './Toggle';
import ModalForm from './ModalForm';
import { FaEye } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import GeneratePDF from './GeneratePDF';
import toast from 'react-hot-toast';
import { BiSortAlt2, BiSolidEditAlt } from "react-icons/bi";
import axios from 'axios';
import { RiArrowDropDownLine } from "react-icons/ri";
import UpdateStaffModal from './UpdateStaffDataModal';
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from 'react-icons/io';
import StaffPdfContent from './StaffPdfContent'


const StaffDirectory = () => {
  const [finalRes, fn] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [open, setOpen] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [openDistrict, setOpenDistrict] = useState(false);


  const handleView = (item) => {
    setSelectedStaff(item)
    setOpen(true)
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5008/staffdetail/${id}`, {
        method: "PATCH", // or PATCH
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Status updated successfully!");

        fn(prevData => prevData.map(item =>
          item.staff_id === id
            ? { ...item, status: newStatus }
            : item));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSchoolData = async (pageNumber = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:5008/schoolpagination?page=${pageNumber}&limit=10`
      );

      fn(response.data.data); // staff data
      console.log(response.data.data)
      setTotalPages(response.data.totalPages); // total pages
    } catch (error) {
      console.error("Pagination fetch error:", error);
    }
  };

  useEffect(() => {
    //console.log("Total Pages State:", totalPages);
    fetchSchoolData(page);
  }, [page]);

  const [updateStaff, setUpdateStaff] = useState(null); // staff to edit
  const [updateOpen, setUpdateOpen] = useState(false);  // modal open/close



  /////////////////////////

  const [activeSearchColumn, setActiveSearchColumn] = useState(null);
  const [columnSearch, setColumnSearch] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  const [globalSearch, setGlobalSearch] = useState("");

  const uniqueNames = [...new Set(
    finalRes.map(item => item.first_name)
  )];

  const filteredData = finalRes.filter((item) => {
    //Dropdown filter
    const matchesDropdown =
      selectedDistrict === "" || item.district === selectedDistrict;
    const value = item[activeSearchColumn];

    const matchesColumnSearch =
      !activeSearchColumn || !columnSearch
        ? true
        : item[activeSearchColumn]
          ?.toString()
          .toLowerCase()
          .includes(columnSearch.toLowerCase());

    //For Global Search
    const matchesGlobalSearch =
      !globalSearch ||
      Object.values(item).some((val) => val?.toString().toLowerCase().includes(globalSearch.toLowerCase())
      )

    //Return both conditions
    return matchesDropdown && matchesColumnSearch && matchesGlobalSearch;
  });

  const [sorting, setSorting] = useState({
    key: null,
    direction: "asc"
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sorting.key) return 0;       //if no column is selected

    let valA = a[sorting.key];
    let valB = b[sorting.key];

    //Handle string comparison;
    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sorting.direction === "asc" ? -1 : 1;
    if (valA > valB) return sorting.direction === "asc" ? 1 : -1;

    return 0;
  })


  const handleSort = (key) => {
    let direction = "asc";

    if (sorting.key === key && sorting.direction === "asc") {
      direction = "desc";
    }

    setSorting({ key, direction });
  }

  const [districts, setDistricts] = useState([]);

  //For MP District api
  function getDistrictsData() {
    fetch('https://gist.githubusercontent.com/devzakir/ade5836fae0ac40531e6afb111d61870/raw/4fe8c90e127060d55ad3c7d6d603d13528450e5b/india-states-and-districts.json')
      .then((res) => res.json())
      .then((res) => {
        const mp = res.states.find((s) => s.state === "Madhya Pradesh");
        //console.log(mp.districts);

        setDistricts(mp.districts)
      })
  }

  useEffect(() => {
    getDistrictsData();
  }, [])

  return (
    <div className='relative'>

      <div className='flex justify-between'>
        <h1 className='text-2xl m-1 font-bold'>Staff Directory</h1>
        <ModalForm />
      </div>

      <p className='text-gray-600'>teaching and administrative staff</p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-4xl p-1">

        {/* 1. Search Input Container */}
        <div className="relative flex-1 min-w-[280px]">
          {/* Perfectly centered icon relative to the input */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearch className="text-gray-400 text-lg" />
          </div>

          <input
            type="text"
            placeholder="Search staff name, ID or school..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
          />
        </div>

        {/* 2. Dropdown Filter Container */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDistrict(!openDistrict)}
            className="flex items-center justify-between gap-3 w-full sm:w-56 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-violet-50"
          >
            <span className="truncate">
              {selectedDistrict || 'All Districts'}
            </span>
            <IoIosArrowDown className={`text-gray-400 transition-transform duration-200 ${openDistrict ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {openDistrict && (
            <ul className="absolute right-0 mt-2 w-full sm:w-56 bg-white border border-gray-100 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 py-1 divide-y divide-gray-50 focus:outline-none">

              {/* All option */}
              <li
                className="px-4 py-2.5 text-sm font-medium text-violet-600 hover:bg-violet-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedDistrict("");
                  setOpenDistrict(false);
                }}
              >
                All Districts
              </li>

              {/* List Items */}
              {districts.map((item, index) => (
                <li
                  key={index}
                  className={`px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors ${selectedDistrict === item.name ? 'bg-violet-50/50 font-medium text-violet-700' : ''
                    }`}
                  onClick={() => {
                    setSelectedDistrict(item.name);
                    setOpenDistrict(false);
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
              <tr>
                {[
                  { label: "Dise Code", key: "dise_code" },
                  { label: "Staff ID", key: "staff_id" },
                  { label: "Name", key: "first_name", filterable: true },
                  { label: "Designation", key: "designation" },
                  { label: "Gender", key: "gender" },
                  { label: "Qualification", key: "qualification" },
                  { label: "Experience", key: "experience" },
                ].map((col) => (
                  <th key={col.key} className="px-4 py-4 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider transition-colors hover:bg-slate-100/50">
                    <div className="flex items-center gap-2 group whitespace-nowrap">
                      <BiSortAlt2
                        onClick={() => handleSort(col.key)}
                        className="text-slate-400 group-hover:text-indigo-600 cursor-pointer transition-colors text-lg"
                      />

                      {col.filterable && activeSearchColumn === col.key ? (
                        <input
                          type="text"
                          autoFocus
                          placeholder="Search..."
                          value={columnSearch}
                          onChange={(e) => setColumnSearch(e.target.value)}
                          className="w-28 px-2 py-1 text-xs border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                        />
                      ) : (
                        <span
                          className="cursor-pointer"
                          onClick={() => col.filterable && setActiveSearchColumn(col.key)}
                        >
                          {col.label}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-4 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sortedData.map((item) => (
                <tr
                  key={`${item.staff_id}-${item.role_id}`}
                  className="group hover:bg-indigo-50/30 transition-colors duration-200"
                >
                  {/* Basic Info Cells */}
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.dise_code}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{item.staff_id}</td>

                  {/* Name with subtle emphasis */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 capitalize leading-none">
                      {item.first_name} {item.last_name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-tighter">
                      Staff Member
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600 capitalize">{item.rname}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.gender}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 italic font-medium">{item.qualification}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.experience} Yrs</td>

                  {/* Modern Status Selector */}
                  <td className="px-6 py-4">
                    <div className="relative inline-block w-full min-w-[120px]">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.staff_id, e.target.value)}
                        className={`appearance-none w-full px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border-2 transition-all cursor-pointer outline-none text-center
              ${item.status === "Active"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : item.status === "Inactive"
                              ? "bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100"
                              : "bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100"
                          }`}
                      >
                        <option value="Active">● Active</option>
                        <option value="Inactive">● Inactive</option>
                        <option value="On Leave">● On Leave</option>
                      </select>
                    </div>
                  </td>

                  {/* Action Buttons Group */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Icon */}
                      <button
                        onClick={() => handleView(item)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <FaEye size={16} />
                      </button>

                      {/* PDF Export */}
                      <div className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Export PDF">
                        <GeneratePDF
                          filename={`${item.first_name}_${item.last_name}.pdf`}
                          title={`${item.first_name} ${item.last_name} Info`}
                        >
                          <StaffPdfContent staff={item} />
                        </GeneratePDF>
                      </div>

                      {/* Edit Icon */}
                      <button
                        onClick={() => {
                          setUpdateOpen(true);
                          setUpdateStaff(item);
                        }}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Edit Staff"
                      >
                        <BiSolidEditAlt size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Modal  for Updating the staff values*/}
        {updateOpen && updateStaff && (
          <UpdateStaffModal
            staff={updateStaff}
            onClose={() => setUpdateOpen(false)}
            refreshData={fetchSchoolData}
          />
        )}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-purple-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>{page} / {totalPages}</span>

          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-purple-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {open && selectedStaff && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b-2 border-gray-500 pb-4">
                <h2 className="flex items-center text-lg font-semibold sm:text-2xl font-bold">
                  <BsPeople className='m-2 p-1 bg-teal-500 font-medium text-5xl text-white shadow-xl rounded-md' />
                  Staff Details
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">

                <div>
                  <p className="text-gray-500 text-xs uppercase">Dise Code</p>
                  <p className="font-medium break-words">
                    {selectedStaff.dise_code}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Name</p>
                  <p className="font-medium break-words">
                    {selectedStaff.first_name} {selectedStaff.last_name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Email</p>
                  <p className="font-medium break-words">
                    {selectedStaff.email || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Phone</p>
                  <p className="font-medium">{selectedStaff.phone || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Date of Birth</p>
                  <p className="font-medium">
                    {selectedStaff.dob
                      ? new Date(selectedStaff.dob).toLocaleDateString("en-GB")
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Gender</p>
                  <p className="font-medium">{selectedStaff.gender}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Designation</p>
                  <p className="font-medium">{selectedStaff.rname.toUpperCase()}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Qualification</p>
                  <p className="font-medium">{selectedStaff.qualification}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Experience</p>
                  <p className="font-medium">{selectedStaff.experience}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Joining Date</p>
                  <p className="font-medium">
                    {selectedStaff.joining_date
                      ? new Date(selectedStaff.joining_date).toLocaleDateString("en-GB")
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Salary</p>
                  <p className="font-medium">{selectedStaff.salary}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Created At</p>
                  <p className="font-medium">
                    {selectedStaff.created_at
                      ? new Date(selectedStaff.created_at).toLocaleDateString("en-GB")
                      : "-"}
                  </p>
                </div>

              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default StaffDirectory
