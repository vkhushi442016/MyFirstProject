import React from 'react';
import { FaCamera, FaUser, FaBriefcase, FaEnvelope, FaTimes } from 'react-icons/fa';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import useStore from '../common/store/store';
import axios from 'axios';
import { useRef, useState, useEffect } from 'react';


const EditProfile = ({ isOpen, onClose }) => {
    const staff_id = useStore((state) => state.staff_id)
    const [user, setUser] = useState({
        user_image: "",
    });

    const fileRef = useRef();


    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);
        formData.append("staff_id", staff_id);

        const result = await axios.patch("http://localhost:5008/update-profile",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        )
        console.log(result.data)
       
        setUser((prev) => ({
            ...prev,
            user_image: result.data.user_image
        }));
    }
useEffect(() => {
  console.log("USER UPDATED:", user);
  console.log("USER IMAGE:", user?.user_image);
}, [user]);

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-800">Account Settings</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
                    >
                        <FaTimes className="h-4 w-4" />
                    </button>
                </div>

                <form className="p-6">
                    {/* Avatar Section */}
                    <div className="mb-8 flex items-center gap-6">
                        <div>
                            {/* Hidden input */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            {/* Clickable image */}
                            <div
                                className="group relative h-24 w-24 cursor-pointer"
                                onClick={() => fileRef.current?.click()}
                            >
                                <img
                                    src={
                                        user?.user_image
                                            ? `http://localhost:5008${user.user_image}`
                                            : "/default-avatar.png"
                                    }
                                    alt="Profile"
                                    className="h-full w-full rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm"
                                />

                                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <FaCamera className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-700">Profile Picture</h4>
                            <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                            <button type="button" className="text-xs font-bold text-purple-600 underline underline-offset-4 hover:text-purple-700">
                                Upload new image
                            </button>
                        </div>
                    </div>

                    {/* Form Grid */}
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Role</label>
                                <div className="relative">
                                    <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                                        placeholder="UX Designer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                <input
                                    type="email"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/30 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                                    placeholder="john@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Bio</label>
                            <textarea
                                rows="3"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/30 p-3 text-sm outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                                placeholder="Brief description for your profile..."
                            ></textarea>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <HiOutlineInformationCircle className="text-lg" />
                        <span className="text-xs font-medium">Auto-saves to cloud</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                        >
                            Cancel
                        </button>
                        <button className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95">
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
