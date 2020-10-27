import Basket from "../../model/Basket"
import BasketItem from "../../model/BasketItem"
import { DiscountBy, DiscountByPrice } from "../../model/DiscountBy"
import ConditionReceiver from "../condition/ConditionReceiver"
import { 
    PromotionalRule,

    PromotionalRuleBasketItemCondition,
    PromotionalRuleBasketItemConditions,
    PromotionalRuleAllBasketItemConditions,
    PromotionalRuleAnyBasketItemCondition,
    PromotionalRuleBasketItemSearchCriteria,

    PromotionalRuleAction,
    PromotionalRuleBasketAction,
    PromotionalRuleBasketItemsAction
} from "./PromotionalRule"

export default class PromotionalRuleReceiver {
  private conditionReceiver: ConditionReceiver

  constructor() {
    this.conditionReceiver = new ConditionReceiver()
  }

  execute(rule: PromotionalRule, onBasket: Basket): void {
    // 1. check if we can apply promotion to basket
    if (this.isExpired(rule)) {
      return
    }
    if (rule.condition.basket) {
      if (!this.conditionReceiver.execute(rule.condition.basket.total, onBasket.total)) {
        return
      }
    }
    if (rule.condition.basketItems) {
      const conditionsMet = this.needToCheckIfAllBasketItemConditionsAreMet(rule.condition.basketItems)
        ? this.checkAllBasketItemConditionsAreMet(onBasket.items, rule.condition.basketItems)
        : this.checkAnyBasketItemConditionIsMet(onBasket.items, rule.condition.basketItems)

      if (!conditionsMet) {
        return
      }
    }

    // 2. apply promotion to basket
    if (this.needToDiscountBasket(rule.action)) {
      this.discountBasket(onBasket, rule.action)
    } else {
      this.discountBasketItems(onBasket.items, rule.action)
    }
  }

  private isExpired(rule: PromotionalRule): boolean {
    const now = new Date()
    return !(now > rule.startDate && (!rule.expiryDate || now < rule.expiryDate))
  }

  private needToCheckIfAllBasketItemConditionsAreMet(
    basketItemConditons: PromotionalRuleBasketItemConditions
    ): basketItemConditons is PromotionalRuleAllBasketItemConditions {

    return (basketItemConditons as PromotionalRuleAllBasketItemConditions).and !== undefined
  }

  private checkAllBasketItemConditionsAreMet(
    basketItems: BasketItem[], 
    basketItemConditions: PromotionalRuleAllBasketItemConditions): boolean {
    
    return basketItemConditions.and.every(basketItemCondition => 
      this.checkBasketItemsMeetCondition(basketItems, basketItemCondition))
  }
    
  private checkAnyBasketItemConditionIsMet(
    basketItems: BasketItem[], 
    basketItemConditions: PromotionalRuleAnyBasketItemCondition): boolean {
        
    return basketItemConditions.or.some(basketItemCondition => 
      this.checkBasketItemsMeetCondition(basketItems, basketItemCondition))
  }

  private checkBasketItemsMeetCondition(
    basketItems: BasketItem[],
    basketItemCondition: PromotionalRuleBasketItemCondition): boolean {
    
    const basketItemsMeetingCriteria = basketItems.filter(basketItem => 
      this.checkBasketItemMeetsCriteria(basketItem, basketItemCondition.itemCriteria))
    
    if (basketItemCondition.occurrences) {
      if (!this.conditionReceiver.execute(
        basketItemCondition.occurrences, basketItemsMeetingCriteria.length)) {
        return false
      }
    } else if (basketItemsMeetingCriteria.length == 0) {
      return false
    }
    return true
  }

  private checkBasketItemMeetsCriteria(
    basketItem: BasketItem, 
    basketItemCriteria: PromotionalRuleBasketItemSearchCriteria): boolean {
    
    if (basketItemCriteria.id && basketItem.id !== basketItemCriteria.id) {
      return false
    }
    if (basketItemCriteria.discounted && basketItem.discounted !== basketItemCriteria.discounted) {
      return false
    }
    return true
  }

  private needToDiscountBasket(
    action: PromotionalRuleAction): action is PromotionalRuleBasketAction {
    return (action as PromotionalRuleBasketAction).basket !== undefined
  }

  private discountBasket(basket: Basket, action: PromotionalRuleBasketAction): void {
    if (this.needToDiscountByPrice(action.basket.discount)) {
      basket.discountByPrice(action.basket.discount.byPrice)
    } else {
      basket.discountByPercentage(action.basket.discount.byPercent)
    }
  }

  private discountBasketItems(basketItems: BasketItem[], action: PromotionalRuleBasketItemsAction): void {
    for (const basketItemAction of action.basketItems) {
      const basketItemsMeetingCriteria = basketItems.filter(basketItem => 
        this.checkBasketItemMeetsCriteria(basketItem, basketItemAction.itemCriteria))
      
      for (const basketItem of basketItemsMeetingCriteria) {
        if (this.needToDiscountByPrice(basketItemAction.discount)) {
          basketItem.discountByPrice(basketItemAction.discount.byPrice)
        } else {
          basketItem.discountByPercentage(basketItemAction.discount.byPercent)
        }
      }
    }
  }

  private needToDiscountByPrice(
    discount: DiscountBy): discount is DiscountByPrice {
    return (discount as DiscountByPrice).byPrice !== undefined
  }
}