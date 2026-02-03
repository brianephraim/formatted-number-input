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
config.resolver.unstable_enablePackageExports = false;
// Prefer CommonJS "main" over ESM "module" for Metro compatibility.
// Some dependencies (e.g. punycode) are imported via `require()` by upstream libs and break when Metro
// resolves to the ESM entrypoint.
config.resolver.resolverMainFields = ['react-native', 'browser', 'main', 'module'];

// Resolve the workspace package from source so we can skip a build step.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@rn-number-input/core': path.resolve(workspaceRoot, 'packages/core/src')
};

module.exports = config;
