import { useNavigate } from 'react-router-dom';
import clothes from '../../assets/icons/clothes.png'; 
import allClothes from '../../assets/icons/all-clothes.png';
import coordi from '../../assets/icons/coordi.png';
import allCoordi from '../../assets/icons/all-coordi.png';

function Closet() {
  const navigate = useNavigate();
  const categories = [
    { id: 'add-clothes', name: '의상 등록하기', icon: clothes, path: '/closet/add' },
    { id: 'coordi-save', name: '코디 저장하기', icon: coordi, path: '/coordi/save' },
    { id: 'all-clothes', name: '모든 의상', icon: allClothes, path: '/closet/all' },
    { id: 'all-coordi', name: '모든 코디', icon: allCoordi, path: '/coordi/all' },
  ];

  return (
    <div className="flex flex-col gap-3 p-5">
      {categories.map((category) => (
        <button 
          key={category.id} 
          onClick={() => navigate(category.path)}
          className="flex items-center gap-[15px] px-5 py-[15px] bg-white border border-[#eee] rounded-[15px] shadow-sm active:bg-gray-50 transition-colors"
        >
          <img 
            src={category.icon} 
            alt={category.name} 
            style={{ width: '40px', height: '40px' }}
            className="w-10 h-10 object-contain" 
            /><span className="text-base font-medium text-[#333]">{category.name}</span>
        </button>
      ))}
    </div>
  );
}

export default Closet;