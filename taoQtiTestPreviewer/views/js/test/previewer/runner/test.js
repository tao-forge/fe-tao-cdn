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
 * Copyright (c) 2018-2019 (original work) Open Assessment Technologies SA ;
 */

/**
 * @author Jean-Sébastien Conan <jean-sebastien@taotesting.com>
 */
define([
    'jquery',
    'lodash',
    'taoQtiTestPreviewer/previewer/runner',
    'json!taoQtiItem/test/samples/json/space-shuttle.json',
    'lib/jquery.mockjax/jquery.mockjax',
    'css!taoQtiTestPreviewer/previewer/provider/item/css/item'
], function($, _, previewerFactory, itemData) {
    'use strict';

    const providers = {
        runner : {
            id: 'qtiItemPreviewer',
            module: 'taoQtiTestPreviewer/previewer/provider/item/item',
            bundle: 'taoQtiTestPreviewer/loader/qtiPreviewer.min',
            category: 'runner'
        },
        proxy: {
            id: 'qtiItemPreviewProxy',
            module: 'taoQtiTestPreviewer/previewer/proxy/item',
            bundle: 'taoQtiTestPreviewer/loader/qtiPreviewer.min',
            category: 'proxy'
        },
        communicator: {
            id: 'request',
            module: 'core/communicator/request',
            bundle: 'loader/vendor.min',
            category: 'communicator'
        }
    };

    QUnit.module('API');

    // Prevent the AJAX mocks to pollute the logs
    $.mockjaxSettings.logger = null;
    $.mockjaxSettings.responseTime = 1;

    // Restore AJAX method after each test
    QUnit.testDone(function() {
        $.mockjax.clear();
    });

    QUnit.test('module', assert =>  {
        const ready = assert.async();
        const config = {
            serviceCallId: 'foo',
            providers,
            options : {}
        };

        const previewer1 = previewerFactory('#fixture-1', config);
        const previewer2 = previewerFactory('#fixture-2', config);

        assert.expect(4);
        $.mockjax({
            url: '/*',
            responseText: {
                success: true
            }
        });
        assert.equal(typeof previewerFactory, 'function', 'The previewer module exposes a function');
        assert.equal(typeof previewer1, 'object', 'The previewer factory returns an object');
        assert.equal(typeof previewer2, 'object', 'The previewer factory returns an object');
        assert.notEqual(previewer1, previewer2, 'The previewer factory returns a different instance on each call');

        Promise.all([
            new Promise(resolve => previewer1.on('ready', resolve) ),
            new Promise(resolve => previewer2.on('ready', resolve) )
        ]).catch(function(err) {
            assert.pushResult({
                result: false,
                message: err
            });
        }).then( ready );
    });

    QUnit.cases.init([{
        title: 'itemData in init',
        fixture: '#fixture-item-1',
        mock: {
            url: '/init*',
            responseText: {
                success: true,
                itemIdentifier: 'item-1',
                itemData: {
                    content: {
                        type: 'qti',
                        data: itemData
                    },
                    baseUrl: '',
                    state: {}
                }
            }
        }
    }, {
        title: 'itemRef in init',
        fixture: '#fixture-item-2',
        mock: [{
            url: '/init*',
            responseText: {
                success: true,
                itemIdentifier: 'item-2'
            }
        }, {
            url: '/getItem*',
            responseText: {
                success: true,
                content: {
                    type: 'qti',
                    data: itemData
                },
                baseUrl: '',
                state: {}
            }
        }]
    }, {
        title: 'manual load',
        fixture: '#fixture-item-3',
        itemIdentifier: 'item-3',
        mock: [{
            url: '/init*',
            responseText: {
                success: true
            }
        }, {
            url: '/getItem*',
            responseText: {
                success: true,
                content: {
                    type: 'qti',
                    data: itemData
                },
                baseUrl: '',
                state: {}
            }
        }]
    }]).test('render item ', (data, assert) =>  {
        const ready = assert.async();
        const $container = $(data.fixture);
        const serviceCallId = 'previewer';
        const config = {
            serviceCallId: serviceCallId,
            providers,
            options : {}
        };

        assert.expect(1);

        $.mockjax(data.mock);

        previewerFactory($container, config)
            .on('error', function(err) {
                assert.ok(false, 'An error has occurred');
                assert.pushResult({
                    result: false,
                    message: err
                });
                ready();
            })
            .on('ready', function(runner) {
                runner
                    .after('renderitem', function() {
                        assert.ok(true, 'The previewer has been rendered');
                        ready();
                    });

                if (data.itemIdentifier) {
                    runner.loadItem(data.itemIdentifier);
                }
            });
    });

    QUnit.test('render', assert =>  {
        const ready = assert.async();
        const $container = $('#fixture-destroy');
        const serviceCallId = 'previewer';
        const config = {
            serviceCallId,
            providers,
            options : {
                readOnly: true,
                fullPage: true,
                hideActionBars: true,
            },
        };

        assert.expect(3);

        $.mockjax({
            url: '/init*',
            responseText: {
                success: true
            }
        });

        previewerFactory($container, config)
            .on('error', function(err) {
                assert.ok(false, 'An error has occurred');
                assert.pushResult({
                    result: false,
                    message: err
                });

                ready();
            })
            .on('ready', function() {
                assert.ok(this.is('fullpage'), 'The runner is in fullpage state');
                assert.ok(this.is('readonly'), 'The runner is in readonly state');
                assert.ok(this.is('hideactionbars'), 'The runner is in hideactionbars state');

                ready();
            });
    });

    QUnit.test('destroy', assert =>  {
        const ready = assert.async();
        const $container = $('#fixture-destroy');
        const serviceCallId = 'previewer';
        const config = {
            serviceCallId,
            providers,
            options : {}
        };

        assert.expect(2);

        $.mockjax({
            url: '/init*',
            responseText: {
                success: true
            }
        });

        previewerFactory($container, config)
            .on('error', function(err) {
                assert.ok(false, 'An error has occurred');
                assert.pushResult({
                    result: false,
                    message: err
                });
                ready();
            })
            .on('ready', function(runner) {
                assert.equal($container.children().length, 1, 'The previewer has been rendered');
                runner.destroy();
            })
            .after('destroy', function() {
                assert.equal($container.children().length, 0, 'The previewer has been destroyed');
                ready();
            });
    });

    QUnit.module('Visual');

    QUnit.test('Visual test', function (assert) {
        const ready = assert.async();
        const $container = $('#visual-test');
        const serviceCallId = 'previewer';
        const itemRef = 'item-1';
        const config = {
            serviceCallId: serviceCallId,
            providers: {
                runner : providers.runner,
                plugins: [{
                    module: 'taoQtiTestPreviewer/previewer/plugins/controls/close',
                    bundle: 'taoQtiTestPreviewer/loader/qtiPreviewer.min',
                    category: 'controls'
                },{
                    module: 'taoQtiTestPreviewer/previewer/plugins/navigation/submit/submit',
                    bundle: 'taoQtiTestPreviewer/loader/qtiPreviewer.min',
                    category: 'navigation'
                }, {
                    module: 'taoQtiTest/runner/plugins/tools/itemThemeSwitcher/itemThemeSwitcher',
                    bundle: 'taoQtiTest/loader/testPlugins.min',
                    category: 'tools'
                }, {
                    module: 'taoQtiTestPreviewer/previewer/plugins/tools/scale/scale',
                    bundle: 'taoQtiTestPreviewer/loader/qtiPreviewer.min',
                    category: 'tools'
                }]
            },
            options : {}
        };

        assert.expect(1);

        $.mockjax({
            url: '/init*',
            responseText: {
                success: true
            }
        });
        $.mockjax({
            url: '/getItem*',
            responseText: {
                success: true,
                content: {
                    type: 'qti',
                    data: itemData
                },
                baseUrl: '',
                state: {}
            }
        });
        $.mockjax({
            url: '/submitItem*',
            responseText: {
                success: true,
                displayFeedbacks: false,
                itemSession: {
                    SCORE: {
                        base: {
                            float: 0
                        }
                    }
                }
            }
        });

        previewerFactory($container, config)
            .on('error', function(err) {
                assert.ok(false, 'An error has occurred');
                assert.pushResult({
                    result: false,
                    message: err
                });
                ready();
            })
            .on('ready', function(runner) {
                runner
                    .after('renderitem.runnerComponent', function() {
                        assert.ok(true, 'The previewer has been rendered');
                        ready();
                    })
                    .loadItem(itemRef);
            });
    });
});
