const dummySelection = {
  selectAll: jest.fn().mockReturnThis(),
  remove: jest.fn().mockReturnThis(),
  append: jest.fn().mockReturnThis(),
  attr: jest.fn().mockReturnThis(),
  datum: jest.fn().mockReturnThis(),
  call: jest.fn().mockReturnThis(),
  style: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  node: jest.fn().mockReturnValue({ getBBox: () => ({ x: 0, y: 0, width: 10, height: 10 }) }),
  text: jest.fn().mockReturnThis(),
};

export const select = jest.fn().mockReturnValue(dummySelection);
export const scaleLinear = jest.fn().mockReturnValue({
  domain: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
});
export const max = jest.fn().mockReturnValue(100);
export const least = jest.fn().mockReturnValue(null);
export const line = jest.fn().mockReturnValue({
  x: jest.fn().mockReturnThis(),
  y: jest.fn().mockReturnThis(),
  curve: jest.fn().mockReturnValue('line-path'),
});
export const curveMonotoneX = 'curveMonotoneX';
export const axisBottom = jest.fn().mockReturnValue({ tickFormat: jest.fn().mockReturnThis() });
export const axisLeft = jest.fn().mockReturnThis();
export const pointer = jest.fn().mockReturnValue([0, 0]);
