import { useState } from "react";
import { signup, checkUsername } from "../../api/users";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        nickname: "",
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await signup(formData);
            console.log("Signup successful:", data);
            localStorage.setItem('id', data.id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('nickname', data.nickname);
            navigate("/login", {state: {isNewUser: true}});
        } catch (error) {
            console.error("Signup failed:", error);
            alert("회원가입에 실패하였습니다. 다시 시도해주세요.");
        }
    }

    const handleUsernameCheck = async () => {
        try {
            const data = await checkUsername(formData.username);
            if (data && data.username) {
                alert("이미 사용 중인 아이디입니다.");
            } 
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
              alert("사용 가능한 아이디입니다.");
            } else {
             console.error("중복 확인 에러", error);
             alert("중복 확인 중 오류가 발생했습니다.");
            }        
        }
  }


    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">회원가입</h2>
        
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <div className="flex gap-2 mb-5">
              <input
                name="username"
                type="text"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="사용할 아이디"
                onChange={handleChange}
                
              />
              <button
              type="button"
              className="text-sm border border-gray-300 text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition"
              onClick={handleUsernameCheck}
              >
              중복확인
              </button>
              
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <div className="flex gap-4 mb-5">
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="사용할 비밀번호"
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input
                name="nickname"
                value={formData.nickname}
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="닉네임 (이름)"
                onChange={handleChange}
                maxLength={10}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200"
            >
              가입하기
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <span 
              onClick={() => navigate('/login')} 
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              로그인 하러가기
            </span>
          </div>
        </div>
      </div>
  );
}
export default SignupPage;