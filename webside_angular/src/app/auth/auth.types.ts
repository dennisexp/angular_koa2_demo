// auth/auth.types.ts
export interface LoginRequest {
    phone: string;
    password: string;
    timestamp: number
  }
  
export interface LoginResponse {
  token: string;
  userInfo: {
    uid: string;
    phone: string;
    username: string;
    role: string[];
  };
}

// 注册相关接口
export interface RegisterRequest {
  phone: string;
  password: string;
  username: string;
}

export interface RegisterResponse {
  token: string;
  userInfo: {
    uid: string;
    phone: string;
    username: string;
    role: string[];
  };
}
  
  // 添加错误响应接口
export interface ApiErrorResponse {
  code: number;
  message: string;
}

// 修改 ApiResponse 接口，使其支持可能为空的 data
export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;  // 使用可选属性，因为错误响应可能没有 data
}