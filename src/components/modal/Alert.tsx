import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'error' | 'success' | 'info';
}

const AlertModal = ({ isOpen, onClose, title, message, type = 'info' }: AlertModalProps) => {
  if (!isOpen) return null;

  const iconConfig = {
    error: <AlertCircle className="text-red-500" size={48} strokeWidth={1.5} />,
    success: <CheckCircle2 className="text-blue-500" size={48} strokeWidth={1.5} />,
    info: <Info className="text-gray-500" size={48} strokeWidth={1.5} />
  };

  const defaultTitle = {
    error: '오류',
    success: '성공',
    info: '알림'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center transform transition-all scale-100">
        
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">
          {iconConfig[type]}
        </div>

        {/* 제목 & 내용 */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {title || defaultTitle[type]}
        </h3>
        <p className="text-sm text-gray-600 mb-6 break-keep leading-relaxed">
          {message}
        </p>

        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-md active:scale-[0.98]"
        >
          확인
        </button>

      </div>
    </div>
  );
};

export default AlertModal;