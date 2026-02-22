import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Sparkles, CalendarX2, CloudRain, Snowflake, Loader2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { getDailyWear } from '../api/wears'; 
import { getUserInfo } from '../api/users'; 
import useDailyWash from '../hooks/Dailywash';
import DailyWashModal from '../components/modal/Dailywash';
import UrgentModal from '../components/modal/Urgentalert'; 
import { getWeatherSummary } from '../api/weather';
import WeatherDetailModal from '../components/modal/Weatherdetail';

interface ClothDetail {
  clothId: number;
  imageUrl: string;
  category: string;
  memo?: string; 
}
interface DisplayData {
  weather: { temp: number; isRaining: boolean };
  items: { outer?: ClothDetail; top?: ClothDetail; bottom?: ClothDetail; };
  comment: string;
  isWarning: boolean;
}

interface WeatherSummary {
  date: string;
  avgTemp: number;
  hasRainOrSnow: boolean;
}

// 날씨 상황에 맞는 코멘트를 생성
const generateWeatherComment = (temp: number, hasRainOrSnow: boolean) => {
  if (hasRainOrSnow) {
    if (temp <= 3) return "눈이 오는 추운 날씨예요! 빙판길 조심하세요 ❄️";
    return "비가 오는 날이에요! 외출 시 우산을 꼭 챙기세요 ☔️";
  }
  if (temp >= 28) return "햇볕이 뜨거운 날씨예요! 시원하게 입으세요 ☀️";
  if (temp >= 20) return "활동하기 딱 좋은 따뜻한 날씨예요! 🌼";
  if (temp >= 10) return "선선한 날씨예요. 가벼운 겉옷을 챙기면 좋아요 🍂";
  return "쌀쌀한 날씨예요! 감기 걸리지 않게 따뜻하게 입으세요 🧣";
};

const Home: React.FC = () => {
  const { isWashModalOpen, triggerWashPrompt, handleConfirmWash, handleCancelWash } = useDailyWash();

  const [data, setData] = useState<DisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [workTime, setWorkTime] = useState<string>("09:00"); 
  const [isUrgentOpen, setIsUrgentOpen] = useState(false);
  
  const [weather, setWeather] = useState<WeatherSummary | null>(null);
  const [isWeatherDetailOpen, setIsWeatherDetailOpen] = useState(false);

  const fetchTodayWear = useCallback(async () => {
    setLoading(true);
    try {
      const [userInfoRes, weatherRes] = await Promise.allSettled([
        getUserInfo(),
        getWeatherSummary()
      ]);

      let currentWorkTime = "09:00";
      let currentTemp = 18;
      let currentHasRain = false;
      
      if (userInfoRes.status === 'fulfilled' && userInfoRes.value?.worktime) {
        setWorkTime(userInfoRes.value.worktime);
        currentWorkTime = userInfoRes.value.worktime;
      }

      if (weatherRes.status === 'fulfilled' && weatherRes.value) {
        currentTemp = Number(weatherRes.value.avgTemp);
        currentHasRain = Boolean(weatherRes.value.hasRainOrSnow);
        
        setWeather({
          date: weatherRes.value.date,
          avgTemp: currentTemp,
          hasRainOrSnow: currentHasRain
        });
      }

      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const res = await getDailyWear(todayStr);
      const clothIds = res.data?.clothIds || [];

      if (clothIds.length > 0) {
        const detailPromises = clothIds.map(async (id: number) => {
          try {
            const detailRes = await api.get(`/api/closet/${id}`);
            return (detailRes.data?.data || detailRes.data) as ClothDetail;
          } catch { 
            if (id === 1) return { clothId: 1, category: 'OUTER', imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=60', memo: '네이비 울 코트' };
            if (id === 2) return { clothId: 2, category: 'TOP', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=60', memo: '화이트 옥스포드 셔츠' };
            if (id === 3) return { clothId: 3, category: 'BOTTOM', imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=60', memo: '베이지 와이드 슬랙스' };
            return null; 
          }
        });

        const clothDetails = (await Promise.all(detailPromises)).filter((item): item is ClothDetail => item !== null);
        const outer = clothDetails.find(item => item.category?.toUpperCase() === 'OUTER');
        const top = clothDetails.find(item => ['TOP', 'DRESS'].includes(item.category?.toUpperCase() || ''));
        const bottom = clothDetails.find(item => item.category?.toUpperCase() === 'BOTTOM');

        setData({
          weather: { temp: currentTemp, isRaining: currentHasRain },
          items: { outer, top, bottom },
          comment: generateWeatherComment(currentTemp, currentHasRain),
          isWarning: currentHasRain || currentTemp <= 3 
        });
        
        setIsUrgentOpen(false); 
      } else {
        setData(null);
        const [hours, minutes] = currentWorkTime.split(':').map(Number);
        const workDate = new Date();
        workDate.setHours(hours, minutes, 0, 0);
        const diffMins = Math.floor((workDate.getTime() - new Date().getTime()) / 60000);
        if (diffMins >= 0 && diffMins <= 30) {
          setIsUrgentOpen(true);
        }
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayWear();
  }, [fetchTodayWear]);

  const getSeasonText = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "봄 시즌";
    if (month >= 6 && month <= 8) return "여름 시즌";
    if (month >= 9 && month <= 11) return "가을 시즌";
    return "겨울 시즌";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center pb-24 gap-3">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-base font-medium text-gray-500">
          오늘의 의상 정보를 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 min-h-screen pb-24 relative overflow-hidden">
      <header className="flex justify-between items-end pt-1 shrink-0">
        <div>
          <p className="text-xs font-bold text-gray-500 mb-0.5">{getSeasonText()}</p>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">내가 고른 오늘의 스타일</h1>
        </div>
        
        <button 
          onClick={() => setIsWeatherDetailOpen(true)}
          className="flex items-center gap-2 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-100 hover:bg-gray-50 transition active:scale-95"
        >
          {weather?.hasRainOrSnow ? (
            weather.avgTemp <= 3 ? (
              <Snowflake className="text-blue-300" size={18} /> 
            ) : (
              <CloudRain className="text-blue-500" size={18} />
            )
          ) : (
            <Sun className="text-yellow-500 fill-yellow-500" size={18} />
          )}
          <span className="text-sm font-bold text-gray-800">
            {weather ? `${weather.avgTemp}°C` : '-'}
          </span>
        </button>
      </header>

      <section className='flex-1 overflow-y-auto pb-20'>
        {data ? (
          <div className="grid grid-cols-2 gap-3 w-full h-[520px]">
            <div className="col-span-1 h-full relative rounded-2xl overflow-hidden shadow-sm bg-white border group">
              {data.items.outer ? (
                  <><img src={data.items.outer.imageUrl} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div><div className="absolute bottom-3 left-3 text-white"><span className="text-[10px] font-medium opacity-90 block mb-0.5">아우터</span><p className="text-sm font-bold">{data.items.outer.memo || "아우터"}</p></div></>
              ) : <div className="flex items-center justify-center h-full text-xs text-gray-400">아우터 없음</div>}
            </div>
            <div className="col-span-1 flex flex-col gap-3 h-full">
              <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm bg-white border">
                  {data.items.top ? (
                  <><img src={data.items.top.imageUrl} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div><div className="absolute bottom-3 left-3 text-white"><span className="text-[10px] font-medium opacity-90 block">상의</span><p className="text-sm font-bold truncate">{data.items.top.memo || "상의"}</p></div></>
                  ) : <div className="flex items-center justify-center h-full text-xs text-gray-400">상의 없음</div>}
              </div>
              <div className="flex-1 relative rounded-2xl overflow-hidden shadow-sm bg-white border">
                  {data.items.bottom ? (
                  <><img src={data.items.bottom.imageUrl} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div><div className="absolute bottom-3 left-3 text-white"><span className="text-[10px] font-medium opacity-90 block">하의</span><p className="text-sm font-bold truncate">{data.items.bottom.memo || "하의"}</p></div></>
                  ) : <div className="flex items-center justify-center h-full text-xs text-gray-400">하의 없음</div>}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 border-dashed m-2 p-8 text-center text-gray-400 gap-4">
             <CalendarX2 size={48} strokeWidth={1} />
             <div>
               <p className="font-bold text-gray-600 mb-1">오늘 등록된 옷이 없습니다.</p>
               <p className="text-sm">캘린더에서 입을 옷을 미리 등록해보세요!</p>
             </div>
             <button onClick={() => setIsUrgentOpen(true)} className="text-xs text-blue-500 underline mt-2">지금 바로 추천받기</button>
          </div>
        )}
      </section>

      {data && (
        <div className="absolute bottom-24 left-4 right-4 flex flex-col gap-3">
          <div className="border border-blue-100 bg-blue-50/90 text-blue-600 rounded-xl p-3 flex items-center justify-center gap-2 shadow-sm backdrop-blur-sm">
            {data.isWarning ? <AlertCircle size={16} /> : <Sparkles size={16} />}
            <span className="text-sm font-bold">{data.comment}</span>
          </div>
          
          <button 
            onClick={() => triggerWashPrompt(false)}
            className="py-3.5 bg-gray-900 text-white text-sm font-bold rounded-2xl shadow-md hover:bg-black transition w-full"
          >
            🌙 오늘 일과 끝! 입은 옷 세탁하기
          </button>
        </div>
      )}

      {/* 모달 */}
      <DailyWashModal isOpen={isWashModalOpen} onConfirm={handleConfirmWash} onCancel={handleCancelWash} />
      <UrgentModal isOpen={isUrgentOpen} onClose={() => setIsUrgentOpen(false)} workTime={workTime} onRegisterSuccess={fetchTodayWear} />
      <WeatherDetailModal isOpen={isWeatherDetailOpen} onClose={() => setIsWeatherDetailOpen(false)} />
    </div>
  );
};

export default Home;