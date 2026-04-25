import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Modal from './Modal';
import toast from 'react-hot-toast';
import { FaRegPaperPlane } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import SmsSender from './UI/SmsSender';

const PerformanceAnalytics = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const whatsAppMessage = async (messageText, setIsModalOpen) => {
    try {
      const response = await axios.post('http://localhost:5008/send-whatsapp', {
        messageText
      });
      //console.log("response: ", response)
      toast.success("Message sent successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.log("Error in sending whatsapp message: ", error)
    }
  }

  const sendSMS = async (messageText, setIsModalOpen) => {
    try {
      const response = await axios.post('http://localhost:5008/send-whatsapp', {
        messageText
      });
      //console.log("response: ", response)
      toast.success("Message sent successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.log("Error in sending whatsapp message: ", error)
    }
  }

  return (
    <>
      <div>
        <h1>Performance And Analytics</h1>

        <div className="h-15 w-20 cursor-pointer">
          <button onClick={() => setIsModalOpen(true)}>
            <img
              src="https://logos-world.net/wp-content/uploads/2020/05/Logo-WhatsApp.png"
              alt="WhatsApp"
            />
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setMessageText("")
          }}
          title={
            <div className='flex items-center'>
              <FaWhatsapp className='size-10 m-1 mr-2 p-1 text-white bg-purple-600 rounded-md' />
              <span>Notify To School Principals</span>
            </div>
          }
          footer={
            <>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setMessageText("")
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  whatsAppMessage(messageText, setIsModalOpen)
                  setMessageText("")
                }}
                className="flex px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >

                Send
                <FaRegPaperPlane className='m-1' />
              </button>
            </>
          }
        >
          <div className="bg-gray-100 p-4 rounded border-2 border-purple-600">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Enter your message..."
              className="w-full outline-none p-2 rounded"
            />
          </div>
        </Modal>
      </div>

      <SmsSender />
    </>
  );
}

export default PerformanceAnalytics
