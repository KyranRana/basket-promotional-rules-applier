import { PromotionalRule } from "../../../main/command/promotional-rule/PromotionalRule"
import PromotionalRulesReceiver from "../../../main/command/promotional-rules/PromotionalRulesReceiver"
import Basket from "../../../main/model/Basket"
import BasketItem from "../../../main/model/BasketItem"
import { Item } from "../../../main/model/Item"

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

interface ExpectedBasket {
  total: number,
  discountedTotal: number,
  items: ExpectedBasketItem[]
}

interface ExpectedBasketItem {
  id: string,
  price: number,
  discountedPrice: number
}

interface TestCaseData {
  scenario: string
  basket: Basket
  promotionalRules: PromotionalRule[]
  expected: ExpectedBasket
}

const promotionalRuleSets1: PromotionalRule[] = [
  {
    id: 1,
    name: "Water Bottle Discount",
    startDate: new Date("2020-10-18T00:00:00.000Z"),
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

const testcase1: TestCaseData = {
  scenario: "K & C - Sample Test 1",
  basket: new Basket([
    new BasketItem(items[0]),
    new BasketItem(items[0]),
    new BasketItem(items[1]),
    new BasketItem(items[2])
  ]),
  promotionalRules: promotionalRuleSets1,
  expected: {
    total: 114.97,
    discountedTotal: 103.47,
    items: [
      {
        id: "0001",
        price: 24.95,
        discountedPrice: 22.99
      },
      {
        id: "0001",
        price: 24.95,
        discountedPrice: 22.99
      },
      {
        id: "0002",
        price: 65,
        discountedPrice: 65
      },
      {
        id: "0003",
        price: 3.99,
        discountedPrice: 3.99
      }
    ]
  }
}
const testcase2: TestCaseData = {
  scenario: "K & C - Sample Test 2",
  basket: new Basket([
    new BasketItem(items[0]),
    new BasketItem(items[0]),
    new BasketItem(items[0])
  ]),
  promotionalRules: promotionalRuleSets1,
  expected: {
    total: 68.97,
    discountedTotal: 68.97,
    items: [
      {
        id: "0001",
        price: 24.95,
        discountedPrice: 22.99
      },
      {
        id: "0001",
        price: 24.95,
        discountedPrice: 22.99
      },
      {
        id: "0001",
        price: 24.95,
        discountedPrice: 22.99
      }
    ]
  }
}
const testcase3: TestCaseData = {
  scenario: "K & C - Sample Test 3",
  basket: new Basket([
    new BasketItem(items[1]),
    new BasketItem(items[1]),
    new BasketItem(items[2])
  ]),
  promotionalRules: promotionalRuleSets1,
  expected: {
    total: 133.99,
    discountedTotal: 120.59,
    items: [
      {
        id: "0002",
        price: 65,
        discountedPrice: 65
      },
      {
        id: "0002",
        price: 65,
        discountedPrice: 65
      },
      {
        id: "0003",
        price: 3.99,
        discountedPrice: 3.99
      }
    ]
  }
}

test.each`
  scenario              | basket              | promotionalRules              | expected
  ${testcase1.scenario} | ${testcase1.basket} | ${testcase1.promotionalRules} | ${testcase1.expected}
  ${testcase2.scenario} | ${testcase2.basket} | ${testcase2.promotionalRules} | ${testcase2.expected}
  ${testcase3.scenario} | ${testcase3.basket} | ${testcase3.promotionalRules} | ${testcase3.expected}
`('$scenario', (testcase: TestCaseData) => {
  const promotionalRulesReceiver = new PromotionalRulesReceiver()
  promotionalRulesReceiver.execute(testcase.promotionalRules, testcase.basket)
  
  const actualBasket = testcase.basket
  const expectedBasket = testcase.expected

  expect(actualBasket.total).toBe(expectedBasket.total)
  expect(actualBasket.discountedTotal).toBe(expectedBasket.discountedTotal)

  for (let i = 0; i < testcase.expected.items.length; i++) {
    const actualBasketItem = actualBasket.items[i]
    const expectedBasketItem = expectedBasket.items[i]

    expect(actualBasketItem.id).toBe(expectedBasketItem.id)
    expect(actualBasketItem.price).toBe(expectedBasketItem.price)
    expect(actualBasketItem.discountedPrice).toBe(expectedBasketItem.discountedPrice)
  }
})