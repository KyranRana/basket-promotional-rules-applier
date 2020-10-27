export default interface Discountable {
  discounted: boolean
  
  discountByPrice(price: number): void
  discountByPercentage(percentage: number): void

  rollbackDiscounts(): void
}