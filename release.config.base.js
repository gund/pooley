module.exports = {
  branches: [
    'master',
    {
      name: 'next',
      prerelease: true,
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        message:
          'chore(release): release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        assets: ['CHANGELOG.md'],
      },
    ],
    '@semantic-release/github',
  ],
};
