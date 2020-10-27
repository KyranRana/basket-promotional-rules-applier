import BasketItem from "../../main/model/BasketItem"
import { Item } from "../../main/model/Item"

const item: Item = { 
  id: "0001", 
  name: "Water Bottle",
  price: 39.99
}

test('BasketItem#id returns item id', () => {
  const basketItem = new BasketItem(item)
  expect(basketItem.id).toBe(item.id)
})

test('BasketItem#price returns item price', () => {
  const basketItem = new BasketItem(item)
  expect(basketItem.price).toBe(item.price)
})

test('BasketItem#discountedPrice initially returns item price', () => {
  const basketItem = new BasketItem(item)
  expect(basketItem.discountedPrice).toBe(item.price)
})

test('BasketItem#discounted returns true when item is discounted', () => {
  const basketItem = new BasketItem(clone(item))
  expect(basketItem.discounted).toBe(false)
  basketItem.discountByPrice(10)
  expect(basketItem.discounted).toBe(true)
})

test('BasketItem#discountByPrice discounts item price by given amount', () => {
  const basketItem = new BasketItem(clone(item))
  basketItem.discountByPrice(10)
  expect(basketItem.discountedPrice).toBe(29.99)
})

test('BasketItem#discountByPercentage discounts item price by given percentage', () => {
  const basketItem = new BasketItem(clone(item))
  basketItem.discountByPercentage(10)
  expect(basketItem.discountedPrice).toBe(35.99)
})

test('BasketItem#rollbackDiscounts reverts discounts applied to basket item', () => {
  const basketItem = new BasketItem(clone(item))
  basketItem.discountByPercentage(10)
  basketItem.rollbackDiscounts()
  expect(basketItem.discountedPrice).toBe(39.99)
})

function clone(item: Item): Item {
  return JSON.parse(JSON.stringify(item))
}