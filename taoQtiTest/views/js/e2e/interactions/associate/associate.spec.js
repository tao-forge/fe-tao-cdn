/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2019 (original work) Open Assessment Technologies SA ;
 */

import {commonInteractionSelectors} from '../../_helpers/selectors/interactionSelectors';

import '../../_helpers/commands/setupCommands';
import '../../_helpers/commands/cleanupCommands';
import '../../_helpers/routes/backOfficeRoutes';
import '../../_helpers/routes/runnerRoutes';

import base64Test from './fixtures/base64AssociateInteractionTestPackage';

describe('Interactions', () => {

    /**
     * Setup to have a proper delivery:
     * - Start server
     * - Add necessary routes
     * - Admin login
     * - Import test package
     * - Publish imported test as a delivery
     * - Set guest access on delivery and save
     * - Logout
     */
    before(() => {
        cy.setupServer();
        cy.addBackOfficeRoutes();
        cy.login('admin');
        cy.importTestPackage(base64Test, 'associate');
        cy.publishTest('associate');
        cy.setDeliveryForGuests('Delivery of associate');
        cy.logout();
    });

    /**
     * Log in & start the test
     */
    beforeEach(() => {
        cy.setupServer();
        cy.addRunnerRoutes();
        cy.guestLogin();
        cy.startTest('associate');
    });

    /**
     * Destroy everything we created during setup, leaving the environment clean for next time.
     */
    after(() => {
        cy.setupServer();
        cy.addBackOfficeRoutes();
        cy.login('admin');
        cy.deleteItem('associate');
        cy.deleteTest('associate');
        cy.deleteDelivery('Delivery of associate');
    });

    /**
     * Interaction tests
     */
    describe('Associate interaction', () => {
        it('Loads in proper state', function () {
            cy.get(commonInteractionSelectors.interaction).eq(0).within(() => {
                cy.get(commonInteractionSelectors.choiceArea).should('exist');
                cy.get('.qti-choice').should('have.length', 4);

                cy.get(commonInteractionSelectors.resultArea).should('exist');
                cy.get('.target.lft.filled.active').should('have.length', 0);
            });
        });

        it.skip('Add item to resultArea', function () {
            cy.get(commonInteractionSelectors.interaction).eq(0).within(() => {
                cy.get('.qti-choice[data-identifier=choice_1]').click();
                cy.get('.qti-choice[data-identifier=choice_1]').should('have.class', 'active');
                cy.get('.qti-choice').should('have.length', 3);

                cy.get('.target').eq(0).click();
                cy.get('.target.lft.filled.active').should('have.length', 1);
            });
        });

        it.skip('Remove item from resultArea', function () {
        });

        it.skip('Cannot create same association', function () {
        });

        it.skip('Removing left association makes row disappear', function () {
        });

        it.skip('Cannot create association because max amount is reached', function () {
        });

        it.skip('Interaction keeps state', function () {
        });

    });
});
