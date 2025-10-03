import * as yup from 'yup';

yup.addMethod(yup.number, 'positiveInteger', function () {
  return this.test('positiveInteger', (value, { originalValue }) => {
    if (value === null || value === undefined) return true;
    if (/^\d+$/.test(originalValue)) return true;
    return false;
  });
});

yup.addMethod(yup.number, 'valueOf', function (input: object) {
  return this.test('valueOf', (value) => {
    let obj = input;
    if ((<any>input).value !== undefined) {
      obj = (<any>input).value;
    }
    const keyArr = Object.keys(obj);
    if (keyArr.length === 0) return true;
    if (obj === null) return true;

    const valueList = keyArr.filter((val) => /^-?\d+$/.test(val));
    if (value == null) {
      return true;
    } else {
      const dataList = String(value).split(',');
      for (const data of dataList) {
        if (!valueList.includes(data)) {
          return false;
        }
      }

      return true;
    }
  });
});

export const nat = () =>
  yup
    .number()
    .transform((value, org) => (org === '' ? null : value))
    .positiveInteger();

declare module 'yup' {
  interface NumberSchema {
    positiveInteger(): this;
    valueOf(obj: object): this;
  }
}
