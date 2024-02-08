/// <reference types="cypress" />

describe('E-commerce Website Testing', () => {
    beforeEach(() => {
      cy.visit('/'); // Assuming the website URL is provided here
    });
  
    it('User Registration and Login', () => {
      // Navigate to the signup page
      cy.contains('Sign Up').click();
  
      // Generate unique data for registration
      const username = `user_${Math.floor(Math.random() * 100000)}`;
      const email = `${username}@example.com`;
      const password = 'testPassword123';
  
      // Fill out the registration form
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
  
      // Verify successful registration and redirect to the login page
      cy.contains('Login').should('exist');
  
      // Log in with the newly created credentials
      cy.contains('Login').click();
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
  
      // Confirm that the login is successful
      cy.contains('Welcome').should('exist');
      cy.url().should('include', '/homepage'); // Assuming successful login redirects to the homepage
    });
  
    it('Product Search and Filter', () => {
      // Use the search function to find products related to "electronics"
      cy.get('input[name="search"]').type('electronics').type('{enter}');
  
      // Apply filters to narrow down the search results
      cy.contains('Filter').click();
      cy.get('input[name="price"]').type('100-500');
      cy.contains('Apply').click();
  
      // Verify that the displayed products match the search criteria and filters applied
      cy.get('.product').should('exist'); // Assuming product cards have a class name of 'product'
      // Add assertions to validate the search results and filters applied as per the requirement
    });
  
    it('Adding Items to Cart', () => {
      // Select a product from the search results and navigate to its details page
      cy.get('.product').first().click(); // Clicking on the first product in the search results
  
      // Add the product to the shopping cart
      cy.contains('Add to Cart').click();
  
      // Verify that the cart updates correctly with the selected item
      cy.contains('Shopping Cart').click(); // Assuming the cart icon has text 'Shopping Cart'
      cy.get('.cart-item').should('have.length', 1); // Assuming cart items have a class name of 'cart-item'
      // Add assertions to validate the correctness of the added item in the cart
    });
  });
  