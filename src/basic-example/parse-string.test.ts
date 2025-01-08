import parseString from './parse-string';

const MOCK_HELLO = 'hello';
const MOCK_TRUE_STRING = 'true';
const MOCK_FALSE_STRING = 'false';
const MOCK_NUMBER_STRING = '123';
const MOCK_EMPTY_STRING = '';
const MOCK_WHITESPACE_STRING = '   ';

const EXPECT_HELLO = 'hello';
const EXPECT_TRUE = true;
const EXPECT_FALSE = false;
const EXPECT_NUMBER = 123;
const EXPECT_EMPTY_STRING = '';
const EXPECT_WHITESPACE_STRING = '   ';

describe('parseString', () => {
  it('should return the original string when provided a string', () => {
    const result = parseString(MOCK_HELLO);
    expect(result).toBe(EXPECT_HELLO);
  });

  it('should return true for the string "true"', () => {
    const result = parseString(MOCK_TRUE_STRING);
    expect(result).toBe(EXPECT_TRUE);
  });

  it('should return false for the string "false"', () => {
    const result = parseString(MOCK_FALSE_STRING);
    expect(result).toBe(EXPECT_FALSE);
  });

  it('should return a number for when provided a number represented as a string', () => {
    const result = parseString(MOCK_NUMBER_STRING);
    expect(result).toBe(EXPECT_NUMBER);
  });

  it('should return the original string when provided an empty string', () => {
    const result = parseString(MOCK_EMPTY_STRING);
    expect(result).toBe(EXPECT_EMPTY_STRING);
  });

  it('should return the original string when provided a string with only whitespace', () => {
    const result = parseString(MOCK_WHITESPACE_STRING);
    expect(result).toBe(EXPECT_WHITESPACE_STRING);
  });
});
