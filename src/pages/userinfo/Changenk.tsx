import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeNickname, getUserInfo } from '../../api/users';
import AlertModal from '../../components/modal/Alert';

const ChangeNickname = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [currentNickname, setCurrentNickname] = useState("");

  const [alertState, setAlertState] = useState({
      isOpen: false,
      message: "",
      type: "info" as "success" | "error" | "info",
      onConfirm: () => {} 
  });

  const showAlert = (message: string, type: "success" | "error" | "info" = "info", onConfirm?: () => void) => {
      setAlertState({ 
          isOpen: true, 
          message, 
          type, 
          onConfirm: onConfirm || (() => setAlertState(prev => ({ ...prev, isOpen: false })))
      });
  };

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
      showAlert("변경할 닉네임을 입력해주세요.", "error");
      return;
    }
    if (nickname === currentNickname) {
      showAlert("현재 닉네임과 동일합니다.", "error");
      return;
    }

    try {
      await changeNickname(nickname);
      localStorage.setItem('nickname', nickname);
      
      showAlert("닉네임이 성공적으로 변경되었습니다!", "success", () => {
          navigate('/userinfo');
      });

    } catch (error) {
      console.error("닉네임 변경 실패:", error);
      showAlert("닉네임 변경 중 오류가 발생했습니다.", "error");
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

      <AlertModal 
          isOpen={alertState.isOpen}
          onClose={alertState.onConfirm}
          message={alertState.message}
          type={alertState.type}
      />
    </div>
  );
};

export default ChangeNickname;