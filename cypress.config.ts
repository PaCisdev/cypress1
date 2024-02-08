import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
  },
});
