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
 * Test runner proxy for the QTI Test Review, relying on remote services to get the data
 *
 * @author Hanna Dzmitryieva <hanna@taotesting.com>
 */
define([
    'lodash',
    'core/promiseQueue',
    'core/request',
    'core/communicator',
    'ltiTestReview/review/config/qtiTestReviewConfig'
], function (_, promiseQueue, coreRequest, communicatorFactory, configFactory) {
    'use strict';

    /**
     * QTI proxy definition
     * Related to remote services calls
     * @typedef {Object} qtiTestReviewProxy
     */
    return {

        name: 'qtiTestReviewProxy',

        /**
         * Installs the proxy
         */
        install() {
            /**
             * A promise queue to ensure requests run sequentially
             */
            this.queue = promiseQueue();

            /**
             * Proxy request function. Returns a promise
             * Applied options: asynchronous call, JSON data, no cache
             * @param {String} url
             * @param {Object} [reqParams]
             * @param {String} [contentType] - to force the content type
             * @param {Boolean} [noToken] - to disable the token
             * @returns {Promise}
             */
            this.request = (url, reqParams, contentType, noToken) => {
                return coreRequest({
                    url: url,
                    data: reqParams,
                    method: reqParams ? 'POST' : 'GET',
                    contentType: contentType,
                    noToken: noToken,
                    background: false,
                    sequential: true,
                    timeout: this.configStorage.getTimeout()
                })
                    .then(response => {
                        this.setOnline();

                        if (response && response.success) {
                            return Promise.resolve(response);
                        } else {
                            return Promise.reject(response);
                        }
                    })
                    .catch(error => {
                        if (error.data && this.isConnectivityError(error.data)) {
                            this.setOffline('request');
                        }
                        return Promise.reject(error);
                    });
            };
        },

        /**
         * Initializes the proxy
         * @param {Object} config - The config provided to the proxy factory
         * @param {String} config.serviceCallId - The URI of the service call
         * @param {Object} [params] - Some optional parameters to join to the call
         * @returns {Promise} - Returns a promise. The proxy will be fully initialized on resolve.
         *                      Any error will be provided if rejected.
         */
        init(config, params) {
            // store config in a dedicated configStorage
            this.configStorage = configFactory(config || {});

            // request for initialization
            return this.request(this.configStorage.getTestActionUrl('init'), params, void 0, true);
        },

        /**
         * Uninstalls the proxy
         * @returns {Promise} - Returns a promise. The proxy will be fully uninstalled on resolve.
         *                      Any error will be provided if rejected.
         */
        destroy() {
            // no request, just a resources cleaning
            this.configStorage = null;
            this.queue = null;

            // the method must return a promise
            return Promise.resolve();
        },

        /**
         * Calls an action related to the test
         * @param {String} action - The name of the action to call
         * @param {Object} [params] - Some optional parameters to join to the call
         * @returns {Promise} - Returns a promise. The result of the request will be provided on resolve.
         *                      Any error will be provided if rejected.
         */
        callTestAction(action, params) {
            return this.request(this.configStorage.getTestActionUrl(action), params);
        },

        /**
         * Calls an action related to a particular item
         * @param {String} itemIdentifier - The identifier of the item for which call the action
         * @param {String} action - The name of the action to call
         * @param {Object} [params] - Some optional parameters to join to the call
         * @returns {Promise} - Returns a promise. The result of the request will be provided on resolve.
         *                      Any error will be provided if rejected.
         */
        callItemAction(itemIdentifier, action, params) {
            return this.request(this.configStorage.getItemActionUrl(itemIdentifier, action), params);
        },

        /**
         * Gets an item definition by its identifier, also gets its current state
         * @param {String} itemIdentifier - The identifier of the item to get
         * @param {Object} [params] - additional parameters
         * @returns {Promise} - Returns a promise. The item data will be provided on resolve.
         *                      Any error will be provided if rejected.
         */
        getItem(itemIdentifier, params) {
            return this.request(this.configStorage.getItemActionUrl(itemIdentifier, 'getItem'), params, void 0, true);
        },

        /**
         * Builds the communication channel
         * @returns {communicator|null} the communication channel
         */
        loadCommunicator() {
            const config = this.configStorage.getCommunicationConfig();
            if (config.enabled) {
                communicatorFactory(config.type, config.params);
            }
            return null;
        }
    };
});
