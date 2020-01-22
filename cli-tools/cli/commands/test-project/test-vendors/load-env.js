/* eslint-disable */
import './get-test-container';

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END
} = Mocha.Runner.constants;


const getFullTitle = (test) => {
  const parts = [];

  while (test.parent) {
    parts.push(test.title);
    test = test.parent;
  }

  return parts.reverse().join(' >> ');
};

// this reporter outputs test results, indenting two spaces per suite
class MyReporter {
  constructor(runner, opts) {
    new Mocha.reporters.HTML(runner, opts);
    // new Mocha.reporters.JSONStream(runner, opts);

    this._indents = 0;
    const stats = runner.stats;

    runner
      // .once(EVENT_RUN_BEGIN, () => {
      //   console.log('start');
      // })
      // .on(EVENT_SUITE_BEGIN, () => {
      //   this.increaseIndent();
      // })
      .on(EVENT_SUITE_END, () => {
        // this.decreaseIndent();
        document.querySelector('#mocha-report').lastElementChild.scrollIntoView();
      })
      .on(EVENT_TEST_PASS, (test) => {
        // Test#fullTitle() returns the suite name(s)
        // prepended to the test title
        window.aofljsConfig.report.stream.push([
          'pass',
          {
            title: test.title,
            fullTitle: getFullTitle(test),
            duration: test.duration,
            currentRetry: test.currentRetry(),
            speed: test.speed
          }
        ]);
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        window.aofljsConfig.report.pass = false;
        window.aofljsConfig.report.stream.push([
          'fail',
          {
            title: test.title,
            fullTitle: test.fullTitle(),
            duration: test.duration,
            currentRetry: test.currentRetry(),
            err: err.message,
            stack: err.stack
          }
        ]);
        // window.aofljsConfig.report.output += `${this.indent()}fail: ${test.fullTitle()} - error: ${err.message}\n${this.indent()}${err.stack}`
        // console.log(`${this.indent()}fail: ${test.fullTitle()} - error: ${err.message}`);
      })
      .once(EVENT_RUN_END, () => {
        window.aofljsConfig.report.stats = stats;
        window.aofljsConfig.report.coverage = window.__coverage__;
        window.aofljsConfig.report.status = 'done';
        // console.log('end', aofljsConfig.report.status);
        // console.log(`end: ${stats.passes}/${stats.passes + stats.failures} ok`);
      });
  }

  // indent() {
  //   return Array(this._indents).join('  ');
  // }

  // increaseIndent() {
  //   this._indents++;
  // }

  // decreaseIndent() {
  //   this._indents--;
  // }
}

mocha.setup({
  reporter: MyReporter,
  ...(window.mochaConfig || {ui: 'bdd', timeout: 10000})
});
