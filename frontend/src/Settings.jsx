import ChangePasswordModal from './ChangePasswordModal'
import EditProfile from './UI/EditProfile'
import React, { useRef, useState, useEffect } from 'react'
import useStore from './common/store/store'
import { FaBriefcase, FaEnvelope, FaPhone, FaFingerprint, FaCalendarAlt, FaKey, FaCamera, FaUser, FaTimes } from 'react-icons/fa'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import axios from 'axios'
import toast from 'react-hot-toast'


const Settings = () => {
  const fileRef = useRef();
  const staff_id = useStore((state) => state.staff_id);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState({
    user_image: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });


  //if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  useEffect(() => {
    console.log("USER UPDATED:", user);
    console.log("USER IMAGE:", user?.user_image);
  }, [user]);

  const handleUpdateProfile = async () => {
    const formData = new FormData();

    formData.append("staff_id", staff_id);
    formData.append("first_name", user.first_name || "");
    formData.append("last_name", user.last_name || "");
    formData.append("email", user.email || "");
    formData.append("phone", user.phone || "");

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const result = await axios.patch(
      "http://localhost:5008/update-profile",
      formData
    );

    console.log(result.data);
    toast.success("Profile updated successfully")
    setUser((prev) => ({
      ...prev,
      user_image: result.data.user_image || prev.user_image
    }));
  };

  useEffect(() => {
    axios.get(`http://localhost:5008/user/profile/${staff_id}`)
      .then((res) => {
        setUser(res.data)
        console.log("Data ", res.data);
      })
      .catch(err => console.error(err));
  }, [staff_id]);

  ///////////
  const id = useStore((state) => state.staff_id);
  const role = useStore((state) => state.role);

  const [data, setData] = useState({})

  const [open, setOpen] = useState(false); //for change password field
  const [isOpen, setIsOpen] = useState(false);

  const fetchProfileData = async (id) => {
    const result = await axios.get(`http://localhost:5008/user/profile/${id}`)
    console.log(result.data)
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

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-4">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Update your photo and personal details here.</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* RIGHT COLUMN: Edit Form */}
          <div className="w-full lg:w-2/3">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">

              {/* Form Header */}
              <div className="border-b border-slate-100 bg-white p-8 pb-6">
                <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
                <p className="text-sm font-medium text-slate-500">Update your profile details and account identity.</p>
              </div>

              <form className="p-8 space-y-8">

                {/* SECTION 1: Identity */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-4 rounded-full bg-indigo-500" />
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Basic Details</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">First Name</label>
                      <div className="group relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                        <input
                          type="text"
                          value={user.first_name}
                          onChange={(e) => setUser(p => ({ ...p, first_name: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                          placeholder="First Name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Last Name</label>
                      <div className="group relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                        <input
                          type="text"
                          value={user.last_name}
                          onChange={(e) => setUser(p => ({ ...p, last_name: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Date of Birth</label>
                    <div className="group relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                      <input
                        type="date" // Use "text" since "date" type expects YYYY-MM-DD
                        value={user.dob ? user.dob.split('T')[0] : ""}
                        onChange={(e) => setUser((prev) => ({ ...prev, dob: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                        placeholder="DD/MM/YYYY"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Contact */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-4 rounded-full bg-indigo-500" />
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Contact Information</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                      <div className="group relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                        <input
                          type="email"
                          value={user.email}
                          onChange={(e) => setUser(p => ({ ...p, email: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Contact Number</label>
                      <div className="group relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500" />
                        <input
                          type="text"
                          value={user.phone}
                          onChange={(e) => setUser(p => ({ ...p, phone: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                          placeholder="+1 (000) 000-0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: System Reference (Read Only) */}
                <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Staff ID</label>
                      <div className="flex items-center gap-2">
                        <FaFingerprint className="text-indigo-500 text-sm" />
                        <span className="text-sm font-mono font-bold text-slate-700">{user.staff_id || "N/A"}</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-1 text-[10px] font-bold text-slate-400 border border-slate-200">
                      Locked Field
                    </div>
                  </div>
                </div>

              </form>

              {/* Footer Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-8 py-6">
                <div className="hidden items-center gap-2 text-slate-400 sm:flex">
                  <HiOutlineInformationCircle className="text-lg text-indigo-500" />
                  <span className="text-[11px] font-medium">Account data is encrypted and secure.</span>
                </div>
                <div className="flex w-full gap-4 sm:w-auto">
                  <button className="flex-1 rounded-xl px-6 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 sm:flex-none">
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="flex-1 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-indigo-600 hover:shadow-indigo-100 active:scale-95 sm:flex-none"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* LEFT COLUMN: Profile Summary Card */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center">

                {/* Profile Image Section */}
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Clickable Image Container */}
                  <div
                    className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-2xl ring-4 ring-slate-50 transition-all hover:ring-indigo-100 shadow-md"
                    onClick={() => fileRef.current?.click()}
                  >
                    <img
                      src={user?.user_image ? `http://localhost:5008${user.user_image}` : "/default-avatar.png"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt="Profile"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <FaCamera className="mb-1 h-6 w-6 text-white" />
                      <span className="text-[10px] font-bold text-white uppercase">Change</span>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
                </div>

                {/* Content */}
                <div className="mt-6 flex flex-col items-center text-center">
                  <span className="mb-2 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    {role}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {data.first_name} {data.last_name}
                  </h2>
                  <p className="text-sm font-medium text-slate-500">{data.email}</p>

                  {/* Upload Trigger (Text version) */}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                  >
                    Upload New Image
                  </button>

                  {/* Quick Actions */}
                  <div className="mt-8 w-full space-y-2 border-t border-slate-100 pt-6">
                    <button
                      onClick={() => { setOpen(true); setIsOpen(false); }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-xs font-bold text-slate-600 transition-all hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <FaKey className="text-[10px]" />
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modals */}
          <ChangePasswordModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={updatePassword}
          />
        </div>
      </div>
    </div>
  )
}

export default Settings
