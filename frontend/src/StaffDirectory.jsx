import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Toggle from './Toggle';
import ModalForm from './ModalForm';
import { FaEye } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import GeneratePDF from './GeneratePDF';
import toast from 'react-hot-toast';
import { BiSortAlt2 } from "react-icons/bi";
import axios from 'axios';
import { RiArrowDropDownLine } from "react-icons/ri";

const StaffDirectory = () => {
  let [finalRes, fn] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [open, setOpen] = useState(false)


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
        `http://localhost:5008/schoolpagination?page=${pageNumber}&limit=5`
      );

      fn(response.data.data); // staff data
      setTotalPages(response.data.totalPages); // total pages
    } catch (error) {
      console.error("Pagination fetch error:", error);
    }
  };

  useEffect(() => {
    console.log("Total Pages State:", totalPages);
    fetchSchoolData(page);
  }, [page]);




  /////////////////////////

  const [activeSearchColumn, setActiveSearchColumn] = useState(null);
  const [columnSearch, setColumnSearch] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  const uniqueNames = [...new Set(
    finalRes.map(item => item.first_name)
  )];

  const filteredData = finalRes.filter((item) => {
    //Dropdown filter
    const matchesDropdown =
      selectedName === "" || item.first_name === selectedName;
    const value = item[activeSearchColumn];

    const matchesColumnSearch =
      !activeSearchColumn || !columnSearch
        ? true
        : item[activeSearchColumn]
          ?.toString()
          .toLowerCase()
          .includes(columnSearch.toLowerCase());

    //Return both conditions
    return matchesDropdown && matchesColumnSearch;
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

  return (
    <div>

      <div className='flex justify-between'>
        <h1 className='text-2xl m-1 font-bold'>Staff Directory</h1>
        <ModalForm />
      </div>
      <div className="w-full overflow-x-auto h-70">
        <table className="table-auto border-collapse w-full capitalise bg-white rounded-md ">
          <thead className='border-b border-gray-300 h-10'>
            <tr>
              <th className="font-normal">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <BiSortAlt2
                    onClick={() => handleSort("dise_code")}
                    className='m-1 text-xl cursor-pointer' />
                  Dise Code
                </div>
              </th>

              <th className="font-normal">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <BiSortAlt2
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSort("staff_id")
                    }}
                    className='m-1 text-xl cursor-pointer' />
                  staff ID
                </div>
              </th>

              <th className="font-normal cursor-pointer">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">

                  <BiSortAlt2
                    onClick={(e) => 
                      handleSort("first_name")
                    }
                    className='m-1 text-xl cursor-pointer' 
                  />

                  {activeSearchColumn === "first_name" ? (
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search Name..."
                      value={columnSearch}
                      onChange={(e) => setColumnSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  ) : (
                    <span
                      className='cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSearchColumn("first_name");
                        setColumnSearch("")
                      }}>Name</span>
                    
                  )}

                  <div className="relative">
                  <RiArrowDropDownLine
                    className="cursor-pointer text-3xl text-gray-500 hover:text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(prev => !prev)
                      }} />

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-10 right-0 bg-white shadow-lg border rounded-md z-50 w-40 max-h-60 overflow-y-auto">

                      <div
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedName("");
                          setShowDropdown(false);
                        }}
                      >
                        All
                      </div>

                      {uniqueNames.map((name, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedName(name);
                            setShowDropdown(false);
                          }}
                        >
                          {name}
                        </div>
                      ))}

                    </div>
                  )}
                  </div>
                </div>
              </th>

              <th className="font-normal">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <BiSortAlt2
                    onClick={() => handleSort("gender")}
                    className='m-1 text-xl cursor-pointer' />
                  Gender
                </div>
              </th>
              <th className="font-normal">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <BiSortAlt2
                    onClick={() => handleSort("designation")} />
                  Designation
                </div>
              </th>

              <th className="font-normal">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <BiSortAlt2
                    onClick={() => handleSort("qualification")} />
                  Qualification
                </div>
              </th>

              <th className="font-normal">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <BiSortAlt2
                    onClick={() => handleSort("experience")} />
                  Experience
                </div>
              </th>
              <th className="font-normal">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <BiSortAlt2
                    onClick={() => handleSort("salary")} />
                  Salary
                </div>
              </th>

              <th className="font-normal">Status</th>
              <th className="font-normal">View More</th>
              <th className="font-normal">Export</th>
              {/* <th className="font-normal">Created At</th> */}
            </tr>

          </thead>
          <tbody>
            {
              sortedData.map((item) => {
                return (
                  <tr key={item.staff_id} className="border-b border-gray-300 h-12">
                    <td className="h-10 pl-6 py-2">{item.dise_code}</td>
                    <td className="h-10 pl-6 py-2">{item.staff_id}</td>
                    <td className="h-10 pl-6 py-2 capitalize font-semibold">{item.first_name} {item.last_name}</td>
                    {/* <td className="h-10 pl-6 py-2 lowercase">{item.email}</td>
                  <td className="h-10 pl-6 py-2">{item.phone}</td>
                  <td>{new Date(item.dob).toLocaleDateString("en-GB")}</td> */}
                    <td className="h-10 pl-6 py-2 capitalize">{item.gender}</td>
                    <td className="h-10 pl-6 py-2 capitalize">{item.designation}</td>
                    <td className="h-10 pl-6 py-2 capitalize">{item.qualification}</td>
                    <td className="h-10 pl-6 py-2">{item.experience}</td>
                    {/* <td className="h-10 pl-6 py-2">{new Date(item.joining_date).toLocaleDateString("en-GB")}</td> */}
                    <td className="h-10 pl-6 py-2">{item.salary}</td>
                    {/* <td>
                      <span className="h-10 m-2 pt-2 mt-3 p-2 bg-green-400 text-white font-medium rounded-md">
                        {item.status}
                      </span>
                    </td> */}
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.staff_id, e.target.value)}
                        className={`p-2 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition duration-200 ease-in-out
                          ${item.status === "Active"
                            ? "bg-green-500 hover:bg-green-600 focus:ring-green-400"
                            : item.status === "Inactive"
                              ? "bg-red-500 hover:bg-red-600 focus:ring-red-400"
                              : "bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300 text-gray-800"
                          }
                      `}
                      >
                        <option value="Active" className='bg-white text-black'>Active</option>
                        <option value="Inactive" className='bg-white text-black'>Inactive</option>
                        <option value="On Leave" className='bg-white text-black'>On Leave</option>
                      </select>
                    </td>

                    <td className='h-10 pl-6 py-2'>
                      <FaEye
                        className="cursor-pointer text-blue-500"
                        onClick={() => handleView(item)} />
                    </td>
                    <td><GeneratePDF staff={item} /></td>
                    {/* <td className=' m-1 hover:text-red-600 text-purple-500 px-4 py-2 text-sm sm:text-lg'><TfiDownload /></td> */}
                    {/* <td className="h-10 pl-6 py-2">{new Date(item.created_at).toLocaleDateString("en-GB")}</td> */}
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>


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
                <p className="font-medium">{selectedStaff.designation}</p>
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



      <Toggle />



    </div>
  )
}

export default StaffDirectory
