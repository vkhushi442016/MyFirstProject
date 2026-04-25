import { useState } from "react";
import { FiX, FiKey, FiUser } from "react-icons/fi";
import { MdLockOutline, MdLockReset } from "react-icons/md";
import useStore from "./common/store/store";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { VscCheckAll } from "react-icons/vsc";
import { PiEyeClosedBold } from "react-icons/pi";

export default function ChangePasswordModal({ isOpen, onClose, onSubmit }) {
  const username = useStore((state) => state.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);    //for showing and hiding password
  const [showNewPassword, setShowNewPassword] = useState(false);    //for showing and hiding password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);    //for showing and hiding password

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, oldPassword, newPassword, confirmPassword });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/30 backdrop-blur-md
             transition-opacity duration-300 ease-in-out"
    >
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <FiX size={20} />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <FiKey className="text-purple-600" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username is made readonly */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-100">
              <FiUser className="text-gray-400 mr-2" />
              <input
                type="text"
                value={username || ""}
                readOnly
                className="w-full outline-none bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Old Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Old Password</label>
            <div className="relative flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <MdLockOutline className="text-gray-400 mr-2" />

              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full outline-none"
                placeholder="Enter old password"
              />

              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute cursor-pointer right-3 flex items-center text-gray-500 hover:text-blue-600"
              >
                {showOldPassword ? <PiEyeClosedBold /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">New Password</label>
            <div className="relative flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <MdLockReset className="text-gray-400 mr-2" />

              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full outline-none"
                placeholder="Enter new password"
              />

              <button type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute cursor-pointer right-3 flex items-center text-gray-500 hover:text-blue-600"
              >
                {showNewPassword ? <PiEyeClosedBold /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            {/* Label */}
            <label className="block text-sm text-gray-600 mb-1">
              Confirm Password
            </label>

            {/* Input Container */}
            <div className="relative flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              {/* Left Icon */}
              <VscCheckAll className="text-gray-400 mr-2" />

              {/* Input Field */}
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full outline-none"
                placeholder="Confirm password"
              />

              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 flex items-center text-gray-500 hover:text-blue-600"
              >
                {showConfirmPassword ? <PiEyeClosedBold /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}