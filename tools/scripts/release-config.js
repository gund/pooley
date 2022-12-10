module.exports.getReleaseConfig = (pkgName) => ({
  extends: 'release.config.base.js',
  pkgRoot: `dist/packages/${pkgName}`,
  tagFormat: `${pkgName}@v\${version}`,
  commitPaths: [`packages/${pkgName}/*`],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: `packages/${pkgName}/CHANGELOG.md`,
        changelogTitle: '# core - Changelog',
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        message: `chore(release): release ${pkgName}@\${nextRelease.version} [skip ci]\n\n\${nextRelease.notes}`,
        assets: [`packages/${pkgName}/CHANGELOG.md`],
      },
    ],
    '@semantic-release/github',
  ],
});
