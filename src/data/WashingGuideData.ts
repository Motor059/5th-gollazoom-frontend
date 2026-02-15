export interface GuideStep {
  id: number;
  title: string;
  description: string;
  image: string;
}

export const WASHING_GUIDE_STEPS = [
  {
    id: 1,
    title: "세탁 기능이란?",
    description: "본 기능은 '세탁 기능을 사용하기' 옵션을 선택하신 유저에게만 제공되는 내용입니다. 골라Zoom은 사용자가 입은 옷을 잊지 않고 관리할 수 있도록 세탁 상태를 추적합니다.",
    image: "/images/guide/guide_intro.png" // 나중에 스크린샷 넣을 자리, 여기엔 뭘 넣을지 고민중임
  },
  {
    id: 2,
    title: "어떻게 세탁하나요?",
    description: "매일 홈 화면의 '오늘의 코디 세탁' 팝업에서 [예]를 누르면 간편하게 세탁 중으로 바뀝니다.",
    image: "/images/guide/guide_auto.png" // 홈 화면의 팝업 스크린샷
  },
  {
    id: 3,
    title: "옷장 페이지에서 수동으로 등록하기",
    description: "[옷장 > 모든 의상] 페이지 우측 상단의 빨래통 아이콘을 누른 뒤, 세탁할 옷들을 선택해 보세요.",
    image: "/images/guide/guide_manual.png" // 옷장 페이지에서 빨래통 아이콘 스크린샷 (gif 가능하면 빨래통 - 세탁할 옷 선택하는 움짤)
  },
  {
    id: 4,
    title: "캘린더 페이지에서 세탁 중인 옷은 어떻게 보이나요?",
    description: "캘린더 페이지에서 세탁 중인 옷은 빨간 테두리와 함께 '세탁 중...' 문구가 표시되며 리스트 최하단으로 밀려납니다.",
    image: "/images/guide/guide_calendar.png" // 캘린더 내 세탁 중 아이콘
  },
  {
    id: 5,
    title: "프리셋 코디 선택시 코디 제약",
    description: "세탁 중인 옷이 하나라도 포함된 코디를 선택하면 확인 알림 팝업이 발생합니다.",
    image: "/images/guide/guide_preset.png" // 프리셋 선택 시 뜨는 경고 팝업 스크린샷
  },
  {
    id: 6,
    title: "다시 입으려면 어떻게 하나요?",
    description: "세탁이 완료되었다면, 옷장에서 '세탁 중' 표시가 된 옷을 다시 클릭하세요. 즉시 '착용 가능' 상태로 복귀합니다.",
    image: "/images/guide/guide_done.png" // (고민중, gif 가능하면 세탁중인 옷 클릭하는 움짤)
  }
];