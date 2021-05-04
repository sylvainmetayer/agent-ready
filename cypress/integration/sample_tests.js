var BASE_URL = 'https://sylvainmetayer.github.io/agent-ready/';
var BASE_URL = "http://localhost:9000/";

describe('Tests', () => {
    beforeEach(() => {
        cy.visit(BASE_URL)
    })

    it('.should() - assert that <title> is correct', () => {
        cy.title().should('include', 'Agent Ready')
    })

    it('.should() - assert their is the start button', () => {
        cy.get('button').should('contain', "Commencer l'immersion !")
    })
})
