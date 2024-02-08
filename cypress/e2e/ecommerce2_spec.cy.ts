/// <reference types="cypress" />

describe('E-commerce Website Testing', () => {
    beforeEach(() => {
      // Mocking the visit to the e-commerce website
      cy.visit('/');
    });
  
    it('User Registration and Login', () => {
      // Mocking user registration
      cy.intercept('POST', '/api/register', (req) => {
        const { username, email, password } = req.body;
        expect(username).to.be.a('string').and.not.empty;
        expect(email).to.be.a('string').and.not.empty;
        expect(password).to.be.a('string').and.not.empty;
        req.reply({
          statusCode: 200,
          body: { message: 'Registration successful' }
        });
      }).as('registration');
  
      // Mocking user login
      cy.intercept('POST', '/api/login', (req) => {
        const { email, password } = req.body;
        expect(email).to.be.a('string').and.not.empty;
        expect(password).to.be.a('string').and.not.empty;
        req.reply({
          statusCode: 200,
          body: { message: 'Login successful' }
        });
      }).as('login');
  
      // Perform user registration
      cy.contains('Sign Up').click();
      const username = `user_${Math.floor(Math.random() * 100000)}`;
      const email = `${username}@example.com`;
      const password = 'testPassword123';
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait('@registration');
  
      // Verify successful registration and redirect to the login page
      cy.contains('Login').should('exist');
  
      // Perform user login
      cy.contains('Login').click();
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
      cy.wait('@login');
  
      // Confirm that the login is successful
      cy.contains('Welcome').should('exist');
      cy.url().should('include', '/homepage');
    });
  
    it('Product Search and Filter', () => {
      // Mocking product search
      cy.intercept('GET', '/api/products', (req) => {
        const searchTerm = req.url.split('=')[1];
        expect(searchTerm).to.equal('electronics');
        req.reply({
          statusCode: 200,
          body: [{ name: 'Product 1', price: 150 }, { name: 'Product 2', price: 300 }]
        });
      }).as('search');
  
      // Mocking product filter
      cy.intercept('GET', '/api/products?price=100-500', (req) => {
        req.reply({
          statusCode: 200,
          body: [{ name: 'Product 1', price: 150 }]
        });
      }).as('filter');
  
      // Perform product search
      cy.get('input[name="search"]').type('electronics').type('{enter}');
      cy.wait('@search');
  
      // Apply filters to narrow down the search results
      cy.contains('Filter').click();
      cy.get('input[name="price"]').type('100-500');
      cy.contains('Apply').click();
      cy.wait('@filter');
  
      // Verify that the displayed products match the search criteria and filters applied
      cy.get('.product').should('exist');
      // Add assertions to validate the search results and filters applied as per the requirement
    });
  
    it('Adding Items to Cart', () => {
      // Mocking adding items to cart
      cy.intercept('POST', '/api/cart/add', (req) => {
        const productId = req.body.productId;
        expect(productId).to.be.a('string').and.not.empty;
        req.reply({
          statusCode: 200,
          body: { message: 'Item added to cart' }
        });
      }).as('addToCart');
  
      // Mocking cart contents
      cy.intercept('GET', '/api/cart', {
        statusCode: 200,
        body: [{ productId: 'product1', quantity: 1 }]
      }).as('getCart');
  
      // Select a product from the search results and navigate to its details page
      cy.get('.product').first().click();
  
      // Add the product to the shopping cart
      cy.contains('Add to Cart').click();
      cy.wait('@addToCart');
  
      // Verify that the cart updates correctly with the selected item
      cy.contains('Shopping Cart').click();
      cy.wait('@getCart');
      cy.get('.cart-item').should('have.length', 1);
      // Add assertions to validate the correctness of the added item in the cart
    });
});
