const { createConfig } = require('semantic-release-config-gitmoji/lib/createConfig');

const config = createConfig({ monorepo: true });

// monorepo 多包并行会打爆 GitHub Search API（success 步骤搜 PR 留言）
config.plugins = config.plugins.map((plugin) => {
  if (plugin === '@semantic-release/github') {
    return [
      '@semantic-release/github',
      {
        successComment: false,
        failComment: false,
        failTitle: false,
        releasedLabels: false,
      },
    ];
  }
  if (Array.isArray(plugin) && plugin[0] === '@semantic-release/github') {
    return [
      '@semantic-release/github',
      {
        ...plugin[1],
        successComment: false,
        failComment: false,
        failTitle: false,
        releasedLabels: false,
      },
    ];
  }
  return plugin;
});

module.exports = config;
