import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CoordiDetailModal, { type CoordiData } from '../../components/common/CoordiDetailModal'; // 새로 만든 모달 임포트
import ClothItem from '../../components/common/ClothItem';
import api from '../../api/axios';

interface CoordiImages {
  TOP: string;
  BOTTOM: string;
  SHOES: string;
  OUTER: string;
}

// 기존 이름에서 컴포넌트 이름이 겹쳐 수정
interface CoordiCloth {
  slot: string;
  clothId: string | number;
  imageUrl: string;
  // 퀵등록 아이콘 판단을 위해 category 등이 필요할 수 있음
  category: string; 
  subCategory?: string;
  color?: string;
}

// interface Coordi {
//   presetId: string; 
//   name: string;
//   items: CoordiCloth[]; // 배열 []로 선언해야 find를 씀
// }

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
      // 수정되지 않았다면 기존 fetch 로직이나 api.get(url)을 그대로 쓰되,
      // 만약 의상 API처럼 data.items 구조가 아니라면 바로 data를 넣음.
      setCoordiList(Array.isArray(data) ? data : []); 
      
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
                const item = coordi.items.find((i: CoordiCloth) => i.slot === slot);
                return (
                  <div key={slot} className="bg-gray-200 rounded-sm overflow-hidden">
                    {item ? (
                        // ClothItem으로 랜더링 수정.
                        <ClothItem item={item} />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
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