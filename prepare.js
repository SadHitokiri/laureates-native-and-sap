// prepare.js

const isProduction = process.env.NODE_ENV === 'production';
const isCi = process.env.CI !== undefined;

if (!isCi && !isProduction) {
	require('husky').install();
}
