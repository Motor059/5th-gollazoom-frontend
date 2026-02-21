import React, { useEffect, useState } from 'react';
import { X, Cloud, CloudRain, CloudSnow, Sun, Umbrella, Thermometer } from 'lucide-react';
import { getWeatherDetail } from '../../api/weather';

interface ForecastItem {
  time: string;
  tmp: number;
  pop: number;
  pty: number;
  sky: number;
}

interface WeatherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WeatherDetailModal = ({ isOpen, onClose }: WeatherDetailModalProps) => {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getWeatherDetail();
      if (res) {
        setTodayDate(res.date);
        setForecasts(res.forecasts || []);
      }
    } catch (error) {
      console.error("날씨 상세 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getWeatherIcon = (pty: number, sky: number) => {
    if (pty > 0) {
      if (pty === 1 || pty === 4) return <CloudRain size={20} className="text-blue-500" />;
      if (pty === 3) return <CloudSnow size={20} className="text-blue-300" />;
      return <Umbrella size={20} className="text-purple-500" />;
    }
    if (sky === 1) return <Sun size={20} className="text-orange-500" />;
    if (sky >= 3) return <Cloud size={20} className="text-gray-500" />;
    return <Sun size={20} className="text-orange-500" />;
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr.length < 4) return timeStr;
    return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative max-h-[80vh] flex flex-col">
        
        {/* 헤더 */}
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center shrink-0">
          <div>
            <span className="text-xs font-bold text-blue-500">{todayDate}</span>
            <h3 className="text-lg font-bold text-gray-900">시간별 상세 날씨</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-blue-100 transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          {loading ? (
            <div className="flex justify-center py-10 text-gray-400">오늘의 날씨 정보 불러오는 중...</div>
          ) : (
            <div className="space-y-3">
              {forecasts.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {/* 시간 */}
                  <span className="font-bold text-gray-700 w-12">{formatTime(item.time)}</span>
                  
                  {/* 강수확률 */}
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    {getWeatherIcon(item.pty, item.sky)}
                    {item.pop > 0 && (
                      <span className="text-xs font-bold text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">
                        {item.pop}%
                      </span>
                    )}
                  </div>

                  {/* 온도 */}
                  <div className="flex items-center gap-1 w-12 justify-end font-bold text-gray-900">
                    <Thermometer size={14} className="text-red-400" />
                    {item.tmp}°
                  </div>
                </div>
              ))}
              {forecasts.length === 0 && (
                <p className="text-center text-gray-400 py-4">예보 데이터가 없습니다.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WeatherDetailModal;