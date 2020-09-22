export class EnumModel<T> {
  key: T;
  value: string;

  constructor(key: T, value: string) {
    this.key = key;
    this.value = value;
  }
}
