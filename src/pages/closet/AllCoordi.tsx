import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CoordiDetailModal, { type CoordiData } from '../../components/CoordiDetailModal'; // 새로 만든 모달 임포트

interface CoordiImages {
  TOP: string;
  BOTTOM: string;
  SHOES: string;
  OUTER: string;
}

interface ClothItem {
  slot: string;
  clothId: number;
  imageUrl: string;
}

interface Coordi {
  presetId: string; 
  name: string;
  items: ClothItem[]; // 배열 []로 선언해야 find를 씀
}

const AllCoordi = () => {
  const navigate = useNavigate();

  const [coordiList, setCoordiList] = useState<CoordiData[]>([]);
  const [selectedCoordi, setSelectedCoordi] = useState<CoordiData | null>(null);

  const fetchPresets = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/presets', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
    });

      if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');

      const data = await response.json();
      setCoordiList(data); 
      
    } catch (e) {
      console.error("API 연결 에러:", e);
    }
  }, []);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  return (
    <div className="p-5 flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/closet')} className="text-xl">←</button>
        <h2 className="text-xl font-bold">나의 코디북</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 overflow-y-auto">
        {coordiList.map((coordi) => (
          <div key={coordi.presetId}
            onClick={() => setSelectedCoordi(coordi)} 
            className="flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform">
            {/* 코디 이미지 2*2 미리보기 영역 */}
            <div 
              className="bg-gray-50 rounded-2xl p-2 border border-gray-100 shadow-sm active:scale-95 transition-transform cursor-pointer aspect-square grid grid-cols-2 gap-0.5 overflow-hidden"
            >
              {["TOP", "BOTTOM", "DRESS", "OUTER"].map(slot => {
                const item = coordi.items.find((i: ClothItem) => i.slot === slot);
                return (
                  <div key={slot} className="bg-gray-200 rounded-sm overflow-hidden">
                    {item && <img src={item.imageUrl} className="w-full h-full object-cover" alt={slot} />}
                  </div>
                );
              })}
            </div>
            
            {/* 코디 이름 및 버튼 영역 */}
            <div className="px-1">
              <div className="text-sm font-bold text-gray-800 truncate mb-1">{coordi.name}</div>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/coordi?edit=${coordi.presetId}`)}
                  className="flex-1 py-1 text-[11px] bg-white border border-blue-200 text-blue-500 rounded-md"
                >
                  수정
                </button>
                <button 
                  onClick={() => {/* 삭제 로직 */}}
                  className="flex-1 py-1 text-[11px] bg-white border border-red-100 text-red-400 rounded-md"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCoordi && (
        <CoordiDetailModal 
          data={selectedCoordi} 
          onClose={() => setSelectedCoordi(null)} 
          onRefresh={fetchPresets} 
        />
      )}
    </div>
  );
};

export default AllCoordi;