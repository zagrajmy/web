const withFonts = require("next-fonts");
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

module.exports = withMDX(
  withFonts({
    pageExtensions: ["ts", "tsx", "mdx", "md"],

    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        // eslint-disable-next-line no-param-reassign
        config.node = {
          fs: "empty",
        };
      }

      // eslint-disable-next-line no-param-reassign
      config.plugins = config.plugins.filter(
        // We'll typecheck in CI and locally. Workaround for GC issue.
        (plugin) => plugin.constructor.name !== "ForkTsCheckerWebpackPlugin"
      );

      return config;
    },
    typescript: {
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // We'll get rid of it some day after cleaning up collateral damage from
      // database migration.
      ignoreBuildErrors: true,
    },
  })
);
