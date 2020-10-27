import { Condition } from "./Condition"

export default class ConditionReceiver {
  execute<T>(condition: Condition<T>, onValue: T): boolean {
    if (condition.operator == '>') {
      return onValue > condition.operand
    } else if (condition.operator == '=') {
      return onValue == condition.operand
    } else if (condition.operator == '<') {
      return onValue < condition.operand
    }
    return false
  }
}