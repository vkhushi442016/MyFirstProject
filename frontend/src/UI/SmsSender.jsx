import React, { useState, useEffect } from "react";
import axios from "axios";

// Environment-safe API endpoint (falls back to local dev)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5008";

const SmsSender = ({ isOpen, onClose }) => {
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // SMS Standard logic: 160 chars = 1 segment
    const charCount = message.length;
    const smsSegments = charCount > 0 ? Math.ceil(charCount / 160) : 0;

    const handleReset = () => {
        setRole("");
        setStatus("");
        setMessage("");
        setSuccess("");
        setError("");
    };

    const sendSms = async () => {
        setSuccess("");
        setError("");

        if (!role || !status || !message.trim()) {
            setError("All fields are required before broadcasting.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(`${API_BASE_URL}/api/send/sms`, {
                role_id: role,
                status,
                message: message.trim()
            });

            if (res.data.success) {
                setSuccess(`Broadcast successful! Sent to ${res.data.sentTo || 0} users.`);
                // Reset inputs on successful broadcast
                setRole("");
                setStatus("");
                setMessage("");
            } else {
                setError(res.data.message || "Failed to initiate broadcast.");
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Network error. Please check your connection."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300"
            onClick={onClose}
        >
            {/* Modal Box */}
            <div
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the card
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Close modal"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">
                        SMS Broadcast Portal
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Target users by role and status to send instant text alerts.
                    </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    {/* Role Selection */}
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                            Target Audience (Role)
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800"
                        >
                            <option value="">-- Choose Role --</option>
                            <option value="r1">Admin</option>
                            <option value="r2">Principal</option>
                            <option value="r3">Teacher</option>
                        </select>
                    </div>

                    {/* Status Selection */}
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">
                            User Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800"
                        >
                            <option value="">-- Choose Status --</option>
                            <option value="Active">Active Only</option>
                            <option value="Inactive">Inactive Only</option>
                        </select>
                    </div>

                    {/* Message Input */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                                Message Content
                            </label>
                            {charCount > 0 && (
                                <span className={`text-[11px] font-medium ${charCount > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                                    {charCount} chars ({smsSegments} {smsSegments === 1 ? 'segment' : 'segments'})
                                </span>
                            )}
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Keep it brief, clear, and actionable..."
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-28 resize-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm"
                        />
                    </div>
                </div>

                {/* Notifications Panel */}
                {(success || error) && (
                    <div className="mt-4 space-y-2">
                        {success && (
                            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-sm font-medium">
                                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{success}</span>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-sm font-medium">
                                <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Action */}
                <button
                    onClick={sendSms}
                    disabled={loading}
                    className={`w-full mt-6 p-3.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg hover:shadow-indigo-500/10 focus:ring-2 focus:ring-indigo-500/50 outline-none ${loading
                        ? "bg-slate-300 cursor-not-allowed shadow-none text-slate-500"
                        : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Dispatching queue...
                        </span>
                    ) : (
                        "Send Broadcast"
                    )}
                </button>
            </div>
        </div>
    );
};

export default SmsSender;