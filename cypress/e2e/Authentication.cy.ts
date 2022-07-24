describe("Testing login functionalities", () => {
  it("Should login using correct credentials", () => {
    
    cy.intercept("/mgmt/users/manager@si.com").as("loginReq");
    cy.intercept("/mgmt/projects*").as("projectReq");

    cy.visit("/login");
    cy.get("#email").click().type("manager@si.com");
    cy.get("#password").click().type("secret");

    cy.get("#login").click();


    cy.wait("@loginReq").then((loginResponse) => {
      expect(loginResponse.response?.statusCode).to.be.equal(200);
      expect(loginResponse.response?.headers["auth-token"]).to.be.a("string");
      expect(loginResponse.response?.body).to.be.an("object");
    });

    cy.url().should("include", "/manage/projects");

    cy.wait("@projectReq").then((projectResponse) => {
      expect(projectResponse.response).to.not.be.null;
      expect(projectResponse.response?.statusCode).to.be.equal(200);
      expect(projectResponse.response?.body).to.be.an("array");
    });
  });

  it("Should fail login using wrong credentials", () => {
    cy.visit("/login");
    cy.get("#email").click().type("manager@si.com");
    cy.get("#password").click().type("secret!!");

    cy.get("#login")
      .click()
      .then(() => {
        cy.url().should("include", "/login");
        cy.get(".cy-snackbar").contains("Wrong credentials please try again");
      });
  });
});
