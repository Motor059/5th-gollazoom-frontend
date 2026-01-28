import React, { useEffect, useState } from 'react';
import { 
  format, addMonths, subMonths, 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  isSameMonth, isSameDay, addDays, isBefore, isToday 
} from 'date-fns';
import hanger from '../assets/icons/hanger.png';
import clothes from '../assets/icons/clothes.png';
// import { MOCK_CLOTHES } from '../mocks/mockData';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'detail' | 'create'| 'preset'>('detail');
  const [myPresets, setMyPresets] = useState<any[]>([]); // 코디 목록 저장용

  //서버 의상 목록을 저장할 상태 추가
  const [serverClothes, setServerClothes] = useState<any[]>([]);

  // 코디 작성을 위한 상세 선택 상태 관리
  const [tempSelectedItems, setTempSelectedItems] = useState<Record<string, {id: number, url: string} | null>>({
    TOP: null, BOTTOM: null, DRESS: null, OUTER: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingCategory, setSelectingCategory] = useState<string | null>(null);

  const [data, setData] = useState<Record<string, { 
    hasCoordi: boolean; 
    items: string[]; 
    wearId?: number // 서버에서 받은 고유 ID 저장용
  }>>({});

  // 착용 함수
  // const handleEditCoordi = () => {
  //   const dateKey = format(selectedDate, 'yyyy-MM-dd');
  //   const existingData = data[dateKey];

  //   if (existingData && existingData.items) {
  //     // 기존의 URL 배열을 순회하며 MOCK_CLOTHES에서 일치하는 객체(id, url)를 찾아 복구함
  //     const restoredItems: Record<string, {id: number, url: string} | null> = {
  //       TOP: null, BOTTOM: null, DRESS: null, OUTER: null
  //     };

  //     existingData.items.forEach(url => {
  //       const match = MOCK_CLOTHES.find(c => c.image === url);
  //       if (match) {
  //         restoredItems[match.category] = { id: match.id, url: match.image };
  //       }
  //     });

  //     setTempSelectedItems(restoredItems);
  //     setViewMode('create');
  //   }
  // };

  // 새로운 코디 만들기 함수
  const handleSaveCoordi = async () => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const existingWearId = data[dateKey]?.wearId; // 기존 기록 ID 확인

    const clothIds = Object.values(tempSelectedItems)
      .filter(item => item !== null)
      .map(item => item!.id); // 숫자 ID만 추출

    if (clothIds.length === 0) {
      alert("최소 한 개 이상의 의상을 선택해야 합니다!");
      return;
    }

    try {
      // ID가 있으면 PATCH /api/wears/{wearId}, 없으면 POST /api/wears
      const url = existingWearId ? `/api/wears/${existingWearId}` : '/api/wears';
      const method = existingWearId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: dateKey,
          clothIds: clothIds // 바뀔 옷 리스트
        })
      });

      const result = await response.json();
      
      if (result.success) { // "success": true 응답 확인
        alert(existingWearId ? "코디가 수정되었습니다!" : "코디가 저장되었습니다!");
        
        // 화면에 즉시 반영하기 위해 로컬 상태도 업데이트
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        setData(prev => ({
          ...prev,
          [dateKey]: {
            hasCoordi: true,
            // 상세 화면에서도 이미지를 보여줘야 하므로 url들만 저장
            items: Object.values(tempSelectedItems).map(item => item?.url || "")
          }
        }));
        
        setTempSelectedItems({ TOP: null, BOTTOM: null, DRESS: null, OUTER: null });
        setViewMode('detail');
      }
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
    }
  };

  // 저장된 코디에서 불러오기 함수
  const fetchMyPresets = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://192.168.158.60:8080/api/presets', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setMyPresets(data);
    setViewMode('preset'); // 화면을 코디북 선택 창으로 전환
  } catch (e) {
    alert("코디북을 불러오지 못했습니다.");
  }
};

// 저장 로직 분기 함수
const handleFinalRegister = async (presetId?: number) => {
  const token = localStorage.getItem('authToken');
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  // 1번(presetId가 있을 때)과 2번(없을 때, 개별 ID 추출) 구분
  const body = presetId 
    ? { presetId, date: dateStr } 
    : { 
        topClothId: String(tempSelectedItems.TOP?.id || ""),
        bottomClothId: String(tempSelectedItems.BOTTOM?.id || ""),
        dressClothId: String(tempSelectedItems.DRESS?.id || ""),
        outerClothId: String(tempSelectedItems.OUTER?.id || ""),
        date: dateStr 
      };

  try {
    const response = await fetch('http://192.168.158.60:8080/api/wears', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      alert("착용 등록 완료!");
      setViewMode('detail');
      fetchSelectedDateData(selectedDate); // 캘린더 갱신
    }
  } catch (e) {
    console.error("등록 실패:", e);
  }
};

  // 날짜 선택 시 호출될 조회 함수
  const fetchSelectedDateData = async (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    try {
      const token = localStorage.getItem('authToken'); // 키 이름 authToken으로 확인 필요!
      const response = await fetch(`http://192.168.158.60:8080/api/wears?date=${dateKey}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (result && result.clothIds) {
        // [핵심 수정] MOCK_CLOTHES 대신 서버에서 받아온 serverClothes를 사용합니다.
        const coordiImages = result.clothIds.map((id: number) => {
          const found = serverClothes.find(c => c.clothId === id);
          return found ? found.imageUrl : "";
        });

        setData(prev => ({
          ...prev,
          [dateKey]: {
            hasCoordi: true,
            wearId: result.wearId,
            items: coordiImages // 찾은 이미지 URL 리스트
          }
        }));
      } else {
        setData(prev => ({
          ...prev,
          [dateKey]: { hasCoordi: false, items: [] }
        }));
      }
    } catch (error) {
      console.error("조회 실패:", error);
    }
  };

  // 삭제 함수
  const handleDeleteCoordi = async () => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const wearId = data[dateKey]?.wearId;

    if (!wearId) return;

    if (window.confirm("정말 이 착용 기록을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`/api/wears/${wearId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        // 삭제 성공 시 204 No Content 응답 확인
        if (response.status === 204) {
          alert("삭제되었습니다.");
          setData(prev => {
            const newData = { ...prev };
            newData[dateKey] = { hasCoordi: false, items: [] };
            return newData;
          });
        }
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
      }
    }
  };

  useEffect(() => {
    // 월이 바뀌면 이전 달의 아이콘들을 화면에서 지워줍니다.
    setData({});
    fetchSelectedDateData(startOfMonth(currentMonth));
  }, [currentMonth]);

  useEffect(() => {
    const fetchAllClothes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://192.168.158.60:8080/api/clothes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        // 서버 응답 구조가 { items: [...] } 인지 확인 후 저장
        setServerClothes(resData.items || resData); 
      } catch (e) {
        console.error("의상 로드 실패:", e);
      }
    };
    fetchAllClothes();
  }, []);

  const renderDetailSection = () => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const dayData = data[dateKey];
    const isPast = isBefore(selectedDate, new Date()) && !isToday(selectedDate);

    // --- [작성 모드]: CoordiSave.tsx의 로직과 유사 ---
    if (viewMode === 'create') {
      return (
        <div className="p-6 bg-white rounded-t-3xl shadow-lg flex-grow animate-slideUp">
          <div className="flex items-center mb-8">
            <button onClick={() => setViewMode('detail')} className="mr-4 text-xl">←</button>
            <h2 className="text-xl font-bold">코디 저장하기</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-12 max-w-[320px] mx-auto">
            {[
              { key: 'TOP', label: '상의' }, { key: 'BOTTOM', label: '하의' },
              { key: 'DRESS', label: '원피스' }, { key: 'OUTER', label: '아우터' }
            ].map((slot) => (
              <div 
                key={slot.key} 
                onClick={() => {
                  setSelectingCategory(slot.key);
                  setIsModalOpen(true);
                }}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-[#F8FAFC] cursor-pointer"
              >
                {tempSelectedItems[slot.key] ? (
                  <img src={tempSelectedItems[slot.key]!.url} className="w-full h-full object-cover rounded-[28px]" alt={slot.label} />
                ) : (
                  <>
                    <img src={clothes} className="w-10 h-10 mb-2 opacity-30 object-contain" alt="아이콘" />
                    <span className="text-xs text-gray-400 font-medium">{slot.label}</span>
                  </>
                )}
              </div>
            ))}
          </div>

          <button 
            className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition"
            onClick={handleSaveCoordi}
          >
            이 코디 저장하기
          </button>
        </div>
      );
    }

    if (viewMode === 'preset') {
      return(
        <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm text-gray-500">불러올 코디를 선택하세요</h4>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {myPresets.map(preset => (
                <div 
                  key={preset.presetId} 
                  onClick={() => handleFinalRegister(preset.presetId)}
                  className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all"
                >
                  <div className="grid grid-cols-2 gap-0.5 aspect-square rounded-xl overflow-hidden mb-2">
                    {preset.items.slice(0, 4).map((item: any, i: number) => (
                      <img key={i} src={item.imageUrl} className="w-full h-full object-cover" alt="p" />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold text-center truncate">{preset.name}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setViewMode('create')} className="text-gray-400 text-sm mt-2">뒤로가기</button>
          </div>
      )
    }

    // --- [상세 모드] ---
    return (
      <div className="p-6 bg-white rounded-t-3xl shadow-lg flex-grow">
        <h2 className="text-2xl font-bold mb-6">{format(selectedDate, 'M월 d일')}</h2>

        {dayData?.hasCoordi ? (
          /* 1. 코디가 있는 날 */
          <div className={`grid gap-3 w-full max-w-[300px] mx-auto animate-fadeIn ${
            dayData.items.filter(item => item !== "").length > 1 ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
            {dayData.items.map((item, idx) => (
              item !== "" && (
                <div key={idx} className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                  <img src={item} className="w-full h-full object-cover" alt="코디템" />
                </div>
              )
            ))}

            {/* 오늘을 포함한 미래 날짜에만 수정 버튼 노출 */}
            {!isPast && (
              <div className="flex flex-col gap-2 w-full">
                <button 
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold active:scale-95 transition"
                  onClick={() => handleFinalRegister()}
                >
                  입을 코디 수정하기
                </button>
                <button 
                  className="w-full py-2 text-red-500 text-sm font-medium active:opacity-50 transition"
                  onClick={handleDeleteCoordi} // 삭제 함수 연결
                >
                  기록 삭제하기
                </button>
              </div>
            )}
          </div>
        ) : isPast ? (
          /* 2. 과거인데 코디가 없는 날*/
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <img src={hanger} alt="코디 없음" className="w-24 h-24 mb-4 opacity-30 object-contain" />
            <p className="text-lg font-medium tracking-tight text-gray-300">저장된 코디가 없습니다</p>
          </div>
        ) : (
          /* 3. 오늘/미래인데 코디가 없는 날 */
          <div className="flex flex-col gap-3">
            <button className="w-full py-4 bg-gray-100 rounded-xl font-bold text-gray-700 active:bg-gray-200 transition"
            onClick={fetchMyPresets}>
              저장된 코디에서 선택하기
            </button>
            <button 
              className="w-full py-4 bg-black text-white rounded-xl font-bold active:bg-gray-800 transition"
              onClick={() => setViewMode('create')}
            >
              새로운 코디 만들기
            </button>
          </div>
        )}
      </div>
    );
  };

  // --- 모달 창: CoordiSave.tsx와 유사 ---
  const renderModal = () => (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-end justify-center">
      <div className="w-full max-w-[430px] bg-white rounded-t-[40px] p-8 h-[60vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <strong className="text-lg font-bold">{selectingCategory} 선택</strong>
          <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3">
          {serverClothes
            .filter(item => item.category === selectingCategory)
            .map((item) => (
              <div 
                key={item.clothId}
                onClick={() => {
                  setTempSelectedItems(prev => ({ 
                    ...prev, 
                    [item.category]: { id: item.clothId, url: item.imageUrl } // 이 부분이 핵심!
                  }));
                  setIsModalOpen(false);
                }}
                className="aspect-square rounded-xl overflow-hidden border cursor-pointer active:scale-95"
              >
                <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2">&lt;</button>
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500">{format(currentMonth, 'yyyy')}</span>
        <span className="text-xl font-bold">{format(currentMonth, 'M월')}</span>
      </div>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2">&gt;</button>
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);
        const isSelected = isSameDay(cloneDay, selectedDate);
        const dateKey = format(cloneDay, 'yyyy-MM-dd');
        const hasData = data[dateKey]?.hasCoordi;

        days.push(
          <div 
            key={cloneDay.toString()} 
            className={`h-24 border-t border-l flex flex-col items-center justify-start cursor-pointer transition-all
              ${!isCurrentMonth ? 'bg-gray-50 text-gray-300' : 'bg-white'} 
              ${isSelected ? 'ring-2 ring-inset ring-blue-500 bg-blue-50' : ''}`}
            onClick={() => {
              setSelectedDate(cloneDay);
              fetchSelectedDateData(cloneDay);
            }}
          >
            <span className={`text-xs mt-1 ${isToday(cloneDay) ? 'bg-blue-500 text-white rounded-full px-1' : ''}`}>
              {format(cloneDay, 'd')}
            </span>
            <div className="mt-2 text-2xl">
              {hasData ? '👕' : '✕'}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="border-r border-b">{rows}</div>;
  };

  

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
      {renderHeader()}
      {renderCells()}
      {renderDetailSection()}
      {isModalOpen && renderModal()}
    </div>
  );
};

export default Calendar;