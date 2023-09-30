const { createConfig } = require('semantic-release-config-gitmoji/lib/createConfig');

const config = createConfig({ monorepo: true });

module.exports = config;
