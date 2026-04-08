import type { Config } from "jest";

const config: Config = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/src/test-utils/setupPolyfills.ts'],

    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.spec.json' }],
    },

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    moduleNameMapper: {
        // Redirect env.ts (uses import.meta which is invalid in Jest/Node CJS context)
        // to a test-safe version that reads from process.env instead.
        '^@config/env$': '<rootDir>/src/config/__mocks__/env',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@theme/(.*)$': '<rootDir>/src/theme/$1',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@router/(.*)$': '<rootDir>/src/router/$1',
        '^@errors/(.*)$': '<rootDir>/src/errors/$1',
        '^@api/(.*)$': '<rootDir>/src/api/$1',

        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // prevent error when import CSS
    },

    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // find test files
    clearMocks: true, //  clear mock after each test
};

export default config;
