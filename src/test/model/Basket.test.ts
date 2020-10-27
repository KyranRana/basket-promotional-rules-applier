import Basket from "../../main/model/Basket"
import BasketItem from "../../main/model/BasketItem"

const basketItems: BasketItem[] = [
  new BasketItem({ 
    id: "0001", 
    name: "Water Bottle",
    price: 39.99
  }),
  new BasketItem({ 
    id: "0002", 
    name: "Orange Juice",
    price: 15.99
  }),
  new BasketItem({ 
    id: "0003", 
    name: "Lemonade",
    price: 16.99
  })
]

test('Basket#total returns total of all items in the basket', () => {
  const basket = new Basket(basketItems)
  expect(basket.total).toBe(72.97)
})

test('Basket#discountedTotal initially returns total of all items in the basket', () => {
  const basket = new Basket(basketItems)
  expect(basket.discountedTotal).toBe(72.97)
})

test('Basket#items returns items in the basket', () => {
  const basket = new Basket(basketItems)
  expect(basket.items).toBe(basketItems)
})

test('Basket#discounted returns true when item is discounted', () => {
  const basket = new Basket(basketItems)
  expect(basket.discounted).toBe(false)
  basket.discountByPrice(10)
  expect(basket.discounted).toBe(true)
})

test('Basket#discountByPrice discounts total by given amount', () => {
  const basket = new Basket(basketItems)
  basket.discountByPrice(10)
  expect(basket.discountedTotal).toBe(62.97)
})

test('Basket#discountByPercentage discounts total by given percentage', () => {
  const basket = new Basket(basketItems)
  basket.discountByPercentage(10)
  expect(basket.discountedTotal).toBe(65.67)
})

test('Basket#rollbackDiscounts reverts discounts applied to basket', () => {
  const basket = new Basket(basketItems)
  basket.discountByPercentage(10)
  basket.rollbackDiscounts()
  expect(basket.discountedTotal).toBe(72.97)
})