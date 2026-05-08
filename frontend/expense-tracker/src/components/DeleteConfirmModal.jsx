import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

/**
 * DeleteConfirmModal — Confirmation dialog before deleting a transaction
 * Props: isOpen, onClose, onConfirm, itemName
 */
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName = 'this item' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Confirmation" maxWidth="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#E0F2FE] flex items-center justify-center">
          <AlertTriangle size={26} className="text-[#1FB6D5]" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#111827]">
            Are you sure?
          </p>
          <p className="text-[13px] text-[#6B7280] mt-1">
            You&apos;re about to delete{' '}
            <span className="font-medium text-[#111827]">{itemName}</span>. This
            action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 w-full mt-1">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-[#6B7280] hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1FB6D5] to-[#169CB8] text-white text-[13px] font-semibold hover:opacity-90 transition-all duration-200 shadow-md shadow-cyan-200"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
