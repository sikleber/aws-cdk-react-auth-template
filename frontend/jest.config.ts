import type {Config} from 'jest';

const config: Config = {
  testEnvironment: "jsdom",
  roots: [
    '<rootDir>/src',
    '<rootDir>/test'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/src/__mocks__/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [
    '/src/index.tsx',
    '/src/@types/',
    '/src/__mocks__/',
  ],
};

export default config