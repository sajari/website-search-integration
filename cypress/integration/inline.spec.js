describe("Inline Website Search Integration", () => {
  it("successfully loads", () => {
    cy.visit("/");
    cy.get("input").type("doc");
    cy.get("#sj-search-button").click();
    cy.url().should("include", "?q=doc");
  });
});
