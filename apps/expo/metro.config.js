const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules')
];

config.resolver.disableHierarchicalLookup = true;

// Resolve the workspace package from source so we can skip a build step.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@rn-number-input/core': path.resolve(workspaceRoot, 'packages/core/src')
};

module.exports = config;
