import React, { useState } from 'react';
import { WASHING_GUIDE_STEPS, type GuideStep } from '../../data/WashingGuideData';

interface WashingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WashingGuideModal: React.FC<WashingGuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < WASHING_GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const progress = ((currentStep + 1) / WASHING_GUIDE_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-1.5 bg-gray-200 w-full">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="p-6">
          <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-6 border-2 border-dashed border-gray-200">
            📸 이미지 준비 중 ({WASHING_GUIDE_STEPS[currentStep].title})
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {WASHING_GUIDE_STEPS[currentStep].title}
          </h2>
          <p className="text-gray-600 leading-relaxed min-h-[80px]">
            {WASHING_GUIDE_STEPS[currentStep].description}
          </p>

          <div className="flex justify-between mt-8 items-center">
            <button 
              onClick={prevStep}
              className={`text-gray-400 font-medium ${currentStep === 0 ? 'invisible' : 'visible'}`}
            >
              이전
            </button>
            
            <div className="flex space-x-1.5">
              {WASHING_GUIDE_STEPS.map((_: GuideStep, idx: number) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full ${idx === currentStep ? 'bg-blue-500' : 'bg-gray-200'}`}
                />
              ))}
            </div>

            <button 
              onClick={nextStep}
              className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors"
            >
              {currentStep === WASHING_GUIDE_STEPS.length - 1 ? '시작하기' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WashingGuideModal;