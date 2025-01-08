// This test file was generated using AI
// It's provided as an example, if needed

import convertCamelCaseToSnakeCase from '../basic-example/convert-camel-case-to-snake-case';

const MOCK_CAMEL_CASE_STRING = 'camelCaseString';
const MOCK_SINGLE_WORD = 'word';
const MOCK_EMPTY_STRING = '';
const MOCK_CAMEL_CASE_WITH_NUMBERS = 'camelCase123String';

const EXPECT_SNAKE_CASE_STRING = 'camel_case_string';
const EXPECT_SINGLE_WORD = 'word';
const EXPECT_EMPTY_STRING = '';
const EXPECT_SNAKE_CASE_WITH_NUMBERS = 'camel_case123_string';

describe('convertCamelCaseToSnakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    const result = convertCamelCaseToSnakeCase(MOCK_CAMEL_CASE_STRING);
    expect(result).toEqual(EXPECT_SNAKE_CASE_STRING);
  });

  it('should return the same string if there are no uppercase letters', () => {
    const result = convertCamelCaseToSnakeCase(MOCK_SINGLE_WORD);
    expect(result).toEqual(EXPECT_SINGLE_WORD);
  });

  it('should return an empty string when provided an empty string', () => {
    const result = convertCamelCaseToSnakeCase(MOCK_EMPTY_STRING);
    expect(result).toEqual(EXPECT_EMPTY_STRING);
  });

  it('should handle camelCase strings with numbers correctly', () => {
    const result = convertCamelCaseToSnakeCase(MOCK_CAMEL_CASE_WITH_NUMBERS);
    expect(result).toEqual(EXPECT_SNAKE_CASE_WITH_NUMBERS);
  });
});
