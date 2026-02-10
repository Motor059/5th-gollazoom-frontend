// src/components/Guide/HelpIcon.tsx
import React, { useState } from 'react';
import WashingGuideModal from './WashingGuideModal';

const HelpIcon: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-6 h-6 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-sm hover:border-gray-400 hover:text-gray-500 transition-all"
      >
        ?
      </button>

      <WashingGuideModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default HelpIcon;