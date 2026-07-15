import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Modal from "./Modal";

import { FaWhatsapp } from "react-icons/fa";
import { MdSms } from "react-icons/md";
import { FaRegPaperPlane } from "react-icons/fa6";

const NotificationModal = ({ type, onClose }) => {

    const [message, setMessage] = useState("");

    if (!type) return null;

    const sendNotification = async () => {

        try {

            const url =
                type === "whatsapp"
                    ? "http://localhost:5008/send-whatsapp"
                    : "http://localhost:5008/send-sms";

            await axios.post(url, {
                messageText: message,
            });

            toast.success(
                `${type.toUpperCase()} sent successfully`
            );

            setMessage("");

            onClose();

        } catch (error) {

            toast.error("Something went wrong.");

            console.log(error);

        }

    };

    return (

        <div>
            <Modal
                isOpen={true}
                onClose={() => {
                    setMessage("");
                    onClose();
                }}
                title={
                    <div className="flex items-center">

                        {type === "whatsapp" ? (
                            <FaWhatsapp className="text-green-600 text-3xl mr-2" />
                        ) : (
                            <MdSms className="text-blue-600 text-3xl mr-2" />
                        )}

                        <span>
                            Send {type === "whatsapp" ? "WhatsApp" : "SMS"}
                        </span>

                    </div>
                }
                footer={
                    <>
                        <button
                            className="px-4 py-2 bg-gray-300 rounded"
                            onClick={() => {
                                setMessage("");
                                onClose();
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded"
                            onClick={sendNotification}
                        >
                            Send
                            <FaRegPaperPlane />
                        </button>
                    </>
                }
            >

                <textarea
                    className="w-full p-3 border rounded resize-none outline-none"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />

            </Modal>


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
    );
};

export default NotificationModal;