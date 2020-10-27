import ObjectToTypeConverter from "./ObjectToTypeConverter"
import { PromotionalRule, PromotionalRuleJson } from "../command/promotional-rule/PromotionalRule"

export default class PromotionalRuleToTypeConverter 
  extends ObjectToTypeConverter<PromotionalRuleJson, PromotionalRule> {
  
  transform(v: PromotionalRuleJson): PromotionalRule {  
    return {
      ...v,

      startDate: new Date(v.startDate),
      expiryDate: new Date(v.expiryDate)
    } as PromotionalRule
  }
}