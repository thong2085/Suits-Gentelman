import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-6xl h-3/4 flex flex-col">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-xl font-bold">
            &times;
          </button>
        </div>
        <div className="flex-grow overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
