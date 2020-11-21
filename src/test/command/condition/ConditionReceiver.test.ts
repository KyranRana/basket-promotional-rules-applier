import { Condition } from "../../../main/command/condition/Condition"
import ConditionReceiver from "../../../main/command/condition/ConditionReceiver"

interface TestCaseData {
  operator: string
  operand: number
  onValue: number
  expected: boolean
}

test.each`
  operator | operand | onValue | expected
  ${'>'}   | ${75}   | ${90}   | ${true}
  ${'>'}   | ${75}   | ${74}   | ${false}
  ${'<'}   | ${55}   | ${35}   | ${true}
  ${'<'}   | ${55}   | ${90}   | ${false}
  ${'='}   | ${45}   | ${45}   | ${true}
  ${'='}   | ${45}   | ${44}   | ${false}
`('execute ($onValue $operator $operand = $expected)', (testcase: TestCaseData) => {
  const { operator, operand, onValue, expected } = testcase
  const condition = { operator, operand } as Condition<number>
    
  const conditionReceiver = new ConditionReceiver()
  expect(conditionReceiver.execute(condition, onValue)).toBe(expected)
})