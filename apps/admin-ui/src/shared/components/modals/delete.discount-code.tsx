import React from 'react';
import { X } from 'lucide-react';

export const DeleteDiscountCodeModal = ({discountCode, onClose, onConfirm}: {discountCode: any; onClose: () => void; onConfirm?: any}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[450px]">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl font-semibold text-white">
            Delete Discount Code
          </h3>
          <button
            className="text-gray-400 hover:text-gray-300 transition"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-gray-300 mt-4">
          Are you sure you want to delete this discount code?
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-semibold"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}