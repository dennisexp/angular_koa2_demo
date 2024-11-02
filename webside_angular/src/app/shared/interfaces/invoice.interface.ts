// src/app/invoice-issue/invoice.interface.ts
export interface InvoiceItem {
  // index: number;
  itemName: string;
  specModel: string;
  meaUnit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  comTaxAm: number;
  }
  
export interface InvoiceForm {
  invoiceId?: string;
  //发票头部信息
  invoiceType: {code: string, name: string},//发票类型：general,普通发票; special, 专用发票
  invoiceNumber: string,//发票号码
  issueDate: string,//开票日期
  taxBureau: {code: string, name: string},//税务结局:代码, 名称
  
  // 购买方信息
  buyerName: string;
  buyerIdNumber: string;
  buyerAddress: string;
  buyerPhone: string;
  buyerBank: string;
  buyerBankAccount: string;
  
  // 销售方信息
  sellerName: string;
  sellerIdNumber: string;
  sellerAddress: string;
  sellerPhone: string;
  sellerBank: string;
  sellerBankAccount: string;

  // 商品明细
  taxSign: number; //含税标志,值域：0，不含税，1含税
  items: InvoiceItem[];

  //发票金额
  totalAmountWithoutTax: number;//不含税金额合计
  totalTaxAmount: number;//合计税额
  totalAmountWithTax:number;//含税金额合计
  totalAmountWithTaxInChinese: string;//含税金额合计大写
  // 备注信息
  remark: string;
  issPerName: string;    // 开票人
  payee: string;     // 收款人
  reviewer: string;  // 复核人
}