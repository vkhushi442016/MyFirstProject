import React from 'react'
import { useEffect } from 'react';
import useStore from '../common/store/store';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ModalForm from '../ModalForm';
import { BiSolidEditAlt } from 'react-icons/bi';
import UpdateStaffModal from '../UpdateStaffDataModal';
import { Pagination } from '../UI/Pagination';
import { FaUserTie } from 'react-icons/fa6';

const PrincipalStaffDirectory = () => {
  const disecode = useStore((state) => state.dise_code);
  const [data, setData] = useState([])

  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateStaff, setUpdateStaff] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const getSchoolStaffData = async (dise_code, page, limit) => {
    const result = await axios.get(`http://localhost:5008/api/disecode/${dise_code}?page=${page}&limit=${limit}`)
    setData(result.data.data);
    console.log(result.data);
    setTotalPages(result.data.totalPages)

  }

  useEffect(() => {
    getSchoolStaffData(disecode, page, limit);
  }, [disecode, page, limit])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5008/staffdetail/${id}`, {
        method: "PATCH", // or PATCH
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Status updated successfully!");

        setData(prevData => prevData.map(item =>
          item.staff_id === id
            ? { ...item, status: newStatus }
            : item));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 gap-6">

        {/* LEFT SIDE: Heading Content */}
        <div className="px-1">
          {/* Top Label */}
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-purple-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Administrative Access
            </span>
          </div>

          {/* Main Title Group */}
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Staff <span className="text-purple-600">Directory</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1 max-w-md">
              Manage and monitor faculty profiles, assignments, and departmental roles.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Action Buttons / Modal Trigger */}
        <div className="flex items-center gap-3 self-end md:self-center">

          {/* This wrapper ensures your ModalForm button looks like a primary action */}
          <div className="shadow-lg shadow-purple-100 rounded-xl">
            <ModalForm />
          </div>
        </div>
      </div>


      <div className="w-full bg-white rounded-md shadow overflow-hidden">
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

        {/* scroll container */}
        <div className="w-full overflow-x-auto">

          <table className="min-w-[600px] w-full text-sm text-left border-collapse">

            <thead className="bg-gray-200">
              <tr className="h-10">
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Staff ID
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Email
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Phone
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Gender
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Qualification
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data.map((item) => {
                return (
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{item.staff_id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.first_name} {item.last_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.gender}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.qualification}</td>
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <BiSolidEditAlt
                        className="cursor-pointer text-green-500"
                        onClick={() => {
                          setUpdateOpen(true)
                          setUpdateStaff(item)
                        }}
                      />
                    </td>
                  </tr>
                )
              })}

            </tbody>

          </table>

          {/* Modal  for Updating the staff values*/}
          {updateOpen && updateStaff && (
            <UpdateStaffModal
              staff={updateStaff}
              onClose={() => setUpdateOpen(false)}
            />
          )}
        </div>

      </div>

    </div>
  )
}

export default PrincipalStaffDirectory
