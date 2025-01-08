const convertCamelCaseToSnakeCase = (str: string) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export default convertCamelCaseToSnakeCase;
