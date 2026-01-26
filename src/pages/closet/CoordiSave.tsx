import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clothes from '../../assets/icons/clothes.png';
import { CATEGORY_OPTIONS, TAG_OPTIONS, SEASON_OPTIONS, type Option } from '../../data/constants';
// import { MOCK_CLOTHES } from '../../mocks/mockData';

interface ClothItem {
  id: string | number; 
  imageUrl: string;
}

interface SelectedItems {
  [key: string]: ClothItem | null;
  TOP: ClothItem | null;
  BOTTOM: ClothItem | null;
  DRESS: ClothItem | null;
  OUTER: ClothItem | null;
}

const CoordiSave = () => {
  const navigate = useNavigate();
  const [coordiName, setCoordiName] = useState('');
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({ 
    TOP: null, 
    BOTTOM: null, 
    DRESS: null, 
    OUTER: null 
  });
  const [serverClothes, setServerClothes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectingCategory, setSelectingCategory] = useState<Option | null>(null);
  // const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]); // 중복 선택을 가능하게 하는 배열
  // const [rainOk, setRainOk] = useState(true);
  // const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
  const fetchClothes = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://192.168.158.60:8080/api/clothes', { // 실제 의상 API 주소 확인 필요
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setServerClothes(data.items); // 받아온 의상들을 상태에 저장
      } catch (e) {
        console.error("의상 목록 로드 실패:", e);
      }
    };
    fetchClothes();
  }, []);

  const slots = [ // 신발 삭제 및 원피스 추가
    { key: 'TOP', label: '상의' }, { key: 'BOTTOM', label: '하의' },
    { key: 'DRESS', label: '원피스' }, { key: 'OUTER', label: '아우터' }
  ];

  // 계절 선택 토글 함수
  // const toggleSeason = (value: string) => {
  //   setSelectedSeasons(prev => 
  //     prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
  //   );
  // };

  const handleSaveCoordi = async () => {
    // selectedItems의 value들 중 null이 아닌 것이 하나라도 있는지 체크.
    const hasSelectedItems = Object.values(selectedItems).some(item => item !== null);

    if (!hasSelectedItems) {
      alert("적어도 하나의 의상은 선택해야 코디를 저장할 수 있습니다.");
      return;
    }

    if (!coordiName.trim()) {
      alert("코디 이름을 입력해주세요.");
      return;
    }

    // 계절 선택 여부 확인 (최소 하나)
    // if (selectedSeasons.length === 0) {
    //   alert("적정 계절을 선택해주세요.");
    //   return;
    // }

    // if (!selectedTag) {
    //   alert("코디 태그를 선택해주세요!");
    //   return;
    // }

    const token = localStorage.getItem('authToken');
    const editId = new URLSearchParams(window.location.search).get('edit'); // 수정 모드 확인

    // 명세서 기반 데이터 구조 생성
  const coordiData = {
    name: coordiName,
    topClothId: String(selectedItems.TOP?.id || ""), 
    bottomClothId: String(selectedItems.BOTTOM?.id || ""),
    dressClothId: String(selectedItems.DRESS?.id || ""),
    outerClothId: String(selectedItems.OUTER?.id || "")
  };

    try {
      const url = editId ? `http://192.168.158.60:8080/api/presets/${editId}` : 'http://192.168.158.60:8080/api/presets';
      const response = await fetch(url, {
      method: editId ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(coordiData)
      }
    );

    if (response.ok) {
      alert(editId ? "코디가 수정되었습니다." : "새 코디가 저장되었습니다.");
      navigate('/closet'); 
    }
  } catch (e) {
    console.error("저장 중 에러 발생:", e);
  }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center gap-3 p-6 border-b bg-white z-10">
        <button onClick={() => navigate('/closet')} className="text-2xl">←</button>
        <h2 className="text-xl font-bold">코디 저장하기</h2>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center">
        {/* 코디 이름 입력 필드 추가 */}
        <div className="w-full max-w-[320px]">
          <label className="block text-sm font-bold text-gray-500 mb-2">코디 이름</label>
          <input 
            type="text"
            value={coordiName}
            onChange={(e) => setCoordiName(e.target.value)}
            placeholder="코디 이름을 적어주세요 (예: 데이트룩)"
            className="w-full p-4 border border-gray-200 rounded-[20px] bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
          {slots.map((slot) => (
            <div 
              key={slot.key} 
              onClick={() => {
                const category = CATEGORY_OPTIONS.find(o => o.value === slot.key) || null;
                setSelectingCategory(category);
                setIsModalOpen(true);
              }}
              className="w-full aspect-square border-2 border-dashed border-gray-200 rounded-[30px] flex flex-col items-center justify-center bg-[#F8FAFC] cursor-pointer active:bg-gray-100"
            >
              {selectedItems[slot.key] ? (
                <img 
                  src={selectedItems[slot.key]?.imageUrl} 
                  className="w-full h-full object-cover rounded-[28px]" 
                  alt={slot.label} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img src={clothes} className="w-10 h-10 mb-2 opacity-30 object-contain" alt="아이콘" />
                  <span className="text-xs font-bold text-gray-400">{slot.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>

      {/* <div className="flex flex-col gap-6 w-full border-t pt-6">
        // 계절 중복 선택
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-3">적정 계절 (중복 선택 가능)</label>
          <div className="flex flex-wrap gap-2">
            {SEASON_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleSeason(opt.value)}
                className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                    selectedSeasons.includes(opt.value)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
          </div>
        </div>

        // 비 올 때 여부 (라디오 버튼)
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-3">비 올 때 입어도 되나요?</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input type="radio" checked={rainOk === true} onChange={() => setRainOk(true)} className="w-5 h-5" /> 예
            </label>
            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input type="radio" checked={rainOk === false} onChange={() => setRainOk(false)} className="w-5 h-5" /> 아니오
            </label>
          </div>
        </div>

        // 태그 선택
        <div className="px-6 py-4">
          <label className="block text-sm font-bold text-gray-500 mb-2">코디 태그 선택</label>
          <div className="relative">
            <select 
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-[15px] bg-gray-50 appearance-none outline-none font-medium text-gray-700"
            >
              <option value="" disabled>태그 선택</option>
              {TAG_OPTIONS.map((tag) => (
                <option key={tag.value} value={tag.value}>
                  {tag.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </div>
          </div>
        </div>
      </div>
    </div> */}

    <div className="p-6">
      <button onClick={handleSaveCoordi} className="w-full p-5 bg-[#007AFF] text-white rounded-[20px] font-bold text-lg shadow-lg">
        이 코디 저장하기
      </button>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black/50 z-[2000] flex items-end justify-center">
        <div className="w-full max-w-[430px] bg-white rounded-t-[40px] p-8 h-[60vh] flex flex-col shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <strong className="text-lg font-bold">{selectingCategory ? selectingCategory.label : '아이템'} 선택</strong>
            <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400">✕</button>
          </div>
            
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-3 gap-3">
              {serverClothes
                .filter(item => item.category === selectingCategory?.value) // 선택한 카테고리 옷만 필터링
                .map((item) => (
                  <div 
                    key={item.clothId}
                    onClick={() => {
                      setSelectedItems(prev => ({ 
                        ...prev, 
                        [item.category]: { id: item.clothId, imageUrl: item.imageUrl } 
                      }))
                      setIsModalOpen(false); // 선택 후 모달 닫기
                    }}
                    className="aspect-square rounded-xl overflow-hidden border border-gray-100 cursor-pointer active:scale-95"
                  >
                    <img src={item.imageUrl} className="w-full h-full object-cover" alt="clothes" />
                  </div>
                ))}
              {/* 해당 카테고리에 옷이 없을 때 */}
              {serverClothes.filter(item => item.category === selectingCategory?.value).length === 0 && (
                <p className="col-span-3 text-center text-gray-400 py-10">아이템이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
    </div>
  );
};

export default CoordiSave;