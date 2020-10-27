import Checkout from "../main/Checkout"
import { PromotionalRule } from "../main/command/promotional-rule/PromotionalRule"
import Basket from "../main/model/Basket"
import BasketItem from "../main/model/BasketItem"
import { Item } from "../main/model/Item"

const items: Item[] = [
  {
    "id": "0001",
    "name": "Water Bottle",
    "price": 24.95
  },
  {
    "id": "0002",
    "name": "Hoodie",
    "price": 65
  },
  {
    "id": "0003",
    "name": "Sticker Set",
    "price": 3.99
  }
]

const promotionalRuleSets: PromotionalRule[] = [
  {
    id: 1,
    name: "Water Bottle Discount",
    startDate: new Date("2020-10-18T00:00:00.000Z"),
    expiryDate: new Date("2020-11-18T00:00:00.000Z"),
    condition: {
      basketItems: {
        and: [{
          itemCriteria: {
            id: "0001",
            discounted: false
          },
          occurrences: {
            operator: ">",
            operand: 1
          }
        }]
      }
    },
    action: {
     basketItems: [{
        itemCriteria: {
          id: "0001",
          discounted: false
        },
        discount: {
          byPrice: 1.96
        }
     }]
    }
  }, 
  {
    id: 2,
    name: "10% discount over £75",
    startDate: new Date("2020-10-18T00:00:00.000Z"),
    expiryDate: new Date("2020-11-18T00:00:00.000Z"),
    condition: {
      basket: {
        total: {
          operator: ">",
          operand: 75
        }
      }
    },
    action: {
      basket: {
        discount: {
          byPercent: 10
        }
      }
    }
  }
]

interface TestCaseData {
  index: number
  basket: Basket
  expected: number
}

const testcase1: TestCaseData = {
  index: 1,
  basket: new Basket([
    new BasketItem(items[0]),
    new BasketItem(items[0]),
    new BasketItem(items[1]),
    new BasketItem(items[2])
  ]),
  expected: 103.47  
}

const testcase2: TestCaseData = {
  index: 2,
  basket: new Basket([
    new BasketItem(items[0]),
    new BasketItem(items[0]),
    new BasketItem(items[0])
  ]),
  expected: 68.97  
}

test.each`
  index               | basket                | expected
  ${testcase1.index}  | ${testcase1.basket}   | ${testcase1.expected}
  ${testcase2.index}  | ${testcase2.basket}   | ${testcase2.expected}
`('Checkout#scan applies discounts directly to basket - variant $index', (testcase: TestCaseData) => {
  const checkout = new Checkout(promotionalRuleSets)
  checkout.scan(testcase.basket)
  expect(checkout.total).toBe(testcase.expected)
})