import { DiscountBy, DiscountByPrice, DiscountByPercent } from "./DiscountBy"

import BasketItem from "./BasketItem"
import Discountable from "./Discountable"

export default class Basket implements Discountable {
  items: BasketItem[]
  private _discountsToApply: DiscountBy[] = []
  
  constructor(items: BasketItem[]) {
    this.items = items
  }

  get total(): number {
    return +this.items.reduce((a, b) => a + b.discountedPrice, 0).toFixed(2)
  }

  get discounted(): boolean {
    return this._discountsToApply.length > 0
  }

  get discountedTotal(): number {
    return +this._discountsToApply.reduce(this.applyDiscount.bind(this), this.total).toFixed(2)
  }

  discountByPrice(price: number): void {
    this._discountsToApply.push(<DiscountByPrice>{ byPrice: price })
  }

  discountByPercentage(percentage: number): void {
    this._discountsToApply.push(<DiscountByPercent>{ byPercent: percentage })
  }

  private applyDiscount(total: number, discount: DiscountBy): number {
    const discountPrice = this.needToDiscountByPrice(discount) 
      ?  discount.byPrice
      : (discount.byPercent / 100) * total

    return total - discountPrice
  }

  rollbackDiscounts() {
    this._discountsToApply = []
    
    for (const item of this.items) {
      item.rollbackDiscounts()
    }
  }

  private needToDiscountByPrice(
    discount: DiscountBy
  ): discount is DiscountByPrice {
    return (discount as DiscountByPrice).byPrice !== undefined
  }
} 
