import axios from 'axios';
import convertCamelCaseToSnakeCase from '../basic-example/convert-camel-case-to-snake-case';
import parseString from '../basic-example/parse-string';
import { parseObject } from './parse-object-and-send';
import { ObjectType, ParsedObjectType } from './types';

const handleValue = (
  value:
    | string
    | number
    | boolean
    | Date
    | ObjectType
    | Array<ObjectType>
    | Array<string>
    | Array<number>
    | Array<boolean>
    | Array<Date>,
):
  | string
  | number
  | boolean
  | Date
  | ParsedObjectType
  | Array<ParsedObjectType | string | number | boolean | Date> => {
  if (typeof value === 'string') {
    return parseString(value);
  }
  if (Array.isArray(value)) {
    return value.map(
      (item) =>
        handleValue(item) as
          | string
          | number
          | boolean
          | Date
          | ParsedObjectType,
    );
  }
  if (
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    value !== null
  ) {
    return parseObject(value);
  }
  return value;
};

export const mergeAndTransform = (
  obj1: ObjectType,
  obj2: ObjectType,
): ParsedObjectType => {
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  const result: ParsedObjectType = {};

  keys.forEach((key) => {
    const snakeCaseKey = convertCamelCaseToSnakeCase(key);
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (typeof value2 === 'string') {
      result[snakeCaseKey] = parseString(value2);
    } else if (Array.isArray(value1) && Array.isArray(value2)) {
      result[snakeCaseKey] = [...value1, ...value2].map(
        (item) =>
          handleValue(item) as
            | string
            | number
            | boolean
            | Date
            | ParsedObjectType,
      );
    } else if (
      typeof value1 === 'object' &&
      !Array.isArray(value1) &&
      !(value1 instanceof Date) &&
      value1 !== null &&
      typeof value2 === 'object' &&
      !Array.isArray(value2) &&
      !(value2 instanceof Date) &&
      value2 !== null
    ) {
      result[snakeCaseKey] = mergeAndTransform(value1, value2);
    } else {
      result[snakeCaseKey] = handleValue(
        value2 !== undefined ? value2 : value1,
      );
    }
  });

  return result;
};

const mergeTransformAndSend = async (
  obj1: ObjectType,
  obj2: ObjectType,
): Promise<ParsedObjectType> => {
  const overallResult = mergeAndTransform(obj1, obj2);

  const response = await axios.put('http://localhost:3000', overallResult, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const parsedResponse = parseObject(response?.data || {});

  return { ...overallResult, ...parsedResponse };
};

export default mergeTransformAndSend;
