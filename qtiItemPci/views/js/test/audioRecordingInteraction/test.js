define([

    'jquery',
    'lodash',
    'taoItems/assets/manager',
    'taoItems/assets/strategies',
    'taoQtiItem/portableElementRegistry/assetManager/portableAssetStrategy',
    'taoQtiItem/runner/qtiItemRunner',
    'taoQtiItem/portableElementRegistry/ciRegistry',
    'taoQtiItem/portableElementRegistry/provider/localManifestProvider',
    'json!qtiItemPci/test/audioRecordingInteraction/data/qti.json'
], function(

    $,
    _,
    assetManagerFactory,
    assetStrategies,
    portableAssetStrategy,
    qtiItemRunner,
    ciRegistry,
    pciTestProvider,
    itemData
) {

    'use strict';

    var runner;
    var fixtureContainerId = 'item-container';

    function getAssetManager(baseUrl) {
        return assetManagerFactory([
            assetStrategies.external,
            assetStrategies.baseUrl,
            portableAssetStrategy
        ], {baseUrl: baseUrl || ''});
    }

    //Manually register the pci from its manifest
    pciTestProvider.addManifestPath(
        'audioRecordingInteraction',
        'qtiItemPci/pciCreator/dev/audioRecordingInteraction/pciCreator.json');
    ciRegistry.resetProviders();
    ciRegistry.registerProvider(pciTestProvider.getModuleName());

    QUnit.module('Audio Recording Interaction', {
        afterEach: function(assert) {
            if (runner) {
                runner.clear();
            }
        }
    });


    /* */

    QUnit.test('renders correctly', function(assert) {
        var ready = assert.async();

        var $container = $('#' + fixtureContainerId);
        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        if (supportsMediaRecorder()) {
            runner = qtiItemRunner('qti', itemData)
                .on('render', function() {

                    assert.equal($container.children().length, 1, 'the container a elements');
                    assert.equal($container.children('.qti-item').length, 1, 'the container contains a the root element .qti-item');
                    assert.equal($container.find('.qti-interaction').length, 1, 'the container contains an interaction .qti-interaction');
                    assert.equal($container.find('.qti-interaction.qti-customInteraction').length, 1, 'the container contains a custom interaction');
                    assert.equal($container.find('.qti-customInteraction .audioRecordingInteraction').length, 1, 'the container contains a Point Line Graph interaction');
                    assert.equal($container.find('.qti-customInteraction .prompt').length, 1, 'the interaction contains a prompt');

                    ready();
                })
                .init()
                .render($container);
        }
        function supportsMediaRecorder() {
            if (!window.MediaRecorder) {
                assert.ok(true, 'skipping test...');
                ready();
                return false;
            }
            return true;
        }
    });

    /* */

    QUnit.test('destroys', function(assert) {
        var ready = assert.async();
        var $container = $('#' + fixtureContainerId);

        assert.expect(3);

        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        if (supportsMediaRecorder()) {
            runner = qtiItemRunner('qti', itemData)
                .on('render', function() {
                    var $controls;

                    //Call destroy manually
                    var interaction = this._item.getInteractions()[0];
                    interaction.renderer.destroy(interaction);

                    $controls = $('.audiorec-control', $container);
                    assert.equal($controls.length, 0, 'recorder has been destroyed');

                    try {
                        interaction.renderer.destroy(interaction);
                    } catch (e) {
                        console.log(e);
                    }

                    ready();
                })
                .on('error', function(error) {
                    $('#error-display').html(error);
                })
                .init()
                .render($container);
            // runner.getState();
        }
        function supportsMediaRecorder() {
            if (!window.MediaRecorder) {
                assert.ok(true, 'skipping test...');
                ready();
                return false;
            }
            return true;
        }
    });

    /* */

    QUnit.test('resets the response', function(assert) {
        var ready = assert.async();
        var changeCounter = 0;
        var response = {
            base: {
                file: {
                    name: 'myFileToBeReseted',
                    mime: 'audio/wav',
                    data: 'YXVkaW8='
                }
            }
        };
        var $container = $('#' + fixtureContainerId);
        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');
        if (supportsMediaRecorder()) {
            runner = qtiItemRunner('qti', itemData)
                .on('render', function() {
                    var interaction,
                        interactions = this._item.getInteractions();

                    assert.equal(_.size(interactions), 1, 'one interaction');
                    interaction = interactions[0];

                    // First we set the response
                    interaction.setResponse(response);
                })
                .on('responsechange', function(res) {
                    var interactions = this._item.getInteractions(),
                        interaction = interactions[0];
                    changeCounter++;

                    if (changeCounter === 1) {
                        interaction.resetResponse();
                    } else if (changeCounter === 2) {
                        assert.ok(_.isPlainObject(res), 'response changed');
                        assert.ok(_.isPlainObject(res.RESPONSE), 'response identifier ok');
                        assert.strictEqual(res.RESPONSE.base, null, 'no response is given when there is no recording');
                        ready();
                    }
                })
                .on('error', function(error) {
                    $('#error-display').html(error);
                })
                .init()
                .render($container);
        }
        function supportsMediaRecorder() {
            if (!window.MediaRecorder) {
                assert.ok(true, 'skipping test...');
                ready();
                return false;
            }
            return true;
        }
    });

    /* */

    QUnit.test('set and get response', function(assert) {
        var ready = assert.async();
        var changeCounter = 0;
        var response = {
            base: {
                file: {
                    name: 'myFileToBeReseted',
                    mime: 'audio/wav',
                    data: 'YmFzZTY0ZW5jb2RlZERhdGE='
                }
            }
        };
        var $container = $('#' + fixtureContainerId);
        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        if (supportsMediaRecorder()) {
            runner = qtiItemRunner('qti', itemData)
                .on('render', function() {
                    var interaction,
                        interactions = this._item.getInteractions();

                    assert.equal(_.size(interactions), 1, 'one interaction');
                    interaction = interactions[0];

                    //Set the response
                    interaction.setResponse(response);
                })
                .on('responsechange', function(res) {
                    changeCounter++;
                    if (changeCounter === 1) { // So it runs only once
                        assert.ok(_.isPlainObject(res), 'response changed');
                        assert.ok(_.isPlainObject(res.RESPONSE), 'response identifier ok');
                        assert.deepEqual(res.RESPONSE, response, 'response set/get ok');
                        ready();
                    }
                })
                .on('error', function(error) {
                    $('#error-display').html(error);
                })
                .init()
                .render($container);
        }
        function supportsMediaRecorder() {
            if (!window.MediaRecorder) {
                assert.ok(true, 'skipping test...');
                ready();
                return false;
            }
            return true;
        }
    });

    /* */

    QUnit.test('set and get state', function(assert) {
        var ready = assert.async();
        var changeCounter = 0;
        var state = {
            RESPONSE: {
                base: {
                    file: {
                        name: 'myFileToBeReseted',
                        mime: 'audio/wav',
                        data: 'YmFzZTY0ZW5jb2RlZERhdGE='
                    }
                }
            }
        };
        var $container = $('#' + fixtureContainerId);
        assert.equal($container.length, 1, 'the item container exists');
        assert.equal($container.children().length, 0, 'the container has no children');

        if (supportsMediaRecorder()) {
            runner = qtiItemRunner('qti', itemData)
                .on('render', function() {

                    this.setState(state);
                    assert.deepEqual(this.getState(), state, 'state set/get ok');
                })
                .on('responsechange', function(res) {
                    changeCounter++;
                    if (changeCounter === 1) { // So it runs only once
                        assert.ok(_.isPlainObject(res), 'response changed');
                        assert.ok(_.isPlainObject(res.RESPONSE), 'response identifier ok');
                        assert.deepEqual(res, state, 'response set/get ok');

                        ready();
                    }
                })
                .init()
                .render($container);
        }
        function supportsMediaRecorder() {
            if (!window.MediaRecorder) {
                assert.ok(true, 'skipping test...');
                ready();
                return false;
            }
            return true;
        }
    });

    /* */

    QUnit.module('Visual test');

    QUnit.test('display and play', function(assert) {
        var ready = assert.async();
        var $container = $('#outside-container');
        var assetManager = getAssetManager('/qtiItemPci/views/js/pciCreator/dev/audioRecordingInteraction/');

        var interaction;

        var $form = $('#form');
        $form.on('change', function(e) {
            var $target = $(e.target),
                newConfig = {};
            if (interaction) {
                newConfig[$target.attr('name')] = $target.is(':checked');
                interaction.triggerPci('configChange', [_.assign(interaction.properties, newConfig)]);
            }
        });

        if (supportsMediaRecorder()) {
            assert.expect(1);
            assert.equal($container.length, 1, 'the item container exists');
            runner = qtiItemRunner('qti', itemData, {assetManager: assetManager})
                .on('render', function() {
                    var interactions = this._item.getInteractions();
                    interaction = interactions[0];

                    ready();
                })
                .on('responsechange', function(response) {
                    if (response &&
                        response.RESPONSE &&
                        response.RESPONSE.base &&
                        response.RESPONSE.base.file &&
                        response.RESPONSE.base.file.data
                    ) {
                        response.RESPONSE.base.file.data = 'DATA'; // Do not display the base64-encoded file!
                    }
                    $('#response-display').html(JSON.stringify(response, null, 2));
                })
                .on('error', function(error) {
                    $('#error-display').html(error);
                })
                .init()
                .render($container.find('#pci'));
        }
        function supportsMediaRecorder() {
            if (!window.MediaRecorder) {
                assert.ok(true, 'skipping test...');
                ready();
                return false;
            }
            return true;
        }
    });

    /* */

});

