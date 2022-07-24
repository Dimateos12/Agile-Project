describe("Home page is loaded", () => {
  it("Should load all data in the HomePage", () => {
    cy.intercept("/mgmt/publications*").as("publicationsReq");
    cy.intercept("/mgmt/projects*").as("projectReq");
    cy.intercept("/mgmt/users*").as("usersReq");

    cy.visit("/");

    cy.wait("@projectReq").then((loginResponse) => {
      expect(loginResponse.response?.statusCode).to.be.equal(200);
      expect(loginResponse.response?.body).to.be.an("array");
    });

    cy.wait("@publicationsReq").then((loginResponse) => {
      expect(loginResponse.response?.statusCode).to.be.equal(200);
      expect(loginResponse.response?.body).to.be.an("array");
    });

    cy.wait("@usersReq").then((loginResponse) => {
      expect(loginResponse.response?.statusCode).to.be.equal(200);
      expect(loginResponse.response?.body).to.be.an("array");
    });
  });

  it("Load all components in the HomPage", () => {
    cy.visit("/");

    cy.get("#latest-publications")
      .should("exist")
      .should("contain", "Latest publications");

    cy.get("#latest-projects")
      .should("exist")
      .should("contain", "Latest projects");

    cy.get("#latest-researchers")
      .should("exist")
      .should("contain", "Latest researchers");

    cy.get("#filters-row").should("not.exist");

    cy.get("#footer").should("exist").should("contain", "SIRP");

    cy.get("#top-bar").contains("a", /^SIRP$/);
    cy.get("#top-bar").contains("a", /^Users$/);
    cy.get("#top-bar").contains("a", /^Projects$/);
    cy.get("#top-bar").contains("a", /^Publications$/);

    cy.get("#login-btn").should("exist");

    cy.get("#login-btn")
      .click()
      .then(() => {
        cy.url().should("include", "/login");
      });
  });
});
