import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeNickname, getUserInfo } from '../../api/users';

const ChangeNickname = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [currentNickname, setCurrentNickname] = useState("");

  useEffect(() => {
    const fetchCurrentInfo = async () => {
      try {
        const data = await getUserInfo();
        if (data && data.nickname) {
          setCurrentNickname(data.nickname);
          setNickname(data.nickname);
        }
      } catch (error) {
        console.error("정보 로딩 실패", error);
      }
    };
    fetchCurrentInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      alert("변경할 닉네임을 입력해주세요.");
      return;
    }
    if (nickname === currentNickname) {
      alert("현재 닉네임과 동일합니다.");
      return;
    }

    try {
      await changeNickname(nickname);
      // 데이터 동기화로 새로운 닉네임 갱신
      localStorage.setItem('nickname', nickname);
      alert("닉네임이 성공적으로 변경되었습니다!");
      navigate('/userinfo');

    } catch (error) {
      console.error("닉네임 변경 실패:", error);
      alert("닉네임 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">닉네임 변경</h2>

        <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-500 mb-1">현재 닉네임</p>
          <p className="text-lg font-bold text-gray-800">{currentNickname || "로딩 중..."}</p>
        </div>
      
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">새로운 닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              placeholder="변경할 닉네임 입력"
              maxLength={10}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
          >
            변경 완료
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => navigate('/userinfo')} 
            className="text-gray-500 hover:text-gray-700 text-sm font-medium underline"
          >
            취소하고 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeNickname;