const _package = require(`../package.json`);

const config = {
	host: `localhost`,
	port: `8080`,

	dest: `./docs/`,
	patterns: [
		`*.md`,
	],

	title: _package.packagename,
	description: _package.description,

	themeConfig: {
		displayAllHeaders: true,

		lastUpdated: `Last updated`,

		nav: [
			{ text: `Home`, link: `/` },
			{ text: `Changelog`, link: `/changelog/` },
		],

		repo: _package.repository.url,
		repoLabel: `GitHub`,

		searchPlaceholder: `Search...`,

		sidebar: `auto`,
		sidebarDepth: 3,

		smoothScroll: true,
	},
};

if (process.env.NODE_ENV === `production`) {
	config.base = `/docs/`;
}

module.exports = config;
