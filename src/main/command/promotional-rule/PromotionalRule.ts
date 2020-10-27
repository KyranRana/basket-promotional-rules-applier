import { DiscountBy } from '../../model/DiscountBy'
import { Condition } from '../condition/Condition'

export interface PromotionalRule extends PromotionalRulePartial {
  startDate: Date
  expiryDate?: Date
}

export interface PromotionalRuleJson extends PromotionalRulePartial {
  startDate: string
  expiryDate?: string 
}

interface PromotionalRulePartial {
  id: number
  name: string,
  condition: PromotionalRuleCondition
  action: PromotionalRuleAction
}

interface PromotionalRuleCondition {
  basket?: PromotionalRuleBasketCondition
  basketItems?: PromotionalRuleBasketItemConditions
}

export type PromotionalRuleAction = 
  PromotionalRuleBasketAction 
  | PromotionalRuleBasketItemsAction


/** condition helper models */

export interface PromotionalRuleBasketCondition {
  total: Condition<number>
} 

export type PromotionalRuleBasketItemConditions = 
  PromotionalRuleAllBasketItemConditions 
  | PromotionalRuleAnyBasketItemCondition

export interface PromotionalRuleAllBasketItemConditions { and: PromotionalRuleBasketItemCondition[] }
export interface PromotionalRuleAnyBasketItemCondition { or: PromotionalRuleBasketItemCondition[] }

export interface PromotionalRuleBasketItemCondition {
  itemCriteria: PromotionalRuleBasketItemSearchCriteria,
  occurrences?: Condition<number>
}

export interface PromotionalRuleBasketItemSearchCriteria {
  id?: string
  discounted?: boolean
}

/** action helper models */

export interface PromotionalRuleBasketAction {
  basket: { discount: DiscountBy }
}

export interface PromotionalRuleBasketItemsAction {
  basketItems: PromotionalRuleBasketItemAction[]
}

export interface PromotionalRuleBasketItemAction {
  itemCriteria: PromotionalRuleBasketItemSearchCriteria
  discount: DiscountBy
}