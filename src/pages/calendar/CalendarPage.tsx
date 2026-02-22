import Calendar from '../../components/Calendar/Calendar';
import HelpIcon from '../../components/guide/HelpIcon'; // 아이콘 추가

const CalendarPage = () => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-xl font-bold">코디 캘린더</h1>
        <HelpIcon />
      </div>
      <Calendar />
    </div>
  );
};

export default CalendarPage;