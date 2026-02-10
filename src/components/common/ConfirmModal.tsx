import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;      // '아니오' 또는 닫기
  onConfirm: () => void;    // '예' (강행)
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
      <div className="bg-white w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl animate-scaleIn">
        <div className="p-6 text-center">
          {/* 경고 아이콘 */}
          <div className="text-3xl mb-4">⚠️</div>
          
          <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        <div className="flex border-t border-gray-100">
          <button 
            onClick={onConfirm}
            className="flex-1 py-4 text-red-500 font-bold hover:bg-red-50 transition-colors"
          >
            예
          </button>
          
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 border-r border-gray-100 transition-colors"
          >
            아니오
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;