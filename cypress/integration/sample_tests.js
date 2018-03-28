var BASE_URL = 'https://sylvainmetayer.github.io/agent-ready/';

describe('Tests', function () {

    beforeEach(function () {
        cy.visit(BASE_URL)
    })

    it('.should() - assert that <title> is correct', function () {
        cy.title().should('include', 'Agent Ready')
    })

    it('.should() - assert their is the start button', function () {
        cy.get('button').should('contain', "Commencer l'immersion !")
    })
})