// src/app/shared/types/invoice.type.ts
import { InvoiceForm, InvoiceItem } from '../interfaces/invoice.interface';
import { PaginatedResponse } from "./api-response.type";

  // 发票基础信息接口
  export interface InvoiceSubmitRequest {
    invoiceType: string;           // 发票类型
    invoiceNumber?: string;        // 发票号码（草稿时可能没有）
    buyerName: string;            // 购买方名称
    buyerIdNumber: string;         // 购买方税号
    sellerName: string;           // 销售方名称
    sellerIdNumber: string;      // 销售方税号
    issueDate?: string;             // 开具日期
    remark?: string;             // 备注
    items: Omit<InvoiceItem, 'id'>[];
  }
  
  // 提交发票请求接口
  // export interface InvoiceSubmitRequest extends InvoiceSubmitRequest {
  //   items: InvoiceItem[];
  // }
  
  // 发票草稿请求接口
  export interface InvoiceDraftRequest extends InvoiceSubmitRequest {
    items: InvoiceItem[];
    draftId?: string;           // 草稿ID，更新草稿时使用
  }
  
  // 发票预览请求接口
  export interface InvoicePreviewRequest extends InvoiceSubmitRequest {
    items: InvoiceItem[];
  }
  
  // 发票列表查询参数接口
  export interface InvoiceListParams {
    page: number;
    limit: number;
    status?: 'draft' | 'issued' | 'void';
    startDate?: Date;
    endDate?: Date;
    keyword?: string;
  }

    // API 响应类型
  export interface InvoiceResponse extends InvoiceForm {}
  
  // 发票预览响应接口
  export interface InvoicePreviewResponse extends InvoiceForm {
    previewUrl?: string;                  // 预览URL
    totalAmountInChinese: string;           // 合计金额大写
  }

  export interface InvoicePreviewResponse extends InvoiceForm {
    previewUrl?: string;
    totalAmountInWords: string;
  }

  export type InvoiceListResponse = PaginatedResponse<InvoiceForm>;

  // 发票列表响应接口
  // export interface InvoiceListResponse extends PaginatedResponse<InvoiceResponse> {}

  
  