import { AUTH0_DOMAIN } from "../support/util";

describe("/", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("enters index page, is redirected to Auth0 with click to [log in]", () => {
    cy.findByText(/log in/i)
      .click()
      .url()
      .should("include", `${AUTH0_DOMAIN}/u/login`);
  });

  it("enters index page, logins and goes to /meetings page", () => {
    cy.login();
    cy.findByText(/meetings/i).click();
    cy.findByText(/organize meeting/i);
    cy.findByText(/your next meeting/i);
    cy.findByText(/meetings you organize/i);
  });
});
