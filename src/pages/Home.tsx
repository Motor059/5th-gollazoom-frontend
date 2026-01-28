import React, { useState, useEffect } from 'react';
import { Sun, Sparkles, CloudRain, AlertCircle } from 'lucide-react';
import api from '../api/axios';

interface RecommendationSet {
  type: string;
  score: number;
  warnings: string[];
  clothIds: number[]; 
}
interface RecommendationResponse {
  date: string;
  isRaining: boolean;
  temperature: number;
  recommendations: RecommendationSet[];
}

interface ClothDetail {
  clothId: number;
  imageUrl: string;
  category: string;
  memo?: string; 
}

interface DisplayData {
  weather: { temp: number; isRaining: boolean };
  items: {
    outer?: ClothDetail;
    top?: ClothDetail;
    bottom?: ClothDetail;
  };
  comment: string;
  isWarning: boolean;
}

const Home: React.FC = () => {
  const [data, setData] = useState<DisplayData | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await api.get<RecommendationResponse>('/api/wears/recommend');
        console.log("response 데이터:", response.data);
        const resData = response.data;

        if (resData && resData.recommendations && resData.recommendations.length > 0) {
          
          const bestSet = resData.recommendations[0]; 

          if (!bestSet.clothIds || bestSet.clothIds.length === 0) {
             console.log("추천된 옷 ID가 없습니다.");
             return;
          }

          const detailPromises = bestSet.clothIds.map(async (id) => {
            try {
              const detailRes = await api.get(`/api/closet/${id}`);
              
              // 응답 안전 처리
              if (detailRes.data && detailRes.data.data) {
                return detailRes.data.data as ClothDetail;
              } else if (detailRes.data) {
                return detailRes.data as ClothDetail;
              }
              return null;
            } catch (err) {
              console.error(`옷 정보 로딩 실패 (ID: ${id})`, err);
              return null;
            }
          });

          const clothDetails = (await Promise.all(detailPromises)).filter((item): item is ClothDetail => item !== null);
          console.log("2차 응답(상세정보):", clothDetails);

          // 카테고리별 분류
          const outer = clothDetails.find(item => item.category?.toUpperCase() === 'OUTER');
          
          const top = clothDetails.find(item => {
             const cat = item.category?.toUpperCase();
             return cat === 'TOP' || cat === 'DRESS' || cat === 'ONEPIECE';
          });
          
          const bottom = clothDetails.find(item => item.category?.toUpperCase() === 'BOTTOM');

          // 코멘트 설정
          let comment = "맑은 날씨에 적합한 조합입니다";
          let isWarning = false;

          if (bestSet.warnings && bestSet.warnings.length > 0) {
            comment = bestSet.warnings[0];
            isWarning = true;
          } else if (resData.isRaining) {
            comment = "비가 오니 젖어도 괜찮은 옷을 추천해요 ☔️";
          }

          // 최종 데이터 세팅
          setData({
            weather: { temp: resData.temperature, isRaining: resData.isRaining },
            items: { outer, top, bottom },
            comment,
            isWarning
          });
        } else {
            console.log("추천 데이터가 비어있습니다.");
        }
      } catch (error) {
        console.error("전체 로딩 실패:", error);
      }
    };

    fetchRecommendation();
  }, []);

  if (!data) return <div className="min-h-screen flex justify-center items-center">로딩 중...</div>;

  const PLACEHOLDER_IMG = "https://via.placeholder.com/300?text=No+Image";

  return (
    <div className="flex flex-col gap-2 p-4 bg-white min-h-screen pb-24">
      {/* 헤더 */}
      <header className="flex justify-between items-end pt-1">
        <div>
          <p className="text-xs font-bold text-gray-500 mb-0.5">오늘의 날씨</p>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">오늘의 추천 스타일</h1>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
           {data.weather.isRaining ? <CloudRain size={18} className="text-blue-500"/> : <Sun className="text-yellow-500 fill-yellow-500" size={18} />}
          <span className="text-sm font-bold text-gray-800">{data.weather.temp}°C</span>
        </div>
      </header>

      {/* 추천 스타일 */}
      <section className='flex flex-col gap-3'>
        <div className="grid grid-cols-2 gap-3 w-full h-[420px]">
          
          {/* 아우터 */}
          <div className="col-span-1 h-full relative rounded-2xl overflow-hidden shadow-sm bg-gray-100 group">
            {data.items.outer ? (
                <>
                <img src={data.items.outer.imageUrl || PLACEHOLDER_IMG} alt="Outer" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-medium opacity-90 block mb-0.5">아우터</span>
                    <p className="text-sm font-bold">{data.items.outer.memo || "아우터"}</p>
                </div>
                </>
            ) : <div className="flex items-center justify-center h-full text-xs text-gray-400">아우터 없음</div>}
          </div>

          <div className="col-span-1 flex flex-col gap-3 h-full">
            {/* 상의 */}
            <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm bg-gray-100">
               {data.items.top ? (
                <>
                <img src={data.items.top.imageUrl || PLACEHOLDER_IMG} alt="Top" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-medium opacity-90 block">
                        {data.items.top.category === 'DRESS' ? '원피스' : '상의'}
                    </span>
                    <p className="text-sm font-bold truncate">{data.items.top.memo || "상의"}</p>
                </div>
                </>
               ) : <div className="flex items-center justify-center h-full text-xs text-gray-400">상의 없음</div>}
            </div>

            {/* 하의 */}
            <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm bg-gray-100">
                {data.items.bottom ? (
                <>
                <img src={data.items.bottom.imageUrl || PLACEHOLDER_IMG} alt="Bottom" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-medium opacity-90 block">하의</span>
                    <p className="text-sm font-bold truncate">{data.items.bottom.memo || "하의"}</p>
                </div>
                </>
                ) : <div className="flex items-center justify-center h-full text-xs text-gray-400">하의 없음</div>}
            </div>
          </div>
        </div>
        
        {/* 코멘트 */}
        <div className={`border rounded-xl p-2.5 flex items-center justify-center gap-2 shadow-sm ${
            data.isWarning ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-blue-50 border-blue-100 text-blue-600'
        }`}>
          {data.isWarning ? <AlertCircle size={14} /> : <Sparkles size={14} />}
          <span className="text-xs font-bold">{data.comment}</span>
        </div>
      </section>
      
      {/* 이번 주 통계 */}
      <section className="border border-gray-100 rounded-[20px] p-5 shadow-sm mt-auto">
         <h3 className="text-base font-bold text-gray-900 mb-2">이번 주 통계</h3>
         <div className="text-center text-sm text-gray-400 py-4">데이터 준비 중...</div>
      </section>
    </div>
  );
};

export default Home;