import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClothItem from './ClothItem';

// 인터페이스 이름을 'CoordiClothData'로 변경하여 충돌 피함.
interface CoordiClothData {
  slot: string;
  clothId: number;
  imageUrl: string;
  category: string;
  subCategory?: string; // 퀵등록 아이콘 대응을 위해 추가 추천
  color?: string;       // 퀵등록 아이콘 대응을 위해 추가 추천
  season: string;
  isRaining: boolean;
}

export interface CoordiData {
  presetId: string | number; 
  name: string; 
  items: CoordiClothData[]; 
}

interface CoordiDetailModalProps {
  data: CoordiData;
  onClose: () => void;
  onRefresh: () => void;
}

const CoordiDetailModal = ({ data, onClose, onRefresh }: CoordiDetailModalProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState(data.name);

  // 헬퍼 함수 수정: URL 문자열 대신 아이템 객체 자체를 찾음
  const getItemBySlot = (slot: string) => data.items.find(item => item.slot === slot);
 
  const handleDelete = async () => {
    if (!window.confirm("정말 이 코디를 삭제할까요?")) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://192.168.158.60:8080/api/presets/${data.presetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("코디가 성공적으로 삭제되었습니다.");
        onRefresh(); // 리스트 새로고침
        onClose();   // 모달 닫기
      } else {
        throw new Error('삭제 실패');
      }
    } catch (e) {
      console.error(e);
      alert("삭제에 실패했습니다.");
    }
  };

  // const handleUpdate = async () => {
  //   try {
  //     const token = localStorage.getItem('authToken');
  //     // [명세서 반영] PATCH 요청 시에는 서버가 요구하는 ID 값들만 골라서 보냅니다.
  //     const response = await fetch('/api/presets/${data.presetId}', {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         name: name,
  //         topClothId: getIdBySlot('TOP'),
  //         bottomClothId: getIdBySlot('BOTTOM'),
  //         dressClothId: getIdBySlot('DRESS'),
  //         outerClothId: getIdBySlot('OUTER')
  //       })
  //     });

  //     if (response.ok) {
  //       alert("코디 정보가 수정되었습니다.");
  //       onRefresh();
  //       onClose();
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     alert("수정 실패");
  //   }
  // };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100]">
      <div className="w-[90%] max-w-[400px] bg-white rounded-[20px] p-5 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-lg">코디 정보</h4>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>

        {/* 2*2 이미지 배치 UI */}
        <div className="grid grid-cols-2 gap-1 aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-200">
          {['TOP', 'BOTTOM', 'DRESS', 'OUTER'].map(slot => {
              const item = getItemBySlot(slot); // 수정된 헬퍼 함수 사용
              return (
                <div key={slot} className="bg-white">
                  {item ? (
                    // 이미지 태그 대신 ClothItem으로 교체
                    <ClothItem item={item} />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[10px] text-gray-300">
                      EMPTY
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm font-semibold text-gray-600">코디 이름</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={handleDelete} className="flex-1 p-3.5 text-red-500 border border-red-200 rounded-2xl font-bold hover:bg-red-50 transition-colors">
            삭제하기
          </button>
          <button 
            onClick={() => navigate(`/coordisave?edit=${data.presetId}`)} // 코디 저장 페이지로 이동
            className="flex-[1.5] p-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-md"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoordiDetailModal;