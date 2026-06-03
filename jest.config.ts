import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^utils$': '<rootDir>/src/utils/index.ts',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^context/(.*)$': '<rootDir>/src/context/$1',
    '^enums/(.*)$': '<rootDir>/src/enums/$1',
    '^server/(.*)$': '<rootDir>/src/server/$1',
    '^styles/(.*)$': '<rootDir>/src/styles/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
    '^pages/(.*)$': '<rootDir>/src/pages/$1',
    '^app-links$': '<rootDir>/src/app-links.ts',
    '^Config$': '<rootDir>/src/Config.ts',
    '^MongoClient$': '<rootDir>/src/MongoClient.ts',
    '^d3(.*)$': '<rootDir>/src/__mocks__/d3.ts',
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
