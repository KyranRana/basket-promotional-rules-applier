export type DiscountBy = 
  DiscountByPrice 
  | DiscountByPercent

export interface DiscountByPrice { byPrice: number }
export interface DiscountByPercent { byPercent: number }