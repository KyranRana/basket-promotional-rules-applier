import ConditionReceiver from "../../../main/command/condition/ConditionReceiver"

test.each`
  operator | operand | onValue | expected
  ${'>'}   | ${75}   | ${90}   | ${true}
  ${'>'}   | ${75}   | ${74}   | ${false}
  ${'<'}   | ${55}   | ${35}   | ${true}
  ${'<'}   | ${55}   | ${90}   | ${false}
  ${'='}   | ${45}   | ${45}   | ${true}
  ${'='}   | ${45}   | ${44}   | ${false}
`('execute ($onValue $operator $operand = $expected)', ({ operator, operand, onValue, expected }) => {
  const condition = { operator, operand }
    
  const conditionReceiver = new ConditionReceiver()
  expect(conditionReceiver.execute(condition, onValue)).toBe(expected)
})