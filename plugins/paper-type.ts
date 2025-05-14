// 纸张类型枚举
export enum PaperType {
  HALF = 101, // 二等分
  FULL = 102, // 一等分
  THIRD = 104, // 三等分
  A5 = 105, // A5
}

// 纸张配置接口
export interface PaperConfig {
  ptWidth: number;
  ptHeight: number;
  mmWidth: number;
  mmHeight: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  pageType: PaperType;
}

// 二等分纸张
export const halfPaper: PaperConfig = {
  ptWidth: 250.16,
  ptHeight: 371.85,
  mmWidth: 120,
  mmHeight: 140,
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 10,
  paddingBottom: 15,
  pageType: PaperType.HALF,
};

// 一等分纸张
export const fullPaper: PaperConfig = {
  ptWidth: 250.16,
  ptHeight: 768.7,
  mmWidth: 120,
  mmHeight: 280,
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 10,
  paddingBottom: 15,
  pageType: PaperType.FULL,
};

// 三等分纸张
export const thirdPaper: PaperConfig = {
  ptWidth: 700,
  ptHeight: 227,
  mmWidth: 280,
  mmHeight: 90,
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 13,
  paddingBottom: 15,
  pageType: PaperType.THIRD,
};

// A5纸张
export const a5Paper: PaperConfig = {
  ptWidth: 399.5,
  ptHeight: 568,
  mmWidth: 148,
  mmHeight: 210,
  paddingLeft: 10,
  paddingRight: 10,
  paddingTop: 13,
  paddingBottom: 15,
  pageType: PaperType.A5,
};

// 纸张配置映射
export const paperConfigs: Record<PaperType, PaperConfig> = {
  [PaperType.HALF]: halfPaper,
  [PaperType.FULL]: fullPaper,
  [PaperType.THIRD]: thirdPaper,
  [PaperType.A5]: a5Paper,
};

// 获取纸张名称的辅助函数
export function getPaperName(config: PaperConfig): string {
  const typeNames = {
    [PaperType.HALF]: "二等分",
    [PaperType.FULL]: "一等分",
    [PaperType.THIRD]: "三等分",
    [PaperType.A5]: "A5",
  };

  return `${typeNames[config.pageType]}(${config.mmWidth}mm×${config.mmHeight}mm)`;
}

/**
 * DPI（每英寸点数）标准打印分辨率通常是 72dpi 或 96dpi。
 *
 * 1英寸 = 25.4毫米
 * 1英寸 = 72像素（在72dpi下）或96像素（在96dpi下）
 *
 * 因此：
 * px = mm * (dpi / 25.4)
 */

// 毫米转像素的工具函数
export function mmToPx(mm: number, dpi: number = 72): number {
  console.log(Math.round(mm * (dpi / 25.4)));
  return Math.round(mm * (dpi / 25.4));
}

// 像素转毫米的工具函数
export function pxToMm(px: number, dpi: number = 72): number {
  return Math.round(((px * 25.4) / dpi) * 100) / 100;
}
