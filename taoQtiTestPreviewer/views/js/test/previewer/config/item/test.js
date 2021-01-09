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
 * Copyright (c) 2018 (original work) Open Assessment Technologies SA ;
 */

/**
 * @author Jean-Sébastien Conan <jean-sebastien@taotesting.com>
 */
define([

    'lodash',
    'util/url',
    'taoQtiTestPreviewer/previewer/config/item'
], function(_, urlUtil, itemConfig) {
    'use strict';

    QUnit.module('itemConfig');

    QUnit.test('module', function(assert) {
        var config = {
            serviceCallId: 'foo'
        };

        assert.expect(3);
        assert.equal(typeof itemConfig, 'function', 'The itemConfig module exposes a function');
        assert.equal(typeof itemConfig(config), 'object', 'The itemConfig factory produces an instance');
        assert.notStrictEqual(itemConfig(config), itemConfig(config), 'The itemConfig factory provides a different instance on each call');
    });

    QUnit
        .cases.init([
            {title: 'getParameters'},
            {title: 'getServiceCallId'},
            {title: 'getServiceController'},
            {title: 'getServiceExtension'},
            {title: 'getTestActionUrl'},
            {title: 'getItemActionUrl'},
            {title: 'getTimeout'}
        ])
        .test('proxy API ', function(data, assert) {
            var instance = itemConfig({
                serviceCallId: 'foo'
            });

            assert.expect(1);

            assert.equal(typeof instance[data.title], 'function', 'The itemConfig instances expose a "' + data.title + '" function');
        });

    QUnit.test('itemConfig factory', function(assert) {
        assert.expect(1);

        itemConfig({
            serviceCallId: 'foo'
        });
        assert.ok(true, 'The itemConfig() factory must not throw an exception when all the required config entries are provided');
    });

    QUnit
        .cases.init([{
            title: 'No item identifier',
            config: {
                serviceCallId: 'http://tao.rdf/1234#56789'
            },
            expected: {
                serviceCallId: 'http://tao.rdf/1234#56789'
            }
        }, {
            title: 'Standard item identifier',
            config: {
                serviceCallId: 'http://tao.rdf/1234#56789'
            },
            itemId: 'http://tao.rdf/item#123',
            expected: {
                serviceCallId: 'http://tao.rdf/1234#56789',
                itemUri: 'http://tao.rdf/item#123'
            }
        }, {
            title: 'Structured item identifier',
            config: {
                serviceCallId: 'http://tao.rdf/1234#56789'
            },
            itemId: {
                resultId: 'http://tao.rdf/result#123',
                itemDefinition: 'http://tao.rdf/item#123',
                deliveryUri: 'http://tao.rdf/delivery#123'
            },
            expected: {
                serviceCallId: 'http://tao.rdf/1234#56789',
                resultId: 'http://tao.rdf/result#123',
                itemDefinition: 'http://tao.rdf/item#123',
                deliveryUri: 'http://tao.rdf/delivery#123'
            }
        }])
        .test('itemConfig.getParameters', function(data, assert) {
            var instance = itemConfig(data.config);

            assert.expect(1);

            assert.deepEqual(instance.getParameters(data.itemId), data.expected, 'The itemConfig.getParameters() method has returned the expected value');
        });

    QUnit
        .cases.init([
            {title: 'number', itemId: 10},
            {title: 'boolean', itemId: true},
            {title: 'array', itemId: [1, 2, 3]}
        ])
        .test('itemConfig.getParameters#error', function(data, assert) {
            var expectedServiceCallId = 'http://tao.rdf/1234#56789';
            var config = {
                serviceCallId: expectedServiceCallId
            };
            var instance = itemConfig(config);

            assert.expect(1);

            assert.throws(function() {
                instance.getParameters(data.itemId);
            }, 'The itemConfig.getParameters() method should throw an error if the parameter does not have the right type');
        });

    QUnit.test('itemConfig.getServiceCallId', function(assert) {
        var expectedServiceCallId = 'http://tao.rdf/1234#56789';
        var config = {
            serviceCallId: expectedServiceCallId
        };
        var instance = itemConfig(config);

        assert.expect(1);

        assert.equal(instance.getServiceCallId(), expectedServiceCallId, 'The itemConfig.getServiceCallId() method has returned the expected value');
    });

    QUnit.test('itemConfig.getServiceController', function(assert) {
        var expectedServiceController = 'MockRunner';
        var config = {
            serviceCallId: 'foo'
        };
        var instance = itemConfig(config);

        assert.expect(3);

        assert.notEqual(instance.getServiceController(), expectedServiceController, 'The itemConfig.getServiceController() method must return the default value');
        assert.ok(!!instance.getServiceController(), 'The itemConfig.getServiceController() method must not return a null value');

        config.bootstrap = {
            serviceController: expectedServiceController
        };
        instance = itemConfig(config);
        assert.equal(instance.getServiceController(), expectedServiceController, 'The itemConfig.getServiceController() method has returned the expected value');
    });

    QUnit.test('itemConfig.getServiceExtension', function(assert) {
        var expectedServiceExtension = 'MockExtension';
        var config = {
            serviceCallId: 'foo'
        };
        var instance = itemConfig(config);

        assert.expect(3);

        assert.notEqual(instance.getServiceExtension(), expectedServiceExtension, 'The itemConfig.getServiceExtension() method must return the default value');
        assert.ok(!!instance.getServiceExtension(), 'The itemConfig.getServiceExtension() method must not return a null value');

        config.bootstrap = {
            serviceExtension: expectedServiceExtension
        };
        instance = itemConfig(config);
        assert.equal(instance.getServiceExtension(), expectedServiceExtension, 'The itemConfig.getServiceExtension() method has returned the expected value');
    });

    QUnit.test('itemConfig.getTestActionUrl', function(assert) {
        var config = {
            serviceCallId: 'foo',
            bootstrap: {
                serviceController: 'MockRunner',
                serviceExtension: 'MockExtension'
            }
        };
        var expectedUrl = urlUtil.route('action1', config.bootstrap.serviceController, config.bootstrap.serviceExtension, {
            serviceCallId: config.serviceCallId
        });
        var expectedUrl2 = urlUtil.route('action2', config.bootstrap.serviceController, config.bootstrap.serviceExtension, {
            serviceCallId: config.serviceCallId
        });
        var instance = itemConfig(config);

        assert.expect(2);

        assert.equal(instance.getTestActionUrl('action1'), expectedUrl, 'The itemConfig.getTestActionUrl() method has returned the expected value');
        assert.equal(instance.getTestActionUrl('action2'), expectedUrl2, 'The itemConfig.getTestActionUrl() method has returned the expected value');
    });

    QUnit.test('itemConfig.getItemActionUrl', function(assert) {
        var config = {
            serviceCallId: 'foo',
            bootstrap: {
                serviceController: 'MockRunner',
                serviceExtension: 'MockExtension'
            }
        };
        var actionName = 'MockAction';
        var expectedUrl = urlUtil.route(actionName, config.bootstrap.serviceController, config.bootstrap.serviceExtension, {
            serviceCallId: config.serviceCallId,
            itemUri: 'item1'
        });
        var expectedUrl2 = urlUtil.route(actionName, config.bootstrap.serviceController, config.bootstrap.serviceExtension, {
            serviceCallId: config.serviceCallId,
            itemUri: 'item2'
        });
        var instance = itemConfig(config);

        assert.expect(2);

        assert.equal(instance.getItemActionUrl('item1', actionName), expectedUrl, 'The itemConfig.getItemActionUrl() method has returned the expected value');
        assert.equal(instance.getItemActionUrl('item2', actionName), expectedUrl2, 'The itemConfig.getItemActionUrl() method has returned the expected value');
    });

    QUnit.test('itemConfig.getTimeout', function(assert) {
        var config = {
            serviceCallId: 'foo'
        };
        var instance = itemConfig(config);

        assert.expect(2);

        assert.equal(typeof instance.getTimeout(), 'undefined', 'The itemConfig.getTimeout() method must return an undefined value if no timeout has been set');

        config.timeout = 10;
        instance = itemConfig(config);
        assert.equal(instance.getTimeout(), 10000, 'The itemConfig.getTimeout() method has returned the expected value');
    });
});
