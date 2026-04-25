import React from "react";
import { VscChromeClose } from "react-icons/vsc";

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">
      <div className={`bg-white rounded-lg shadow-lg w-11/12 p-6 relative max-w-md`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-7 right-7 text-gray-500 hover:text-red-600 text-xl"
        >
          <VscChromeClose />
        </button>

        {/* Title */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {/* Modal Content */}
        <div>{children}</div>

        {/* Footer Buttons */}
        {footer && <div className="mt-6 flex justify-end space-x-2">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;