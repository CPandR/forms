module.exports = {
  purge: ["./src/**/*.svelte", "./src/**/*.css"],
  plugins: [require("@tailwindcss/forms"), require("tw-elements/dist/plugin")],
};
