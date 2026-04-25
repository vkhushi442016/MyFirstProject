import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useStore from '../common/store/store'
import { FaUserCircle } from "react-icons/fa";
import ChangePasswordModal from '../ChangePasswordModal';
import toast from 'react-hot-toast';
import EditProfile from './EditProfile';



const ProfileCard = () => {
  const id = useStore((state) => state.staff_id);
  const role = useStore((state) => state.role);

  const [data, setData] = useState({})

  const [open, setOpen] = useState(false); //for change password field
  const [isOpen, setIsOpen] = useState(false);

  const fetchProfileData = async (id) => {
    const result = await axios(`http://localhost:5008/user/profile/${id}`)
    setData(result.data);
  }
  useEffect(() => {
    fetchProfileData(id)
  }, [id])

  //Change password
  const updatePassword = async ({ username, oldPassword, newPassword, confirmPassword }) => {
    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm Password do not match!");
      return;
    }
    try {
      const res = await axios.patch(`http://localhost:5008/update/password/${username}`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,      //send password
          confirmPassword
        }
      );
      if (res.status === 200) {
        toast.success("Password updated successfully!")
      } else {
        toast.error("Failed to change password")
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <div className="absolute right-0 top-2 z-[999] w-80">
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

          <div className="flex flex-col items-center">
            {/* Profile Image */}
            <div className="relative group">
              <div className="h-28 w-28 rounded-full ring-4 ring-indigo-50 overflow-hidden">
                <img
                  src='https://readymadeui.com/team-1.webp'
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              </div>
            </div>

            {/* Content */}
            <div className="mt-5 text-center flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md mb-2">
                {role}
              </span>
              <h2 className="text-xl text-slate-900 font-bold leading-tight">
                {data.first_name} {data.last_name}
              </h2>
              <p className="text-sm text-slate-500 font-medium mb-4">
                {data.email}
              </p>

              {/* Actions - Flex row for better alignment */}
              <div className="flex flex-col gap-2 w-full pt-4 border-t border-slate-50">
                <button
                  onClick={() => {
                    setOpen(true);
                    setIsOpen(false); // Close Edit Profile
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Change Password
                </button>

                <button
                  onClick={() => {
                    setIsOpen(true);
                    setOpen(false); // Close Change Password
                  }}
                  className="text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <EditProfile
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />

        <ChangePasswordModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSubmit={updatePassword}
        />
      </div>
    </div>
  )
}

export default ProfileCard
