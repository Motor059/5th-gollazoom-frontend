import React from 'react';

interface DailyWashModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DailyWashModal: React.FC<DailyWashModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-fade-in-up">        
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🧺</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">오늘 입은 옷 세탁하기</h3>
          <p className="text-sm text-gray-500">
            오늘 캘린더에 등록된 의상들을<br/> 세탁 중 상태로 변경하시겠습니까?
          </p>
        </div>

        {/* 버튼 부분 */}
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
          >
            아니오
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition shadow-md"
          >
            예
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default DailyWashModal;