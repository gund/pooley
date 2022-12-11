module.exports.getReleaseConfig = (pkgName) => ({
  pkgRoot: `dist/packages/${pkgName}`,
  tagFormat: `${pkgName}@v\${version}`,
  commitPaths: [`packages/${pkgName}/*`],
  branches: ['main', 'next'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: `packages/${pkgName}/CHANGELOG.md`,
        changelogTitle: `# ${pkgName} - Changelog`,
      },
    ],
    [
      '@semantic-release/exec',
      {
        // Initialize package.json in dist so @semantic-release/npm will not fail in verifyConditions
        verifyConditionsCmd: `mkdir -p dist/packages/${pkgName} && cp packages/${pkgName}/package.json dist/packages/${pkgName}/`,
        prepareCmd: `npx nx build ${pkgName}`,
      },
    ],
    [
      '@semantic-release/npm',
      {
        tarballDir: `dist/tars/${pkgName}/`,
      },
    ],
    [
      '@semantic-release/git',
      {
        message: `chore(release): release ${pkgName}@\${nextRelease.version} [skip ci]\n\n\${nextRelease.notes}`,
        assets: [`packages/${pkgName}/CHANGELOG.md`],
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: `dist/tars/${pkgName}/*.tgz`,
      },
    ],
  ],
});
