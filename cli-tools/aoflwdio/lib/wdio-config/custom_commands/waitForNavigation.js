const waitForNavigation = function(url) {
  return this.waitUntil(() => {
    const newUrl = this.getUrl();
    return newUrl !== this.config.baseUrl + url;
  }, this.config.waitforTimeout, 'Page didn\'t navigate in time', this.config.waitforInterval);
};

module.exports = waitForNavigation;
