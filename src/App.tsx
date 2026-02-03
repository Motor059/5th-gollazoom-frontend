import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import UserInfo from './pages/Userinfo';
import ChangePw from './pages/Changepw';
import Home from './pages/Home';
import Worktime from './pages/Worktime';

import Closet from './pages/closet/Closet';
import AddClothes from './pages/closet/AddClothes';
import AllClothes from './pages/closet/AllClothes';
import CoordiSave from './pages/closet/CoordiSave';
import AllCoordi from './pages/closet/AllCoordi';
import CalendarPage from './pages/calendar/CalendarPage';
import ClosetLayout from './layouts/Closetlayout';
import QuickAdd from './components/addClothes/QuickAdd';
import UploadDetail from './components/addClothes/UploadDetail';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/change-password" element={<ChangePw />} />
      <Route path="/worktime" element={<Worktime />} />

      <Route element={<ClosetLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/userinfo" element={<UserInfo />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/closet" element={<Closet />} />
        {/* 추가 */}
        <Route path="/closet/quick-add" element={<QuickAdd />} />
         <Route path="/closet/add/detail" element={<UploadDetail />} />
        <Route path="/closet/all" element={<AllClothes />} />
        <Route path="/closet/add" element={<AddClothes />} />
        <Route path="/coordi/save" element={<CoordiSave />} />
        <Route path="/coordi/all" element={<AllCoordi />} />
      </Route>
    </Routes>
  );
}

export default App;