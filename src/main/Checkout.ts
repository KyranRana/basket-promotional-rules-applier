import Basket from "./model/Basket"
import { PromotionalRule } from "./command/promotional-rule/PromotionalRule"
import PromotionalRulesReceiver from "./command/promotional-rules/PromotionalRulesReceiver"

export default class Checkout {
  total: number = 0
  private promotionalRules: PromotionalRule[]

  constructor(promotionalRules: PromotionalRule[]) {
    this.promotionalRules = promotionalRules
  }

  scan(basket: Basket): void {
    // 1. rollback discounts in basket (if any)
    basket.rollbackDiscounts()

    // 2. re-apply promotional rules to basket
    const promotionalRulesReceiver = new PromotionalRulesReceiver()
    promotionalRulesReceiver.execute(this.promotionalRules, basket)

    // 3. update checkout total
    this.total = basket.discountedTotal
  }
}