import Basket from "../../model/Basket"
import { PromotionalRule } from "../promotional-rule/PromotionalRule"
import PromotionalRuleReceiver from "../promotional-rule/PromotionalRuleReceiver"

export default class PromotionalRulesReceiver {
  promotionalRuleReceiver: PromotionalRuleReceiver

  constructor() {
    this.promotionalRuleReceiver = new PromotionalRuleReceiver()
  }

  execute(rules: PromotionalRule[], onBasket: Basket) {
    for (const rule of rules) {
      if (!this.isExpired(rule)) {
        this.promotionalRuleReceiver.execute(rule, onBasket)
      }
    }
  }
  
  private isExpired(rule: PromotionalRule): boolean {
    const now = new Date()
    return !(now > rule.startDate && (!rule.expiryDate || now < rule.expiryDate))
  }
}