const defaults = require('./default').config;

const user = process.env.TB_KEY;
const key = process.env.TB_SECRET;


const config = {
  ...defaults,
  //
  // ====================
  // Default Runner Configuration
  // ====================
  user,
  key,
  host: 'hub.testingbot.com',
  tbTunnel: false,
  tbTunnelOpts: {},
  capabilities: [
    {
      browserName: 'chrome',
      browserVersion: 'latest',
      platformName: 'WIN10'
    }
  ],
  services: ['testingbot'],
  beforeSession(config, capabilities, specs) {
    if (typeof process.env.JOB_ID !== 'undefined') {
      capabilities.build = process.env.JOB_ID;
    }
  }
};

exports.config = config;
