import Discountable from "./Discountable"
import { Item } from "./Item"

export default class BasketItem implements Discountable {
  private _item: Item
  private _discountedPrice: number
    
  constructor(item: Item) {
    this._item = item
    this._discountedPrice = item.price
  }

  get id(): string {
    return this._item.id
  }

  get price(): number {
    return this._item.price
  }

  get discounted(): boolean {
    return this._discountedPrice != this._item.price 
  }

  get discountedPrice(): number {
    return +this._discountedPrice.toFixed(2)
  }

  discountByPrice(amount: number): void {
    this._discountedPrice -= amount
  }

  discountByPercentage(percentage: number): void {
    this._discountedPrice -= this._discountedPrice * (percentage / 100)
  }

  rollbackDiscounts(): void {
    this._discountedPrice = this._item.price
  }
} 