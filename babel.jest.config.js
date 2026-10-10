// Babel config used ONLY by Jest (see jest.config.js). Kept separate from
// babel.config.js so Metro keeps its own (reanimated plugin, etc.).
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  // Hoist jest.mock(...) above imports so module mocks apply before modules load.
  plugins: ["babel-plugin-jest-hoist"],
};
