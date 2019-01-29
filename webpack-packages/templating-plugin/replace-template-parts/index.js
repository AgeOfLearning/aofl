module.exports = (_template, match, replace) => {
  let template = _template;
  let i = template.indexOf(match);
  while (i > -1) {
    template = template.substring(0, i) + replace + template.substring(i + match.length);
    i = template.indexOf(match, i + match.length);
  }
  return template;
};
