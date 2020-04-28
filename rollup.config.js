// Package.json.
import _package from './package.json';
// Rollup plugins.
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

/**
 * Check whether the value is an object.
 * @param {Any} value Value of unknown type.
 * @returns Whether the value is an object.
 */
const isObject = function(value) {
	return (value && typeof value === `object` && !Array.isArray(value));
};

/**
 * Deeply assign a series of objects properties together.
 * @param {Object} target Target object to merge to.
 * @param  {...Object} sources Objects to merge into the target.
 */
const deepAssign = function(target, ...sources) {
	if (!sources.length) {
		return target;
	}
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) {
					Object.assign(target, {
						[key]: {}
					});
				}
				deepAssign(target[key], source[key]);
			} else if (Array.isArray(source[key])) {
				target[key] = source[key].map((value) => {
					if (isObject(value)) {
						return deepAssign({}, value);
					}
					return value;
				});
			} else {
				Object.assign(target, {
					[key]: source[key]
				});
			}
		}
	}

	return deepAssign(target, ...sources);
};

// File extensions to potentially process.
const extensions = [
	`.es`,
	`.js`,
	`.mjs`,
	`.ts`,
];

// List of configs to return.
const configs = [];

// UMD config.
const configUMD = {
	input: `./src/index.ts`,
	output: {
		file: _package.browser,
		format: `umd`,
		name: _package.packagename,
	},
	plugins: [
		resolve({
			extensions: extensions,
		}),
		babel({
			exclude: `node_modules/**`,
			extensions: extensions,
		}),
	],
};
if (process.env.NODE_ENV === `production`) {
	// Clone options.
	const configUMDMin = deepAssign({}, configUMD);

	// Rename file name to add 'min' before file extension.
	const fileSplit = configUMDMin.output.file.split(`.`);
	fileSplit.splice(fileSplit.length - 1, 0, `min`);
	configUMDMin.output.file = fileSplit.join(`.`);

	// Enable sourcemap for minified build.
	configUMDMin.output.sourcemap = true;

	// Add uglify to plugins.
	configUMDMin.plugins.push(uglify());

	// Add config to the list.
	configs.push(configUMDMin);
}

// Add config to list.
configs.push(configUMD);

module.exports = configs;
