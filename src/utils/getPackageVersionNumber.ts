// Leave as require - TS won't compile if import used on file outside of src/
// eslint-disable-next-line
const pkg = require('../../package.json')

/**
 * Gets the package version number so we can display it in the app
 */
export function getPackageVersionNumber(): string {
  return `v${pkg.version}`
}
