import { Item } from "../../../main/model/Item"
import { PromotionalRule } from "../../../main/command/promotional-rule/PromotionalRule"
import Basket from "../../../main/model/Basket"
import BasketItem from "../../../main/model/BasketItem"
import PromotionalRuleReceiver from "../../../main/command/promotional-rule/PromotionalRuleReceiver"

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
  promotionalRule: PromotionalRule
  expected: ExpectedBasket
}

const testcase1: TestCaseData = {
  scenario: "A promotional rule which discounts an item by price if more than one of it is in the basket",
  basket: new Basket([
    new BasketItem(items[0]),
    new BasketItem(items[0]),
    new BasketItem(items[0]),
    new BasketItem(items[1])
  ]),
  promotionalRule: {
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
  expected: {
    total: 133.97,
    discountedTotal: 133.97,
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
      },
      {
        id: "0002",
        price: 65,
        discountedPrice: 65
      },
    ]
  }
}
const testcase2: TestCaseData = {
  scenario: "A promotional rule which discounts the basket total by percentage if it is greater than a certain amount",
  basket: new Basket([
    new BasketItem(items[0]),
    new BasketItem(items[1]),
    new BasketItem(items[2])
  ]),
  promotionalRule: {
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
  },
  expected: {
    total: 93.94,
    discountedTotal: 84.55,
    items: [
      {
        id: "0001",
        price: 24.95,
        discountedPrice: 24.95
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
const testcase3: TestCaseData = {
  scenario: "A promotional rule which doesn't execute because its not valid anymore",
  basket: new Basket([
    new BasketItem(items[0]),
    new BasketItem(items[0]),
    new BasketItem(items[0]),
    new BasketItem(items[1])
  ]),
  promotionalRule: {
    id: 1,
    name: "Water Bottle Discount",
    startDate: new Date("2010-10-18T00:00:00.000Z"),
    expiryDate: new Date("2010-11-18T00:00:00.000Z"),
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
  expected: {
    total: 139.85,
    discountedTotal: 139.85,
    items: [
      {
        id: "0001",
        price: 24.95,
        discountedPrice: 24.95
      },
      {
        id: "0001",
        price: 24.95,
        discountedPrice: 24.95
      },
      {
        id: "0001",
        price: 24.95,
        discountedPrice: 24.95
      },
      {
        id: "0002",
        price: 65,
        discountedPrice: 65
      },
    ]
  }
}

test.each`
  scenario              | basket              | promotionalRule               | expected
  ${testcase1.scenario} | ${testcase1.basket} | ${testcase1.promotionalRule}  | ${testcase1.expected}
  ${testcase2.scenario} | ${testcase2.basket} | ${testcase2.promotionalRule}  | ${testcase2.expected}
  ${testcase3.scenario} | ${testcase3.basket} | ${testcase3.promotionalRule}  | ${testcase3.expected}
`('$scenario', (testcase: TestCaseData) => {
  const promotionalRuleReceiver = new PromotionalRuleReceiver()
  promotionalRuleReceiver.execute(testcase.promotionalRule, testcase.basket)
  
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