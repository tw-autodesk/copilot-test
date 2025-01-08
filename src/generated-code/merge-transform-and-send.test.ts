import axios from 'axios';
import mergeTransformAndSend from '../complex-example/merge-transform-and-send';
import { ObjectType, ParsedObjectType } from '../complex-example/types';
import parseString from '../basic-example/parse-string';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const MOCK_INPUT_1: ObjectType = {
  camelCaseKey: 'true',
  anotherKey: '123',
  yetAnotherKey: 'someString',
  nestedObject: {
    nestedCamelCaseKey: 'false',
    nestedArray: [{ num1: '456' }, { num2: '789' }],
  },
  arrayOfObjects: [
    { arrayCamelCaseKey: 'true' },
    { anotherArrayCamelCaseKey: 'false' },
  ],
  booleanKey: true,
  numberKey: 42,
  dateKey: new Date('2023-01-01T00:00:00Z'),
  arrayOfBooleans: [true, false, true],
  arrayOfNumbers: [1, 2, 3],
  arrayOfDates: [
    new Date('2023-01-01T00:00:00Z'),
    new Date('2023-01-02T00:00:00Z'),
  ],
  arrayOfStrings: ['true', 'false', '123', 'someString'],
  optionalObject: { optional: 'optionalString' },
  otherOptionalObject: {},
  keyValueObject: { key: 'keyString', value: 'valueString' },
};

const MOCK_INPUT_2: ObjectType = {
  camelCaseKey: 'false',
  anotherKey: '456',
  yetAnotherKey: 'anotherString',
  nestedObject: {
    nestedCamelCaseKey: 'true',
    nestedArray: [{ num1: '789' }, { num2: '012' }],
  },
  arrayOfObjects: [
    { arrayCamelCaseKey: 'false' },
    { anotherArrayCamelCaseKey: 'true' },
  ],
  booleanKey: false,
  numberKey: 84,
  dateKey: new Date('2023-02-01T00:00:00Z'),
  arrayOfBooleans: [false, true, false],
  arrayOfNumbers: [4, 5, 6],
  arrayOfDates: [
    new Date('2023-02-01T00:00:00Z'),
    new Date('2023-02-02T00:00:00Z'),
  ],
  arrayOfStrings: ['false', 'true', '456', 'anotherString'],
  optionalObject: { optional: 'anotherOptionalString' },
  otherOptionalObject: {},
  keyValueObject: { key: 'anotherKeyString', value: 'anotherValueString' },
};

const MOCK_RESPONSE: ObjectType = {
  responseKey1: 'responseValue1',
  responseKey2: 456,
  responseKey3: true,
  responseNestedObject: {
    responseNestedKey1: 'nestedValue1',
    responseNestedKey2: 789,
    responseNestedArray: [
      { nestedArrayKey1: 'value1' },
      { nestedArrayKey2: 'value2' },
    ],
  },
  responseArray: [
    { responseArrayKey1: 'arrayValue1' },
    { responseArrayKey2: 'arrayValue2' },
  ],
  responseBoolean: false,
  responseNumber: 123,
  responseDate: new Date('2023-02-01T00:00:00Z'),
  responseString: 'responseString',
  responseOptionalObject: { optional: 'optionalResponse' },
};

const EXPECT_OUTPUT: ParsedObjectType = {
  camel_case_key: false,
  another_key: 456,
  yet_another_key: 'anotherString',
  nested_object: {
    nested_camel_case_key: true,
    nested_array: [{ num1: 789 }, { num2: 12 }],
  },
  array_of_objects: [
    { array_camel_case_key: false },
    { another_array_camel_case_key: true },
  ],
  boolean_key: false,
  number_key: 84,
  date_key: new Date('2023-02-01T00:00:00Z'),
  array_of_booleans: [false, true, false],
  array_of_numbers: [4, 5, 6],
  array_of_dates: [
    new Date('2023-02-01T00:00:00Z'),
    new Date('2023-02-02T00:00:00Z'),
  ],
  array_of_strings: [false, true, 456, 'anotherString'],
  optional_object: { optional: 'anotherOptionalString' },
  other_optional_object: {},
  key_value_object: { key: 'anotherKeyString', value: 'anotherValueString' },
};

describe('mergeTransformAndSend', () => {
  beforeEach(() => {
    mockedAxios.put.mockResolvedValue({ data: {} });
  });

  it('should merge and transform objects, then send and merge response', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(MOCK_INPUT_1, MOCK_INPUT_2);
    expect(result).toEqual({
      ...EXPECT_OUTPUT,
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      EXPECT_OUTPUT,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle empty objects', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend({}, {});
    expect(result).toEqual({
      ...{},
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle objects with only string values', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(
      {
        keyOne: 'true',
        keyTwo: 'false',
        keyThree: '123',
        keyFour: 'someString',
      },
      {
        keyOne: 'false',
        keyTwo: 'true',
        keyThree: '456',
        keyFour: 'anotherString',
      },
    );
    expect(result).toEqual({
      key_one: false,
      key_two: true,
      key_three: 456,
      key_four: 'anotherString',
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        key_one: false,
        key_two: true,
        key_three: 456,
        key_four: 'anotherString',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle nested objects with mixed types', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(
      {
        outerKey: 'true',
        nestedObject: {
          innerKey: 'false',
          anotherNestedObject: {
            deepKey: '123',
          },
        },
      },
      {
        outerKey: 'false',
        nestedObject: {
          innerKey: 'true',
          anotherNestedObject: {
            deepKey: '456',
          },
        },
      },
    );
    expect(result).toEqual({
      outer_key: false,
      nested_object: {
        inner_key: true,
        another_nested_object: {
          deep_key: 456,
        },
      },
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        outer_key: false,
        nested_object: {
          inner_key: true,
          another_nested_object: {
            deep_key: 456,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle arrays of objects', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(
      {
        arrayKey: [{ nestedKeyOne: 'true' }, { nestedKeyTwo: 'false' }],
      },
      {
        arrayKey: [{ nestedKeyOne: 'false' }, { nestedKeyTwo: 'true' }],
      },
    );
    expect(result).toEqual({
      array_key: [
        { nested_key_one: true },
        { nested_key_two: false },
        { nested_key_one: false },
        { nested_key_two: true },
      ],
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        array_key: [
          { nested_key_one: true },
          { nested_key_two: false },
          { nested_key_one: false },
          { nested_key_two: true },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle arrays of booleans', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(
      { arrayOfBooleans: MOCK_INPUT_1.arrayOfBooleans },
      { arrayOfBooleans: MOCK_INPUT_2.arrayOfBooleans },
    );
    expect(result).toEqual({
      array_of_booleans: [
        ...MOCK_INPUT_1.arrayOfBooleans,
        ...MOCK_INPUT_2.arrayOfBooleans,
      ],
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        array_of_booleans: [
          ...MOCK_INPUT_1.arrayOfBooleans,
          ...MOCK_INPUT_2.arrayOfBooleans,
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle arrays of numbers', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(
      { arrayOfNumbers: MOCK_INPUT_1.arrayOfNumbers },
      { arrayOfNumbers: MOCK_INPUT_2.arrayOfNumbers },
    );
    expect(result).toEqual({
      array_of_numbers: [
        ...MOCK_INPUT_1.arrayOfNumbers,
        ...MOCK_INPUT_2.arrayOfNumbers,
      ],
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        array_of_numbers: [
          ...MOCK_INPUT_1.arrayOfNumbers,
          ...MOCK_INPUT_2.arrayOfNumbers,
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle arrays of dates', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(
      { arrayOfDates: MOCK_INPUT_1.arrayOfDates },
      { arrayOfDates: MOCK_INPUT_2.arrayOfDates },
    );
    expect(result).toEqual({
      array_of_dates: [
        ...MOCK_INPUT_1.arrayOfDates,
        ...MOCK_INPUT_2.arrayOfDates,
      ],
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        array_of_dates: [
          ...MOCK_INPUT_1.arrayOfDates,
          ...MOCK_INPUT_2.arrayOfDates,
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle arrays of strings', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(
      { arrayOfStrings: MOCK_INPUT_1.arrayOfStrings },
      { arrayOfStrings: MOCK_INPUT_2.arrayOfStrings },
    );
    expect(result).toEqual({
      array_of_strings: [
        ...MOCK_INPUT_1.arrayOfStrings.map(parseString),
        ...MOCK_INPUT_2.arrayOfStrings.map(parseString),
      ],
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        array_of_strings: [
          ...MOCK_INPUT_1.arrayOfStrings.map(parseString),
          ...MOCK_INPUT_2.arrayOfStrings.map(parseString),
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle optional objects', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(
      { optionalObject: MOCK_INPUT_1.optionalObject },
      { optionalObject: MOCK_INPUT_2.optionalObject },
    );
    expect(result).toEqual({
      optional_object: MOCK_INPUT_2.optionalObject,
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      { optional_object: MOCK_INPUT_2.optionalObject },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });

  it('should handle key-value objects', async () => {
    mockedAxios.put.mockResolvedValue({ data: MOCK_RESPONSE });
    const result = await mergeTransformAndSend(
      { keyValueObject: MOCK_INPUT_1.keyValueObject },
      { keyValueObject: MOCK_INPUT_2.keyValueObject },
    );
    expect(result).toEqual({
      key_value_object: MOCK_INPUT_2.keyValueObject,
      ...MOCK_RESPONSE,
    });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:3000',
      { key_value_object: MOCK_INPUT_2.keyValueObject },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
});
