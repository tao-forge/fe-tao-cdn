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
 * Copyright (c) 2015-2017 (original work) Open Assessment Technologies SA ;
 */
define(['taoClientDiagnostic/tools/performances/tester'], function(performancesTester) {
    'use strict';

    QUnit.module('API');

    QUnit.test('The tester has the right form', function(assert) {
        assert.expect(6);
        assert.ok(typeof performancesTester === 'function', 'The module exposes a function');
        assert.ok(typeof performancesTester() === 'object', 'performancesTester is a factory');
        assert.ok(typeof performancesTester().start === 'function', 'the test has a start method');
        assert.ok(typeof performancesTester().getSummary === 'function', 'the test has a getSummary method');
        assert.ok(typeof performancesTester().getFeedback === 'function', 'the test has a getFeedback method');
        assert.ok(typeof performancesTester().labels === 'object', 'the test has a labels objects');
    });

    QUnit.cases.init([{
        title: 'no level'
    }, {
        title: 'level 0',
        level: 0
    }, {
        title: 'level 1',
        level: 1
    }, {
        title: 'level 2',
        level: 2
    }, {
        title: 'level 3',
        level: 3
    }])
        .test('labels', function(data, assert) {
            var labels = performancesTester({level: data.level}).labels;
            var labelKeys = [
                'title',
                'status',
                'performancesMin',
                'performancesMax',
                'performancesAverage'
            ];

            assert.expect(labelKeys.length + 1);

            assert.equal(typeof labels, 'object', 'A set of labels is returned');
            labelKeys.forEach(function(key) {
                assert.equal(typeof labels[key], 'string', 'The label ' + key + ' exists');
            });
        });

    QUnit.test('getSummary', function(assert) {
        var tester = performancesTester({});
        var results = {
            min: 30,
            max: 90,
            average: 60
        };
        var summary = tester.getSummary(results);

        assert.expect(10);

        assert.equal(typeof summary, 'object', 'The method has returned the summary');

        assert.equal(typeof summary.performancesMin, 'object', 'The summary contains entry for min performances');
        assert.equal(typeof summary.performancesMin.message, 'string', 'The summary contains label for min performances');
        assert.equal(summary.performancesMin.value, results.min + ' s', 'The summary contains the expected value for min performances');

        assert.equal(typeof summary.performancesMax, 'object', 'The summary contains entry for max performances');
        assert.equal(typeof summary.performancesMax.message, 'string', 'The summary contains label for max performances');
        assert.equal(summary.performancesMax.value, results.max + ' s', 'The summary contains the expected value for max performances');

        assert.equal(typeof summary.performancesAverage, 'object', 'The summary contains entry for average performances');
        assert.equal(typeof summary.performancesAverage.message, 'string', 'The summary contains label for average performances');
        assert.equal(summary.performancesAverage.value, results.average + ' s', 'The summary contains the expected value for average performances');
    });

    QUnit.test('getFeedback', function(assert) {
        var optimal = 1;
        var threshold = 10;
        var tester = performancesTester({optimal: optimal, threshold: threshold});
        var result = optimal;
        var status = tester.getFeedback(result);

        assert.expect(6);

        assert.equal(typeof status, 'object', 'The method has returned the status');
        assert.equal(status.id, 'performances', 'The status contains the tester id');
        assert.equal(status.percentage, 100, 'The status contains the expected percentage');
        assert.equal(typeof status.title, 'string', 'The status contains a title');
        assert.equal(typeof status.quality, 'object', 'The status contains a quality descriptor');
        assert.equal(typeof status.feedback, 'object', 'The status contains a feedback descriptor');
    });

    QUnit.module('Test');

    QUnit.test('The tester runs', function(assert) {
        var ready = assert.async();

        assert.expect(10);

        performancesTester({}).start(function(status, details, results) {
            var duration = results.average;
            var toString = {}.toString;

            assert.ok(typeof status === 'object', 'The status is a object');
            assert.ok(typeof details === 'object', 'The details is a object');
            assert.ok(typeof results === 'object', 'The results is a object');
            assert.ok(duration > 0, 'The result is a positive number');
            assert.ok(typeof results.min === 'number', 'The minimum speed is provided inside the details');
            assert.ok(typeof results.max === 'number', 'The maximum speed is provided inside the details');
            assert.ok(typeof results.average === 'number', 'The average speed is provided inside the details');
            assert.ok(typeof results.variance === 'number', 'The speed variance is provided inside the details');
            assert.equal(duration, results.average, 'The total duration provided inside the details must be equal to provided duration');
            assert.ok(toString.call(results.values) === '[object Array]', 'The detailed measures are provided inside the details');

            ready();
        });
    });

});
