import React, { useEffect, useState } from 'react';
import { Clock, X, Loader2, CheckCircle2 } from 'lucide-react'; 
import api from '../../api/axios';
import { registerDailyWear } from '../../api/wears';

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
  onRegisterSuccess: () => void;
}

const UrgentModal = ({ isOpen, onClose, workTime, onRegisterSuccess }: UrgentModalProps) => {
  const [items, setItems] = useState<ClothDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [recommendedIds, setRecommendedIds] = useState<number[]>([]);

  // 모달이 열릴 때마다 추천 데이터 부름
  useEffect(() => {
    if (isOpen) {
      fetchUrgentRecommendation();
      
      // 음성 안내
      if ('speechSynthesis' in window) {
        const text = `출근 30분 전입니다! 오늘의 긴급 추천 코디를 확인해주세요.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [isOpen]);

  const fetchUrgentRecommendation = async () => {
    setLoading(true);
    try {
      const res = await api.get<RecommendationResponse>('/api/wears/recommend');
      const bestSet = res.data.data?.recommendations?.[0];

      if (bestSet && bestSet.clothIds) {
        setRecommendedIds(bestSet.clothIds);
        
        const detailPromises = bestSet.clothIds.map(async (id) => {
          try {
            const detailRes = await api.get(`/api/closet/${id}`);
            if (detailRes.data?.data) return detailRes.data.data;
            if (detailRes.data) return detailRes.data;
            return null;
          } catch { 
            return null; 
          }
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

  const handleRegister = async () => {
    if (recommendedIds.length === 0) return;
    setIsRegistering(true);
    try {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      await registerDailyWear(todayStr, recommendedIds);
      onRegisterSuccess();
      onClose();
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isOpen) return null;

  const outer = items.find(i => i.category?.toUpperCase() === 'OUTER');
  const top = items.find(i => ['TOP', 'DRESS'].includes(i.category?.toUpperCase() || ''));
  const bottom = items.find(i => i.category?.toUpperCase() === 'BOTTOM');

  const PLACEHOLDER = "https://via.placeholder.com/150?text=No+Item";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-white/80 hover:text-white z-10"><X size={24} /></button>

        <div className="bg-blue-600 p-5 pt-8 text-center text-white relative">
          <div className="flex justify-center items-center gap-2 mb-1">
            <Clock className="animate-pulse" size={20}/>
            <span className="font-bold text-lg opacity-90">{workTime} 출근 임박</span>
          </div>
          <h2 className="text-2xl font-extrabold leading-tight">오늘의 긴급 추천</h2>
        </div>

        <div className="p-5 bg-gray-50 min-h-[300px]">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <p className="text-sm font-medium">최적의 조합을 찾는 중...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* 아우터 */}
              {outer && (
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <img src={outer.imageUrl || PLACEHOLDER} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                  <div>
                    <span className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full">Outer</span>
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
        
        <div className="p-4 bg-white border-t border-gray-100">
          <button 
            onClick={handleRegister}
            disabled={loading || isRegistering}
            className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-black transition shadow-lg active:scale-[0.98] disabled:bg-gray-400"
          >
            {isRegistering ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
            {isRegistering ? "캘린더에 등록 중..." : "이대로 등록하고 입기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrgentModal;