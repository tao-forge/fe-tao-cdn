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

/**
 * Config manager for the services proxy of the QTI Test Review
 *
 *  @author Hanna Dzmitryieva <hanna@taotesting.com>
 */
define([
    'lodash',
    'util/url',
    'util/config'
], function (_, urlUtil, configHelper) {
    'use strict';

    /**
     * Some default config values
     * @type {Object}
     * @private
     */
    const _defaults = {
        bootstrap: {
            serviceController: 'Review',
            serviceExtension: 'ltiTestReview'
        }
    };

    /**
     * The list of handled config entries. Each required entry is set to true, while optional entries are set to false.
     * @type {Object}
     * @private
     */
    const _entries = {
        serviceCallId: true,
        bootstrap: false,
        timeout: false
    };

    /**
     * Creates a config object for the proxy implementation
     * @param {Object} config - Some required and optional config
     * @param {String} config.serviceCallId - An identifier for the service call
     * @param {String} [config.bootstrap.serviceController] - The name of the service controller
     * @param {String} [config.bootstrap.serviceExtension] - The name of the extension containing the service controller
     * @returns {Object}
     */
    return function testReviewConfigFactory(config) {
        // protected storage
        const storage = configHelper.from(config, _entries, _defaults);

        // convert some values from seconds to milliseconds
        if (storage.timeout) {
            storage.timeout *= 1000;
        } else {
            /* eslint-disable-next-line */
            storage.timeout = undefined;
        }

        // returns only a proxy storage object : no direct access to data is provided
        return {
            /**
             * Gets the list of parameters
             * @param {String|Object} [itemIdentifier]
             * @returns {Object}
             */
            getParameters(itemIdentifier) {
                const type = typeof itemIdentifier;
                const parameters = {
                    serviceCallId: this.getServiceCallId()
                };

                if (type === 'string') {
                    // simple item identifier
                    parameters.itemUri = itemIdentifier;
                } else if (type === 'object' && _.isPlainObject(itemIdentifier)) {
                    // structured item identifier (a list of parameters)
                    Object.assign(parameters, itemIdentifier);
                } else if (type !== 'undefined') {
                    throw new TypeError('Wrong parameter type provided for itemIdentifier: ' + type + '. Only string or plain object are allowed!');
                }

                return parameters;
            },

            /**
             * Gets the URI of the service call
             * @returns {String}
             */
            getServiceCallId() {
                return storage.serviceCallId;
            },

            /**
             * Gets the name of the service controller
             * @returns {String}
             */
            getServiceController() {
                return storage.bootstrap.serviceController || _defaults.bootstrap.serviceController;
            },

            /**
             * Gets the name of the extension containing the service controller
             * @returns {String}
             */
            getServiceExtension() {
                return storage.bootstrap.serviceExtension || _defaults.bootstrap.serviceExtension;
            },

            /**
             * Gets an URL of a service action
             * @param {String} action - the name of the action to request
             * @returns {String} - Returns the URL
             */
            getTestActionUrl(action) {
                return urlUtil.route(action, this.getServiceController(), this.getServiceExtension(), this.getParameters());
            },

            /**
             * Gets an URL of a service action related to a particular item
             * @param {String|Object} itemIdentifier - The URI of the item
             * @param {String} action - the name of the action to request
             * @returns {String} - Returns the URL
             */
            getItemActionUrl(itemIdentifier, action) {
                return urlUtil.route(action, this.getServiceController(), this.getServiceExtension(), this.getParameters(itemIdentifier));
            },

            /**
             * Gets the request timeout
             * @returns {Number}
             */
            getTimeout() {
                return storage.timeout;
            },

            /**
             * Gets the config for the communication channel
             * @returns {Object}
             */
            getCommunicationConfig() {
                const communication = storage.bootstrap.communication || {};
                const extension = communication.extension || this.getServiceExtension();
                const controller = communication.controller || this.getServiceController();
                const action = communication.action || 'message';
                const syncActions = communication.syncActions || [];
                const serviceCallId = this.getServiceCallId();
                const service = communication.service || urlUtil.route(action, controller, extension, {serviceCallId});
                const params = Object.assign({}, communication.params || {}, {service});

                // convert some values from seconds to milliseconds
                if (params.timeout) {
                    params.timeout *= 1000;
                } else {
                    params.timeout = storage.timeout;
                }
                if (params.interval) {
                    params.interval *= 1000;
                }

                return {
                    enabled: communication.enabled,
                    type: communication.type,
                    params,
                    syncActions
                };
            }
        };
    };
});
