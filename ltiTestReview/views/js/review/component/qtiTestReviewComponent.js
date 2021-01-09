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
 * @author Hanna Dzmitryieva <hanna@taotesting.com>
 */
define([
    'context',
    'taoTests/runner/runnerComponent',
    'tpl!ltiTestReview/review/component/tpl/qtiTestReviewComponent',
    'css!ltiTestReview/review/component/css/qtiTestReviewComponent',
    'css!ltiTestReview/review/provider/css/qtiTestReviewProvider'
], function (context, runnerComponentFactory, runnerTpl) {
    'use strict';

    /**
     * Extracts the test runner options from the config
     * @param {Object} config
     * @returns {Object}
     */
    const extractOptions = config => {
        const {
            fullPage = false,
            readOnly = false,
            showScore = false,
            showCorrect = false,
            pluginsOptions = {}
        } = config;
        return {fullPage, readOnly, showScore, showCorrect, plugins: pluginsOptions};
    };

    /**
     * Builds a component with test runner to review a test
     * @param {jQuery|HTMLElement|String} container - The container in which renders the component
     * @param {Object} [config] - The testRunner options
     * @param {Object[]} [config.plugins] - Additional plugins to load
     * @param {Object[]} [config.pluginsOptions] - Options for the plugins
     * @param {Boolean} [config.fullPage] - Force the review to occupy the full window.
     * @param {Boolean} [config.readOnly] - Do not allow to modify the reviewed item.
     * @param {Boolean} [config.showScore] - Allow to show the score.
     * @param {Boolean} [config.showCorrect] - Allow to show the correct responses.
     * @param {Function} [template] - An optional template for the component
     * @returns {review}
     */
    return function qtiTestReviewFactory(container, config = {}, template = null) {

        const testRunnerConfig = {
            testDefinition: config.testDefinition || 'test-container',
            serviceCallId: config.testUri && config.testUri.resultId || 'review',
            providers: {
                runner: {
                    id: 'qtiTestReviewProvider',
                    module: 'ltiTestReview/review/provider/qtiTestReviewProvider',
                    bundle: 'ltiTestReview/loader/ltiTestReview.min',
                    category: 'runner'
                },
                proxy: {
                    id: 'qtiTestReviewProxy',
                    module: 'ltiTestReview/review/proxy/qtiTestReviewProxy',
                    bundle: 'ltiTestReview/loader/ltiTestReview.min',
                    category: 'proxy'
                },
                communicator: {
                    id: 'request',
                    module: 'core/communicator/request',
                    bundle: 'loader/vendor.min',
                    category: 'communicator'
                },
                plugins: config.plugins || []
            },
            options: extractOptions(config)
        };

        //extra context config
        testRunnerConfig.loadFromBundle = !!context.bundle;

        return runnerComponentFactory(container, testRunnerConfig, template || runnerTpl)
            .on('render', function onComponentInit() {
                const {fullPage, readOnly, showScore, showCorrect} = this.getConfig().options;
                this.setState('fullpage', fullPage);
                this.setState('readonly', readOnly);
                this.setState('showscore', showScore);
                this.setState('showcorrect', showCorrect);
            })
            .on('ready', function onComponentReady(runner) {
                runner.on('destroy', () => this.destroy());
            });
    };
});
