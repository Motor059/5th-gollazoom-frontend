import React from 'react';
import Calendar from '../../components/Calendar/Calendar';

const CalendarPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">코디 캘린더</h1>
      <Calendar />
    </div>
  );
};

export default CalendarPage;