import api from './axios';
export interface ClothInput {
    image: File;
    category: string;
    season: string;
    color: string;
    isRaining: boolean;
    memo: string;
}

// 퀵등록에 대해 추가
export interface QuickClothRequest {
  category: string;
  season: string;
  color: string;
  memo?: string;
  imageUrl: "";       // 퀵등록은 빈 문자열
  subCategory: string;
  colorCode: string;
  isRaining: boolean;
}

// 수정 요청을 위한 인터페이스 추가
export interface UpdateClothRequest {
  category: string;
  season: string;
  color: string;
  memo?: string;
  imageUrl: string; 
  subCategory: string;
  colorCode: string;
  isRaining: boolean;
}

export interface ClothParams {
    page?: number;
    size?: number;
    category?: string;
    season?: string;
}

// 옷 등록 (POST /api/closet), 퀵등록 대응 수정
export const addCloth = async (data: FormData | QuickClothRequest) => {
  const isFormData = data instanceof FormData;
  
  const response = await api.post('/api/closet', data, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

// 모든 옷 조회 (GET /api/closet)
export const getClothes = async (params?: ClothParams) => {
    const response = await api.get('/api/closet', {
        params: {
            page: 0,
            size: 20,
            ...params, // category, season 등의 필터가 들어오면 합침
        }
    });
    return response.data;
};

// 옷 상세 조회 (GET /api/closet/{clothId})
export const getClothDetail = async (clothId: string) => {
    const response = await api.get(`/api/closet/${clothId}`);
    return response.data;
};

// 옷 수정 (PATCH /api/closet/{clothId}), 퀵등록 대응 수정
export const updateCloth = async (clothId: string, data: FormData | UpdateClothRequest) => {
    const isFormData = data instanceof FormData;
  
    const response = await api.patch(`/api/closet/${clothId}`, data, {
        headers: {
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        },
    });
    return response.data;
};

// 옷 삭제 (DELETE /api/closet/{clothId})
export const deleteCloth = async (clothId: string) => {
    const response = await api.delete(`/api/closet/${clothId}`);
    return response.data;
};

// 옷 세탁 상태 다중 변경 (PATCH /api/closet/clothes/wash-status)
export const updateWashStatus = async (clothIds: number[], status: "WASHING" | "AVAILABLE") => {
  const response = await api.patch('/api/closet/clothes/wash-status', {
    clothIds: clothIds,
    washStatus: status
  });
  return response.data;
};