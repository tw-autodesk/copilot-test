import convertCamelCaseToSnakeCase from '../basic-example/convert-camel-case-to-snake-case';
import parseString from '../basic-example/parse-string';
import { ObjectType, ParsedObjectType } from './types';
import axios from 'axios';

export const parseObject = (nestedObj: ObjectType): ParsedObjectType => {
  const result: ParsedObjectType = {};

  for (const key in nestedObj) {
    const snakeCaseKey = convertCamelCaseToSnakeCase(key);
    const value = nestedObj[key];

    if (typeof value === 'string') {
      result[snakeCaseKey] = parseString(value);
    } else if (Array.isArray(value)) {
      result[snakeCaseKey] = value.map((item) => {
        if (typeof item === 'string') {
          return parseString(item);
        }
        if (
          typeof item === 'object' &&
          !(item instanceof Date) &&
          item !== null
        ) {
          return parseObject(item);
        }
        return item;
      });
    } else if (
      typeof value === 'object' &&
      !(value instanceof Date) &&
      value !== null
    ) {
      result[snakeCaseKey] = parseObject(value);
    } else {
      result[snakeCaseKey] = value;
    }
  }

  return result;
};

const parseObjectAndSend = async (
  obj: ObjectType,
  token: string,
): Promise<ParsedObjectType> => {
  const overallResult = parseObject(obj);

  const response = await axios.post('http://localhost:3000', overallResult, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  return { ...overallResult, ...(response?.data || {}) };
};

export default parseObjectAndSend;
