import BabelJest from 'babel-jest';

const transformer = BabelJest.createTransformer({
  rootMode: 'upward',
});

export default transformer;
