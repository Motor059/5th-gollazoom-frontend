import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, X, Loader2 } from 'lucide-react'; 
import api from '../../api/axios';

interface RecommendationResponse {
  data: {
    recommendations: { clothIds: number[] }[];
  };
}

interface ClothDetail {
  clothId: number;
  imageUrl: string;
  category: string;
  memo?: string;
}

interface UrgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  workTime: string;
}

const UrgentModal = ({ isOpen, onClose, workTime }: UrgentModalProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ClothDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달이 열릴 때마다 추천 데이터 부름
  useEffect(() => {
    if (isOpen) {
      fetchUrgentRecommendation();
    }
  }, [isOpen]);

  const fetchUrgentRecommendation = async () => {
    setLoading(true);
    try {
      const res = await api.get<RecommendationResponse>('/api/wears/recommend');
      const bestSet = res.data.data?.recommendations?.[0]; // 1순위 추천

      if (bestSet && bestSet.clothIds) {
        const detailPromises = bestSet.clothIds.map(async (id) => {
          try {
            const detailRes = await api.get(`/api/closet/${id}`);
            if (detailRes.data?.data) return detailRes.data.data;
            if (detailRes.data) return detailRes.data;
            return null;
          } catch { return null; }
        });

        const details = (await Promise.all(detailPromises)).filter((item): item is ClothDetail => item !== null);
        setItems(details);
      }
    } catch (error) {
      console.error("긴급 추천 로딩 실패", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const outer = items.find(i => i.category === 'OUTER');
  const top = items.find(i => ['TOP', 'DRESS'].includes(i.category));
  const bottom = items.find(i => i.category === 'BOTTOM');

  const PLACEHOLDER = "https://via.placeholder.com/150?text=No+Item";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-3 right-3 text-white/80 hover:text-white z-10">
          <X size={24} />
        </button>

        {/* 헤더 */}
        <div className="bg-red-600 p-5 pt-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="flex justify-center items-center gap-2 mb-1">
            <Clock className="animate-pulse" size={20}/>
            <span className="font-bold text-lg opacity-90">{workTime} 출근 임박!</span>
          </div>
          <h2 className="text-2xl font-extrabold leading-tight">오늘의 긴급 추천 🚨</h2>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="p-5 bg-gray-50 min-h-[300px]">
          
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Loader2 className="animate-spin text-red-500" size={40} />
              <p className="text-sm font-medium">최적의 조합을 찾는 중...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* 아우터 */}
              {outer && (
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <img src={outer.imageUrl || PLACEHOLDER} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                  <div>
                    <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">Outer</span>
                    <p className="font-bold text-gray-800 mt-1">{outer.memo || "아우터"}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {/* 상의 */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                   <div className="w-full aspect-square rounded-lg bg-gray-100 overflow-hidden">
                     <img src={top?.imageUrl || PLACEHOLDER} className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <span className="text-[10px] text-gray-500 font-bold block">Top</span>
                     <p className="text-sm font-bold text-gray-800 truncate px-1">{top?.memo || "상의"}</p>
                   </div>
                </div>

                {/* 하의 */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                   <div className="w-full aspect-square rounded-lg bg-gray-100 overflow-hidden">
                     <img src={bottom?.imageUrl || PLACEHOLDER} className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <span className="text-[10px] text-gray-500 font-bold block">Bottom</span>
                     <p className="text-sm font-bold text-gray-800 truncate px-1">{bottom?.memo || "하의"}</p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 bg-white border-t border-gray-100">
          <button 
            onClick={() => {
                navigate('/');
                onClose();
            }}
            className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition shadow-lg active:scale-[0.98]"
          >
            이대로 입고 출근하기 👉
          </button>
        </div>

      </div>
    </div>
  );
};

export default UrgentModal;