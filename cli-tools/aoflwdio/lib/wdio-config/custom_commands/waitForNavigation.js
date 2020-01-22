const waitForNavigation = function() {
  const currentUrl = this.getUrl();
  return this.waitUntil(() => {
    return browser.getUrl() !== currentUrl;
  }, 10000, 'Page didnt navigate in time', 250);
};

module.exports = waitForNavigation;