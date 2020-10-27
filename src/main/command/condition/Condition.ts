export interface Condition<T> {
  operator: '>' | '=' | '<'
  operand: T
}