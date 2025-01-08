const parseString = (val: string): string | boolean | number => {
  // boolean
  if (val?.toLowerCase() === 'true') {
    return true;
  } else if (val?.toLowerCase() === 'false') {
    return false;
  }

  // number
  if (val?.trim() && !Number.isNaN(Number(val))) {
    return Number(val);
  }

  // string
  return val;
};

export default parseString;
