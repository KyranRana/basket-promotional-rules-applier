import ItemsJsonFile from "./json/Items.json"
import PromotionalRulesJsonFile from "./json/PromotionalRules.json"

import prompt from "prompt-sync"

import Checkout from "./Checkout"
import Basket from "./model/Basket"
import BasketItem from "./model/BasketItem"

import { Item } from "./model/Item"
import { PromotionalRule } from "./command/promotional-rule/PromotionalRule"

import PromotionalRuleToTypeConverter from "./converter/PromotionalRuleToTypeConverter"
const promotionalRuleToTypeConverter = new PromotionalRuleToTypeConverter()

// get available items and promotional rules
const items: Item[] = ItemsJsonFile
const promotionalRules: PromotionalRule[] = 
  PromotionalRulesJsonFile.map(rule => promotionalRuleToTypeConverter.convert(rule))

// get items user has picked via user input (no validation I know...)
const userInput = prompt({ sigint: true })("Enter item ids: ")
const chosenItems = userInput.split(',').map(findItem).filter(v => v) as Item[]

// create basket with items user has chosen
const chosenBasketItems = chosenItems.map(item => new BasketItem(item))
const basket = new Basket(chosenBasketItems)

// checkout and get discounted total
const checkout = new Checkout(promotionalRules)
checkout.scan(basket)
console.log(`£${checkout.total}`)

function findItem(id: string) {
  return items.find(item => item.id == id.trim())
}