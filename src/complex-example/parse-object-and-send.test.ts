import axios from 'axios';
import parseObjectAndSend from './parse-object-and-send';
import { ObjectType, ParsedObjectType } from './types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const MOCK_INPUT: ObjectType = {
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

const MOCK_DATA_1: ObjectType = {
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

const MOCK_DATA_2: ObjectType = {
  responseArray: [
    { responseArrayKey1: 'arrayValue1' },
    { responseArrayKey2: 'arrayValue2' },
  ],
  responseBoolean: false,
  responseNumber: 123,
  responseDate: new Date('2023-03-01T00:00:00Z'),
  responseString: 'anotherResponseString',
  responseNestedObject: {
    responseNestedKey1: 'nestedValue1',
    responseNestedKey2: 789,
    responseNestedArray: [
      { nestedArrayKey1: 'value1' },
      { nestedArrayKey2: 'value2' },
    ],
  },
  responseOptionalObject: { optional: 'anotherOptionalResponse' },
};

const MOCK_DATA_3: ObjectType = {
  responseDate: new Date('2023-04-01T00:00:00Z'),
  responseString: 'yetAnotherResponseString',
  responseOptionalObject: { optional: 'yetAnotherOptionalResponse' },
  responseArray: [
    { responseArrayKey1: 'arrayValue1' },
    { responseArrayKey2: 'arrayValue2' },
  ],
  responseBoolean: true,
  responseNumber: 789,
  responseNestedObject: {
    responseNestedKey1: 'nestedValue1',
    responseNestedKey2: 456,
    responseNestedArray: [
      { nestedArrayKey1: 'value1' },
      { nestedArrayKey2: 'value2' },
    ],
  },
};

const EXPECT_OUTPUT: ParsedObjectType = {
  camel_case_key: true,
  another_key: 123,
  yet_another_key: 'someString',
  nested_object: {
    nested_camel_case_key: false,
    nested_array: [{ num1: 456 }, { num2: 789 }],
  },
  array_of_objects: [
    { array_camel_case_key: true },
    { another_array_camel_case_key: false },
  ],
  boolean_key: true,
  number_key: 42,
  date_key: new Date('2023-01-01T00:00:00Z'),
  array_of_booleans: [true, false, true],
  array_of_numbers: [1, 2, 3],
  array_of_dates: [
    new Date('2023-01-01T00:00:00Z'),
    new Date('2023-01-02T00:00:00Z'),
  ],
  array_of_strings: [true, false, 123, 'someString'],
  optional_object: { optional: 'optionalString' },
  other_optional_object: {},
  key_value_object: { key: 'keyString', value: 'valueString' },
};

describe('parseObjectAndSend', () => {
  const token = 'Bearer test-token';

  beforeEach(() => {
    mockedAxios.post.mockResolvedValue({ data: {} });
  });

  it('should convert camelCase keys to snake_case and parse string values', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_1 });
    const result = await parseObjectAndSend(MOCK_INPUT, token);
    expect(result).toEqual({
      ...EXPECT_OUTPUT,
      ...MOCK_DATA_1,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      EXPECT_OUTPUT,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle empty objects', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_2 });
    const result = await parseObjectAndSend({}, token);
    expect(result).toEqual({
      ...{},
      ...MOCK_DATA_2,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle objects with only string values', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_3 });
    const result = await parseObjectAndSend(
      {
        keyOne: 'true',
        keyTwo: 'false',
        keyThree: '123',
        keyFour: 'someString',
      },
      token,
    );
    expect(result).toEqual({
      key_one: true,
      key_two: false,
      key_three: 123,
      key_four: 'someString',
      ...MOCK_DATA_3,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        key_one: true,
        key_two: false,
        key_three: 123,
        key_four: 'someString',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle nested objects with mixed types', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_1 });
    const result = await parseObjectAndSend(
      {
        outerKey: 'true',
        nestedObject: {
          innerKey: 'false',
          anotherNestedObject: {
            deepKey: '123',
          },
        },
      },
      token,
    );
    expect(result).toEqual({
      outer_key: true,
      nested_object: {
        inner_key: false,
        another_nested_object: {
          deep_key: 123,
        },
      },
      ...MOCK_DATA_1,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        outer_key: true,
        nested_object: {
          inner_key: false,
          another_nested_object: {
            deep_key: 123,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle arrays of objects', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_2 });
    const result = await parseObjectAndSend(
      {
        arrayKey: [{ nestedKeyOne: 'true' }, { nestedKeyTwo: 'false' }],
      },
      token,
    );
    expect(result).toEqual({
      array_key: [{ nested_key_one: true }, { nested_key_two: false }],
      ...MOCK_DATA_2,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      {
        array_key: [{ nested_key_one: true }, { nested_key_two: false }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle arrays of booleans', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_3 });
    const result = await parseObjectAndSend(
      { arrayOfBooleans: MOCK_INPUT.arrayOfBooleans },
      token,
    );
    expect(result).toEqual({
      array_of_booleans: MOCK_INPUT.arrayOfBooleans,
      ...MOCK_DATA_3,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      { array_of_booleans: MOCK_INPUT.arrayOfBooleans },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle arrays of numbers', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_1 });
    const result = await parseObjectAndSend(
      { arrayOfNumbers: MOCK_INPUT.arrayOfNumbers },
      token,
    );
    expect(result).toEqual({
      array_of_numbers: MOCK_INPUT.arrayOfNumbers,
      ...MOCK_DATA_1,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      { array_of_numbers: MOCK_INPUT.arrayOfNumbers },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle arrays of dates', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_2 });
    const result = await parseObjectAndSend(
      { arrayOfDates: MOCK_INPUT.arrayOfDates },
      token,
    );
    expect(result).toEqual({
      array_of_dates: MOCK_INPUT.arrayOfDates,
      ...MOCK_DATA_2,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      { array_of_dates: MOCK_INPUT.arrayOfDates },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle arrays of strings', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_3 });
    const result = await parseObjectAndSend(
      { arrayOfStrings: MOCK_INPUT.arrayOfStrings },
      token,
    );
    expect(result).toEqual({
      array_of_strings: [true, false, 123, 'someString'],
      ...MOCK_DATA_3,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      { array_of_strings: [true, false, 123, 'someString'] },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle optional objects', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_1 });
    const result = await parseObjectAndSend(
      { optionalObject: MOCK_INPUT.optionalObject },
      token,
    );
    expect(result).toEqual({
      optional_object: MOCK_INPUT.optionalObject,
      ...MOCK_DATA_1,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      { optional_object: MOCK_INPUT.optionalObject },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });

  it('should handle key-value objects', async () => {
    mockedAxios.post.mockResolvedValue({ data: MOCK_DATA_2 });
    const result = await parseObjectAndSend(
      { keyValueObject: MOCK_INPUT.keyValueObject },
      token,
    );
    expect(result).toEqual({
      key_value_object: MOCK_INPUT.keyValueObject,
      ...MOCK_DATA_2,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:3000',
      { key_value_object: MOCK_INPUT.keyValueObject },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      },
    );
  });
});
