import * as yup from 'yup';

import { messages } from './constant';

yup.addMethod(yup.string, 'positiveInteger', function () {
  return this.test('positiveInteger', (value, { originalValue }) => {
    if (value === null || value === undefined) return true;
    if (/^\d+$/.test(originalValue)) return true;
    return false;
  });
});

yup.addMethod(yup.number, 'positiveInteger', function () {
  return this.test('positiveInteger', (value, { originalValue }) => {
    if (value === null || value === undefined) return true;
    if (/^\d+$/.test(originalValue)) return true;
    return false;
  });
});

yup.addMethod(yup.string, 'valueOf', function (input: Record<string, any>) {
  return this.test('valueOf', (value) => {
    const obj = 'value' in input ? input.value : input;
    if (obj === null) return true;

    const keyArr = Object.keys(obj);
    if (keyArr.length === 0) return true;

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

yup.addMethod(yup.number, 'valueOf', function (input: Record<string, any>) {
  return this.test('valueOf', (value) => {
    const obj = 'value' in input ? input.value : input;
    if (obj === null) return true;

    const keyArr = Object.keys(obj);
    if (keyArr.length === 0) return true;

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

yup.addMethod(
  yup.string,
  'dateFormat',
  function (format: string = 'YYYY-MM-DD', message?: string) {
    return this.test(
      'dateFormat',
      message || messages.invalidDateFormat(format),
      function (value) {
        if (!value) return true; // Let required() handle empty values

        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(value);
      },
    );
  },
);

export const nat = () =>
  yup
    .number()
    .transform((value, org) => (org === '' ? null : value))
    .positiveInteger();

declare module 'yup' {
  interface StringSchema {
    positiveInteger(): this;
    valueOf(obj: Record<string, any>): this;
    dateFormat(format?: string, message?: string): this;
  }

  interface NumberSchema {
    positiveInteger(): this;
    valueOf(obj: Record<string, any>): this;
  }
}
