import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import album from '../../assets/icons/album.png';
import camera from '../../assets/icons/camera.png';
import quick from '../../assets/icons/quick.png';
// import { COLOR_OPTIONS, SEASON_OPTIONS, CATEGORY_OPTIONS, type Option } from '../../data/constants';
// import { addCloth } from '../../api/closet';

const AddClothes = () => {
  const navigate = useNavigate();
  
  const albumRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      navigate('/closet/add/detail', { state: { file } });
      console.log("파일 선택됨:", file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      <div className="flex items-center gap-3 p-6 border-b sticky top-0 bg-white z-10">
        <button onClick={() => navigate('/closet')} className="text-2xl">←</button>
        <h3 className="text-xl font-bold">의상 등록하기</h3>
      </div>

      {/* 선택 영역 */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        <p className="text-gray-400 text-sm font-medium mb-2">등록 방법을 선택해주세요</p>

        {/* 옵션 1: 앨범에서 선택 */}
        <div 
          onClick={() => albumRef.current?.click()} 
          className="h-[140px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
        >
          <img src={album} className="w-10 h-10 mb-2 opacity-40 object-contain" alt="앨범" />
          <span className="text-gray-600 font-bold text-sm">앨범에서 선택</span>
        </div>

        {/* 옵션 2: 직접 촬영하기 */}
        <div 
          onClick={() => cameraRef.current?.click()} 
          className="h-[140px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
        >
          <img src={camera} className="w-10 h-10 mb-2 opacity-40 object-contain" alt="카메라" />
          <span className="text-gray-600 font-bold text-sm">직접 촬영하기</span>
        </div>

        {/* 옵션 3: 퀵등록 (기본 의상) */}
        <div 
          onClick={() => navigate('/closet/quick-add')} 
          className="h-[140px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
        >
          <img src={quick} className="w-10 h-10 mb-2 opacity-40 object-contain" alt="퀵등록" />
          <span className="text-gray-600 font-bold text-lg">퀵등록</span>
          <span className="text-gray-400 text-sm font-medium">아이콘으로 빠르게 등록</span>
        </div>
      </div>

      <input type="file" ref={albumRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <input type="file" ref={cameraRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
    </div>
  );
};

export default AddClothes;