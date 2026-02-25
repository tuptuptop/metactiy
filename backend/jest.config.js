module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/app.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['./tests/setup.js'],
    testTimeout: 10000
};
