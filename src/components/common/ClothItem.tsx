import { COLOR_OPTIONS } from '../../data/constants';

interface ClothItemProps {
  item: {
    imageUrl: string;  
    category?: string;     
    subCategory?: string;  
    color?: string;        
  };
  className?: string;      
}

const ClothItem = ({ item, className = "w-full h-full" }: ClothItemProps) => {
  // 1. 퀵등록 여부 판단
  const isQuickAdd = item.imageUrl?.includes('quickupload');

  if (isQuickAdd) {
    // 2. 퀵등록인 경우 URL에서 정보 추출하기
    
    // 1. URL에서 정보 파싱 (보험용)
    // URL 예시: http://quickupload/TOP/T_SHIRT/#DDDDDD
    const urlParts = item.imageUrl!.split('/');
    const urlCategory = urlParts[urlParts.length - 3];
    const urlSubCategory = urlParts[urlParts.length - 2];
    const urlColorCode = urlParts[urlParts.length - 1];

    // 2. 데이터 우선순위 결정: 직접 넘어온 값(item.category)이 있으면 쓰고, 없으면 URL에서 파싱한 값을 씁니다.
    const finalCategory = item.category || urlCategory;
    const finalSubCategory = item.subCategory || urlSubCategory;

    // 3. 색상 결정: COLOR_OPTIONS 매핑 우선 -> URL 내 색상코드 -> 기본값 순서
    const colorOption = COLOR_OPTIONS.find(opt => opt.value === item.color);
    const finalColor = colorOption?.hex || urlColorCode || '#F3F4F6';
    
    // 아이콘 경로 생성
    const iconUrl = new URL(
      `../../assets/icons/${finalCategory}/${finalSubCategory}.png`,
      import.meta.url
    ).href;

    return (
      <div className={`relative ${className}`}>
        {item.color === 'WHITE' && (
          <div 
            className="absolute inset-0 scale-[1.05]"
            style={{
              backgroundColor: '#E5E7EB',
              maskImage: `url(${iconUrl})`,
              WebkitMaskImage: `url(${iconUrl})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
          />
        )}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: finalColor,
            maskImage: `url(${iconUrl})`,
            WebkitMaskImage: `url(${iconUrl})`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
          }}
        />
      </div>
    );
  }

  // 3. 일반 사진인 경우
  return (
    <img 
      src={item.imageUrl} 
      className={`object-cover ${className}`} 
      alt="의상" 
      onError={(e) => {
        // 이미지 로드 실패 시 대체 이미지 처리 로직 추가 가능
        e.currentTarget.src = '/path/to/default-image.png';
      }}
    />
  );
};

export default ClothItem;