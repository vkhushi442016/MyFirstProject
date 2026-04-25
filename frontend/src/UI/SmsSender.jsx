import React, { useState } from "react";
import axios from "axios";

const SmsSender = () => {
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const sendSms = async () => {
        console.log("🔥 SMS BUTTON CLICKED");
        setSuccess("");
        setError("");

        // ✅ validation
        if (!role || !status || !message) {
            setError("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post("http://localhost:5008/api/send/sms", {
                role_id: role,
                status,
                message
            });

              // ✅ HANDLE BOTH CASES PROPERLY
        if (res.data.success) {
            setSuccess(`Message sent to ${res.data.sentTo} users`);
            setError("");
        } else {
            setError(res.data.message);
            setSuccess("");
        }

            setSuccess(`Message sent to ${res.data.sentTo} users`);

        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    📩 SMS Broadcast Panel
                </h2>

                {/* Role */}
                <label className="text-sm font-semibold text-gray-600">
                    Select Role
                </label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="">-- Choose Role --</option>
                    <option value="r1">Admin</option>
                    <option value="r2">Principal</option>
                    <option value="r3">Teacher</option>
                </select>

                {/* Status */}
                <label className="text-sm font-semibold text-gray-600 mt-4 block">
                    Select Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="">-- Choose Status --</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

                {/* Message */}
                <label className="text-sm font-semibold text-gray-600 mt-4 block">
                    Message
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full mt-2 p-3 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                {/* Button */}
                <button
                    onClick={sendSms}
                    disabled={loading}
                    className={`w-full mt-5 p-3 rounded-lg text-white font-semibold transition duration-200 ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {loading ? "Sending..." : "Send SMS"}
                </button>

                {/* Success */}
                {success && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                        ✅ {success}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        ❌ {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmsSender;