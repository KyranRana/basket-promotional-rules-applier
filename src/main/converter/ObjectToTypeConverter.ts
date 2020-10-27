export default abstract class ObjectToTypeConverter<T, R> {
  protected abstract transform(v: T): R

  convert(v: any): R {
    return this.transform(v as T)
  }
}