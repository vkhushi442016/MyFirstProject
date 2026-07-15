import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { FaWhatsapp } from "react-icons/fa";
import { FaRegPaperPlane } from "react-icons/fa6";

// Environment-safe API endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5008";

const WhatsappModal = ({ isOpen, onClose }) => {
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return; // Prevent closing while processing
    setMessageText("");
    onClose();
  };

  const whatsAppMessage = async () => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      toast.error("Please enter a message to broadcast.");
      return;
    }

    try {
      setLoading(true);
      
      await axios.post(`${API_BASE_URL}/send-whatsapp`, {
        messageText: trimmedMessage,
      });

      toast.success("Broadcast queued successfully!");
      handleClose();
    } catch (error) {
      console.error("WhatsApp Send Error:", error);
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      toast.error(serverMessage || "Failed to send WhatsApp broadcast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/10">
            <FaWhatsapp className="text-2xl" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 text-lg leading-tight">
              WhatsApp Broadcast
            </h3>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Notify school principals instantly
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={whatsAppMessage}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-700/20 active:scale-[0.98] transition-all duration-200 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : (
              <>
                Send Message
                <FaRegPaperPlane className="text-xs" />
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          Message Content
        </label>
        
        <div className="relative bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 p-3 rounded-2xl transition-all duration-200">
          <textarea
            rows={6}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={loading}
            placeholder="Type the message details you would like to send to school principals..."
            className="w-full bg-transparent outline-none resize-none text-slate-800 placeholder-slate-400 text-sm leading-relaxed disabled:cursor-not-allowed"
          />
          
          {/* Subtle formatting helper tip */}
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-400">
            <span>Use *text* for bold, _text_ for italics.</span>
            <span>{messageText.length} characters</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WhatsappModal;