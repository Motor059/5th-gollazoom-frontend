import { useEffect, useRef } from 'react';
import { getUserInfo } from '../api/users';

export const useWorktimeAlert = (
    onTrigger: () => void, // 모달을 여는 함수
    setWorkTime: (time: string) => void // 출근 시간을 저장하는 함수
  ) => {
    // 알람 중복 방지 플래그
  const hasAlerted = useRef(false);

  useEffect(() => {
    // 출근 시간 가져오기
    const fetchWorkTime = async () => {
      try {
        const data = await getUserInfo();
        if (data && data.worktime) {
          setWorkTime(data.worktime);
          startTimer(data.worktime);
        }
      } catch (error) {
        console.error("출근 시간 로딩 실패:", error);
      }
    };

    const startTimer = (workTimeStr: string) => {
      const intervalId = setInterval(() => {
        const now = new Date();
        
        // 오늘 날짜의 출근 시간 객체 생성
        const [hours, minutes] = workTimeStr.split(':').map(Number);
        const workDate = new Date();
        workDate.setHours(hours, minutes, 0, 0);

        // 출근 시간 - 30분 계산
        const alertTime = new Date(workDate.getTime() - 30 * 60 * 1000);

        // 08:30 ~ 09:00 사이에 알람 실행(예시)
        if (now >= alertTime && now < workDate) {
          
          // 오늘 이미 알람을 안 봤다면 실행
          const todayStr = now.toDateString();
          const lastAlertDate = localStorage.getItem('lastAlertDate');

          if (lastAlertDate !== todayStr && !hasAlerted.current) {
            hasAlerted.current = true; // 중복 실행 방지
            localStorage.setItem('lastAlertDate', todayStr); // 오늘 하루는 그만 보기
            onTrigger(); // 모달 열기
          }
        }
      }, 60000); // 1분마다 체크

      return () => clearInterval(intervalId);
    };

    fetchWorkTime();

  }, [onTrigger, setWorkTime]);
};

export default useWorktimeAlert;