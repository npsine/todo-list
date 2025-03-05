module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.json' }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!axios)'],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};