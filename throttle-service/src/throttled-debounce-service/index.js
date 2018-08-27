/**
 *
 * @param {*} fn
 * @param {*} wait
 * @return {Function}
 */
export default (fn, wait) => {
  let timeout = null;
  let execCount = 0;
  let execSeries = 0;

  return (...args) => {
    let execIndex = execCount++;
    let later = (execSeriesIndex) => {
      timeout = null;
      if (execIndex === execCount - 1 && execSeriesIndex === execSeries) {
        execCount = 0;
        execSeries++;
        if (execIndex > 0) {
          return fn(...args);
        }
      }
      return Promise.reject();
    };

    clearTimeout(timeout);
    return new Promise((resolve) => {
      timeout = setTimeout(() => {
        return later(execSeries).then(resolve).catch(()=>{});
      }, wait);

      if (execIndex === 0) {
        return fn(...args).then(resolve);
      }
    });
  };
};
