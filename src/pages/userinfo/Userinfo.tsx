import { deleteUser, getUserInfo } from "../../api/users";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const UserInfo = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        nickname: "",
        worktime: "",
        //savedTime: "" 시간 남으면 구현
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
            } catch (error) {
                console.error("내 정보 로딩 실패:", error);
            }
        };
        fetchUserInfo();
    }, []);

    {/* 로그아웃 추가 */}
    const handleLogout = () => {
        localStorage.clear(); 
        alert("로그아웃 되었습니다.");
        navigate("/login"); 
    };

    const handleDelete = async () => {
        if (!window.confirm("정말로 회원탈퇴를 진행하시겠습니까?")) return;
        try {
            await deleteUser();
            localStorage.clear();
            alert("회원탈퇴가 완료되었습니다.");
            navigate("/login");
        } catch (error) {
            console.error("Delete user failed:", error);
            alert("회원탈퇴에 실패하였습니다. 다시 시도해주세요.");
        }
    };
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* 상단 헤더 영역 */}
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white text-center">내 정보 (My Page)</h2>
        </div>

        {/* 정보 표시 영역 */}
        <div className="p-8 space-y-6">
          
          {/* 아이디 */}
          <div className="border-b border-gray-100 pb-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              아이디
            </label>
            <div className="text-lg font-medium text-gray-800">
              {user?.username}
            </div>
          </div>

          {/* 닉네임 */}
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                닉네임
              </label>
              <div className="text-lg font-medium text-gray-800 tracking-widest">
                {user?.nickname}
              </div>
            </div>

            {/* 닉네임 변경 버튼 */}
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => navigate('/change-nickname')}
            >
              변경
            </button>
          </div>

          {/* 비밀번호 (마스킹 처리) */}
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                비밀번호
              </label>
              <div className="text-lg font-medium text-gray-800 tracking-widest">
                *******
              </div>
            </div>
            {/* 비밀번호 변경 버튼 */}
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => navigate('/change-password')}
            >
              변경
            </button>
          </div>

          {/* 출근 시간 */}
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                출근 시간
              </label>
              <div className="text-lg font-medium text-gray-800 tracking-widest">
                {user?.worktime}
              </div>
            </div>
            {/* 출근 시간 변경 버튼 */}
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => navigate('/change-worktime')}
            >
              변경
            </button>
          </div>

          {/* 닉네임 */}
          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                절약한 시간
              </label>
              <div className="text-lg font-medium text-gray-800 tracking-widest">
                {/*{user?.savedTime}*/}
              </div>
            </div>
            
            {/* 절약한 시간 확인 버튼 */}
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={() => alert('추후 구현 예정 기능입니다.')}
            >
              확인
            </button>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col gap-3">
          <button
            onClick={handleDelete}
            className="w-full py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition text-sm"
          >
            회원 탈퇴하기
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition text-sm"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserInfo;