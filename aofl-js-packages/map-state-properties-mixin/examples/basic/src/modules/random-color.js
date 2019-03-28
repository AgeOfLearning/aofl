const colors = [
  '#b82d0a',
  '#c3b3e2',
  '#5cbd34',
  '#1519bb',
  '#aeb18e',
  '#dfd8cb',
  '#aa7cb1',
  '#c9cf40',
  '#8f62f4',
  '#30a86f',
  '#1c9632',
  '#825321',
  '#fa75b2',
  '#b40852',
  '#c20a05',
  '#e76f31',
  '#49aac8',
  '#0bd95c',
  '#7acfc3',
  '#efa0bc',
  '#9a685d'
];

export default () => {
  return colors[Math.round(Math.random() * colors.length)];
};
