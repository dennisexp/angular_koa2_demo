// src/app/shared/types/api-response.type.ts
export interface ApiErrorResponse {
    code: number;
    message: string;
  }
  
  export interface ApiResponse<T> {
    code: number;
    message: string;
    data?: T;
  }
  
  export interface PaginatedResponse<T> {
    code: number;
    message: string;
    data?: {
      list: T[];
      total: number;
      page: number;
      limit: number;
    };
  }